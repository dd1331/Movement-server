import { Module } from '@nestjs/common';
import { WingmanService } from './wingman.service';
import { WingmanController } from './wingman.controller';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../like.entity';
import { File } from '../files/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Like, File])],
  controllers: [WingmanController],
  providers: [WingmanService, UsersService, PostsService],
})
export class WingmanModule {}
