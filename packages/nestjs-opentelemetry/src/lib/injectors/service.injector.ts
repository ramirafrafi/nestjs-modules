import { Injectable, Logger } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { BaseInjector } from './base.injector';
import { TraceInjectorUtils } from '../utils/trace-injector.utils';

@Injectable()
export class ServiceInjector extends BaseInjector {
  constructor(
    logger: Logger,
    modulesContainer: ModulesContainer,
  ) {
    super(
      logger,
      {
        filter: (provider) => TraceInjectorUtils.isService(provider),
        traceName: (provider, key) => `Service->${provider.name}.${key}`,
        attributes: (provider, key) => ({
          service: provider.name,
          method: key,
        }),
      },
      modulesContainer,
    );
  }
}
