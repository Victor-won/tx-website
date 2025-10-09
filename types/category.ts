import { z } from "zod";

// 分类相关
export const CategorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空"),
  slug: z.string().min(1, "Slug不能为空"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

export const CreateCategorySchema = CategorySchema;
export const UpdateCategorySchema = CategorySchema.partial();

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
