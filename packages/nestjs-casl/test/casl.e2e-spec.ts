import request from 'supertest'; // eslint-disable-line @nx/enforce-module-boundaries

import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from "http";
import { CaslModule } from '../src/lib/casl.module';
import { TestController } from './controllers/test.controller';
import { TestAbilityFactory } from './ability/test.ability-factory';

describe('CaslModule (e2e)', () => {
    let app: INestApplication<Server>;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [CaslModule.forRoot({
                global: true,
                abilityFactory: TestAbilityFactory,
            })],
            controllers: [TestController],
        }).compile();

        app = moduleRef.createNestApplication();

        await app.init();
    });

    it('GET /allow returns 200', () =>
        request(app.getHttpServer())
            .get('/allow')
            .expect(200),
    );

    it('GET /deny returns 403', () =>
        request(app.getHttpServer())
            .get('/deny')
            .expect(403),
    );
});
