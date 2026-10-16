import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MetricsService } from './metrics.service.js';
import { FsReaderService } from '../core/fs-reader.service.js';

describe('MetricsService', () => {
  let service: MetricsService;
  let fs: { read: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    fs = {
      read: vi.fn(async (path: string) => {
        const files: Record<string, string> = {
          '/proc/uptime': '1000.50 800.25',
          '/proc/loadavg': '0.10 0.20 0.30 1/100 1234',
          '/proc/meminfo': [
            'MemTotal:       16000 kB',
            'MemFree:         4000 kB',
            'MemAvailable:   10000 kB',
          ].join('\n'),
        };

        const content = files[path];
        if (content === undefined) {
          throw new Error(`Unexpected path: ${path}`);
        }

        return content;
      }),
    };

    service = new MetricsService(fs as unknown as FsReaderService);
  });

  it('returns parsed system metrics', async () => {
    await expect(service.getSummary()).resolves.toEqual({
      uptime: {
        seconds: 1000.5,
        idle: 800.25,
      },
      load: {
        l1: 0.1,
        l5: 0.2,
        l15: 0.3,
      },
      memory: {
        total: 16000,
        free: 4000,
        available: 10000,
        used: 6000,
      },
    });
  });

  it('reads the three expected proc files', async () => {
    await service.getSummary();

    expect(fs.read).toHaveBeenCalledTimes(3);
    expect(fs.read).toHaveBeenCalledWith('/proc/uptime');
    expect(fs.read).toHaveBeenCalledWith('/proc/loadavg');
    expect(fs.read).toHaveBeenCalledWith('/proc/meminfo');
  });
  
  it('propagates file read errors', async () => {
    fs.read.mockRejectedValueOnce(new Error('Permission denied'));

    await expect(service.getSummary()).rejects.toThrow(
      'Permission denied',
    );
  });
  
  it('returns null when MemAvailable is missing', async () => {
    fs.read
      .mockResolvedValueOnce('1000.50 800.25')
      .mockResolvedValueOnce('0.10 0.20 0.30 1/100 1234')
      .mockResolvedValueOnce(
        'MemTotal: 16000 kB\nMemFree: 4000 kB',
      );

    await expect(service.getSummary()).resolves.toEqual({
      uptime: { seconds: 1000.5, idle: 800.25 },
      load: { l1: 0.1, l5: 0.2, l15: 0.3 },
      memory: {
        total: 16000,
        free: 4000,
        available: null,
        used: null,
      },
    });
  });

  it('throws when a memory value is invalid', async () => {
    fs.read
      .mockResolvedValueOnce('1000.50 800.25')
      .mockResolvedValueOnce('0.10 0.20 0.30 1/100 1234')
      .mockResolvedValueOnce(
        'MemTotal: abc kB\nMemFree: 4000 kB\nMemAvailable: 10000 kB',
      );

    await expect(service.getSummary()).rejects.toThrow(
      'Invalid numeric value for MemTotal: abc kB',
    );
  });
});

