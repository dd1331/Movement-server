import { Module } from '@nestjs/common';
import { MatcherGateway } from './matcher.gateway';
import { MatcherService } from './matcher.service';

@Module({ providers: [MatcherService, MatcherGateway] })
export class MatcherModule {}
