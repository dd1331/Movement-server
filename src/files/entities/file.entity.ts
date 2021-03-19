import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { CommonEntity } from '../../common.entity';

@Entity()
export class File extends CommonEntity {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column()
  url: string;

  @Column()
  key: string;

  @Column()
  eTag: string;

  @ManyToOne(() => Post, (post) => post.files)
  post: Post;
}
