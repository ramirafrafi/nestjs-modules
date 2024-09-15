import { Injectable } from '@nestjs/common';
import { ILock } from '../interfaces/lock.interface';

type RunOptions = {
  autoRelease?: boolean;
}

type RunCallback = () => void | Promise<void>;

@Injectable()
export class LockService {
  async runIfUnlocked(
    lock: ILock,
    callback: RunCallback,
    options?: RunOptions,
  ): Promise<void> {
    // If locked, return without executing
    if (await lock.isLocked()) {
      return;
    }

    await this.runExclusive(lock, callback, options);
  }

  async runExclusive(
    lock: ILock,
    callback: RunCallback,
    { autoRelease = true }: RunOptions = {},
  ): Promise<void> {
    // Acquire the lock
    const release = await lock.acquire();

    try {
      // Execute
      await callback();
    } finally {
      // Release the lock no matter the execution is completed or an exception is raised
      if (autoRelease) {
        release();
      }
    }
  }
}
