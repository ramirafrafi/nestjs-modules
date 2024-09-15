import { InjectionToken } from "@nestjs/common";

export const S3_OPTIONS: InjectionToken = Symbol('S3_OPTIONS');

export const S3_SERVICE: InjectionToken = Symbol('S3_SERVICE');
