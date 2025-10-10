import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  // 配置动态路由
  experimental: {
    // after: true,
  },
};

export default withNextIntl(nextConfig);
