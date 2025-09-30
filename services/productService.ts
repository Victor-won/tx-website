import { prisma } from '../lib/prisma'
import { CreateProduct, UpdateProduct } from '../types'
import { ProductStatus } from '@prisma/client'

export class ProductService {
  static async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    categoryId?: string
  }) {
    const { page = 1, limit = 10, search, status, categoryId } = params || {}
    const skip = (page - 1) * limit

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { shortDesc: { contains: search } },
          { sku: { contains: search } },
        ],
      }),
      ...(status && { status: status as ProductStatus }),
      ...(categoryId && { categoryId }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          tags: true,
          mediaFiles: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
        mediaFiles: true,
      },
    })
  }

  static async getBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        mediaFiles: true,
      },
    })
  }

  static async create(data: CreateProduct) {
    const { tags, ...productData } = data
    
    return prisma.product.create({
      data: {
        ...productData,
        ...(tags && {
          tags: {
            connectOrCreate: tags.map(tag => ({
              where: { slug: tag },
              create: { name: tag, slug: tag },
            })),
          },
        }),
      },
      include: {
        category: true,
        tags: true,
        mediaFiles: true,
      },
    })
  }

  static async update(id: string, data: UpdateProduct) {
    const { tags, ...productData } = data
    
    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(tags && {
          tags: {
            set: [],
            connectOrCreate: tags.map(tag => ({
              where: { slug: tag },
              create: { name: tag, slug: tag },
            })),
          },
        }),
      },
      include: {
        category: true,
        tags: true,
        mediaFiles: true,
      },
    })
  }

  static async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    })
  }
}