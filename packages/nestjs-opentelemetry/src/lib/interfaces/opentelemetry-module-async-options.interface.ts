import type {
  FactoryProvider,
  ModuleMetadata,
} from '@nestjs/common';
import { IOpentelemetryModuleOptions } from './opentelemetry-module-options.interface';

type BaseAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider, 'inject'>;

type UseFactoryReturn = IOpentelemetryModuleOptions | Promise<IOpentelemetryModuleOptions>;

export interface IOpentelemetryModuleAsyncOptions extends BaseAsyncOptions {
  useFactory: (...args: unknown[]) => UseFactoryReturn;
}
