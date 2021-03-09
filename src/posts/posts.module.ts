import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../like/entities/like.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Category } from '../common/entities/category.entity';
import { File } from '../files/entities/file.entity';
import { LikesService } from '../like/likes.service';
import { Comment } from '../comments/entities/comment.entity';
import { ChildComment } from '../comments/entities/child_comment.entity';
import { CommentsService } from '../comments/comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      Like,
      Category,
      File,
      Comment,
      ChildComment,
    ]),
  ],
  exports: [PostsService],
  providers: [PostsService, UsersService, LikesService, CommentsService],
  controllers: [PostsController],
})
export class PostsModule {}
