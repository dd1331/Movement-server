import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Repository, UpdateResult, IsNull } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}
  async createPost(dto: CreatePostDto): Promise<Post> {
    const newPost = await this.postRepo.create(dto);
    await this.postRepo.save(newPost);
    if (!newPost) {
      throw new HttpException('글 작성에 실패했습니다', HttpStatus.BAD_REQUEST);
    }
    return newPost;
  }
  async readPost(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!post)
      throw new HttpException(
        '존재하지 않는 게시글입니다',
        HttpStatus.BAD_REQUEST,
      );
    return post;
  }
  async readAllPosts(): Promise<Post[]> {
    const posts = await this.postRepo.find({
      where: { deletedAt: IsNull() },
    });

    return posts;
  }
  async updatePost(updatePostDto: UpdatePostDto): Promise<UpdateResult> {
    // const existingPost = await this.postRepo.findOne(updatePostDto.poster);
    const existingPost = await this.readPost(updatePostDto.postId);
    if (!existingPost) return;

    const updatedPost = await this.postRepo.update(updatePostDto.postId, {
      ...updatePostDto,
    });
    return updatedPost;
  }
  async deletePost(postId: number): Promise<Post> {
    const post = await this.readPost(postId);
    if (!post) return;
    await this.postRepo.softDelete(postId);
    return post;
  }

  // checkPostValidation(dto: CreatePostDto): boolean {
  //   const MIN_TITLE_LENGTH = 5;
  //   const MIN_CONTENT_LENGTH = 5;
  //   const { title, content } = dto;
  //   if (
  //     title.length < MIN_TITLE_LENGTH ||
  //     content.length < MIN_CONTENT_LENGTH
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }
}
