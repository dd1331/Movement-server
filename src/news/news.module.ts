import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { RedisCacheModule } from '../cache/cache.module';

@Module({
  imports: [RedisCacheModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
