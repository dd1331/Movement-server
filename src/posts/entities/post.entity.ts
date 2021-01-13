import { CommonEntity } from 'src/common.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Post extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => User, (user) => user.posts)
  userId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  comment: string; //temp

  @Column()
  like: number;

  @Column()
  dislike: number;

  @Column()
  views: number;
}
