import { S3ClientConfig } from "@aws-sdk/client-s3";

export interface IS3ModuleOptions extends S3ClientConfig {
  endpoint?: string;
}
