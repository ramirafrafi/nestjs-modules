import type { DynamicModule, InjectionToken } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { DriveManager } from 'flydrive';
import {
  IFlyDriveModuleAsyncOptions,
  IFlyDriveModuleOptions,
} from './interfaces/flydrive-module-options.interface';
import { FlyDriveServices } from './types/flydrive-services.type';

export const FLYDRIVE_MANAGER: InjectionToken = Symbol('FLYDRIVE_MANAGER');

@Module({})
export class FlyDriveModule {
  static forRoot<T extends FlyDriveServices>({
    global,
    options,
  }: IFlyDriveModuleOptions<T>): DynamicModule {
    return {
      global,
      module: FlyDriveModule,
      providers: [
        {
          provide: FLYDRIVE_MANAGER,
          useValue: new DriveManager(options),
        },
      ],
      exports: [FLYDRIVE_MANAGER],
    };
  }

  static forRootAsync<T extends FlyDriveServices>({
    global,
    ...options
  }: IFlyDriveModuleAsyncOptions<T>): DynamicModule {
    return {
      global,
      module: FlyDriveModule,
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
