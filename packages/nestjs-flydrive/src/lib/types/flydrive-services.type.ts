import { DriverContract } from 'flydrive/build/src/types';

export type FlyDriveServices = Record<string, () => DriverContract>;
