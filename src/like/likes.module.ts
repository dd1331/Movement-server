import { Module } from '@nestjs/common';
import { LikeController } from './likes.controller';
import { Post } from '../posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';
import { File } from '../files/entities/file.entity';
import { Comment } from '../comments/entities/comment.entity';
import { ChildComment } from '../comments/entities/child_comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, User, File, Comment, ChildComment]),
  ],
  controllers: [LikeController],
})
export class LikeModule {}
