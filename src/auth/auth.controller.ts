import {
  Controller,
  UseGuards,
  Post,
  Req,
  Get,
  Redirect,
  Res,
} from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }
  @Get('naver')
  naverLogin(@Res() res) {
    return this.authService.naverLogin(res);
  }

  @Get('naver/redirect')
  @Redirect('http://192.168.35.123:8080/')
  naverAuthRedirect(@Req() req: Request) {
    return this.authService.naverAuthRedirect(req);
  }
}
