import { Test } from '@nestjs/testing';
import { LockModule } from '../lock.module';
import { LockService } from './lock.service';
import { LOCK_SERVICE } from '../lock.tokens';
import { ILock } from '../interfaces/lock.interface';
import { MemoryMutex } from '../mutexes/memory.mutex';
import { setTimeout, } from 'timers/promises';

let lockService: LockService;
let lock: ILock;

async function oneSecondCallback() {
    await setTimeout(1000);
    console.log('After 1s');
}

async function twoSecondsCallback() {
    await setTimeout(2000);
    console.log('After 2s');
}

describe('LockService', () => {
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [LockModule],
        }).compile();

        lockService = moduleRef.get(LOCK_SERVICE);

        console.log = jest.fn();
    });

    it('should logs in order without lock', async () => {
        await Promise.all([
            oneSecondCallback(),
            twoSecondsCallback(),
        ]);

        expect(console.log).toHaveBeenNthCalledWith(1, 'After 1s');
        expect(console.log).toHaveBeenNthCalledWith(2, 'After 2s');
    });

    describe('MemoryMutex', () => {
        beforeEach(async () => {
            lock = new MemoryMutex();
        });

        it('should logs first call', async () => {
            await Promise.all([
                lockService.runExclusive(lock, twoSecondsCallback),
                lockService.runExclusive(lock, oneSecondCallback),
            ]);

            expect(console.log).toHaveBeenNthCalledWith(1, 'After 2s');
            expect(console.log).toHaveBeenNthCalledWith(2, 'After 1s');
        });
    });
});
