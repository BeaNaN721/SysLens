import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';

@Injectable()
export class FsReaderService {
  async read(path: string): Promise<string> {
    return readFile(path, 'utf-8');
  }
}
