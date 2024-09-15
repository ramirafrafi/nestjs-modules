import { Injectable, Logger } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { BaseInjector } from './base.injector';
import { TraceInjectorUtils } from '../utils/trace-injector.utils';

@Injectable()
export class RepositoryInjector extends BaseInjector {
  constructor(
    logger: Logger,
    modulesContainer: ModulesContainer,
  ) {
    super(
      logger,
      {
        filter: (provider) => TraceInjectorUtils.isRepository(provider),
        traceName: (provider, key) => `Repository->${provider.name}.${key}`,
        attributes: (provider, key) => ({
          repository: provider.name,
          method: key,
        }),
      },
      modulesContainer,
    );
  }
}
