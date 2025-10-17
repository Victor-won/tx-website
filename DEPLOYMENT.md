# TX Website 部署文档

## 目录
- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [本地开发](#本地开发)
- [生产部署](#生产部署)
- [数据库配置](#数据库配置)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)

## 项目概述

TX Website 是一个现代化的企业官网系统,支持中英文双语,包含文章管理、产品展示、解决方案、合作伙伴展示等功能模块,以及完整的后台管理系统。

### 主要功能
- 📝 **内容管理**: 文章、产品、分类管理
- 🌐 **国际化**: 中英文双语支持,AI 智能翻译
- 🎨 **首页模块**: 轮播图、解决方案、合作伙伴展示
- 💬 **留言系统**: 用户留言管理
- 🖼️ **媒体库**: 文件上传和管理
- 🔐 **权限管理**: 基于角色的访问控制
- 📱 **响应式设计**: 支持各种设备

## 技术栈

### 前端框架
- **Next.js 15.5.4**: React 框架,支持 SSR 和 SSG
- **React 19**: 用户界面库
- **TypeScript 5**: 类型安全
- **Tailwind CSS 4**: 实用优先的 CSS 框架

### 后端技术
- **Next.js API Routes**: 服务端 API
- **Prisma 6**: ORM 数据库工具
- **NextAuth.js 4**: 身份认证
- **MySQL**: 数据库

### UI 组件
- **Radix UI**: 无障碍组件库
- **shadcn/ui**: UI 组件集合
- **Lucide Icons**: 图标库
- **TipTap**: 富文本编辑器

### 开发工具
- **Biome**: 代码格式化和检查
- **Turbopack**: 快速构建工具
- **pnpm 9**: 包管理器

## 环境要求

### 软件要求
- **Node.js**: >= 18.17.0 (推荐 20.x LTS)
- **pnpm**: >= 9.1.0
- **MySQL**: >= 8.0
- **Git**: >= 2.0

### 服务器要求
- **CPU**: 2核以上
- **内存**: 4GB 以上
- **磁盘**: 20GB 以上
- **操作系统**: Linux (Ubuntu 20.04+, CentOS 8+) 或 macOS

## 本地开发

### 1. 克隆项目

```bash
git clone <repository-url>
cd tx-website
```

### 2. 安装依赖

```bash
# 安装 pnpm (如果还没有安装)
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 3. 配置环境变量

创建 `.env` 文件:

```bash
cp .env.example .env
```

编辑 `.env` 文件,配置以下变量:

```env
# 数据库配置
DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# AI 翻译 API (可选)
OPENAI_API_KEY="your-openai-api-key"
```

### 4. 初始化数据库

```bash
# 生成 Prisma Client
pnpm db:generate

# 推送数据库结构
pnpm db:push

# 运行种子数据 (可选)
pnpm db:seed
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看网站

### 6. 创建管理员账户

首次运行需要创建管理员账户:

1. 访问 http://localhost:3000/auth/signup
2. 注册一个账户
3. 在数据库中将该用户的 `role` 字段改为 `ADMIN`

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 生产部署

### 方案 1: Vercel 部署 (推荐)

#### 步骤 1: 准备数据库

1. 创建云 MySQL 数据库 (推荐 PlanetScale, AWS RDS, 或阿里云 RDS)
2. 获取数据库连接字符串

#### 步骤 2: 部署到 Vercel

1. 在 Vercel 创建新项目
2. 连接 Git 仓库
3. 配置环境变量:

```env
DATABASE_URL=mysql://user:password@host:3306/database
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
OPENAI_API_KEY=your-api-key
```

4. 部署设置:
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

5. 点击 Deploy

#### 步骤 3: 初始化生产数据库

```bash
# 设置生产环境数据库 URL
export DATABASE_URL="your-production-database-url"

# 推送数据库结构
npx prisma db push

# 运行种子数据
npx tsx prisma/seed.ts
```

### 方案 2: Docker 部署

#### 创建 Dockerfile

```dockerfile
FROM node:20-alpine AS base

# 安装 pnpm
RUN npm install -g pnpm

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 生成 Prisma Client
RUN pnpm db:generate

# 构建应用
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: tx_website
      MYSQL_USER: tx_user
      MYSQL_PASSWORD: tx_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "mysql://tx_user:tx_password@mysql:3306/tx_website"
      NEXTAUTH_URL: "http://localhost:3000"
      NEXTAUTH_SECRET: "your-secret-key"
    depends_on:
      - mysql

volumes:
  mysql_data:
```

#### 部署命令

```bash
# 构建并启动
docker-compose up -d

# 初始化数据库
docker-compose exec app npx prisma db push
docker-compose exec app npx tsx prisma/seed.ts
```

### 方案 3: VPS 部署 (Ubuntu/CentOS)

#### 步骤 1: 安装依赖

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2 (进程管理器)
npm install -g pm2
```

#### 步骤 2: 配置 MySQL

```bash
sudo mysql -u root -p

CREATE DATABASE tx_website;
CREATE USER 'tx_user'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON tx_website.* TO 'tx_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 步骤 3: 部署应用

```bash
# 克隆代码
cd /var/www
git clone <repository-url> tx-website
cd tx-website

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
nano .env  # 编辑配置

# 初始化数据库
pnpm db:generate
pnpm db:push
pnpm db:seed

# 构建应用
pnpm build

# 使用 PM2 启动
pm2 start npm --name "tx-website" -- start
pm2 save
pm2 startup
```

#### 步骤 4: 配置 Nginx

```bash
sudo nano /etc/nginx/sites-available/tx-website
```

添加以下配置:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用站点:

```bash
sudo ln -s /etc/nginx/sites-available/tx-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 步骤 5: 配置 SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 数据库配置

### 数据库结构

项目使用 Prisma ORM 管理数据库,主要包含以下表:

- **User**: 用户表 (管理员、普通用户)
- **Category**: 分类表 (文章、产品分类)
- **Post**: 文章表
- **Product**: 产品表
- **Tag**: 标签表
- **MediaFile**: 媒体文件表
- **Contact**: 留言表
- **Solution**: 解决方案表
- **Partner**: 合作伙伴表
- **Banner**: 轮播图表

### 数据库迁移

```bash
# 生成迁移文件
npx prisma migrate dev --name migration_name

# 应用迁移到生产环境
npx prisma migrate deploy

# 重置数据库 (开发环境)
npx prisma migrate reset
```

### 数据库备份

```bash
# 备份
mysqldump -u username -p database_name > backup.sql

# 恢复
mysql -u username -p database_name < backup.sql
```

## 环境变量配置

### 必需配置

```env
# 数据库 URL
DATABASE_URL="mysql://user:password@host:3306/database"

# NextAuth 配置
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-random-secret"
```

### 可选配置

```env
# AI 翻译 API
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4"

# 邮件服务 (用于通知)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# 文件上传
UPLOAD_DIR="/uploads"
MAX_FILE_SIZE="10485760"  # 10MB
```

### 生成 NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 常见问题

### 1. 数据库连接失败

**问题**: `Error: Can't reach database server`

**解决方案**:
- 检查 DATABASE_URL 是否正确
- 确认 MySQL 服务已启动
- 检查防火墙设置
- 验证用户权限

### 2. 构建失败

**问题**: `Error: Cannot find module 'xxx'`

**解决方案**:
```bash
# 清理缓存并重新安装
rm -rf node_modules .next
pnpm install
pnpm build
```

### 3. 翻译功能不工作

**问题**: 翻译 API 调用失败

**解决方案**:
- 检查 OPENAI_API_KEY 是否配置
- 验证 API key 是否有效
- 检查 API 配额是否用尽

### 4. 图片上传失败

**问题**: 无法上传图片

**解决方案**:
- 检查上传目录权限: `chmod 755 public/uploads`
- 检查 MAX_FILE_SIZE 配置
- 验证文件类型是否支持

### 5. 性能优化

**建议**:
- 启用 Next.js 图片优化
- 配置 CDN 加速
- 启用数据库索引
- 使用 Redis 缓存
- 启用 Gzip 压缩

### 6. 安全加固

**建议**:
- 定期更新依赖: `pnpm update`
- 使用强密码和 HTTPS
- 配置 CORS 策略
- 启用 CSP 头部
- 定期备份数据库

## 维护命令

```bash
# 查看日志 (PM2)
pm2 logs tx-website

# 重启应用
pm2 restart tx-website

# 更新应用
git pull
pnpm install
pnpm build
pm2 restart tx-website

# 数据库备份
npx prisma db pull  # 拉取当前数据库结构
mysqldump -u user -p database > backup_$(date +%Y%m%d).sql

# 监控资源使用
pm2 monit
```

## 性能监控

### 使用 PM2 监控

```bash
# 安装 PM2 Plus (可选)
pm2 plus

# 查看性能指标
pm2 show tx-website
```

### 日志管理

```bash
# 查看实时日志
pm2 logs --lines 100

# 清理旧日志
pm2 flush
```

## 支持与联系

如有问题或需要技术支持,请联系:
- 邮箱: support@example.com
- 文档: https://docs.example.com
- Issues: https://github.com/xxx/tx-website/issues

## 许可证

[MIT License](LICENSE)
