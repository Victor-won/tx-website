import { z } from "zod";

// 产品规格 Specification
export const SpecificationSchema = z.object({
  name: z.string(),
  nameEn: z.string().optional(),
  value: z.string(),
  valueEn: z.string().optional(),
});

// 产品特性 Feature
export const FeatureSchema = z.object({
  title: z.string(),
  titleEn: z.string().optional(),
  description: z.string(),
  descriptionEn: z.string().optional(),
  icon: z.string().optional(),
});

// 产品相关
export const ProductSchema = z.object({
  name: z.string().min(1, "产品名称不能为空"),
  nameEn: z.string().optional(),
  slug: z.string().min(1, "Slug不能为空"),
  description: z.string().min(1, "产品描述不能为空"),
  descriptionEn: z.string().optional(),
  shortDesc: z.string().optional(),
  shortDescEn: z.string().optional(),
  tag: z.string().optional(),
  tagEn: z.string().optional(),
  priceDisplay: z.string().optional(),
  priceDisplayEn: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  specifications: z.array(SpecificationSchema).optional(),
  features: z.array(FeatureSchema).optional(),
  price: z.number().min(0, "价格不能为负数"),
  salePrice: z.number().min(0, "销售价格不能为负数").optional(),
  sku: z.string().min(1, "SKU不能为空"),
  stock: z.number().min(0, "库存不能为负数").default(0),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).default("ACTIVE"),
  featuredImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export const CreateProductSchema = ProductSchema;
export const UpdateProductSchema = ProductSchema.partial();

export type Specification = z.infer<typeof SpecificationSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
