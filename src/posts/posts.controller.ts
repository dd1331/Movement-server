import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateLikeDto } from '../like/dto/create-like-dto';
import { LikesService } from '../like/likes.service';
import { GetPostsDto } from './dto/get-posts.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../roles.guard';
import { CurrentUser } from '../current.user.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
  ) {}

  @Post('create')
  create(@Body() dto: CreatePostDto) {
    return this.postsService.createPost(dto);
  }
  @Get()
  getPosts(@Query() dto: GetPostsDto) {
    return this.postsService.getPosts(dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('recent')
  getRecentPosts(@Req() req, @CurrentUser() user) {
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
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPost(id);
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
    return this.likesService.likeOrDislike(dto);
  }
  @Post('dislike')
  dislikePost(@Body() dto: CreateLikeDto) {
    return this.likesService.likeOrDislike(dto);
  }
}
