import { z } from 'zod'

// 文章相关
export const PostSchema = z.object({
  title: z.string().min(1, '文章标题不能为空'),
  slug: z.string().min(1, 'Slug不能为空'),
  content: z.string().min(1, '文章内容不能为空'),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const CreatePostSchema = PostSchema
export const UpdatePostSchema = PostSchema.partial()

export type Post = z.infer<typeof PostSchema>
export type CreatePost = z.infer<typeof CreatePostSchema>
export type UpdatePost = z.infer<typeof UpdatePostSchema>