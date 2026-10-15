import { Module, Global } from '@nestjs/common';
import { FsReaderService } from './fs-reader.service.js';

@Global()
@Module({
  providers: [FsReaderService],
  exports: [FsReaderService],
})
export class CoreModule {}
