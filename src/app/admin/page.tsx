'use client'

import { useEffect, useState } from 'react'

interface Stats {
  users: number
  posts: number
  products: number
  categories: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    posts: 0,
    products: 0,
    categories: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [usersRes, postsRes, productsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/stats/users'),
        fetch('/api/posts'),
        fetch('/api/products'),
        fetch('/api/categories'),
      ])

      const [users, posts, products, categories] = await Promise.all([
        usersRes.ok ? usersRes.json() : { pagination: { total: 0 } },
        postsRes.ok ? postsRes.json() : { pagination: { total: 0 } },
        productsRes.ok ? productsRes.json() : { pagination: { total: 0 } },
        categoriesRes.ok ? categoriesRes.json() : { pagination: { total: 0 } },
      ])

      setStats({
        users: users.pagination?.total || 0,
        posts: posts.pagination?.total || 0,
        products: products.pagination?.total || 0,
        categories: categories.pagination?.total || 0,
      })
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: '用户总数',
      value: stats.users,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      name: '文章总数',
      value: stats.posts,
      icon: '📝',
      color: 'bg-green-500',
    },
    {
      name: '产品总数',
      value: stats.products,
      icon: '📦',
      color: 'bg-yellow-500',
    },
    {
      name: '分类总数',
      value: stats.categories,
      icon: '📁',
      color: 'bg-purple-500',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
        <p className="mt-1 text-sm text-gray-600">
          欢迎来到 TX Website 管理后台
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 ${item.color} rounded-md flex items-center justify-center text-white text-lg`}>
                    {item.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 快速操作 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            快速操作
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <a
              href="/admin/posts"
              className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-gray-900">新建文章</div>
              </div>
            </a>
            <a
              href="/admin/products"
              className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📦</div>
                <div className="text-sm font-medium text-gray-900">添加产品</div>
              </div>
            </a>
            <a
              href="/admin/categories"
              className="bg-yellow-50 p-4 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📁</div>
                <div className="text-sm font-medium text-gray-900">管理分类</div>
              </div>
            </a>
            <a
              href="/admin/media"
              className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🖼️</div>
                <div className="text-sm font-medium text-gray-900">媒体库</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}