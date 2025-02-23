import { STORAGE_DEFAULT } from '../tokens';

export function getDiskToken(token = STORAGE_DEFAULT): string {
  return `STORAGE_DISK/${token}`;
}
