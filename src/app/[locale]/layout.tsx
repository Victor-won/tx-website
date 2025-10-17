import type { Metadata } from "next";
import "../globals.css";
import Providers from "../../components/Providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // 手动加载翻译文件
  const messages = await import(`@/messages/${locale}.json`).then(
    (m) => m.default,
  );

  return {
    title: messages.metadata?.title || "TX Website",
    description: messages.metadata?.description || "Modern Enterprise Website",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // 验证语言参数
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
