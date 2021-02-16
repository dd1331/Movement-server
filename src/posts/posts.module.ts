import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../like.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Category } from 'src/common/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Like, Category])],
  exports: [PostsService],
  providers: [PostsService, UsersService],
  controllers: [PostsController],
})
export class PostsModule {}
