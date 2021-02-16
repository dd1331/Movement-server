import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Repository, IsNull, Entity } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { Like } from '../like.entity';
import { CreateLikeDto } from '../create-like-dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
    private usersService: UsersService,
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
    //TODO exclude softdeleted likes
    const post = await this.postRepo.findOne(id, {
      relations: ['poster', 'comments', 'comments.commenter', 'likes'],
      withDeleted: false,
    });
    if (!post) {
      throw new HttpException(
        '존재하지 않는 게시글입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    return post;
  }

  async readAllPosts(): Promise<Post[]> {
    const posts = await this.postRepo.find({
      relations: ['poster', 'comments'],
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

  async likeOrDislikePost(dto: CreateLikeDto): Promise<Like[]> {
    const post = await this.readPost(dto.postId);
    if (!post) return;
    const like = await this.likeRepo.findOne({
      where: { post: { id: dto.postId }, user: { id: dto.userId } },
    });
    if (like) {
      like.isLike = like.isLike === dto.isLike ? null : dto.isLike;
      await this.likeRepo.save(like);
    }
    if (!like) {
      const user = await this.usersService.findOne(dto.userId);
      const createdLike = await this.likeRepo.create(dto);
      createdLike.post = post;
      createdLike.user = user;
      await this.likeRepo.save(createdLike);
    }
    const likes = await this.likeRepo.find({
      where: { post: { id: dto.postId } },
    });
    return likes;
  }
}
