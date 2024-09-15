import { Module } from '@nestjs/common';
import { LOCK_SERVICE } from './lock.tokens';
import { LockService } from './services/lock.service';

@Module({
  providers: [
    {
      provide: LOCK_SERVICE,
      useClass: LockService,
    },
  ],
  exports: [LOCK_SERVICE],
})
export class LockModule {}
