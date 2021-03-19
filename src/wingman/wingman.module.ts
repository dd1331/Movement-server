import { Module } from '@nestjs/common';
import { WingmanService } from './wingman.service';
import { WingmanController } from './wingman.controller';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../like/entities/like.entity';
import { File } from '../files/entities/file.entity';
import { HashtagsService } from '../hashtags/hashTags.service';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { PostHashtag } from '../posts/entities/post_hashtag.entity';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Like, File, Hashtag, PostHashtag]),
    PostsModule,
  ],
  controllers: [WingmanController],
  providers: [WingmanService, UsersService, PostsService, HashtagsService],
})
export class WingmanModule {}
