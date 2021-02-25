import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Repository, Between } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { Like } from '../like.entity';
import { CreateLikeDto } from '../create-like-dto';
import { UsersService } from '../users/users.service';
import { Category } from '../common/entities/category.entity';
import { File } from '../files/entities/file.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
    // @InjectRepository(Category)
    // private readonly categoryRepo: Repository<Category>,
    private usersService: UsersService,
  ) {}
  async createPost(dto: CreatePostDto): Promise<Post> {
    const newPost = await this.postRepo.create(dto);
    if (!newPost) {
      throw new HttpException('글 작성에 실패했습니다', HttpStatus.BAD_REQUEST);
    }
    // const category = await this.categoryRepo.findOne({
    //   where: { title: dto.category },
    // });
    // newPost.category = [category];
    // const file = await this.fileRepo.create({ dto.location });
    const newFiles = await this.fileRepo.find({ where: { id: dto.fileId } });
    newPost.files = newFiles;
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
    post.views += 1;
    await this.postRepo.save(post);
    return post;
  }

  async readAllPosts(category?: string): Promise<Post[]> {
    const where = category ? { category } : null;
    const posts = await this.postRepo.find({
      where,
      relations: ['poster', 'comments'],
      order: {
        createdAt: 'DESC',
      },
    });

    return posts;
  }
  async getPopularPosts(): Promise<Post[]> {
    const posts = await this.postRepo.find({
      where: {
        createdAt: Between(dayjs().subtract(1, 'd').toDate(), dayjs().toDate()),
      },
      order: {
        views: 'DESC',
      },
      take: 10,
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
