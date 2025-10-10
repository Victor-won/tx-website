"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/routing";
import { Globe } from "lucide-react";
import { routing } from "@/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const langLabels: Record<string, string> = {
    zh: "中文",
    en: "EN",
  };

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const langButtons = Object.keys(langLabels).map((loc) => (
      <button
          key={loc}
          onClick={() => switchLanguage(loc)}
          className={`relative z-10 font-medium transition-all duration-300 text-sm px-2 py-1 rounded-md ${
              locale === loc ? 'text-primary bg-white shadow-sm' : 'text-gray-500 hover:text-primary hover:bg-white/50'
          }`}
          aria-label={loc === 'zh' ? '切换到中文' : loc === 'en' ? 'Switch to English' : loc}
      >
          {langLabels[loc] || loc.toUpperCase()}
      </button>
  ));

  langButtons.splice(1, 0, (
      <div key="divider" className="w-px h-5 bg-gray-300 mx-1" />
  ));

  return (
      <div className="relative flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
          {langButtons}
      </div>
  );
}
