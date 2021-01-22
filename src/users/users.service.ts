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
    try {
      await this.checkIfExist(createUserDto);
      const newUser = await this.userRepo.create(createUserDto);
      return newUser;
    } catch (error) {
      return error;
    }
  }
  //temp any
  async checkIfExist(createUserDto: CreateUserDto): Promise<boolean> {
    const { phone, name } = createUserDto;
    const where = [{ phone }, { name }];

    const isExist = await this.userRepo.findOne({ where });
    if (isExist) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: '이미 존재하는 **입니다',
        },
        HttpStatus.CONFLICT,
      );
    }
    return true;
  }

  async findAll() {
    const users = await this.userRepo.find();
    return users;
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { id, deletedAt: IsNull() },
      });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      return error;
    }
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

  async remove(id: number): Promise<boolean> {
    // const user = await this.userRepo.findOne(id);
    try {
      const user = await this.userRepo.findOne(id);
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const result = await this.userRepo.softDelete(id);
      if (result) return true;
      return false;
    } catch (error) {
      return error;
    }
  }
}
