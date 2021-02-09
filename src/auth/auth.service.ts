import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
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
    const user = await this.usersService.findOneByNaver(id);
    if (!user) {
      return await this.usersService.signupWithSns(id, 'naver');
    }
    return user;
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
  //       const user = await this.usersService.findOneByNaver(profile.id);
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
