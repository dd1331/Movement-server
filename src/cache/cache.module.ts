import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'redis-server',
      port: 6379,
    }),
  ],
  controllers: [CacheController],
  providers: [CacheService],
  exports: [
    CacheService,
    CacheModule.register({
      store: redisStore,
      host: 'redis-server',
      port: 6379,
    }),
  ],
})
export class RedisCacheModule {}
