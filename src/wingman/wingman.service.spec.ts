import { Test, TestingModule } from '@nestjs/testing';
import { WingmanService } from './wingman.service';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../like/entities/like.entity';
import { File } from '../files/entities/file.entity';

describe('WingmanService', () => {
  let service: WingmanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WingmanService,
        UsersService,
        PostsService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            softDelete: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            softDelete: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Like),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            softDelete: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(File),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            softDelete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WingmanService>(WingmanService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
  it('test', async () => {
    await service.crawlInstizFreeBoard();
    // console.log(res);
  });
});
