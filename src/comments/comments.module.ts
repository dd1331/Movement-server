import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { ChildComment } from './entities/child_comment.entity';
import { LikesService } from '../like/likes.service';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../like/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, ChildComment, Post, Like]),
    PostsModule,
    UsersModule,
  ],
  exports: [CommentsService],
  providers: [CommentsService, LikesService],
  controllers: [CommentsController],
})
export class CommentsModule {}
