import { Injectable } from '@nestjs/common';
import { FsReaderService } from '../core/fs-reader.service.js';

function parseMemNumber(raw: string, field: string): number {
  const value = Number.parseInt(raw, 10);

  if (Number.isNaN(value)) {
    throw new Error(`Invalid numeric value for ${field}: ${raw}`);
  }
  return value;
}

@Injectable()
export class MetricsService {
  constructor(private readonly fs: FsReaderService) {}

  async getSummary() {
    const [uptimeRaw, loadavgRaw, meminfoRaw] = await Promise.all([
      this.fs.read('/proc/uptime'),
      this.fs.read('/proc/loadavg'),
      this.fs.read('/proc/meminfo'),
    ]);

    const [up, idle] = uptimeRaw.trim().split(/\s+/).map(Number);
    const [l1, l5, l15] = loadavgRaw.trim().split(/\s+/).slice(0, 3).map(Number);
    const mem = Object.fromEntries(
      meminfoRaw.split('\n').filter(Boolean).map(l => {
        const [k, v] = l.split(':');
        return [k.trim(), parseMemNumber(v.trim(), k.trim())];
      }),
    ) as Partial<Record<string, number>>;

    return {
      uptime: { seconds: up, idle },
      load: { l1, l5, l15 },
      memory: {
        total: mem.MemTotal,
        free: mem.MemFree,
        available: mem.MemAvailable ?? null,
        used: mem.MemAvailable == null || mem.MemTotal == null ? null : mem.MemTotal - mem.MemAvailable,
      },
    };
  }
}
