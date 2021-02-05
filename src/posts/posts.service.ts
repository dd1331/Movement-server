import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Repository, IsNull } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}
  async createPost(dto: CreatePostDto): Promise<Post> {
    const newPost = await this.postRepo.create(dto);
    if (!newPost) {
      throw new HttpException('글 작성에 실패했습니다', HttpStatus.BAD_REQUEST);
    }
    await this.postRepo.save(newPost);
    return newPost;
  }
  async readPost(id: number): Promise<Post> {
    const post = await this.postRepo.findOne(id);
    if (!post)
      throw new HttpException(
        '존재하지 않는 게시글입니다',
        HttpStatus.NOT_FOUND,
      );
    return post;
  }
  async readAllPosts(): Promise<Post[]> {
    const posts = await this.postRepo.find({
      where: { deletedAt: IsNull() },
    });

    return posts;
  }
  async updatePost(updatePostDto: UpdatePostDto): Promise<Post> {
    const { title, content } = updatePostDto;
    const existingPost = await this.readPost(updatePostDto.id);

    if (!existingPost) return;

    existingPost.title = title;
    existingPost.content = content;
    const updatedPost = await this.postRepo.save(existingPost);
    return updatedPost;
  }
  async deletePost(postId: number): Promise<Post> {
    // TODO softdelete related comments
    const post = await this.readPost(postId);
    if (!post) return;
    post.deletedAt = new Date();
    await this.postRepo.save(post);
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
