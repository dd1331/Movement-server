import { Module } from '@nestjs/common';
import { MatcherGateway } from './matcher.gateway';
import { MatcherService } from './matcher.service';
import { Room } from './room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [MatcherService, MatcherGateway],
})
export class MatcherModule {}
