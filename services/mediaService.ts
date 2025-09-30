import { prisma } from '../lib/prisma'
import { CreateMediaFile, UpdateMediaFile } from '../types'

export class MediaService {
  static async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    mimeType?: string
  }) {
    const { page = 1, limit = 10, search, mimeType } = params || {}
    const skip = (page - 1) * limit

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { fileName: { contains: search } },
          { alt: { contains: search } },
          { caption: { contains: search } },
        ],
      }),
      ...(mimeType && { mimeType: { startsWith: mimeType } }),
    }

    const [mediaFiles, total] = await Promise.all([
      prisma.mediaFile.findMany({
        where,
        skip,
        take: limit,
        include: {
          posts: {
            select: { id: true, title: true, slug: true },
          },
          products: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mediaFile.count({ where }),
    ])

    return {
      data: mediaFiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getById(id: string) {
    return prisma.mediaFile.findUnique({
      where: { id },
      include: {
        posts: {
          select: { id: true, title: true, slug: true },
        },
        products: {
          select: { id: true, name: true, slug: true },
        },
      },
    })
  }

  static async create(data: CreateMediaFile) {
    return prisma.mediaFile.create({
      data,
      include: {
        posts: {
          select: { id: true, title: true, slug: true },
        },
        products: {
          select: { id: true, name: true, slug: true },
        },
      },
    })
  }

  static async update(id: string, data: UpdateMediaFile) {
    return prisma.mediaFile.update({
      where: { id },
      data,
      include: {
        posts: {
          select: { id: true, title: true, slug: true },
        },
        products: {
          select: { id: true, name: true, slug: true },
        },
      },
    })
  }

  static async delete(id: string) {
    return prisma.mediaFile.delete({
      where: { id },
    })
  }
}