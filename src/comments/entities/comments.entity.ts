import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from 'src/common.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Comment extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => User, (user) => user.comments)
  userId: string;

  @Column()
  content: string;

  @Column()
  like: number;

  @Column()
  dislike: number;
}
