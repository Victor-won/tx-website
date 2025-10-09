import { z } from "zod";

// 产品相关
export const ProductSchema = z.object({
  name: z.string().min(1, "产品名称不能为空"),
  slug: z.string().min(1, "Slug不能为空"),
  description: z.string().min(1, "产品描述不能为空"),
  shortDesc: z.string().optional(),
  price: z.number().min(0, "价格不能为负数"),
  salePrice: z.number().min(0, "销售价格不能为负数").optional(),
  sku: z.string().min(1, "SKU不能为空"),
  stock: z.number().min(0, "库存不能为负数").default(0),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).default("ACTIVE"),
  featuredImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const CreateProductSchema = ProductSchema;
export const UpdateProductSchema = ProductSchema.partial();

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
