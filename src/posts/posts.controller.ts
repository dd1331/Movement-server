import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateLikeDto } from '../create-like-dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  create(@Body() dto: CreatePostDto) {
    return this.postsService.createPost(dto);
  }
  @Get('readAll/:category?')
  readAllPosts(@Param('category') category: string) {
    return this.postsService.readAllPosts(category);
  }

  @Get('recent')
  getRecentPosts() {
    return this.postsService.getRecentPosts();
  }

  @Get('popular')
  getPopularPosts() {
    return this.postsService.getPopularPosts();
  }
  @Get('recommended')
  getRecommendedPosts() {
    return this.postsService.getRecommendedPosts();
  }

  @Get(':id')
  readPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.readPost(id);
  }

  @Patch()
  updatePost(@Body() dto: UpdatePostDto) {
    return this.postsService.updatePost(dto);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
  @Post('like')
  likePost(@Body() dto: CreateLikeDto) {
    return this.postsService.likeOrDislikePost(dto);
  }
  @Post('dislike')
  dislikePost(@Body() dto: CreateLikeDto) {
    return this.postsService.likeOrDislikePost(dto);
  }
}
