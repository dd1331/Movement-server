import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(userName: string, password: string): Promise<any> {
    const user = this.authService.validateUser(userName, password);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
