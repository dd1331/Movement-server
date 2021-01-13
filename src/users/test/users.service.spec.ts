import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { HttpStatus } from '@nestjs/common';
User.findOne = jest.fn();
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should have findOne function', async () => {
    expect(typeof service.findOne).toBe('function');
  });
  it('should be called width id', async () => {
    await service.findOne(3);
    expect(User.findOne).toHaveBeenCalledWith(3);
  });
  it('should throw error', async () => {
    (User.findOne as jest.Mock).mockReturnValue(null);
    const { response } = await service.findOne(-3);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.error).toBe('user not found');
  });
  test('findOne function should be defined', async () => {
    User.findOne = jest.fn();
    expect(typeof service.findOne).toBe('function');
    await service.findOne(3);
    expect(User.findOne).toHaveBeenCalledWith(3);
  });

  describe('create', () => {
    it('should have create function', () => {
      expect(service.create).toBeDefined();
      expect(typeof service.create).toBe('function');
    });
    // it('should create user', () => {

    // });
  });
});
