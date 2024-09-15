import { BaseTraceInjector } from '@metinseylan/nestjs-opentelemetry/dist/Trace/Injectors/BaseTraceInjector'; // eslint-disable-line @nx/enforce-module-boundaries
import type { Injector } from '@metinseylan/nestjs-opentelemetry/dist/Trace/Injectors/Injector'; // eslint-disable-line @nx/enforce-module-boundaries
import { Logger } from '@nestjs/common';
import type { ModulesContainer } from '@nestjs/core';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { TraceInjectorUtils } from '../utils/trace-injector.utils';

type BaseInjectorOptions = {
  filter: (provider: InstanceWrapper) => boolean;
  traceName: (provider: InstanceWrapper, key: string) => string;
  attributes: (
    provider: InstanceWrapper,
    key: string,
  ) => Record<string, unknown> | undefined;
};

export class BaseInjector extends BaseTraceInjector implements Injector {
  constructor(
    protected readonly logger: Logger,
    protected readonly options: BaseInjectorOptions,
    modulesContainer: ModulesContainer,
  ) {
    super(modulesContainer);
  }

  public inject() {
    const providers = this.getProviders();

    const { filter, traceName, attributes } = this.options;

    for (const provider of providers) {
      if (!filter(provider)) {
        continue;
      }

      const keys = this.metadataScanner.getAllMethodNames(
        provider.metatype.prototype as Record<string, unknown>,
      );

      for (const key of keys) {
        if (
          !this.isDecorated(provider.metatype.prototype[key]) &&
          !this.isAffected(provider.metatype.prototype[key]) &&
          !this.isExcluded(provider.metatype.prototype[key])
        ) {
          const method = this.wrap(
            provider.metatype.prototype[key] as Record<string, unknown>,
            traceName(provider, key),
            attributes(provider, key),
          );

          this.reDecorate(provider.metatype.prototype[key], method);

          provider.metatype.prototype[key] = method;

          this.logger.log(
            `Mapped ${provider.name}.${key}`,
            this.constructor.name,
          );
        }
      }
    }
  }

  protected isExcluded(prototype: unknown): boolean {
    return TraceInjectorUtils.isExcluded(
      prototype as Record<string, unknown>,
    );
  }
}
