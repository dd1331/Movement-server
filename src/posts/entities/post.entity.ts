import { CommonEntity } from '../../common.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Post extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => User, (user) => user.posts)
  userId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @OneToMany((type) => Comment, (comment) => comment.postId)
  comments: string;

  @Column()
  like: number;

  @Column()
  dislike: number;

  @Column()
  views: number;
}
