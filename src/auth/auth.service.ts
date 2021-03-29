import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { BulkedUser } from 'src/users/users.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {} //readonly?

  googleLogin(req: Request) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
  async naverLogin(naver: BulkedUser): Promise<BulkedUser> {
    const accessToken = naver.accessToken;
    const user = await this.getUserBySocial(naver.naverId, 'naver', 'naverId');

    if (!user) {
      return {
        ...(await this.signupWithSns(naver.naverId, 'naver', 'naverId')),
        accessToken,
      };
    }
    return { ...user, accessToken };
  }

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByName(userName);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async getUserBySocial(id: string, provider: string, column: string) {
    const where = { provider, [column]: id };

    return await this.userRepo.findOne({
      where,
    });
  }

  async signupWithSns(
    id: string,
    provider: string,
    socialId: string,
  ): Promise<User> {
    const createUserDto: CreateUserDto = {
      provider: provider,
      password: 'randomString',
      phone: 'randomPhone',
      userId: 'randomString',
      userName: 'randomString',
      [socialId]: id,
    };
    const user = await this.userRepo.create(createUserDto);

    return await this.userRepo.save(user);
  }
}
