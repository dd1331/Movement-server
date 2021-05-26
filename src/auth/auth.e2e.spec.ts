import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Auth', () => {
  let app: INestApplication;
  let agent;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    agent = app.getHttpServer();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('SOCIAL LOGIN/SIGNUP', () => {
    it('create new User and return it when not existing', async () => {
      return;
    });
  });
});
