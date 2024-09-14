import type { DynamicModule, Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import {
  AZURE_STORAGE_BLOB_SERVICE,
  AZURE_STORAGE_CLIENT,
  AZURE_STORAGE_CREDENTIAL,
  AZURE_STORAGE_OPTIONS,
} from './azure-storage-blob.tokens';
import { AzureStorageBlobService } from './services/azure-storage-blob.service';
import { IAzureBlobModuleOptions } from './interfaces/azure-blob-module-options.interface';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { IAzureBlobModuleAsyncOptions } from './interfaces/azure-blob-module-async-options.interface';
import { storageAccountUrl } from './utils/storage-account-url';

const commonProviders: Provider[] = [
  {
    provide: AZURE_STORAGE_CREDENTIAL,
    useFactory: (options: IAzureBlobModuleOptions) =>
      new StorageSharedKeyCredential(
        options.storageAccount,
        options.storageAccountKey,
      ),
    inject: [AZURE_STORAGE_OPTIONS],
  },

  {
    provide: AZURE_STORAGE_CLIENT,
    useFactory: (
      options: IAzureBlobModuleOptions,
      credential: StorageSharedKeyCredential,
    ) => new BlobServiceClient(storageAccountUrl(options), credential),
    inject: [
      AZURE_STORAGE_OPTIONS,
      AZURE_STORAGE_CREDENTIAL,
    ],
  },

  {
    provide: AZURE_STORAGE_BLOB_SERVICE,
    useClass: AzureStorageBlobService,
  },
];

@Module({})
export class AzureStorageBlobModule {
  static forRoot(options: IAzureBlobModuleOptions): DynamicModule {
    return {
      module: AzureStorageBlobModule,
      providers: [
        {
          provide: AZURE_STORAGE_OPTIONS,
          useValue: options,
        },

        ...commonProviders,
      ],
      exports: [
        AZURE_STORAGE_CLIENT,
        AZURE_STORAGE_BLOB_SERVICE,
      ],
    };
  }

  static forRootAsync(options: IAzureBlobModuleAsyncOptions): DynamicModule {
    return {
      module: AzureStorageBlobModule,
      imports: options.imports,
      providers: [
        {
          provide: AZURE_STORAGE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },

        ...commonProviders,
      ],
      exports: [
        AZURE_STORAGE_CLIENT,
        AZURE_STORAGE_BLOB_SERVICE,
      ],
    };
  }
}
