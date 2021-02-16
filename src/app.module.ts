import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { APP_PIPE } from '@nestjs/core';
import { CommentsModule } from './comments/comments.module';
import { Like } from './like.entity';
import { Category } from './common/entities/category.entity';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'charlie',
      password: '1331',
      database: 'movement',
      entities: [User, Post, Comment, Like, Category],
      synchronize: true,
      // logging: true,
      // logging: ['error', 'log'],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    CommonModule,
  ],
  controllers: [
    AppController,
    // NOTE no need to be added cause modules above are including controllers ?
    // PostsController,
    // AuthController,
    // UsersController,
    // CommentsController,
  ],
  providers: [
    AppService,
    //Note that in terms of dependency injection, global pipes registered from outside of any module (with useGlobalPipes() as in the example above) cannot inject dependencies since the binding has been done outside the context of any module. In order to solve this issue, you can set up a global pipe directly from any module using the following construction:
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // CommentsService, // TODO 넣으면 에러
    //Note that in terms of dependency injection, global pipes registered from outside of any module (with useGlobalPipes() as in the example above) cannot inject dependencies since the binding has been done outside the context of any module. In order to solve this issue, you can set up a global pipe directly from any module using the following construction:
  ],
})
export class AppModule {}
