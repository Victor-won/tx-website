import { prisma } from "../lib/prisma";
import { CreatePost, UpdatePost } from "../types";
import { PostStatus } from "@prisma/client";

export class PostService {
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
          { title: { contains: search } },
          { content: { contains: search } },
          { excerpt: { contains: search } },
        ],
      }),
      ...(status && { status: status as PostStatus }),
      ...(categoryId && { categoryId }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          category: true,
          tags: true,
          mediaFiles: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        tags: true,
        mediaFiles: true,
      },
    });
  }

  static async create(data: CreatePost & { authorId: string }) {
    const { tags, ...postData } = data;

    return prisma.post.create({
      data: {
        ...postData,
        ...(data.status === "PUBLISHED" && { publishedAt: new Date() }),
        ...(tags && {
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: { slug: tag },
              create: { name: tag, slug: tag },
            })),
          },
        }),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        tags: true,
        mediaFiles: true,
      },
    });
  }

  static async update(id: string, data: UpdatePost) {
    const { tags, ...postData } = data;

    return prisma.post.update({
      where: { id },
      data: {
        ...postData,
        ...(data.status === "PUBLISHED" && { publishedAt: new Date() }),
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
        author: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        tags: true,
        mediaFiles: true,
      },
    });
  }

  static async delete(id: string) {
    return prisma.post.delete({
      where: { id },
    });
  }
}
