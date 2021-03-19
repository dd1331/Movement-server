import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  HttpCode,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
  @Post('naver')
  @HttpCode(200)
  //TODO set HttpCode dynamically?
  async loginWithNaver(@Body('id') id: string): Promise<User> {
    return await this.authService.loginWithNaver(id);
  }
}
// curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
