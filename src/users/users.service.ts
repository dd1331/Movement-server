import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await User.create(createUserDto);
      return newUser;
    } catch (error) {
      return error;
    }
  }
  //temp any
  async checkDuplication(payload): Promise<any | boolean> {
    const findOption = { where: payload };

    const isDuplicated = await User.findOne(findOption);

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
      const user = await User.findOne(id);

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
