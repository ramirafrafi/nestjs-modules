import { S3Module as BaseModule } from 'nestjs-s3';
import type { DynamicModule, Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { S3_OPTIONS, S3_SERVICE } from './s3.tokens';
import { S3Service } from './services/s3.service';
import { IS3ModuleOptions } from './interfaces/s3-module-options.interface';
import { IS3ModuleAsyncOptions } from './interfaces/s3-module-async-options.interface';

const commonProviders: Provider[] = [
  {
    provide: S3_SERVICE,
    useClass: S3Service,
  },
];


@Module({})
export class S3Module {
  static forRoot(options: IS3ModuleOptions): DynamicModule {
    return {
      module: S3Module,
      imports: [
        BaseModule.forRoot({
          config: options,
        }),
      ],
      providers: [
        {
          provide: S3_OPTIONS,
          useValue: options,
        },

        ...commonProviders,
      ],
      exports: [
        S3_OPTIONS,
        S3_SERVICE,
      ],
    };
  }

  static forRootAsync(options: IS3ModuleAsyncOptions): DynamicModule {
    return {
      module: S3Module,
      imports: [
        ...(options.imports ?? []),
        BaseModule.forRootAsync({
          useFactory: (...args: unknown[]) => ({
            config: options.useFactory(args),
          }),
          inject: options.inject,
        }),
      ],
      providers: [
        {
          provide: S3_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },

        ...commonProviders,
      ],
      exports: [
        S3_OPTIONS,
        S3_SERVICE,
      ],
    };
  }
}
