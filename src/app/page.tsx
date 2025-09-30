'use client'

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <h1 className="text-2xl font-bold text-gray-900">TX Website</h1>
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link href="/" className="text-base font-medium text-gray-500 hover:text-gray-900">
                首页
              </Link>
              <Link href="/products" className="text-base font-medium text-gray-500 hover:text-gray-900">
                产品
              </Link>
              <Link href="/posts" className="text-base font-medium text-gray-500 hover:text-gray-900">
                文章
              </Link>
              <Link href="/categories" className="text-base font-medium text-gray-500 hover:text-gray-900">
                分类
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-600">欢迎，{session.user.name}</span>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      管理后台
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                    登录
                  </Link>
                  <Link href="/auth/signup" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            欢迎来到 TX Website
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            现代化企业网站解决方案
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">产</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      产品管理
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      完整的产品CRUD
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/api/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  查看 API →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">文</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      文章管理
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      内容发布系统
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/api/posts"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  查看 API →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">类</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      分类管理
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      层级分类系统
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/api/categories"
                  className="text-sm font-medium text-purple-600 hover:text-purple-500"
                >
                  查看 API →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">媒</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      媒体库
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      文件资源管理
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/api/media"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  查看 API →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">API 端点</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">产品 API</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>GET /api/products - 获取产品列表</li>
                  <li>POST /api/products - 创建产品</li>
                  <li>GET /api/products/[id] - 获取产品详情</li>
                  <li>PUT /api/products/[id] - 更新产品</li>
                  <li>DELETE /api/products/[id] - 删除产品</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">文章 API</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>GET /api/posts - 获取文章列表</li>
                  <li>POST /api/posts - 创建文章</li>
                  <li>GET /api/posts/[id] - 获取文章详情</li>
                  <li>PUT /api/posts/[id] - 更新文章</li>
                  <li>DELETE /api/posts/[id] - 删除文章</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">分类 API</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>GET /api/categories - 获取分类列表</li>
                  <li>POST /api/categories - 创建分类</li>
                  <li>GET /api/categories/[id] - 获取分类详情</li>
                  <li>PUT /api/categories/[id] - 更新分类</li>
                  <li>DELETE /api/categories/[id] - 删除分类</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">媒体库 API</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>GET /api/media - 获取媒体文件列表</li>
                  <li>POST /api/media - 上传媒体文件</li>
                  <li>GET /api/media/[id] - 获取媒体文件详情</li>
                  <li>PUT /api/media/[id] - 更新媒体文件</li>
                  <li>DELETE /api/media/[id] - 删除媒体文件</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 TX Website. 基于 Next.js 15 + Prisma + TypeScript 构建。
          </p>
        </div>
      </footer>
    </div>
  );
}