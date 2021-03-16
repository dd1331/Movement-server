import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { Post } from './post.entity';
import { Hashtag } from '../../hashtags/entities/hashtag.entity';

@Entity()
export class PostHashtag extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'hashtag_id' })
  hashtagId: number;

  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne((type) => Post, (post) => post.postHashtags)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne((type) => Hashtag, (hashtag) => hashtag.postHashtags)
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;
}
