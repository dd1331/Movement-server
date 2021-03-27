import { Controller, UseGuards, Post, Req, Get } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { NaverAuthGuard } from './naver/naver.auth.guard';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return await this.authService.login(req.user);
  }
  @Get('naver')
  // TOOD check what differences between using AuthGuard('name') and 'customguard?' are
  // @UseGuards(AuthGuard('naver'))
  @UseGuards(NaverAuthGuard)
  async loginWithNaver(@Req() req: Request) {}
  // async loginWithNaver() {}

  @Get('naver/redirect')
  // @UseGuards(AuthGuard('naver'))
  @UseGuards(NaverAuthGuard)
  naverAuthRedirect(@Req() req: Request) {
    return this.authService.naverLogin(req);
  }
}
