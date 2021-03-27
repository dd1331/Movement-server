import { Injectable, Res, Body } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private authService: AuthService) {
    super({
      clientID: 'ag_B0_vLXpvrgG1J5Upp',
      callbackURL: 'http://localhost:3000/auth/naver/redirect',
      clientSecret: 'hE0MnzlWWk',
    });
    () => {
      console.log('111');
    };
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // TODO specify done type
    done: any,
  ): Promise<any> {
    type BulkedUser = Partial<User> & { accessToken };
    const user: BulkedUser = {
      naverId: profile.id,
      accessToken,
    };
    done(null, user);
  }
}
