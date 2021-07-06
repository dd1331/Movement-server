import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatcherService {
  constructor(
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
  ) {}

  async getRoomOrCreate(topic): Promise<Room> {
    try {
      const room: Room = await this.roomRepo.findOneOrFail({
        where: { topic },
      });
      if (room) return room;
    } catch (error) {
      const room: Room = await this.roomRepo.create({ topic });
      await this.roomRepo.save(room);
      return room;
    }
  }
}
