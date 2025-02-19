import { Abilities } from '@casl/ability';
import { DynamicModule, FactoryProvider, Type } from '@nestjs/common';
import { ICaslAbilityFactory } from './casl-ability-factory.interface';

type BaseOptions = Pick<DynamicModule, 'global'>;

export interface ICaslModuleOptions<T extends Abilities> extends BaseOptions {
  abilityFactory: ICaslAbilityFactory<T> | Type<ICaslAbilityFactory<T>>;
}

export type ICaslModuleAsyncOptions<T extends Abilities> = Pick<
  DynamicModule,
  'global' | 'imports'
> &
  Pick<FactoryProvider<ICaslAbilityFactory<T>>, 'inject' | 'useFactory'>;
