import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../../common.entity';

@Entity()
export class Category extends CommonEntity {
  // @PrimaryGeneratedColumn()
  // id: number;
  @Column()
  type: string;
  @Column()
  title: string;
}
