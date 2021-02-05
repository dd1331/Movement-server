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
import { CreateUserDto } from 'src/users/dto/create-user.dto';
const newUser: CreateUserDto = {
  userId: 'test id 2',
  userName: 'test2',
  password: '123123',
  phone: '01000000002',
};
describe('Posts', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let postsService: PostsService;
  let user: User;
  let post: Post;
  let createPostDto: CreatePostDto;
  let updatePostDto: UpdatePostDto;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    postsService = moduleRef.get<PostsService>(PostsService);
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    // const userRepo: Repository<User> = new Repository<User>();
    // const postRepo: Repository<Post> = new Repository<Post>();
    // // await userRepo.delete(user.id);
    // await postRepo.delete(212);
    await app.close();
  });
  beforeEach(async () => {
    const [foundPost] = await postsService.readAllPosts();
    post = foundPost ? foundPost : await postsService.createPost(createPostDto);

    const [foundUser] = await usersService.findAll();
    user = foundUser ? foundUser : await usersService.create(newUser);
    createPostDto = {
      poster: user.id,
      title: 'test title 12',
      content: 'test content 1',
    };
    updatePostDto = {
      id: post.id,
      title: 'updated title',
      content: 'updated content',
    };
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
    });
    it('should throw an error if values are not valid', async () => {
      const invalidCreatePostDto: CreatePostDto = {
        poster: user.id,
        content: '',
        title: '',
      };
      const { body } = await request(app.getHttpServer())
        .post('/posts/create')
        .send(invalidCreatePostDto)
        .expect(HttpStatus.BAD_REQUEST);
      expect(body.message).toHaveLength(2); // title, content
    });
  });
  describe('/GET readPost', () => {
    it('should return a post object', async () => {
      const postId = post.id;
      const { body } = await request(app.getHttpServer()).get(
        `/posts/${postId}`,
      );
      expect(body.title).toBe(post.title);
      expect(body.content).toBe(post.content);
      expect(body.title).toBe(post.title);
    });
    it('should throw an error if post is not found', async () => {
      const nonExistentPostId = 9999999;
      await request(app.getHttpServer())
        .get(`/posts/${nonExistentPostId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('/GET readAllPosts', () => {
    it('should return post array', async () => {
      const posts = await postsService.readAllPosts();
      const { body } = await request(app.getHttpServer())
        .get('/posts')
        .expect(HttpStatus.OK);
      expect(body).toHaveLength(posts.length);
    });
    it('should throw an error if there is no post', async () => {
      // TODO write code
    });
  });
  describe('/PATCH updatePost', () => {
    it('should return updated post object', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/posts')
        .send(updatePostDto)
        .expect(HttpStatus.OK);
      expect(body.title).toBe(updatePostDto.title);
      expect(body.content).toBe(updatePostDto.content);
    });

    it('should throw an error if data is not valid', async () => {
      const invalidUpdatePostDto: UpdatePostDto = {
        ...updatePostDto,
        title: '',
        content: '',
      };
      const { body } = await request(app.getHttpServer())
        .patch('/posts')
        .send(invalidUpdatePostDto)
        .expect(HttpStatus.BAD_REQUEST);
      expect(body.message).toHaveLength(2); // title, content
    });
    it('should throw an error if the post is not existing', async () => {
      const invalidUpdatePostDto: UpdatePostDto = { ...updatePostDto };
      invalidUpdatePostDto.id = 99999;
      const { body } = await request(app.getHttpServer())
        .patch('/posts')
        .send(invalidUpdatePostDto)
        .expect(HttpStatus.NOT_FOUND);
      expect(body.message).toBe('존재하지 않는 게시글입니다');
    });
  });
  describe('/DELETE deletePost', () => {
    it('should return deleted post object', async () => {
      const { body } = await request(app.getHttpServer())
        .delete(`/posts/${post.id}`)
        .expect(HttpStatus.OK);
      expect(body).toBeTruthy();
    });
    it('should throw an erorr if post does not exist or already deleted', async () => {
      const { body } = await request(app.getHttpServer())
        .delete(`/posts/${post.id - 1}`)
        .expect(HttpStatus.NOT_FOUND);
      expect(body.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(body.message).toBe('존재하지 않는 게시글입니다');
    });
  });
});
