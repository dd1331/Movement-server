import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AwsService } from './aws.service';

describe('Aws', () => {
  let app: INestApplication;
  let awsService: AwsService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    awsService = moduleRef.get<AwsService>(AwsService);
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {});
  describe('CREATE', () => {
    it('test', async () => {
      const res = await request(app.getHttpServer())
        .post('/aws/upload')
        .attach('file', './README.md')
        .field('name', 'test2')
        .expect(201);
      // console.log(res);
    });
  });
});
