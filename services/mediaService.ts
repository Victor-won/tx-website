import { prisma } from "../lib/prisma";
import { CreateMediaFile, UpdateMediaFile } from "../types";
import { deleteFile } from "../lib/upload";
import { MediaFileType } from "@prisma/client";

export class MediaService {
  static async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    mimeType?: string;
    folder?: string;
    fileType?: MediaFileType;
  }) {
    const { page = 1, limit = 10, search, mimeType, folder, fileType } = params || {};
    const skip = (page - 1) * limit;

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
      ...(folder && { folder }),
      ...(fileType && { fileType }),
    };

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
        orderBy: { createdAt: "desc" },
      }),
      prisma.mediaFile.count({ where }),
    ]);

    return {
      data: mediaFiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    });
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
    });
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
    });
  }

  static async delete(id: string) {
    // 获取文件信息以删除物理文件
    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id },
      select: { path: true },
    });

    if (mediaFile?.path) {
      try {
        await deleteFile(mediaFile.path);
      } catch (error) {
        console.error("删除物理文件失败:", error);
        // 继续删除数据库记录
      }
    }

    return prisma.mediaFile.delete({
      where: { id },
    });
  }

  static async batchDelete(ids: string[]) {
    // 获取所有文件路径
    const mediaFiles = await prisma.mediaFile.findMany({
      where: { id: { in: ids } },
      select: { path: true },
    });

    // 删除物理文件
    const deletionPromises = mediaFiles
      .filter((f) => f.path)
      .map((f) =>
        deleteFile(f.path).catch((error) =>
          console.error(`删除文件 ${f.path} 失败:`, error),
        ),
      );

    await Promise.all(deletionPromises);

    // 删除数据库记录
    return prisma.mediaFile.deleteMany({
      where: { id: { in: ids } },
    });
  }

  static async getFolders() {
    const folders = await prisma.mediaFile.findMany({
      where: { folder: { not: null } },
      select: { folder: true },
      distinct: ["folder"],
    });

    return folders.map((f) => f.folder).filter(Boolean);
  }
}
