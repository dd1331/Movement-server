import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../users.module';
import { UsersService } from '../users.service';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
const newUsers = [
  {
    id: 0,
    name: 'test',
    password: '123123',
    phone: '01000000000',
  },
  {
    id: 1,
    name: 'test1',
    password: '123123',
    phone: '01000000001',
  },
  {
    id: 2,
    name: 'test2',
    password: '123123',
    phone: '01000000002',
  },
];

describe('Users', () => {
  let app: INestApplication;
  const usersService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(UsersService)
      // .useValue(usersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
  it('/POST signup', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(newUsers[0])
      .expect(201);
    console.log(response.body);
    expect(response.body).toEqual({});
  });
  it('/GET users', () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect({
      data: usersService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
