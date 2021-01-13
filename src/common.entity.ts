import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class CommonEntity extends BaseEntity {
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  // @Column({ name: 'deleted_at', type: 'datetime' })
  @Column() // 이렇게 하면?
  deletedAt: Date;
}
