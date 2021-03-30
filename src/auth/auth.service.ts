import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {} //readonly?

  naverLogin(res: Response) {
    const client_id = 'ag_B0_vLXpvrgG1J5Upp';
    const redirectURI = 'http://192.168.35.123:8080';
    const state = 'test';
    const url =
      'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' +
      client_id +
      '&redirect_uri=' +
      redirectURI +
      '&state=' +
      state;

    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    const test = res.end(
      "<a href='" +
        url +
        "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>",
    );
    return test;
  }
  async naverAuthRedirect(req: Request) {
    const code = req.query.code;
    const state = req.query.state;
    const client_secret = 'hE0MnzlWWk';
    const client_id = 'ag_B0_vLXpvrgG1J5Upp';
    const redirectURI = 'http://192.168.35.123:8080';
    const api_url =
      'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' +
      client_id +
      '&client_secret=' +
      client_secret +
      '&redirect_uri=' +
      redirectURI +
      '&code=' +
      code +
      '&state=' +
      state;
    const options = {
      headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
      },
    };
    const res = await axios.get(api_url, options);
    return JSON.stringify(res.data);
    // function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
    //     res.end(body);
    //   } else {
    //     res.status(response.statusCode).end();
    //     console.log('error = ' + response.statusCode);
    //   }
    // }
  }

  googleLogin(req: Request) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
  // async naverLogin(naver: BulkedUser): Promise<BulkedUser> {
  //   const accessToken = naver.accessToken;
  //   const user = await this.getUserBySocial(naver.naverId, 'naver', 'naverId');

  //   if (!user) {
  //     return {
  //       ...(await this.signupWithSns(naver.naverId, 'naver', 'naverId')),
  //       accessToken,
  //     };
  //   }
  //   console.log(user);

  //   return { ...user, accessToken };
  // }

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
