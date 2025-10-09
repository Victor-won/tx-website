import { z } from "zod";

// 媒体文件相关
export const MediaFileSchema = z.object({
  name: z.string().min(1, "文件名称不能为空"),
  fileName: z.string().min(1, "文件名不能为空"),
  url: z.string().url("请提供有效的URL"),
  mimeType: z.string().min(1, "MIME类型不能为空"),
  size: z.number().min(0, "文件大小不能为负数"),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const CreateMediaFileSchema = MediaFileSchema;
export const UpdateMediaFileSchema = MediaFileSchema.partial();

export type MediaFile = z.infer<typeof MediaFileSchema>;
export type CreateMediaFile = z.infer<typeof CreateMediaFileSchema>;
export type UpdateMediaFile = z.infer<typeof UpdateMediaFileSchema>;
