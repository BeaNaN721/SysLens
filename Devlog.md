# DevLog-SysLens
Linux 本机系统监控

## backend init
```bash
git init
touch Devlog.md

# nestjs
## --package-manager pnpm  不会交互式问你用哪个
## nestjs12 和 11的区别比较大
npx @nestjs/cli@12 new backend --package-manager pnpm --skip-git --no-observe
## 选 ESM

# 确定环境没问题
cd backend
pnpm start:dev
## 开另一个终端
curl localhost:3000

```

## 确定MVP
打开网页 → 看到本机真实数据 → 每 3 秒自动刷新。
后端：一个接口 GET /api/metrics/summary
需要解析三个文件: /proc/uptime loadavg meminfo
```jsonc
{
    "uptime"
    "load"
    "memory"
}
```
## frontend init
```bash
pnpm create vue@latest frontend
## TypeScript, Router, Pinia
pnpm add naive-ui
```