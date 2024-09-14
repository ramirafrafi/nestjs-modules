import { AzureStorageBlobError } from "./azure-storage-blob.error";


export class InvalidBlobNameError extends AzureStorageBlobError {
  constructor(blobName: string) {
    super(
      `Invalid blobName "${blobName}", must be of the form {container}/{blobName} or {container}/{virtualDirectory}/{blobName}`,
    );
  }
}
