import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Repository, Between, Connection } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { Like } from '../like/entities/like.entity';
import { CreateLikeDto } from '../like/dto/create-like-dto';
import { UsersService } from '../users/users.service';
import { HashtagsService } from '../hashtags/hashTags.service';
import { File } from '../files/entities/file.entity';
import * as dayjs from 'dayjs';
import { GetPostsDto } from './dto/get-posts.dto';
import { PostHashtag } from './entities/post_hashtag.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
    private usersService: UsersService,
    private hashTagsService: HashtagsService,
  ) {}
  async createPost(dto: CreatePostDto): Promise<Post> {
    const newPost = await this.postRepo.create(dto);
    if (!newPost) {
      throw new HttpException('글 작성에 실패했습니다', HttpStatus.BAD_REQUEST);
    }
    // TODO add to other methods
    const postHashtags: PostHashtag[] = await this.hashTagsService.create(
      newPost,
      dto,
    );

    newPost.postHashtags = postHashtags;
    // const file = await this.fileRepo.create({ dto.location });
    const newFiles = await this.fileRepo.find({ where: { id: dto.fileId } });
    newPost.files = newFiles;
    await this.postRepo.save(newPost);
    return newPost;
  }
  async createPostByWingman(dto: CreatePostDto): Promise<Post> {
    const post: Post = await this.postRepo.create(dto);

    await this.postRepo.save(post);

    return post;
  }
  async readPost(id: number): Promise<Post> {
    //TODO exclude softdeleted likes
    const post = await this.postRepo.findOne(id, {
      relations: ['poster', 'comments', 'comments.commenter', 'likes', 'files'],
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

  async readAllPosts(dto: GetPostsDto): Promise<Post[]> {
    // TODO find better way of setting default when dto used
    const take = dto.take ? dto.take : 20;
    const where = dto.category ? { category: dto.category } : null;
    const posts = await this.postRepo.find({
      where,
      relations: ['poster', 'comments', 'files'],
      order: {
        createdAt: 'DESC',
      },
      take,
      skip: (dto.page - 1) * take,
    });

    return posts;
  }
  async getRecentPosts(): Promise<Post[]> {
    const posts = await this.postRepo.find({
      relations: ['poster', 'comments', 'files'],
      take: 5,
      order: {
        createdAt: 'DESC',
      },
    });
    return posts;
  }
  async getPopularPosts(): Promise<Post[]> {
    const posts = await this.postRepo.find({
      where: {
        createdAt: Between(dayjs().subtract(7, 'd').toDate(), dayjs().toDate()),
      },
      relations: ['comments'],
      order: {
        views: 'DESC',
      },
      take: 5,
    });
    return posts;
  }
  async getRecommendedPosts(): Promise<Post[]> {
    const posts = await this.postRepo.find({
      where: {
        createdAt: Between(dayjs().subtract(7, 'd').toDate(), dayjs().toDate()),
      },
      order: {
        likeCount: 'DESC',
      },
      relations: ['files'],
      take: 6,
    });
    return posts;
  }

  async updatePost(dto: UpdatePostDto): Promise<Post> {
    const { title, content } = dto;
    const existingPost = await this.readPost(dto.id);

    if (!existingPost) return;
    const newFiles = await this.fileRepo.find({ where: { id: dto.fileId } });
    existingPost.title = title;
    existingPost.content = content;
    existingPost.files = newFiles;
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
    const post = await this.readPost(dto.targetId);
    if (!post) return;
    const like = await this.likeRepo.findOne({
      where: { post: { id: dto.targetId }, user: { id: dto.userId } },
    });
    if (!like) {
      await this.createLike(dto, post);
    }
    if (like) {
      await this.updateLikeCount(like, dto, post);
    }
    const likes = await this.likeRepo.find({
      where: { post: { id: dto.targetId } },
    });
    return likes;
  }
  async updateLikeCount(like: Like, dto: CreateLikeDto, post: Post) {
    const status: boolean | null = like.isLike;
    if (status === null && dto.isLike) {
      post.likeCount += 1;
      like.isLike = dto.isLike;
    }
    if (status === null && !dto.isLike) {
      post.dislikeCount += 1;
      like.isLike = dto.isLike;
    }
    if (status === true && dto.isLike) {
      post.likeCount -= 1;
      like.isLike = null;
    }
    if (status === true && !dto.isLike) {
      post.likeCount -= 1;
      post.dislikeCount += 1;
      like.isLike = dto.isLike;
    }
    if (status === false && dto.isLike) {
      post.likeCount += 1;
      post.dislikeCount -= 1;
      like.isLike = dto.isLike;
    }
    if (status === false && !dto.isLike) {
      post.dislikeCount -= 1;
      like.isLike = null;
    }
    await this.likeRepo.save(like);
    await this.postRepo.save(post);
    return like;
  }
  async createLike(dto: CreateLikeDto, post) {
    const user = await this.usersService.findOne(dto.userId);
    if (dto.isLike) post.likeCount += 1;
    if (!dto.isLike) post.dislikeCount += 1;
    await this.postRepo.save(post);
    const like = await this.likeRepo.create(dto);
    like.post = post;
    like.user = user;
    await this.likeRepo.save(like);
    return like;
  }
}
