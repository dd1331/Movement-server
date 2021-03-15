import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { Post } from './post.entity';
import { Hashtag } from '../../hashtags/entities/hashtag.entity';

@Entity()
export class PostHashtag extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Post, (post) => post.postHashtags)
  post: Post;

  @ManyToOne((type) => Hashtag, (hashtag) => hashtag.postHashtags)
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;
}
