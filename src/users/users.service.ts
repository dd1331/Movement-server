import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userRepo.create(createUserDto);
      return newUser;
    } catch (error) {
      return error;
    }
  }
  //temp any
  async checkDuplication(payload): Promise<any | boolean> {
    const findOption = { where: payload };

    const isDuplicated = await this.userRepo.findOne(findOption);
    if (isDuplicated) {
      return new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: '이미 존재하는 **입니다',
        },
        HttpStatus.CONFLICT,
      );
    }
    return true;
  }

  findAll() {
    return [`This action returns all users`];
  }

  async findOne(id: number) {
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

      return user;
    } catch (error) {
      return error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
