import type {
  DynamicModule,
  FactoryProvider,
} from '@nestjs/common';
import { Abilities } from '@casl/ability';
import { ICaslModuleOptions } from './casl-module-options.interface';

type AsyncOptions<T extends Abilities> = Omit<ICaslModuleOptions<T>, 'global'>;

type UseFactoryReturn<T extends Abilities> = AsyncOptions<T> | Promise<AsyncOptions<T>>;

type BaseAsyncOptions = Pick<DynamicModule, 'global' | 'imports'> & Pick<FactoryProvider, 'inject'>;

export interface ICaslModuleAsyncOptions<T extends Abilities> extends BaseAsyncOptions {
  useFactory: (...args: unknown[]) => UseFactoryReturn<T>;
}
