import type {
  DynamicModule,
  FactoryProvider,
} from '@nestjs/common';
import { Abilities } from '@casl/ability';
import { ICaslModuleOptions } from './casl-module-options.interface';

type UseFactoryReturn<T extends Abilities> = ICaslModuleOptions<T> | Promise<ICaslModuleOptions<T>>;

type BaseAsyncOptions = Pick<DynamicModule, 'global' | 'imports'> & Pick<FactoryProvider, 'inject'>;;

export interface ICaslModuleAsyncOptions<T extends Abilities> extends BaseAsyncOptions {
  useFactory: (...args: unknown[]) => UseFactoryReturn<T>;
}
