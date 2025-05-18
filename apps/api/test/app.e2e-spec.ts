import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';

import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Disable ESLint for the test case because supertest has inherent type issues

  it('/ (GET)', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const server: Server = app.getHttpServer();

    const req = request(server);

    return req.get('/').expect(200).expect('Hello World!');
  });
});
