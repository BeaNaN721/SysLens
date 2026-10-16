import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module.js';
import { MetricsModule } from './metrics/metrics.module.js';

@Module({
  imports: [CoreModule, MetricsModule],
})
export class AppModule {}
