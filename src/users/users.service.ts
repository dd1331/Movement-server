import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkIfExist(createUserDto);
    const newUser = await this.userRepo.create(createUserDto);
    await this.userRepo.save(newUser);
    return newUser;
  }
  //temp any
  async checkIfExist(createUserDto: CreateUserDto): Promise<boolean> {
    const { phone, userId, userName } = createUserDto;
    const where = [{ phone }, { userId }, { userName }];

    const isExisting = await this.userRepo.findOne({ where });
    if (isExisting) {
      throw new HttpException('이미 존재하는 **입니다', HttpStatus.CONFLICT);
    }
    return true;
  }

  async findAll(): Promise<User[]> {
    const users: User[] = await this.userRepo.find();
    return users;
  }

  async findAllWithDeleted(): Promise<User[]> {
    const users: User[] = await this.userRepo.find({ withDeleted: true });
    return users;
  }

  async findOne(id: number) {
    const user: User = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  ///temp///
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];
  async findOneByName(name: string) {
    return this.users.find((user) => user.username === name);
  }
  ///temp///

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  async remove(id: number): Promise<User> {
    const user: User = await this.userRepo.findOne(id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepo.softDelete(id);

    return user;
  }
  async hardRemove(id: number): Promise<boolean> {
    await this.userRepo.delete(id);
    return true;
  }
}
