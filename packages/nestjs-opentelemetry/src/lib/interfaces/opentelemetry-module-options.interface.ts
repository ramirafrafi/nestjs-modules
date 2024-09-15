import type { OpenTelemetryModuleConfig } from '@metinseylan/nestjs-opentelemetry';
import { OpentelemetryProtocol } from '../enums/opentelemetry-protocol.enum';

export interface IOpentelemetryModuleOptions extends OpenTelemetryModuleConfig {
  traces?: {
    protocol?: OpentelemetryProtocol;
    endpoint?: string;
  };
  metrics?: {
    protocol?: OpentelemetryProtocol;
    endpoint?: string;
  };
}
