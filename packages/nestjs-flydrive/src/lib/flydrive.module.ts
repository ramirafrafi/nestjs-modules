import type { DynamicModule, InjectionToken } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { DriveManager } from 'flydrive';
import {
  IFlydriveModuleAsyncOptions,
  IFlydriveModuleOptions,
} from './interfaces/flydrive-module-options.interface';
import { FlydriveServices } from './types/flydrive-services.type';

export const FLYDRIVE_MANAGER: InjectionToken = Symbol('FLYDRIVE_MANAGER');

@Module({})
export class FlydriveModule {
  static forRoot<T extends FlydriveServices>({
    global,
    options,
  }: IFlydriveModuleOptions<T>): DynamicModule {
    return {
      global,
      module: FlydriveModule,
      providers: [
        {
          provide: FLYDRIVE_MANAGER,
          useValue: new DriveManager(options),
        },
      ],
      exports: [FLYDRIVE_MANAGER],
    };
  }

  static forRootAsync<T extends FlydriveServices>({
    global,
    ...options
  }: IFlydriveModuleAsyncOptions<T>): DynamicModule {
    return {
      global,
      module: FlydriveModule,
      imports: options.imports,
      providers: [
        {
          provide: FLYDRIVE_MANAGER,
          useFactory: async (...args) => {
            return new DriveManager(await options.useFactory(args));
          },
          inject: options.inject,
        },
      ],
      exports: [FLYDRIVE_MANAGER],
    };
  }
}
