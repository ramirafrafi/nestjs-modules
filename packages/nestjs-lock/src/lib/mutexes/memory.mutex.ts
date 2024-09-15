import { Mutex } from 'async-mutex';
import { ILock } from '../interfaces/lock.interface';

export class MemoryMutex implements ILock {
  protected readonly mutex = new Mutex();

  async isLocked(): Promise<boolean> {
    return this.mutex.isLocked();
  }

  async acquire(): Promise<() => void> {
    return this.mutex.acquire();
  }
}
