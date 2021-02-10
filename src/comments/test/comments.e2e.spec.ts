import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { CommentsService } from '../comments.service';
import { CreateCommentDto } from '../dto/create-comment-dto';

describe('Posts', () => {
  let app: INestApplication;
  let commentsService: CommentsService;
  const createCommentDto: CreateCommentDto = {
    content: 'new content',
    commenterId: 243,
    postId: 230,
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    commentsService = moduleRef.get<CommentsService>(CommentsService);
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {});
  describe('CREATE', () => {
    it('create a comment an get comment object', async () => {
      // const comment = await commentsService.createComment(createCommentDto);
      const { body } = await request(app.getHttpServer())
        .post('/comments/create')
        .send(createCommentDto)
        .expect(HttpStatus.CREATED);
      expect(body.content).toBe(createCommentDto.content);
    });
  });
});
