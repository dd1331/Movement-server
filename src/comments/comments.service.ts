import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { Post } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { ChildComment } from './entities/child_comment.entity';
import { CreateChildCommentDto } from './dto/create-child-comment-dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(ChildComment)
    private readonly childcommentRepo: Repository<ChildComment>,
    private readonly postsService: PostsService,
    private readonly userService: UsersService,
  ) {}
  async createComment(dto: CreateCommentDto): Promise<Comment> {
    const post = await this.postsService.readPost(dto.postId);
    if (!post) return;
    const user = await this.userService.findOne(dto.commenterId);
    const createdComment = await this.commentRepo.create(dto);
    createdComment.post = post;
    createdComment.commenter = user;
    await this.commentRepo.save(createdComment);
    return createdComment;
  }
  async createChildComment(dto: CreateChildCommentDto): Promise<ChildComment> {
    const childComment = await this.childcommentRepo.create(dto);
    const parentComment = await this.readComment(dto.parentId);
    const post = await this.postsService.readPost(dto.postId);
    const commenter = await this.userService.findOne(dto.commenterId);
    parentComment.childCount += 1;
    await this.commentRepo.save(parentComment);
    childComment.post = post;
    childComment.commenter = commenter;
    await this.childcommentRepo.save(childComment);
    return childComment;
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
    console.log(commentId);
    const comment = await this.readComment(commentId);
    if (!comment) return;
    comment.deletedAt = new Date();
    await this.commentRepo.save(comment);
    return comment;
  }
}
