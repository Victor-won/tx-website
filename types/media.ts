import { z } from "zod";

// 媒体文件类型枚举
export enum MediaFileType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
  ARCHIVE = "ARCHIVE",
  OTHER = "OTHER",
}

// 媒体文件相关
export const MediaFileSchema = z.object({
  name: z.string().min(1, "文件名称不能为空"),
  fileName: z.string().min(1, "文件名不能为空"),
  url: z.string().min(1, "URL不能为空"),
  path: z.string().min(1, "文件路径不能为空"),
  mimeType: z.string().min(1, "MIME类型不能为空"),
  size: z.number().min(0, "文件大小不能为负数"),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  folder: z.string().optional(),
  fileType: z.nativeEnum(MediaFileType).default(MediaFileType.OTHER),
  uploadedBy: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export const CreateMediaFileSchema = MediaFileSchema;
export const UpdateMediaFileSchema = MediaFileSchema.partial();

// 批量上传Schema
export const BatchUploadSchema = z.object({
  files: z.array(z.any()).min(1, "至少上传一个文件"),
  folder: z.string().optional(),
});

// 批量删除Schema
export const BatchDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "至少选择一个文件"),
});

export type MediaFile = z.infer<typeof MediaFileSchema>;
export type CreateMediaFile = z.infer<typeof CreateMediaFileSchema>;
export type UpdateMediaFile = z.infer<typeof UpdateMediaFileSchema>;
export type BatchUpload = z.infer<typeof BatchUploadSchema>;
export type BatchDelete = z.infer<typeof BatchDeleteSchema>;
