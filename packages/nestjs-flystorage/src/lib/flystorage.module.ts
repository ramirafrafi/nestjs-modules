import { FileStorage } from '@flystorage/file-storage';
import {
  DynamicModule,
  FactoryProvider,
  InjectionToken,
  Module,
  ValueProvider,
} from '@nestjs/common';
import { entries, keys, map } from 'lodash';
import {
  IFlystorageModuleAsyncOptions,
  IFlystorageModuleOptions,
} from './interfaces/flystorage-module-options.interface';
import { STORAGE_DEFAULT } from './tokens';
import { getDiskToken } from './utils/get-disk-token';

@Module({})
export class FlystorageModule {
  static forRoot<TKey extends string = string>(
    options: IFlystorageModuleOptions<TKey>,
  ): DynamicModule {
    return {
      module: FlystorageModule,
      global: options.global,
      providers: FlystorageModule.providers(options),
      exports: [
        getDiskToken(STORAGE_DEFAULT),
        ...map(keys(options.options.disks), getDiskToken),
      ],
    };
  }

  static forRootAsync<TKey extends string = string>(
    options: IFlystorageModuleAsyncOptions<TKey>,
  ): DynamicModule {
    return {
      module: FlystorageModule,
      global: options.global,
      imports: options.imports,
      providers: FlystorageModule.asyncProviders(options),
      exports: [
        getDiskToken(STORAGE_DEFAULT),
        ...map(keys(options.options.disks), getDiskToken),
      ],
    };
  }

  protected static providers<TKey extends string = string>(
    options: IFlystorageModuleOptions<TKey>,
  ): ValueProvider<FileStorage>[] {
    const {
      options: { defaultDisk, disks },
    } = options;

    const disksProviders = entries<(typeof disks)[TKey]>(disks).map(
      ([token, storage]): ValueProvider<FileStorage> => ({
        provide: getDiskToken(token),
        useValue: storage,
      }),
    );

    const defaultDiskProvider: ValueProvider<FileStorage> = {
      provide: getDiskToken(STORAGE_DEFAULT),
      useValue: disks[defaultDisk],
    };

    return [defaultDiskProvider, ...disksProviders];
  }

  protected static asyncProviders<TKey extends string = string>(
    options: IFlystorageModuleAsyncOptions<TKey>,
  ): FactoryProvider<FileStorage>[] {
    const {
      options: { defaultDisk, disks },
      inject,
    } = options;

    const disksProviders = entries<(typeof disks)[TKey]>(disks).map(
      ([token, storage]): FactoryProvider<FileStorage> => ({
        provide: getDiskToken(token),
        useFactory: storage.useFactory,
        inject,
      }),
    );

    const defaultDiskProvider: FactoryProvider<FileStorage> = {
      provide: getDiskToken(STORAGE_DEFAULT),
      useFactory: disks[defaultDisk].useFactory,
      inject,
    };

    return [defaultDiskProvider, ...disksProviders];
  }

  protected static exports(
    options: IFlystorageModuleOptions | IFlystorageModuleAsyncOptions,
  ): InjectionToken[] {
    return [
      getDiskToken(STORAGE_DEFAULT),
      ...map(keys(options.options.disks), getDiskToken),
    ];
  }
}
