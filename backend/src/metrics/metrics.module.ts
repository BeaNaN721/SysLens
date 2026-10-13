import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller.js';
import { MetricsService } from './metrics.service.js';

@Module({
  providers: [MetricsService],
  controllers: [MetricsController]
})
export class MetricsModule {}
