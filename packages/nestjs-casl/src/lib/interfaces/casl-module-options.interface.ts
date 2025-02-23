import { Abilities } from '@casl/ability';
import { DynamicModule, FactoryProvider, Type } from '@nestjs/common';
import { ICaslAbilityFactory } from './casl-ability-factory.interface';

type ICaslOptions<T extends Abilities> = {
  abilityFactory: ICaslAbilityFactory<T> | Type<ICaslAbilityFactory<T>>;
};

export interface ICaslModuleOptions<T extends Abilities>
  extends Pick<DynamicModule, 'global'> {
  options: ICaslOptions<T>;
}

export type ICaslModuleAsyncOptions<T extends Abilities> = Pick<
  DynamicModule,
  'global' | 'imports'
> &
  Pick<FactoryProvider<ICaslOptions<T>>, 'inject' | 'useFactory'>;
