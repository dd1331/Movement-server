import { Module } from '@nestjs/common';
import { WingmanService } from './wingman.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../like/entities/like.entity';
import { File } from '../files/entities/file.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { PostHashtag } from '../posts/entities/post_hashtag.entity';
import { PostsModule } from '../posts/posts.module';
import { FilesService } from '../files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Like, File, Hashtag, PostHashtag]),
    PostsModule,
  ],
  providers: [
    WingmanService,
    UsersService,
    // PostsService,
    HashtagsService,
    FilesService,
  ],
})
export class WingmanModule {}
