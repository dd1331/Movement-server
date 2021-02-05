import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { Repository, IsNull } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { HttpStatus } from '@nestjs/common';
const newPosts = [
  {
    id: 1,
    poster: 3,
    title: 'test title 1',
    content: 'test content 1',
    like: 0,
    dislike: 0,
    views: 0,
    deletedAt: null,
  },
  {
    id: 2,
    poster: 3,
    title: 'test title 2',
    content: 'test content 2',
    like: 0,
    dislike: 0,
    views: 0,
    deletedAt: new Date(),
  },
  {
    id: 3,
    poster: 3,
    title: 'test title 3',
    content: 'test content 3',
    like: 0,
    dislike: 0,
    views: 0,
    deletedAt: null,
  },
  {
    id: 4,
    poster: 3,
    title: 'test title 4',
    content: 'test content 4',
    like: 0,
    dislike: 0,
    views: 0,
    deletedAt: null,
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

describe('PostsService', () => {
  let service: PostsService;
  let repo: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<PostsService>(PostsService);
    repo = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CREATE', () => {
    it('should be defined', () => {
      expect(service.createPost).toBeDefined();
      expect(typeof service.createPost).toBe('function');
    });
    it('should return Post object', async () => {
      (repo.create as jest.Mock).mockReturnValue(newPosts[0]);
      const res = await service.createPost(createPostDto);
      expect(repo.create).toHaveBeenCalledWith(createPostDto);
      expect(res).toEqual(newPosts[0]);
    });
    it('should throw an error if it fails to create one', async () => {
      (repo.create as jest.Mock).mockReturnValue(null);
      try {
        await service.createPost(createPostDto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('글 작성에 실패했습니다');
      }
    });
  });
  describe('READ', () => {
    it('should be defined', () => {
      expect(service.readPost).toBeDefined();
      expect(typeof service.readPost).toBe('function');
      expect(service.readAllPosts).toBeDefined();
      expect(typeof service.readAllPosts).toBe('function');
    });
    it('should return a post object', async () => {
      (repo.findOne as jest.Mock).mockReturnValue(newPosts[0]);
      const res = await service.readPost(3);
      expect(res).toStrictEqual(newPosts[0]);
    });
    it('should return post objects', async () => {
      (repo.find as jest.Mock).mockReturnValue(newPosts);
      const res = await service.readAllPosts();
      expect(res).toStrictEqual(newPosts);
    });
    it('should throw an error if there is no data found', async () => {
      (repo.findOne as jest.Mock).mockReturnValue(null);
      try {
        await service.readPost(3);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('존재하지 않는 게시글입니다');
      }
      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 3, deletedAt: IsNull() },
      });
    });
    it('should throw an error if no data exist', async () => {
      (repo.find as jest.Mock).mockReturnValue(null);
      try {
        await service.readAllPosts();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('존재하지 않는 게시글입니다');
      }
      expect(repo.find).toHaveBeenCalled();
    });
    it('should throw an error if it is a deleted post', async () => {
      (repo.findOne as jest.Mock).mockReturnValue(null);
      try {
        await service.readPost(newPosts[1].id);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('존재하지 않는 게시글입니다');
      }
      expect(repo.findOne).toHaveBeenCalledTimes(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: newPosts[1].id, deletedAt: IsNull() },
      });
    });
  });
  describe('UPDATE', () => {
    const updateDto = {
      title: 'updated title',
      content: 'updated content',
      id: 3,
    };
    it('should be defined', () => {
      expect(service.updatePost).toBeDefined();
      expect(typeof service.updatePost).toBe('function');
    });
    it('should return updated post', async () => {
      (repo.findOne as jest.Mock).mockReturnValue(newPosts[0]);
      (repo.update as jest.Mock).mockReturnValue(updateDto);
      const res = await service.updatePost(updateDto);
      expect(res).toStrictEqual(updateDto);
      expect(repo.findOne).toHaveBeenCalledTimes(1);
      expect(repo.update).toBeCalledTimes(1);
    });
    it('should throw an error if post does not exist', async () => {
      (repo.findOne as jest.Mock).mockReturnValue(null);
      (repo.update as jest.Mock).mockReturnValue(updateDto);

      try {
        await service.updatePost(updateDto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('존재하지 않는 게시글입니다');
      }
      expect(repo.findOne).toBeCalled();
      expect(repo.update).toBeCalledTimes(0);
    });
    it('should throw an error if it is a deleted post', async () => {
      (repo.findOne as jest.Mock).mockReturnValue(null);
      try {
        await service.updatePost(updateDto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('존재하지 않는 게시글입니다');
      }
      expect(repo.findOne).toBeCalledTimes(1);
      expect(repo.findOne).toBeCalledWith({
        where: { id: updateDto.id, deletedAt: IsNull() },
      });
    });
  });
  describe('DELETE', () => {
    it('should be defined', () => {
      expect(service.deletePost).toBeDefined();
      expect(typeof service.deletePost).toBe('function');
    });
    it('should throw an error if post does not exist', async () => {
      const postId = 3;
      (repo.findOne as jest.Mock).mockReturnValue(null);
      (repo.softDelete as jest.Mock).mockReturnValue(null);
      try {
        await service.deletePost(postId);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('존재하지 않는 게시글입니다');
      }
      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: postId, deletedAt: IsNull() },
      });
      expect(repo.softDelete).toHaveBeenCalledTimes(0);
      // expect()
      // expect
    });
    it('should return deleted post', async () => {
      const postId = 3;
      (repo.findOne as jest.Mock).mockReturnValue(newPosts[0]);
      (repo.softDelete as jest.Mock).mockReturnValue(null);
      const res = await service.deletePost(postId);
      expect(repo.softDelete).toHaveBeenCalledWith(postId);
      expect(res).toStrictEqual(newPosts[0]);
    });
    it('should throw an error if post is already deleted', async () => {
      (repo.findOne as jest.Mock).mockReturnValue(null);
      try {
        await service.deletePost(2);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('존재하지 않는 게시글입니다');
      }
      expect(repo.findOne).toBeCalledTimes(1);
      expect(repo.findOne).toBeCalledWith({
        where: { id: 2, deletedAt: IsNull() },
      });
    });
  });
});
