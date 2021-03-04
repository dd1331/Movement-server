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

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
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
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.deleteComment(id);
  }
}
