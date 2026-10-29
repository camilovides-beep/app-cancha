import { Module } from '@nestjs/common';
import { ANALYTICS_REPOSITORY } from './domain/analytics.repository';
import { AnalyticsService } from './application/analytics.service';
import { AnalyticsController } from './infrastructure/analytics.controller';
import { TypeOrmAnalyticsRepository } from './infrastructure/analytics.repository.typeorm';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, { provide: ANALYTICS_REPOSITORY, useClass: TypeOrmAnalyticsRepository }],
})
export class AnalyticsModule {}
