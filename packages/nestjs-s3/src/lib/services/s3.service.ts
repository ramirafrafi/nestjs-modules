import { InjectS3, S3 } from 'nestjs-s3';
import type {
  CompleteMultipartUploadCommandOutput,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { S3Error } from '../errors/s3.error';
import { S3_OPTIONS } from '../s3.tokens';
import { IS3ModuleOptions } from '../interfaces/s3-module-options.interface';
import { RequestPresigningArguments } from "@smithy/types";

@Injectable()
export class S3Service {
  @InjectS3()
  private s3Client!: S3;

  @Inject(S3_OPTIONS)
  private options!: IS3ModuleOptions;

  /**
   * @throws {S3Error}
   */
  async upload(params: PutObjectCommandInput): Promise<CompleteMultipartUploadCommandOutput> {
    try {
      const uploadOptions = {
        client: this.s3Client,
        params,
      };

      return new Upload(uploadOptions).done();
    } catch (error) {
      throw new S3Error((error as Error).message);
    }
  }

  /**
   * @throws {S3Error}
   */
  async delete(params: DeleteObjectCommandInput): Promise<DeleteObjectCommandOutput> {
    try {
      return await this.s3Client.deleteObject(params);
    } catch (error) {
      throw new S3Error((error as Error).message);
    }
  }

  /**
   * @throws {S3Error}
   */
  async getSignedUrl(
    params: GetObjectCommandInput,
    options?: RequestPresigningArguments,
  ): Promise<string> {
    try {
      return await getSignedUrl(
        this.s3Client,
        new GetObjectCommand(params),
        options,
      );
    } catch (error) {
      throw new S3Error((error as Error).message);
    }
  }

  async getObjectUrl(params: GetObjectCommandInput): Promise<string> {
    const endpoint = this.options.endpoint;

    return isNil(endpoint)
      ? `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
      : new URL(`${params.Bucket}/${params.Key}`, endpoint).href;
  }
}
