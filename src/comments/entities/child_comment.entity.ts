import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { CommonEntity } from '../../common.entity';
@Entity()
export class ChildComment extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  parentId: number;
}
