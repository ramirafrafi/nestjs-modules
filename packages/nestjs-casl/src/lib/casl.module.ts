import type { Abilities } from '@casl/ability';
import type { DynamicModule, Type } from '@nestjs/common';
import { Module, Scope } from '@nestjs/common';
import { CASL_ABILITY_FACTORY } from './interfaces/casl-ability-factory.interface';
import {
  ICaslModuleAsyncOptions,
  ICaslModuleOptions,
} from './interfaces/casl-module-options.interface';

@Module({})
export class CaslModule {
  static forRoot<T extends Abilities>({
    global,
    options,
  }: ICaslModuleOptions<T>): DynamicModule {
    return {
      module: CaslModule,
      global,
      providers: [
        (options.abilityFactory as Type).name
          ? {
              provide: CASL_ABILITY_FACTORY,
              useClass: options.abilityFactory as Type,
              scope: Scope.REQUEST,
            }
          : {
              provide: CASL_ABILITY_FACTORY,
              useValue: options.abilityFactory,
              scope: Scope.REQUEST,
            },
      ],
      exports: [CASL_ABILITY_FACTORY],
    };
  }

  static forRootAsync<T extends Abilities>({
    global,
    imports,
    useFactory,
    inject,
  }: ICaslModuleAsyncOptions<T>): DynamicModule {
    return {
      module: CaslModule,
      global,
      imports,
      providers: [
        {
          provide: CASL_ABILITY_FACTORY,
          useFactory: async (...args) => (await useFactory(args)).abilityFactory,
          inject,
          scope: Scope.REQUEST,
        },
      ],
      exports: [CASL_ABILITY_FACTORY],
    };
  }
}
