import { DriverContract } from 'flydrive/build/src/types';

export type FlydriveServices = Record<string, () => DriverContract>;
