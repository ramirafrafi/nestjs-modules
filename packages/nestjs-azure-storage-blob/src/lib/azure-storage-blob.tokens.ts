import { InjectionToken } from "@nestjs/common";

export const AZURE_STORAGE_OPTIONS: InjectionToken = Symbol('AZURE_STORAGE_OPTIONS');

export const AZURE_STORAGE_CREDENTIAL: InjectionToken = Symbol('AZURE_STORAGE_CREDENTIAL');

export const AZURE_STORAGE_CLIENT: InjectionToken = Symbol('AZURE_STORAGE_CLIENT');

export const AZURE_STORAGE_BLOB_SERVICE: InjectionToken = Symbol('AZURE_STORAGE_BLOB_SERVICE');
