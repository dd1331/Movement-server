import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Comment extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column()
  commenterId: number;

  @Column()
  content: string;

  @Column({ default: 0, nullable: true })
  like: number;

  @Column({ default: 0, nullable: true })
  dislike: number;

  @ManyToOne(() => User, (user) => user.comments)
  commenter: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
}
