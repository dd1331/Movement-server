import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Comment extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.comments)
  commenter: number;

  @Column()
  content: string;

  @Column()
  like: number;

  @Column()
  dislike: number;

  @ManyToOne((type) => Post, (post) => post.comments)
  postId: string;
}
