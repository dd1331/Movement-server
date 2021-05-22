import {
  Controller,
  UseGuards,
  Post,
  Req,
  Get,
  Redirect,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BulkedUser } from '../users/users.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @Redirect('http://localhost:8080')
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @UseGuards(AuthGuard('local'))
  @Post('jwt')
  async jwtLogin(@Req() req) {
    const user: BulkedUser = await this.authService.login(req.user);
    return user;
  }
  @Post('naver')
  @Redirect('http://192.168.35.123:3000/auth/naver/redirect')
  async naverLogin(@Body() user: BulkedUser, @Req() req) {
    console.log('tes');
    const res = await this.authService.naverLogin(user);
    req.user = res;
    return res;
  }

  @Get('naver/redirect')
  naverAuthRedirect(@Req() req: Request) {}
}
