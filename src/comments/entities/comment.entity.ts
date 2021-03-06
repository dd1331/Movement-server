import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Comment extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: 0, nullable: true })
  like: number;

  @Column({ default: 0, nullable: true })
  dislike: number;

  @Column({ default: 0, nullable: true, name: 'child_count' })
  childCount: number;

  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => User, (user) => user.childComments)
  commenter: User;

  @ManyToOne(() => Post, (post) => post.childComments)
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
