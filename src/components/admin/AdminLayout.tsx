"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "仪表板", href: "/admin", icon: "📊" },
  { name: "用户管理", href: "/admin/users", icon: "👥" },
  { name: "分类管理", href: "/admin/categories", icon: "📁" },
  { name: "文章管理", href: "/admin/posts", icon: "📝" },
  { name: "产品管理", href: "/admin/products", icon: "📦" },
  { name: "媒体库", href: "/admin/media", icon: "🖼️" },
  { name: "留言管理", href: "/admin/contacts", icon: "💬" },
  { name: "轮播图管理", href: "/admin/banners", icon: "🎨" },
  { name: "解决方案管理", href: "/admin/solutions", icon: "💡" },
  { name: "合作伙伴管理", href: "/admin/partners", icon: "🤝" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 移动端侧边栏 */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">关闭侧边栏</span>
                <span className="text-white text-xl">×</span>
              </button>
            </div>
            <SidebarContent pathname={pathname} />
          </div>
        </div>
      )}

      {/* 桌面端侧边栏 */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <SidebarContent pathname={pathname} />
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* 顶部导航 */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">打开侧边栏</span>
            <span className="text-xl">☰</span>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <h1 className="text-xl font-semibold text-gray-900 my-auto">
                后台管理
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">
                    {session?.user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 页面内容 */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <>
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
        <h2 className="text-white text-lg font-semibold">TX 管理后台</h2>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-white space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-sm font-medium border-l-4`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            返回前台
          </Link>
        </div>
      </div>
    </>
  );
}
