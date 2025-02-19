import type { Abilities } from '@casl/ability';
import type { DynamicModule, Type } from '@nestjs/common';
import { Module, Scope } from '@nestjs/common';
import { CASL_ABILITY_FACTORY } from './interfaces/casl-ability-factory.interface';
import { ICaslModuleAsyncOptions } from './interfaces/casl-module-async-options.interface';
import { ICaslModuleOptions } from './interfaces/casl-module-options.interface';

@Module({})
export class CaslModule {
  static forRoot<T extends Abilities>(options: ICaslModuleOptions<T>): DynamicModule {
    return {
      global: options.global,
      module: CaslModule,
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

  static forRootAsync<T extends Abilities>(asyncOptions: ICaslModuleAsyncOptions<T>): DynamicModule {
    return {
      global: asyncOptions.global,
      module: CaslModule,
      imports: asyncOptions.imports,
      providers: [
        {
          provide: CASL_ABILITY_FACTORY,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
          scope: Scope.REQUEST,
        },
      ],
      exports: [CASL_ABILITY_FACTORY],
    };
  }
}
