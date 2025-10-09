import { getRequestConfig } from "next-intl/server";

// 支持的语言列表
export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = "zh";

export default getRequestConfig(async ({ requestLocale }) => {
  // 从请求中获取 locale，如果没有则使用默认值
  let locale = await requestLocale;

  // 验证并确保使用支持的 locale
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
