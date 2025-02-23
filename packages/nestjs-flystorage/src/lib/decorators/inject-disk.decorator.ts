import { Inject } from '@nestjs/common';
import { getDiskToken } from '../utils/get-disk-token';

export const InjectDisk = (token?: string) => Inject(getDiskToken(token));
