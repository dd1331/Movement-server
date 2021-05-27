import { Entity, PrimaryColumn } from 'typeorm';
import { CommonEntity } from '../../common.entity';

@Entity()
export class RecommendedPost extends CommonEntity {
  @PrimaryColumn({ name: 'post_id' })
  postId: number;
}
