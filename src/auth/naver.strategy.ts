import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { AuthService } from './auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // authorizationURL: '',
      // tokenURL: '',
      clientID: 'ag_B0_vLXpvrgG1J5Upp',
    });
    console.log('tsafds');
  }
  async validate(payload: any) {
    console.log('payload', payload());
    return { userId: payload.sub, username: payload.username };
  }
}
