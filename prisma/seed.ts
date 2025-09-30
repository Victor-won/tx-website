import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建管理员用户
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  })

  // 创建分类
  const techCategory = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: '技术',
      slug: 'technology',
      description: '技术相关内容',
    },
  })

  const productCategory = await prisma.category.upsert({
    where: { slug: 'products' },
    update: {},
    create: {
      name: '产品',
      slug: 'products',
      description: '产品相关内容',
    },
  })

  // 创建标签
  const tag1 = await prisma.tag.upsert({
    where: { slug: 'javascript' },
    update: {},
    create: {
      name: 'JavaScript',
      slug: 'javascript',
    },
  })

  const tag2 = await prisma.tag.upsert({
    where: { slug: 'react' },
    update: {},
    create: {
      name: 'React',
      slug: 'react',
    },
  })

  // 创建示例文章
  await prisma.post.upsert({
    where: { slug: 'welcome-to-our-website' },
    update: {},
    create: {
      title: '欢迎来到我们的网站',
      slug: 'welcome-to-our-website',
      content: '这是一个示例文章内容...',
      excerpt: '欢迎来到我们的企业网站',
      status: 'PUBLISHED',
      authorId: adminUser.id,
      categoryId: techCategory.id,
      publishedAt: new Date(),
      tags: {
        connect: [{ id: tag1.id }]
      }
    },
  })

  // 创建示例产品
  await prisma.product.upsert({
    where: { slug: 'sample-product' },
    update: {},
    create: {
      name: '示例产品',
      slug: 'sample-product',
      description: '这是一个示例产品的详细描述...',
      shortDesc: '示例产品简短描述',
      price: 99.99,
      sku: 'SAMPLE-001',
      stock: 100,
      status: 'ACTIVE',
      categoryId: productCategory.id,
      tags: {
        connect: [{ id: tag2.id }]
      }
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })