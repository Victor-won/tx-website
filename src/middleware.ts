import createIntlMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";
import { routing } from "./routing";

// 创建国际化中间件
const intlMiddleware = createIntlMiddleware(routing);

// 组合认证和国际化中间件
const authMiddleware = withAuth(
  function middleware(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 检查管理员权限
        if (
          req.nextUrl.pathname.startsWith("/admin") ||
          req.nextUrl.pathname.match(/^\/(zh|en)\/admin/)
        ) {
          return token?.role === "ADMIN";
        }

        // 检查API权限
        if (req.nextUrl.pathname.startsWith("/api/admin")) {
          return token?.role === "ADMIN";
        }

        return true;
      },
    },
  },
);

export default function middleware(req: NextRequest) {
  // 对于需要认证的路径，使用 authMiddleware
  const pathname = req.nextUrl.pathname;
  if (pathname.match(/^\/(zh|en)?\/?(admin|api\/admin)/)) {
    // @ts-ignore - next-auth middleware 类型不匹配
    return (authMiddleware as any)(req);
  }

  // 其他路径只使用国际化中间件
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/",
    "/(zh|en)/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
