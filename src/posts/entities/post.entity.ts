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
  id: number;

  @ManyToOne((type) => User, (user) => user.posts)
  poster: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  like: number;

  @Column({ nullable: true })
  dislike: number;

  @Column({ nullable: true })
  views: number;

  @OneToMany((type) => Comment, (comment) => comment.postId)
  comments: string;
}
