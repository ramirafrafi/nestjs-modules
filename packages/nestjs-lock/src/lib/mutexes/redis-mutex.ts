import { lock } from 'simple-redis-mutex'; // eslint-disable-line @nx/enforce-module-boundaries

import { Redis } from 'ioredis';
import { ILock } from '../interfaces/lock.interface';

type RedisMutexOptions = {
  failAfterMillis?: number;
  timeoutMillis?: number;
};

export class RedisMutex implements ILock {
  constructor(
    readonly redis: Redis,
    readonly keyName: string,
    readonly options: RedisMutexOptions = {},
  ) { }

  get readKey(): string {
    return `@simple-redis-mutex:lock-${this.keyName}`;
  }

  async isLocked(): Promise<boolean> {
    return (await this.redis.exists(this.readKey)) === 1;
  }

  async acquire(): Promise<() => void> {
    return lock(this.redis, this.keyName, this.options);
  }
}
