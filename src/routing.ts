import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./i18n";

export const routing = defineRouting({
  // 支持的语言列表
  locales,

  // 默认语言
  defaultLocale,

  // 语言前缀策略 - 'as-needed' 表示默认语言不需要前缀
  localePrefix: "as-needed",
});

// 创建国际化导航辅助函数
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
