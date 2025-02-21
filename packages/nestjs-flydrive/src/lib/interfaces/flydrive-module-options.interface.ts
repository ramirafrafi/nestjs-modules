import { DynamicModule, FactoryProvider } from '@nestjs/common';
import { DriveManagerOptions } from 'flydrive/build/src/types';
import { FlydriveServices } from '../types/flydrive-services.type';

type IFlydriveOptions<T extends FlydriveServices = FlydriveServices> =
  DriveManagerOptions<T>;

export interface IFlydriveModuleOptions<
  T extends FlydriveServices = FlydriveServices
> extends Pick<DynamicModule, 'global'> {
  options: DriveManagerOptions<T>;
}

export type IFlydriveModuleAsyncOptions<
  T extends FlydriveServices = FlydriveServices
> = Pick<DynamicModule, 'global' | 'imports'> &
  Pick<FactoryProvider<IFlydriveOptions<T>>, 'inject' | 'useFactory'>;
