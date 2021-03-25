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
import each from 'jest-each';
let agent;
const createUserDto: CreateUserDto = {
  userId: 'testUserId',
  userName: 'testUserName',
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
  // const dto: GetPostsDto = {
  //   category: 'free',
  // };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    postsService = moduleRef.get<PostsService>(PostsService);
    app = moduleRef.createNestApplication();
    await app.init();
    agent = app.getHttpServer();
    user = await usersService.create(createUserDto);

    createPostDto = {
      poster: user.id.toString(),
      title: '트렌드 test',
      content: 'trend content 1',
      category: 'free',
      hashtags: ['해시태그 테스트1', 'test트렌드5'],
    };
    const createPostDtoArray = [
      createPostDto,
      {
        ...createPostDto,
        title: '검색용',
        category: 'excercise',
        hashtags: ['검색용1', '검색용2'],
      },
      {
        ...createPostDto,
        title: '검색용',
        category: 'excercise',
        hashtags: ['검색용1', '검색용2'],
      },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
    ];
    await Promise.all(
      createPostDtoArray.map(async (item) => {
        await postsService.createPost(item);
      }),
    );
  });
  afterAll(async () => {
    // const userRepo: Repository<User> = new Repository<User>();
    // const postRepo: Repository<Post> = new Repository<Post>();
    // // await userRepo.delete(user.id);
    // await postRepo.delete(212);
    await app.close();
  });
  describe('/POST createPost', () => {
    it('created post with no extra ', async () => {
      const { body } = await request(agent)
        .post('/posts/create')
        .send(createPostDto)
        .expect(HttpStatus.CREATED);
      expect(body).toMatchObject(createPostDto);
    });
    it('create post with file', async () => {
      const dtoWithHashTag: CreatePostDto = {
        ...createPostDto,
        fileId:
          'https://movement-seoul.s3.ap-northeast-2.amazonaws.com/credit_button.png',
      };
      // TODO should i get created files and compare?
      const { body } = await request(agent)
        .post('/posts/create')
        .send(dtoWithHashTag)
        .expect(HttpStatus.CREATED);
      expect(body).toMatchObject(createPostDto);
    });
    it('create post with hashtags', async () => {
      const dtoWithHashTag: CreatePostDto = {
        ...createPostDto,
        hashtags: ['test트렌드1', 'test트렌드5'],
      };
      // TODO should i get created hashtags and compare?
      const { body } = await request(agent)
        .post('/posts/create')
        .send(dtoWithHashTag)
        .expect(HttpStatus.CREATED);
      expect(body).toMatchObject(createPostDto);
    });
    each([
      // [content, title, category, expected]
      ['', '', '', HttpStatus.BAD_REQUEST],
      ['test content', '', 'free', HttpStatus.BAD_REQUEST],
      ['', 'test title', 'free', HttpStatus.BAD_REQUEST],
      ['test1', 'test2', '', HttpStatus.BAD_REQUEST],
      ['valid title', 'valid content', 'free', HttpStatus.CREATED],
    ]).test(
      'should throw an error if has invalid value',
      async (content, title, category, expected) => {
        const invalidCreatePostDto: CreatePostDto = {
          poster: user.id.toString(),
          content,
          title,
          category,
        };
        await request(agent)
          .post('/posts/create')
          .send(invalidCreatePostDto)
          .expect(expected);
        // TODO check file size and hashtag validation
        // expect(body.message).toHaveLength(2); // title, content
      },
    );
  });
  describe('/GET getPost', () => {
    const params = [
      [1, HttpStatus.OK],
      ['1', HttpStatus.OK],
      ['das', HttpStatus.BAD_REQUEST],
      [null, HttpStatus.BAD_REQUEST],
      [99999999, HttpStatus.NOT_FOUND],
      // TODO return bad request for negative integer and one exceeding maximum value,
      // seems like parseInt pipe is handling exceeding int value
      [-99999999, HttpStatus.NOT_FOUND],
      // [999999999999999999999, HttpStatus.NOT_FOUND],
    ];
    each(params).it('validate get post param', async (postId, expected) => {
      const { body } = await request(agent)
        .get(`/posts/${postId}`)
        .expect(expected);
      expect(body.deletedAt).toBeFalsy();
    });
  });
  describe('/GET getPosts', () => {
    const params = [
      // [category, take, page, hashtagId]
      ['free', 2, 1, 3],
      ['excercise', 3, 1, 2],
      ['enviroment', 3, 1, 0],
    ];
    each(params).it(
      'should return post array',
      async (category, take, page, hashtagId) => {
        const dto: GetPostsDto = {
          category,
          take,
          page,
          hashtagId,
        };
        const { body } = await request(agent)
          .get('/posts')
          .query(dto)
          .expect(HttpStatus.OK);
        // TODO handle when existing data is less than take
        if (take) expect(body.length).toBeLessThanOrEqual(take);
        if (!take) expect(body.length).toBeLessThanOrEqual(20);
        // TODO find a way of checking page
        const categories = body.map((post) => post.category);
        expect(categories.every((cg) => cg === category)).toEqual(true);
      },
    );
  });

  // describe('GET getPopularPosts', () => {
  //   it('should return popular posts', async () => {
  //     const res = await request(agent).get('/posts/popular');
  //     console.log(res.body);
  //   });
  // });

  // describe('/GET getRecommendedPosts', () => {
  //   it('should return posts ordered by likes', async () => {
  //     const res = await request(agent).get('/posts/recommended');
  //     console.log(res.body);
  //   });
  // });
  // describe('/PATCH updatePost', () => {
  //   it('should return updated post object', async () => {
  //     const { body } = await request(agent)
  //       .patch('/posts')
  //       .send(updatePostDto)
  //       .expect(HttpStatus.OK);
  //     expect(body.title).toBe(updatePostDto.title);
  //     expect(body.content).toBe(updatePostDto.content);
  //   });

  //   it('should throw an error if data is not valid', async () => {
  //     const invalidUpdatePostDto: UpdatePostDto = {
  //       ...updatePostDto,
  //       title: '',
  //       content: '',
  //     };
  //     const { body } = await request(agent)
  //       .patch('/posts')
  //       .send(invalidUpdatePostDto)
  //       .expect(HttpStatus.BAD_REQUEST);
  //     expect(body.message).toHaveLength(2); // title, content
  //   });
  //   it('should throw an error if the post is not existing', async () => {
  //     const invalidUpdatePostDto: UpdatePostDto = { ...updatePostDto };
  //     invalidUpdatePostDto.id = 99999;
  //     const { body } = await request(agent)
  //       .patch('/posts')
  //       .send(invalidUpdatePostDto)
  //       .expect(HttpStatus.NOT_FOUND);
  //     expect(body.message).toBe('존재하지 않는 게시글입니다');
  //   });
  // });
  // describe('/DELETE deletePost', () => {
  //   it('should return deleted post object', async () => {
  //     const { body } = await request(agent)
  //       .delete(`/posts/${post.id}`)
  //       .expect(HttpStatus.OK);
  //     expect(body).toBeTruthy();
  //   });
  //   it('should throw an erorr if post does not exist or already deleted', async () => {
  //     const { body } = await request(agent)
  //       .delete(`/posts/${post.id - 1}`)
  //       .expect(HttpStatus.NOT_FOUND);
  //     expect(body.statusCode).toBe(HttpStatus.NOT_FOUND);
  //     expect(body.message).toBe('존재하지 않는 게시글입니다');
  //   });
  // });
  // describe('/POST likePost', () => {
  //   it('should return created like obejct', async () => {
  //     const createLikeDto: CreateLikeDto = {
  //       type: 'post',
  //       isLike: true,
  //       targetId: 136,
  //       userId: 233,
  //     };
  //     const { body } = await request(agent)
  //       .post('/posts/like')
  //       .send(createLikeDto);
  //     console.log(body);
  //   });
  // });
  // describe('/POST dislikePost', () => {
  //   it('should return created like obejct', async () => {
  //     const createLikeDto: CreateLikeDto = {
  //       type: 'post',
  //       isLike: false,
  //       targetId: 136,
  //       userId: 233,
  //     };
  //     const { body } = await request(agent)
  //       .post('/posts/dislike')
  //       .send(createLikeDto);
  //     console.log(body);
  //   });
  // });
});
