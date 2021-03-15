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
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreateLikeDto } from '../../like/dto/create-like-dto';
import { GetPostsDto } from '../dto/get-posts.dto';
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
  const dto: GetPostsDto = {
    category: 'free',
  };

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
    const [foundPost] = await postsService.readAllPosts(dto);
    post = foundPost ? foundPost : await postsService.createPost(createPostDto);

    const [foundUser] = await usersService.findAll();
    user = foundUser ? foundUser : await usersService.create(newUser);
    createPostDto = {
      poster: user.id,
      title: 'test title 12 view',
      content: 'test content 1',
      category: 'free',
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
    it('hashtag', async () => {
      const dtoWithHashTag: CreatePostDto = {
        ...createPostDto,
        hashtags: ['test', 'test2'],
      };
      const { body } = await request(app.getHttpServer())
        .post('/posts/create')
        .send(dtoWithHashTag);
      console.log(body);
    });
    it('should throw an error if values are not valid', async () => {
      const invalidCreatePostDto: CreatePostDto = {
        poster: user.id,
        content: '',
        title: '',
        category: 'free',
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
      const posts = await postsService.readAllPosts(dto);
      const { body } = await request(app.getHttpServer())
        .get('/posts')
        .expect(HttpStatus.OK);
      expect(body).toHaveLength(posts.length);
    });
    it('should throw an error if there is no post', async () => {
      // TODO write code
    });
  });

  describe('GET getPopularPosts', () => {
    it('should return popular posts', async () => {
      const res = await request(app.getHttpServer()).get('/posts/popular');
      console.log(res.body);
    });
  });

  describe('/GET getRecommendedPosts', () => {
    it('should return posts ordered by likes', async () => {
      const res = await request(app.getHttpServer()).get('/posts/recommended');
      console.log(res.body);
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
  describe('/POST likePost', () => {
    it('should return created like obejct', async () => {
      const createLikeDto: CreateLikeDto = {
        type: 'post',
        isLike: true,
        targetId: 136,
        userId: 233,
      };
      const { body } = await request(app.getHttpServer())
        .post('/posts/like')
        .send(createLikeDto);
      console.log(body);
    });
  });
  describe('/POST dislikePost', () => {
    it('should return created like obejct', async () => {
      const createLikeDto: CreateLikeDto = {
        type: 'post',
        isLike: false,
        targetId: 136,
        userId: 233,
      };
      const { body } = await request(app.getHttpServer())
        .post('/posts/dislike')
        .send(createLikeDto);
      console.log(body);
    });
  });
});
