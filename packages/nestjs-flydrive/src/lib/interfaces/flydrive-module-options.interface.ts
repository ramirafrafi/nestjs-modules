import { DynamicModule, FactoryProvider } from '@nestjs/common';
import { DriveManagerOptions } from 'flydrive/build/src/types';
import { FlyDriveServices } from '../types/flydrive-services.type';

type IFlyDriveOptions<T extends FlyDriveServices> = DriveManagerOptions<T>;

export interface IFlyDriveModuleOptions<T extends FlyDriveServices>
  extends Pick<DynamicModule, 'global'> {
  options: DriveManagerOptions<T>;
}

export type IFlyDriveModuleAsyncOptions<T extends FlyDriveServices> = Pick<
  DynamicModule,
  'global' | 'imports'
> &
  Pick<FactoryProvider<IFlyDriveOptions<T>>, 'inject' | 'useFactory'>;
