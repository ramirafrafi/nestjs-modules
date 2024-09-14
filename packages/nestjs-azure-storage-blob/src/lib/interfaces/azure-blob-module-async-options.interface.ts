import type {
  FactoryProvider,
  ModuleMetadata,
} from '@nestjs/common';
import { IAzureBlobModuleOptions } from './azure-blob-module-options.interface';

type BaseAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider, 'inject'>;

type UseFactoryReturn = IAzureBlobModuleOptions | Promise<IAzureBlobModuleOptions>;

export interface IAzureBlobModuleAsyncOptions extends BaseAsyncOptions {
  useFactory: (...args: unknown[]) => UseFactoryReturn;
}
