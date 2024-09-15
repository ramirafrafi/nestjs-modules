import type {
  FactoryProvider,
  ModuleMetadata,
} from '@nestjs/common';
import { IS3ModuleOptions } from './s3-module-options.interface';

type BaseAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider, 'inject'>;

type UseFactoryReturn = IS3ModuleOptions | Promise<IS3ModuleOptions>;

export interface IS3ModuleAsyncOptions extends BaseAsyncOptions {
  useFactory: (...args: unknown[]) => UseFactoryReturn;
}
