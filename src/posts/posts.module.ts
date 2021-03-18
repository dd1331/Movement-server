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
import { HashtagsService } from '../hashTags/hashtags.service';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { PostHashtag } from './entities/post_hashtag.entity';
import { RedisCacheModule } from 'src/cache/cache.module';

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
      Hashtag,
      PostHashtag,
    ]),
    RedisCacheModule,
  ],
  exports: [PostsService, RedisCacheModule],
  providers: [
    PostsService,
    UsersService,
    LikesService,
    CommentsService,
    HashtagsService,
  ],
  controllers: [PostsController],
})
export class PostsModule {}
