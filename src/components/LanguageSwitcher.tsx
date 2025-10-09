"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/routing";
import { Globe } from "lucide-react";
import { routing } from "@/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-500" />
        <select
          value={locale}
          onChange={(e) => switchLanguage(e.target.value)}
          className="text-sm font-medium text-gray-700 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-0"
        >
          {routing.locales.map((loc) => (
            <option key={loc} value={loc}>
              {loc === "zh" ? "中文" : "English"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
