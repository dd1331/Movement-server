import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from 'src/common.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comments.entity';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  name: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @OneToMany((type) => Post, (post) => post.userId)
  posts: [Post];

  @OneToMany((type) => Comment, (comment) => comment.userId)
  comments: [Comment];
}
