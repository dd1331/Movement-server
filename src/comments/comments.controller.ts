import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { CreateChildCommentDto } from './dto/create-child-comment-dto';
import { CreateLikeDto } from '../like/dto/create-like-dto';
import { LikesService } from '../like/likes.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
  ) {}
  @Post('create')
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.createComment(dto);
  }
  @Post('create-child')
  createChild(@Body() dto: CreateChildCommentDto) {
    return this.commentsService.createChildComment(dto);
  }
  @Get('fetch-children/:id')
  fetchChildren(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.fetchChildComments(id);
  }
  @Get('post/:id')
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.getActiveComments(id);
  }
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.deleteComment(id);
  }
  @Delete('child/:id')
  deleteChild(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.deleteChildComment(id);
  }
  @Post('like')
  like(@Body() dto: CreateLikeDto) {
    return this.likesService.likeOrDislike(dto);
  }
  @Post('dislike')
  dislike(@Body() dto: CreateLikeDto) {
    return this.likesService.likeOrDislike(dto);
  }
}
