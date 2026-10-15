import {createServer} from 'node:http'
import {readFile} from 'node:fs/promises'

const read = (p) => readFile(p, 'utf8');

async function snapshot(){
  const [uptime, loadavg, meminfo] = await Promise.all([
    read('/proc/uptime'),
    read('/proc/loadavg'),
    read('/proc/meminfo'),
  ]);
  const [up, idle] = uptime.trim().split(/\s+/).map(Number);
  const [l1, l5, l15] = loadavg.trim().split(/\s+/).slice(0, 3).map(Number);
  const mem = Object.fromEntries(
    meminfo.split('\n').filter(Boolean).map(l => {
      const [k, v] = l.split(':');
      return [k.trim(), parseInt(v)]; // 虽然标的kB, 但是应该是Byte, 这是Linux 的历史遗留问题
    })
  );
  return {
    uptime: { seconds: up, idle },
    load: { l1, l5, l15 },
    memory: {
      total: mem.MemTotal,
      free: mem.MemFree,
      available: mem.MemAvailable,
      used: mem.MemTotal - mem.MemAvailable,
    },
  };
}

createServer(async (req, res) => {
  if (req.url === '/api/metrics/summary') {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(await snapshot()));
  } else {
    res.statusCode = 404;
    res.end();
  }
}).listen(3000, () => console.log('http://localhost:3000/api/metrics/summary'));
