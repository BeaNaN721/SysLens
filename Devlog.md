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
cd frontend
pnpm add naive-ui
```

## .gitignore add
```bash
# Dependencies
node_modules/

# Build output
dist/
dist-ssr/

# TS cache
*.tsbuildinfo

# env var
.env
.env.*
!.env.example

# Logs
logs/
*.log

# Editor and OS
*.swp
```
一定要记得保存!!!

## repo sync
```bash
git add .
## 一定不能把node_modules里面的东西放进去
git status --short | grep -c node_modules
git commit -m "repo push"

git remote add origin git@github.com:BeaNaN721/SysLens.git
git branch -M main
git push -u origin main
```

## Start Dev
```bash
cd backend
npx nest g module metrics
## g generate
pnpm exec nest g controller metrics
pnpm exec nest g service metrics

# --- core 模块：FsReader 的家 ---
pnpm exec nest g module core
pnpm exec nest g service core/fs-reader --flat --no-spec

# CoreModule 添加 @Global()
## 之后每个模块可以直接用 FsReaderService, 不用反复imports: [CoreModule]
@Global()

# main.ts 加全局前缀 api
## 为什么要加这层前缀
### 1. Vite 代理只需要一条规则. 一条前缀覆盖所有后端接口
### 2. 生产部署分流. 上线时通常是nginx在前面, location / 返回前端静态文件, location /api 转发给 NestJS
### 3. 避免和别的路径打架. 将来可能有 /health 健康检查
app.setGlobalPrefix('api');
### 放在 await app.listen(3000) 之前, 因为需要在路由注册前配置
```

