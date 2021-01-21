import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;
  @Column({ unique: true })
  phone: string;

  @OneToMany((type) => Post, (post) => post.userId)
  posts: [Post];

  @OneToMany((type) => Comment, (comment) => comment.userId)
  comments: [Comment];
}
