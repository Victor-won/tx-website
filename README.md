# 通用目录结构（带数据库模型 + 多语言）

```shell
tx-website/
├── app/
│   ├── (public)/                # 官网/展示页
│   │   ├── page.tsx
│   │   └── about/page.tsx
│   ├── (dashboard)/             # SaaS 控制台 / CMS 管理后台
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── users/page.tsx
│   │   ├── posts/page.tsx
│   │   └── settings/page.tsx
│   ├── api/                     # API routes (App Router)
│   │   ├── auth/route.ts
│   │   ├── posts/route.ts
│   │   └── users/route.ts
│   └── middleware.ts            # 中间件（鉴权/国际化）
│
├── components/                  # 通用 UI 组件 (Button, Navbar, Footer)
├── features/                    # 业务模块化（SaaS/CMS 通用）
│   ├── auth/                    # 登录注册模块
│   ├── users/                   # 用户模块
│   ├── posts/                   # 内容模块
│   └── billing/                 # SaaS 订阅模块
│
├── db/                          # 数据库层
│   ├── schema.prisma            # Prisma 数据模型定义
│   ├── migrations/              # 数据库迁移
│   ├── index.ts                 # PrismaClient 实例化
│   └── seed.ts                  # 初始化数据
│
├── services/                    # API SDK 层
│   ├── authService.ts
│   ├── userService.ts
│   └── postService.ts
│
├── store/                       # 全局状态 (Zustand/Redux)
│
├── lib/                         # 工具函数
│   ├── auth.ts                  # 鉴权相关逻辑
│   ├── i18n.ts                  # 多语言配置（next-intl/next-i18next）
│   └── utils.ts
│
├── locales/                     # 多语言文案
│   ├── en/
│   │   ├── common.json
│   │   └── dashboard.json
│   ├── zh/
│   │   ├── common.json
│   │   └── dashboard.json
│   └── ...                      # 可扩展更多语言
│
├── constants/                   # 常量、配置
│   ├── routes.ts                # 路由表
│   ├── roles.ts                 # 角色/权限常量
│   └── settings.ts
│
├── hooks/                       # 自定义 hooks
│   ├── useAuth.ts
│   ├── useI18n.ts
│   └── useFetch.ts
│
├── middlewares/                 # 自定义中间件
│   └── withAuth.ts              # 鉴权
│
├── types/                       # 类型定义
│   ├── auth.d.ts
│   ├── user.d.ts
│   └── post.d.ts
│
├── tests/                       # 单元/集成测试
│   ├── e2e/
│   └── unit/
│
├── public/                      # 静态资源
├── styles/                      # 全局样式 (Tailwind/CSS Modules)
│   └── globals.css
│
├── .env.local                   # 环境变量（数据库连接、API key）
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 功能说明

1. **数据库模型（db/）**: 数据库使用 postgresql 或者 mysql

   * 使用 `Prisma`：`schema.prisma` 定义模型（User、Post、Role、Subscription 等）。
   * `migrations/` 管理数据库版本。
   * `seed.ts` 初始化测试数据。
   * 可替换为 **Drizzle ORM**（结构类似）。

2. **多语言（locales/ + lib/i18n.ts）**

   * 推荐 **next-intl** 或 **next-i18next**。
   * `locales/en/common.json`、`locales/zh/common.json` 存放文案。
   * 在 `middleware.ts` 实现自动语言切换（根据 Cookie/浏览器设置）。

3. **SaaS / CMS / 官网灵活裁剪**

   * 如果是 **官网**：保留 `app/(public)`，删除 `(dashboard)`。
   * 如果是 **SaaS 后台**：重点用 `(dashboard)` + `features/billing`。
   * 如果是 **CMS 系统**：保留 `features/posts`、`features/categories` 等。

---

## 示例：Prisma 数据模型（`db/schema.prisma`）

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

---

## 示例：多语言配置（`lib/i18n.ts`）

```ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../locales/${locale}/common.json`)).default
}));
```
