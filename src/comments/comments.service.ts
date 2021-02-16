import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { Post } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}
  async createComment(dto: CreateCommentDto): Promise<Comment> {
    const post = await this.postsService.readPost(dto.postId);
    if (!post) return;
    const createdComment = await this.commentRepo.create(dto);
    await this.commentRepo.save(createdComment);
    console.log(createdComment);
    return createdComment;
  }
  async readPostComments(postId: number): Promise<Comment[]> {
    const comments: Comment[] = await this.commentRepo.find({
      where: { postId },
    });
    if (!comments) {
      throw new HttpException('댓글이 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }

    return comments;
  }
  async readComment(commentId: number): Promise<Comment> {
    const comment = await this.commentRepo.findOne(commentId);
    if (!comment) {
      throw new HttpException('댓글이 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    return comment;
  }
  async updateComment(dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.readComment(dto.id);
    if (!comment) return;
    comment.content = dto.content;
    const updatedComment = await this.commentRepo.save(comment);
    return updatedComment;
  }

  async deleteComment(commentId: number): Promise<Comment> {
    const comment = await this.readComment(commentId);
    if (!comment) return;
    comment.deletedAt = new Date();
    await this.commentRepo.save(comment);
    return comment;
  }
}
