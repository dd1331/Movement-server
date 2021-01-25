import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'user_id' })
  userId: string;

  @Column({ unique: true, name: 'user_name' })
  userName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany((type) => Post, (post) => post.poster)
  posts: [Post];

  @OneToMany((type) => Comment, (comment) => comment.commenter)
  comments: [Comment];
}
