import { FileStorage } from '@flystorage/file-storage';
import { DynamicModule, FactoryProvider } from '@nestjs/common';

export interface IFlystorageOptions<TKey extends string = string> {
  defaultDisk: TKey;
  disks: Record<TKey, FileStorage>;
}

export interface IFlystorageModuleOptions<TKey extends string = string>
  extends Pick<DynamicModule, 'global'> {
  options: IFlystorageOptions<TKey>;
}

export interface IFlystorageAsyncOptions<TKey extends string = string> {
  defaultDisk: TKey;
  disks: Record<TKey, Pick<FactoryProvider<FileStorage>, 'useFactory'>>;
}

export type IFlystorageModuleAsyncOptions<TKey extends string = string> = Pick<
  DynamicModule,
  'global' | 'imports'
> &
  Pick<FactoryProvider, 'inject'> & {
    options: IFlystorageAsyncOptions<TKey>;
  };
