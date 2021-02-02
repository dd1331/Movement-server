import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsService } from '../posts.service';
import { Post } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
const newUsers = [
  {
    id: 0,
    userId: 'test id',
    userName: 'test',
    password: '123123',
    phone: '01000000000',
  },
  {
    id: 1,
    userId: 'test id 1',
    userName: 'test1',
    password: '123123',
    phone: '01000000001',
  },
  {
    id: 2,
    userId: 'test id 2',
    userName: 'test2',
    password: '123123',
    phone: '01000000002',
  },
];

describe('Posts', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let postsService: PostsService;
  let user: User;
  let createdPost: Post;
  let createPostDto: CreatePostDto;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    postsService = moduleRef.get<PostsService>(PostsService);
    app = moduleRef.createNestApplication();
    await app.init();
    const newUser = newUsers[0];
    const [foundUser] = await usersService.findAll();
    user = foundUser;
    if (!user) {
      user = await usersService.create(newUser[0]);
    }
    createPostDto = {
      poster: user.id,
      title: 'test title 12',
      content: 'test content 1',
    };
  });
  afterAll(async () => {
    await app.close();
  });
  describe('/POST createPost', () => {
    it('should return created object ', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/posts/create')
        .send(createPostDto)
        .expect(HttpStatus.CREATED);
      expect(body.title).toBe(createPostDto.title);
      expect(body.content).toBe(createPostDto.content);
      expect(body.poster).toBe(createPostDto.poster);
      createdPost = body;
    });
    it('should throw an error if values are not valid', async () => {
      const invalidCreatePostDto: CreatePostDto = {
        // poster: user.id,
        // temp
        poster: 233,
        content: '',
        title: '',
      };
      await request(app.getHttpServer())
        .post('/posts/create')
        .send(invalidCreatePostDto)
        .expect(HttpStatus.BAD_REQUEST);
      invalidCreatePostDto.content = 'added content';
      await request(app.getHttpServer())
        .post('/posts/create')
        .send(invalidCreatePostDto)
        .expect(HttpStatus.BAD_REQUEST);
      invalidCreatePostDto.title = 'added title';
      await request(app.getHttpServer())
        .post('/posts/create')
        .send(invalidCreatePostDto)
        .expect(HttpStatus.CREATED);
    });
  });
  describe('/GET readPost', () => {
    const postId = createdPost.id;
    it('should return a post object', async () => {
      const { body } = await request(app.getHttpServer()).get(
        `/posts/:${postId}`,
      );
      expect(body.title).toBe(createdPost.title);
      expect(body.content).toBe(createdPost.content);
      expect(body.title).toBe(createdPost.title);
    });
    it('should throw an error if post is not found', async () => {
      const invalidPostId = 999999999;
      await request(app.getHttpServer())
        .get(`/posts/:${invalidPostId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('/GET readAllPosts', () => {
    const posts = postsService.readAllPosts();
    it('should return post array', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/posts')
        .expect(HttpStatus.OK);
      expect(body).toStrictEqual(posts);
    });
    it('should throw an error if there is no post', async () => {
      // TODO write code
      // const res = await request(app.getHttpServer())
      //   .get('/posts')
      //   .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('/PATCH updatePost', () => {
    const poster: number = createdPost.poster;
    const updatePostDto: UpdatePostDto = {
      title: 'updated title',
      content: 'updated content',
      // postId: createdPost.id,
      //TEMP
      postId: 55,
    };
    it('should return updated post object', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/posts/:${poster}`)
        .send(updatePostDto)
        .expect(HttpStatus.CREATED);
      expect(body.title).toBe(updatePostDto.title);
      expect(body.const).toBe(updatePostDto.content);
    });

    it('should throw an error if data is not valid', async () => {
      const invalidUpdatePostDto: UpdatePostDto = {
        title: '',
        content: '',
        postId: 44,
      };
      const { body } = await request(app.getHttpServer())
        .patch(`/posts/:${poster}`)
        .send(invalidUpdatePostDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('should throw an error if the post is not existing', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/posts/:${poster}`)
        .send(updatePostDto)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/DELETE deletePost', () => {
    const postId = createdPost.id;
    it('should return deleted post object', async () => {
      const { body } = await request(app.getHttpServer())
        .delete(`posts/:${postId}`)
        .expect(HttpStatus.OK);
      expect(body.deleteAt).toBeTruthy();
    });
    it('should throw an erorr if post does not exist or already deleted', async () => {
      await request(app.getHttpServer())
        .delete(`posts/:${postId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
