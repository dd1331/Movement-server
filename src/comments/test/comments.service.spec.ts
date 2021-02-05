import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from '../comments.service';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsService],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('CREATE', () => {
    it('should be defined', async () => {
      return;
    });
    it('should return a created object', async () => {
      return;
    });
    it('should throw an error if content is empty', async () => {
      return;
    });
    it('should throw an error if comment does not exist', async () => {
      return;
    });
    it('should throw an error if post does not exist', async () => {
      return;
    });
  });
  describe('READ', () => {
    it('should return comment list on a specified post', async () => {
      return;
    });
    it('should throw an error if no comment exist on a specified post', async () => {
      return;
    });
  });

  describe('UPDATE', () => {
    it('should return updated comment', async () => {
      return;
    });
    it('should throw error if input data is not valid', async () => {
      return;
    });
    it('should throw an error if comment does not exist', async () => {
      return;
    });
    it('should throw an error if post does not exist', async () => {
      return;
    });
  });
  describe('DELETE', () => {
    it('should return deleted comment with truthy deleted column', async () => {
      return;
    });
    it('should throw an error if comment does not exist', async () => {
      return;
    });
    it('should throw an error if post does not exist', async () => {
      return;
    });
  });
});
