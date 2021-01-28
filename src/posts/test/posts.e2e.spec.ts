import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
const newPosts = [
  {
    id: 1,
    poster: 3,
    title: 'test title 1',
    content: 'test content 1',
    like: 0,
    dislike: 0,
    views: 0,
  },
  {
    id: 2,
    poster: 3,
    title: 'test title 2',
    content: 'test content 2',
    like: 0,
    dislike: 0,
    views: 0,
  },
  {
    id: 3,
    poster: 3,
    title: 'test title 3',
    content: 'test content 3',
    like: 0,
    dislike: 0,
    views: 0,
  },
  {
    id: 4,
    poster: 3,
    title: 'test title 4',
    content: 'test content 4',
    like: 0,
    dislike: 0,
    views: 0,
  },
];
const createPostDto = {
  poster: 3,
  title: 'test title 1',
  content: 'test content 1',
  // like: 0,
  // dislike: 0,
  // views: 0,
};
describe('Posts', () => {
  let app: INestApplication;
  const usersService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  it('Post posts/create ', async () => {
    await request(app.getHttpServer())
      .post('/posts/create')
      .expect(201)
      .send(createPostDto);
  });
});
