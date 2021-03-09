import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikeController } from './likes.controller';
import { Post } from '../posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
import { File } from '../files/entities/file.entity';
import { CommentsService } from '../comments/comments.service';
import { Comment } from '../comments/entities/comment.entity';
import { ChildComment } from '../comments/entities/child_comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, User, File, Comment, ChildComment]),
  ],
  controllers: [LikeController],
  // providers: [LikesService, UsersService, PostsService, CommentsService],
})
export class LikeModule {}
