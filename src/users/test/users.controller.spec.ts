import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
    // catsService = await moduleRef.resolve(CatsService); //필요시 체크(resolve)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll', () => {
    test('createUser should be defined', () => {
      expect(service.create).toBeDefined();
    });
    test('createUser return', () => {
      // User.crea
      User.create = jest.fn();
      service.create({ name: 'test' });
      expect(User.create).toBeCalled();

      // jest.spyOn(service, '')
    });
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(service, 'findAll').mockImplementation(() => result);

      expect(await controller.findAll()).toBe(result);
    });
  });
});
