import { Controller, Post, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Post('create')
  create(@Body() dto: CreateCommentDto) {
    console.log(dto);
    return this.commentsService.createComment(dto);
  }
}
