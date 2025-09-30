import { prisma } from '../lib/prisma'
import { CreateCategory, UpdateCategory } from '../types'

export class CategoryService {
  static async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    parentId?: string | null
  }) {
    const { page = 1, limit = 10, search, parentId } = params || {}
    const skip = (page - 1) * limit

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(parentId !== undefined && { parentId }),
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              posts: true,
              products: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.count({ where }),
    ])

    return {
      data: categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        posts: true,
        products: true,
      },
    })
  }

  static async getBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        posts: true,
        products: true,
      },
    })
  }

  static async create(data: CreateCategory) {
    return prisma.category.create({
      data,
      include: {
        parent: true,
        children: true,
      },
    })
  }

  static async update(id: string, data: UpdateCategory) {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
      },
    })
  }

  static async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    })
  }
}