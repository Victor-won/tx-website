# 国际化功能使用说明

## 概述

项目已成功实现国际化（i18n）功能，支持中文（zh）和英文（en）两种语言。

## 已实现的功能

### 1. 多语言资源管理系统
- **翻译文件位置**: `src/messages/`
  - `zh.json` - 中文翻译
  - `en.json` - 英文翻译
- **配置文件**: `src/i18n.ts` - 国际化配置
- **中间件**: `src/middleware.ts` - 处理语言路由和权限认证

### 2. 语言切换功能
- **语言切换组件**: `src/components/LanguageSwitcher.tsx`
- 支持在页面右上角通过下拉菜单切换语言
- 切换语言后保持在当前页面路径

### 3. 路由结构
所有页面现在都通过 `[locale]` 动态路由支持多语言：
```
/zh          - 中文首页
/en          - 英文首页
/zh/products - 中文产品页
/en/products - 英文产品页
```

### 4. 核心组件
- **LocaleLayout**: `src/app/[locale]/layout.tsx` - 国际化布局
- **国际化首页**: `src/app/[locale]/page.tsx` - 支持多语言的主页
- **AuthSection**: `src/components/AuthSection.tsx` - 认证区域组件

## 安装依赖

首先需要安装新增的依赖包：

```bash
npm install
```

主要新增依赖：
- `next-intl@^4.3.9` - Next.js 国际化库
- `@radix-ui/react-dropdown-menu@^2.1.2` - 下拉菜单组件

## 如何使用

### 在组件中使用翻译

```tsx
'use client'

import { useTranslations, useLocale } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <p>当前语言: {locale}</p>
    </div>
  );
}
```

### 添加新的翻译

1. 在 `src/messages/zh.json` 添加中文：
```json
{
  "newSection": {
    "title": "新标题",
    "description": "新描述"
  }
}
```

2. 在 `src/messages/en.json` 添加英文：
```json
{
  "newSection": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

3. 在组件中使用：
```tsx
{t('newSection.title')}
{t('newSection.description')}
```

### 带参数的翻译

翻译文件：
```json
{
  "greeting": "欢迎，{name}！"
}
```

使用：
```tsx
{t('greeting', { name: '张三' })}
// 输出: 欢迎，张三！
```

### 创建多语言链接

```tsx
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function Navigation() {
  const locale = useLocale();

  return (
    <nav>
      <Link href={`/${locale}/about`}>关于我们</Link>
      <Link href={`/${locale}/contact`}>联系我们</Link>
    </nav>
  );
}
```

## 项目结构

```
src/
├── app/
│   ├── [locale]/              # 国际化路由
│   │   ├── layout.tsx         # 国际化布局
│   │   └── page.tsx           # 国际化首页
│   ├── layout.tsx             # 根布局（简化版）
│   └── page.tsx               # 根页面（重定向到默认语言）
├── components/
│   ├── LanguageSwitcher.tsx   # 语言切换组件
│   ├── AuthSection.tsx        # 认证区域
│   └── ui/
│       └── dropdown-menu.tsx  # 下拉菜单组件
├── messages/
│   ├── zh.json                # 中文翻译
│   └── en.json                # 英文翻译
├── i18n.ts                    # 国际化配置
└── middleware.ts              # 路由中间件
```

## 启动开发服务器

```bash
npm run dev
```

访问:
- 中文版: http://localhost:3000 或 http://localhost:3000/zh
- 英文版: http://localhost:3000/en

## 下一步扩展

### 为其他页面添加国际化

1. 在 `src/messages/zh.json` 和 `en.json` 添加相应翻译
2. 将页面移动到 `src/app/[locale]/` 目录下
3. 在组件中使用 `useTranslations()` hook

### 添加更多语言

1. 在 `src/i18n.ts` 中添加新语言代码：
```typescript
export const locales = ['zh', 'en', 'ja'] as const;
```

2. 创建新的翻译文件 `src/messages/ja.json`

3. 更新中间件配置

### SEO 优化

在 `layout.tsx` 中添加语言元标签：
```tsx
export async function generateMetadata({ params: { locale } }) {
  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'zh-CN': '/zh',
        'en-US': '/en',
      },
    },
  };
}
```

## 注意事项

1. **API 路由**: API 路由不受国际化影响，仍然保持在 `/api/*` 路径下
2. **认证路由**: 管理后台等需要认证的路由已集成到中间件中
3. **默认语言**: 访问根路径 `/` 会自动重定向到默认语言 `/zh`
4. **语言检测**: 中间件会根据浏览器语言偏好自动检测用户语言

## 常见问题

### Q: 如何更改默认语言？
A: 修改 `src/i18n.ts` 中的 `defaultLocale` 变量。

### Q: 如何禁用自动语言检测？
A: 在 `src/middleware.ts` 中将 `localeDetection` 设置为 `false`。

### Q: 翻译文件很大怎么办？
A: 可以将翻译文件拆分为多个小文件，在 `i18n.ts` 中合并导入。

## 技术栈

- **Next.js 15** - React 框架
- **next-intl 4.x** - 国际化解决方案
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Radix UI** - 无障碍 UI 组件库