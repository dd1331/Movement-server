import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // exports: [CatsService] // shared module 다른 모듈에서 사용하기 위해서는 exports 해줘야함
})
export class UsersModule {}
