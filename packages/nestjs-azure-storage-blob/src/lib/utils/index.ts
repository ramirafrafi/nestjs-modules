import { IAzureBlobModuleOptions } from "../interfaces/azure-blob-module-options.interface";

export function storageAccountUrl(options: IAzureBlobModuleOptions): string {
    return `https://${options.storageAccount}.blob.core.windows.net`;
}
