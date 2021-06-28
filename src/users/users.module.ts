import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PostsService } from '../posts/posts.service';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../like/entities/like.entity';
import { File } from '../files/entities/file.entity';
import { RecommendedPost } from '../posts/entities/recommended_post.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { PostHashtag } from '../posts/entities/post_hashtag.entity';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // TODO remove duplicated entities from circular dependency
      // remove circular dependency using req.user
      User,
      Post,
      Like,
      File,
      RecommendedPost,
      Hashtag,
      PostHashtag,
    ]),
    // PostsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, PostsService, HashtagsService],
  exports: [UsersService],
  // exports: [CatsService] // shared module 다른 모듈에서 사용하기 위해서는 exports 해줘야함
})
export class UsersModule {}
