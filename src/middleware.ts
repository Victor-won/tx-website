import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // 中间件逻辑
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 检查管理员权限
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        
        // 检查API权限
        if (req.nextUrl.pathname.startsWith('/api/admin')) {
          return token?.role === 'ADMIN'
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}