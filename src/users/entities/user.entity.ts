import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';
import { ChildComment } from '../../comments/entities/child_comment.entity';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'user_id' })
  userId: string;

  @Column({ unique: true, name: 'naver_id', nullable: true })
  naverId: string;

  @Column({ unique: true, name: 'user_name' })
  userName: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'normal' })
  provider: string;

  @Column()
  avatar: string;

  @OneToMany((type) => Post, (post) => post.poster)
  posts: [Post];

  @OneToMany((type) => Comment, (comment) => comment.commenter)
  comments: [Comment];

  @OneToMany((type) => ChildComment, (comment) => comment.commenter)
  childComments: [ChildComment];

  @OneToMany((type) => Like, (like) => like.user)
  likes: [Like];
}
