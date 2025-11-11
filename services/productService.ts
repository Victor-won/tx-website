import { prisma } from "../lib/prisma";
import { CreateProduct, UpdateProduct } from "../types";
import { Prisma, ProductStatus } from "@prisma/client";

export class ProductService {
  static async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }) {
    const { page = 1, limit = 10, search, status, categoryId } = params || {};
    const skip = (page - 1) * limit;

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
    };

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
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
        mediaFiles: true,
      },
    });
  }

  static async getBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        mediaFiles: true,
      },
    });
  }

  static async create(data: CreateProduct) {
    const { tags, categoryId, images, ...productData } = data;

    return prisma.product.create({
      data: {
        ...productData,
        ...(images && { images: images as Prisma.JsonArray }),
        ...(categoryId != null
          ? { category: { connect: { id: categoryId } } }
          : {}),
        ...(tags && tags.length > 0
          ? {
              tags: {
                connectOrCreate: tags.map((tag) => ({
                  where: { slug: tag },
                  create: { name: tag, slug: tag },
                })),
              },
            }
          : {}),
      },
      include: {
        category: true,
        tags: true,
        mediaFiles: true,
      },
    });
  }

  static async update(id: string, data: UpdateProduct) {
    const { tags, categoryId, images, ...productData } = data;

    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(images && { images: images as Prisma.JsonArray }),
        ...(categoryId !== undefined
          ? categoryId === null
            ? { category: { disconnect: true } }
            : { category: { connect: { id: categoryId } } }
          : {}),
        ...(tags && {
          tags: {
            set: [],
            connectOrCreate: tags.map((tag) => ({
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
    });
  }

  static async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  static async updateOrder(updates: { id: string; order: number }[]) {
    // 使用事务批量更新产品排序
    await prisma.$transaction(
      updates.map(({ id, order }) =>
        prisma.product.update({
          where: { id },
          data: { order },
        })
      )
    );
    return { success: true };
  }
}
