import path from 'path';
import {
  AppendBlobClient,
  BlobBatchClient,
  BlobClient,
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
  PageBlobClient,
} from '@azure/storage-blob';
import { Inject, Injectable } from '@nestjs/common';
import { AZURE_STORAGE_CLIENT, AZURE_STORAGE_OPTIONS } from '../azure-storage-blob.tokens';
import { IAzureBlobModuleOptions } from '../interfaces/azure-blob-module-options.interface';
import { storageAccountUrl } from '../utils/storage-account-url';
import { IBlobLocation } from '../interfaces/blob-location.interface';
import { InvalidBlobNameError } from '../errors/invalid-blob-name.error';

@Injectable()
export class AzureStorageBlobService {
  constructor(
    @Inject(AZURE_STORAGE_OPTIONS)
    protected options: IAzureBlobModuleOptions,
    @Inject(AZURE_STORAGE_CLIENT)
    protected service: BlobServiceClient,
  ) { }

  /**
   * @throws {AzureBlobError}
   */
  async getBlobUrl(blobName: string): Promise<string> {
    return new URL(blobName, storageAccountUrl(this.options)).href;
  }

  /**
   * @throws {InvalidBlobNameError}
   */
  async getAppendClient(blobName: string): Promise<AppendBlobClient> {
    return this.getBlobClient(blobName).then(
      (client) => client.getAppendBlobClient(),
    );
  }

  /**
   * @throws {InvalidBlobNameError}
   */
  async getBlockClient(blobName: string): Promise<BlockBlobClient> {
    return this.getBlobClient(blobName).then(
      (client) => client.getBlockBlobClient(),
    );
  }

  /**
   * @throws {InvalidBlobNameError}
   */
  async getPageClient(blobName: string): Promise<PageBlobClient> {
    return this.getBlobClient(blobName).then(
      (client) => client.getPageBlobClient(),
    );
  }

  /**
   * @throws {InvalidBlobNameError}
   */
  async getBlobClient(blobName: string): Promise<BlobClient> {
    const { client, blobPath } = await this.getBlobContainerClient(blobName);

    return client.getBlobClient(blobPath);
  }

  /**
   * @throws {InvalidBlobNameError}
   */
  async getBlobBatchClient(container: string): Promise<BlobBatchClient> {
    const client = await this.getContainerClient(container);

    return client.getBlobBatchClient();
  }

  /**
   * @throws {InvalidBlobNameError}
   */
  async getBlobContainerClient(blobName: string): Promise<{ client: ContainerClient } & IBlobLocation> {
    const { container, blobPath } = await this.getBlobLocation(blobName);

    const client = this.service.getContainerClient(container);
    await client.createIfNotExists({ access: 'blob' });

    return {
      client,
      container,
      blobPath,
    };
  }

  /**
   * @throws {InvalidBlobNameError}
   */
  async getContainerClient(container: string): Promise<ContainerClient> {
    const client = this.service.getContainerClient(container);
    await client.createIfNotExists({ access: 'blob' });

    return client;
  }

  /**
   * @throws {InvalidBlobNameError}
   */
  async getBlobLocation(blobName: string): Promise<IBlobLocation> {
    const blobNameParts = blobName.split(path.sep).filter(Boolean);

    if (blobNameParts.length < 2) {
      throw new InvalidBlobNameError(blobName);
    }

    return {
      container: blobNameParts[0],
      blobPath: blobNameParts.slice(1).join(path.sep),
    };
  }

  async getServiceClient(): Promise<BlobServiceClient> {
    return this.service;
  }
}
