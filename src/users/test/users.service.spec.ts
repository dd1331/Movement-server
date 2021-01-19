import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
User.findOne = jest.fn();
User.create = jest.fn();
const newUser = {
  name: 'test',
  password: '123123',
  phone: '01000000000',
};
describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;
  // https://github.com/jmcdo29/testing-nestjs/tree/master/apps/typeorm-sample/src/cat
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),

          useValue: {
            find: jest.fn().mockResolvedValue('catArray'),
            findOneOrFail: jest.fn().mockResolvedValue('oneCat'),
            create: jest.fn().mockReturnValue(newUser),
            save: jest.fn(),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolee is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolee is true to not crash
            delete: jest.fn().mockResolvedValue(true),
            // findOne: jest.fn().mockResolvedValue(true),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();
    repo = module.get<Repository<User>>(getRepositoryToken(User));
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
    expect(repo.findOne).toHaveBeenCalledWith(3);
  });
  it('should throw error', async () => {
    // (User.findOne as jest.Mock).mockReturnValue(null);
    const { response } = await service.findOne(-3);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.error).toBe('user not found');
  });
  test('findOne function should be defined', async () => {
    expect(typeof service.findOne).toBe('function');
    await service.findOne(3);
    expect(repo.findOne).toHaveBeenCalledWith(3);
  });

  describe('create', () => {
    it('should have create function', () => {
      expect(service.create).toBeDefined();
      expect(typeof service.create).toBe('function');
    });

    it('should be called with newUser', async () => {
      await service.create(newUser);
      expect(repo.create).toHaveBeenCalledWith(newUser);
    });
    it('should return true if newUser is created', async () => {
      (User.create as jest.Mock).mockReturnValue(newUser);
      const response = await service.create(newUser);
      expect(response).toStrictEqual(newUser);
    });
    it('should throw an error if phone exist', async () => {
      (User.create as jest.Mock).mockReturnValue(new Error());
      const response = await service.create(newUser);
      expect(response);
    });
    it('should return an error if name exist', async () => {
      (repo.findOne as jest.Mock).mockReturnValue(newUser);
      const { response } = await service.checkDuplication(newUser.name);
      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.error).toBe('이미 존재하는 **입니다');
    });
    it('should return an error if phone exist', async () => {
      (repo.findOne as jest.Mock).mockReturnValue(newUser);
      const { response } = await service.checkDuplication(newUser.phone);
      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.error).toBe('이미 존재하는 **입니다');
    });
    it('should return true if name does not exist', async () => {
      (User.findOne as jest.Mock).mockReturnValue(null);
      const { response } = await service.checkDuplication(newUser.name);
      expect(response).toBeTruthy;
    });
    it('should return true if phone does not exist', async () => {
      (User.findOne as jest.Mock).mockReturnValue(null);
      const { response } = await service.checkDuplication(newUser.phone);
      expect(response).toBeTruthy;
    });
  });
});
