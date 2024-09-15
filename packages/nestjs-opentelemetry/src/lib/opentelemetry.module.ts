import type { OpenTelemetryModuleConfig } from '@metinseylan/nestjs-opentelemetry';
import {
  ControllerInjector,
  EventEmitterInjector,
  GuardInjector,
  LoggerInjector,
  OpenTelemetryModule,
  PipeInjector,
  ScheduleInjector,
} from '@metinseylan/nestjs-opentelemetry';
import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { OTLPMetricExporter as OTLPMetricExporterHttp } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPMetricExporter as OTLPMetricExporterProto } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter as OTLPTraceExporterHttp } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPTraceExporter as OTLPTraceExporterProto } from '@opentelemetry/exporter-trace-otlp-proto';
import type { PushMetricExporter } from '@opentelemetry/sdk-metrics';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import type { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { IOpentelemetryModuleOptions } from './interfaces/opentelemetry-module-options.interface';
import { IOpentelemetryModuleAsyncOptions } from './interfaces/opentelemetry-module-async-options.interface';
import { RepositoryInjector } from './injectors/repository.injector';
import { ServiceInjector } from './injectors/service.injector';
import { OpentelemetryProtocol } from './enums/opentelemetry-protocol.enum';

@Module({})
export class OpentelemetryModule {
  static forRoot(options: IOpentelemetryModuleOptions): DynamicModule {
    return {
      module: OpentelemetryModule,
      imports: [
        OpenTelemetryModule.forRoot(
          opentelemetryConfig(options),
        ),
      ],
    };
  }

  static forRootAsync(options: IOpentelemetryModuleAsyncOptions): DynamicModule {
    return {
      module: OpentelemetryModule,
      imports: [
        OpenTelemetryModule.forRootAsync({
          useFactory: async (...args: unknown[]) => {
            return opentelemetryConfig(
              await options.useFactory(...args)
            );
          },
          imports: options.imports,
          inject: options.inject,
        }),
      ],
    };
  }
}

function opentelemetryConfig(options: IOpentelemetryModuleOptions): OpenTelemetryModuleConfig {
  const { traces, metrics, ...config } = options;

  const spanProcessor = new SimpleSpanProcessor(
    tracesExporter(traces),
  ) as unknown as OpenTelemetryModuleConfig['spanProcessor'];

  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter(metrics),
  }) as unknown as OpenTelemetryModuleConfig['metricReader'];

  return {
    ...config,
    traceAutoInjectors: [
      ControllerInjector,
      GuardInjector,
      EventEmitterInjector,
      ScheduleInjector,
      PipeInjector,
      LoggerInjector,
      RepositoryInjector,
      ServiceInjector,
    ],
    spanProcessor,
    metricReader,
  };
}

function tracesExporter({
  protocol,
  endpoint,
}: {
  protocol?: OpentelemetryProtocol;
  endpoint?: string;
} = {}): SpanExporter {
  switch (protocol) {
    case OpentelemetryProtocol.Proto: {
      return new OTLPTraceExporterProto({ url: endpoint });
    }

    default: {
      return new OTLPTraceExporterHttp({ url: endpoint });
    }
  }
}

function metricExporter({
  protocol,
  endpoint,
}: {
  protocol?: OpentelemetryProtocol;
  endpoint?: string;
} = {}): PushMetricExporter {
  switch (protocol) {
    case OpentelemetryProtocol.Proto: {
      return new OTLPMetricExporterProto({ url: endpoint });
    }

    default: {
      return new OTLPMetricExporterHttp({ url: endpoint });
    }
  }
}
