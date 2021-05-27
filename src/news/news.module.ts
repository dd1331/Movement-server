import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
// import { RedisCacheModule } from '../cache/cache.module';
import { FilesService } from '../files/files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../files/entities/file.entity';

@Module({
  // imports: [RedisCacheModule, TypeOrmModule.forFeature([File])],
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [NewsController],
  providers: [NewsService, FilesService],
})
export class NewsModule {}
