import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../users.module';
import { UsersService } from '../users.service';
import * as request from 'supertest';

describe('Users', () => {
  let app: INestApplication;
  const usersServise = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersServise)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
  it('/GET users', () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect({
      data: usersServise.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
