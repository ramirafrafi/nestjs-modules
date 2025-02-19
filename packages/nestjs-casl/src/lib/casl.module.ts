import type { Abilities } from '@casl/ability';
import type { DynamicModule, Type } from '@nestjs/common';
import { Module, Scope } from '@nestjs/common';
import { CASL_ABILITY_FACTORY } from './interfaces/casl-ability-factory.interface';
import { ICaslModuleAsyncOptions, ICaslModuleOptions } from './interfaces/casl-module-options.interface';

@Module({})
export class CaslModule {
  static forRoot<T extends Abilities>(options: ICaslModuleOptions<T>): DynamicModule {
    return {
      module: CaslModule,
      global: options.global,
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

  static forRootAsync<T extends Abilities>(options: ICaslModuleAsyncOptions<T>): DynamicModule {
    return {
      module: CaslModule,
      global: options.global,
      imports: options.imports,
      providers: [
        {
          provide: CASL_ABILITY_FACTORY,
          useFactory: options.useFactory,
          inject: options.inject,
          scope: Scope.REQUEST,
        },
      ],
      exports: [CASL_ABILITY_FACTORY],
    };
  }
}
