import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CoreModule } from './core/core.module.js';
import { MetricsModule } from './metrics/metrics.module.js';

@Module({
  imports: [CoreModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
