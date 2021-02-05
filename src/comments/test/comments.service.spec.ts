import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { HttpStatus } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { CommentsService } from '../comments.service';
import { UpdateCommentDto } from '../dto/update-comment-dto';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let commentRepo: Repository<Comment>;
  let postRepo: Repository<Post>;
  let createCommentDto: CreateCommentDto;
  let createdComment: Partial<Comment>;
  let updateCommentDto: UpdateCommentDto;
  let post: Post;
  let postsService: PostsService;
  let comments: Comment[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
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

    postsService = module.get<PostsService>(PostsService);
    commentsService = module.get<CommentsService>(CommentsService);
    commentRepo = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });
  beforeEach(async () => {
    createCommentDto = {
      postId: 40,
      commenterId: 3,
      content: 'tset',
    };
    createdComment = {
      id: 3,
      postId: 50,
      commenterId: 3,
      content: 'test',
    };
    updateCommentDto = {
      id: createdComment.id,
      content: 'updated content',
    };
    [post] = await postsService.readAllPosts();
    comments = await commentsService.readAllComments();
  });

  it('should be defined', () => {
    expect(commentsService).toBeDefined();
  });
  describe('CREATE', () => {
    it('should be defined', async () => {
      expect(commentsService.createComment).toBeDefined();
      expect(typeof commentsService.createComment).toBe('function');
    });
    it('should return a created object', async () => {
      (commentRepo.create as jest.Mock).mockReturnValue(createdComment);
      const res = await commentsService.createComment(createCommentDto);
      expect(res.id).toBe(expect.any('number'));
      expect(res.postId).toBe(expect.any('number'));
      expect(res.commenterId).toBe(expect.any('number'));
      expect(res.content).toBe(expect.any('string'));
    });
    it('should throw an error if content is empty', async () => {
      (commentRepo.create as jest.Mock).mockReturnValue(null);
      try {
        await commentsService.createComment(createCommentDto);
      } catch (err) {
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe('댓글 작성에 실패했습니다');
      }
      expect(commentRepo.create).toHaveBeenCalledWith(createCommentDto);
    });
    it('should throw an error if post does not exist', async () => {
      // (commentRepo.create as jest.Mock).mockReturnValue(null);
      (postRepo.findOne as jest.Mock).mockReturnValue(null);
      try {
        await commentsService.createComment(createCommentDto);
      } catch (err) {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('게시글이 존재하지 않습니다');
      }
      expect(postRepo.findOne).toHaveBeenCalledWith(createCommentDto.postId);
      expect(commentRepo.create).toHaveBeenCalledTimes(0);
    });
  });
  describe('READ', () => {
    it('should be defined', async () => {
      expect(commentsService.readComments).toBeDefined();
      expect(typeof commentsService.readComments).toBe('function');
    });
    it('should return comment list on a specified post', async () => {
      (postRepo.findOne as jest.Mock).mockReturnValue(post);
      (commentRepo.find as jest.Mock).mockReturnValue(comments);
      const res = await commentsService.readComments(createdComment.postId);
      expect(postRepo.findOne).toHaveBeenCalledWith(createdComment.postId);
      expect(res).toHaveLength(post.comments.length);
      expect(res).toStrictEqual(comments);
      expect(res).toBe(expect.any(Array));
    });
    it('should throw an error if no comment exist on a specified post', async () => {
      (postRepo.findOne as jest.Mock).mockReturnValue(post);
      (commentRepo.find as jest.Mock).mockReturnValue(null);
      try {
        await commentsService.readComments(createdComment.postId);
      } catch (error) {
        expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('댓글이 존재하지 않습니다');
      }
      expect(postRepo.findOne).toHaveBeenCalledWith(createdComment.postId);
      expect(commentRepo.find).toHaveBeenCalledTimes(0);
    });
  });

  describe('UPDATE', () => {
    it('should be defined', async () => {
      expect(commentsService.updateComment).toBeDefined();
      expect(typeof commentsService.updateComment).toBe('function');
    });
    it('should return updated comment', async () => {
      (commentRepo.findOne as jest.Mock).mockReturnValue(expect.any(Comment));
      (commentRepo.save as jest.Mock).mockReturnValue(expect.any(Comment));
      const res = await commentsService.updateComment(updateCommentDto);
      expect(res.id).toBe(updateCommentDto.id);
      expect(res.content).toBe(updateCommentDto.content);
    });
    it('should throw error if input data is not valid', async () => {
      (commentRepo.findOne as jest.Mock).mockReturnValue(expect.any(Comment));
      (commentRepo.save as jest.Mock).mockReturnValue(expect.any(Comment));
      const invalidUpdateCommentDto = {
        ...updateCommentDto,
        content: '',
      };
      try {
        await commentsService.updateComment(invalidUpdateCommentDto);
      } catch (error) {
        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toHaveLength(1);
      }
      expect(commentRepo.find).toBeCalledWith(createdComment.id);
      expect(commentRepo.save).toBeCalledTimes(0);
    });
    it('should throw an error if comment does not exist', async () => {
      (commentRepo.findOne as jest.Mock).mockReturnValue(expect.any(Comment));
      (commentRepo.save as jest.Mock).mockReturnValue(expect.any(Comment));
      const invalidUpdateCommentDto = {
        ...updateCommentDto,
        id: 999999,
      };
      try {
        await commentsService.updateComment(invalidUpdateCommentDto);
      } catch (error) {
        expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('댓글이 존재하지 않습니다');
      }
      expect(commentRepo.findOne).toBeCalledWith(invalidUpdateCommentDto.id);
      expect(commentRepo.save).toBeCalledTimes(0);
    });
  });
  describe('DELETE', () => {
    it('should be defined', async () => {
      expect(commentsService.deleteComment).toBeDefined();
      expect(typeof commentsService.deleteComment).toBe('function');
    });
    it('should return deleted comment with truthy deleted column', async () => {
      (commentRepo.findOne as jest.Mock).mockReturnValue(comments[0]);
      (commentRepo.save as jest.Mock).mockReturnValue(comments[0]);
      const res = await commentsService.deleteComment(comments[0].id);
      expect(commentRepo.findOne).toBeCalledWith(comments[0].id);
      expect(commentRepo.save).toBeCalled();
      expect(res.deletedAt).toBeTruthy();
    });
    it('should throw an error if comment does not exist', async () => {
      (commentRepo.findOne as jest.Mock).mockReturnValue(null);
      (commentRepo.save as jest.Mock).mockReturnValue(comments[0]);
      try {
        await commentsService.deleteComment(9999999);
      } catch (error) {
        expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('댓글이 존재하지 않습니다');
      }
      expect(commentRepo.findOne).toBeCalledWith(9999999);
      expect(commentRepo.save).toBeCalledTimes(0);
    });
  });
});
