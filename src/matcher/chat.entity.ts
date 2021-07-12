import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { User } from '../users/entities/user.entity';
import { Room } from './room.entity';

@Entity()
export class Chat extends CommonEntity {
  @ManyToOne(() => User, (user) => user.roomLog, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.roomLog, { nullable: false })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column()
  message: string;
}
