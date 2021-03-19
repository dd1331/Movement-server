import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {} //readonly?

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
  async loginWithNaver(id: string): Promise<User> {
    const user = await this.getUserBySocial(id, 'naver', 'naverId');

    if (!user) {
      return await this.signupWithSns(id, 'naver', 'naverId');
    }
    return user;
  }

  async getUserBySocial(id: string, provider: string, socialId: string) {
    const where = { provider, [socialId]: id };

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
  // async loginWithNaver() {
  //   const test = new NaverStrategy();
  //   console.log(test);
  //   await test.register();
  //   // passport.use(
  //   new NaverStrategy(
  //     {
  //       clientId: 'ag_B0_vLXpvrgG1J5Upp',
  //       clientSecret: 'hE0MnzlWWk',
  //       callbackUrl: 'http://192.168.35.237:8080/auth/naver',
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       // console.log()
  //       const user = await this.usersService.getUserBySocial(profile.id);
  //       console.log(user);
  //       // User.findOne(
  //       //   {
  //       //     'naver.id': profile.id,
  //       //   },
  //       //   function (err, user) {
  //       //     if (!user) {
  //       //       user = new User({
  //       //         name: profile.displayName,
  //       //         email: profile.emails[0].value,
  //       //         username: profile.displayName,
  //       //         provider: 'naver',
  //       //         naver: profile._json,
  //       //       });
  //       //       user.save(function (err) {
  //       //         if (err) console.log(err);
  //       //         return done(err, user);
  //       //       });
  //       //     } else {
  //       //       return done(err, user);
  //       //     }
  //       //   },
  //       // );
  //     },
  //   ),
  // );
  // }

  // async signupWithSns(id: string) {
  //   const user = await
  // }
}
