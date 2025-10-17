import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "../../../../services/productService";
import { CreateProductSchema } from "../../../../types";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a paginated list of products with optional filters
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 *         description: Product status filter
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Category ID filter
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;

    const result = await ProductService.getAll({
      page,
      limit,
      search,
      status,
      categoryId,
    });

    // Convert Decimal fields to numbers for proper JSON serialization
    const serializedData = result.data.map(product => ({
      ...product,
      price: product.price ? Number(product.price) : product.price,
      salePrice: product.salePrice ? Number(product.salePrice) : product.salePrice,
      rating: product.rating ? Number(product.rating) : product.rating,
    }));

    return NextResponse.json({
      success: true,
      data: serializedData,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("获取产品列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取产品列表失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided data
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameZh
 *               - slug
 *               - sku
 *             properties:
 *               nameZh:
 *                 type: string
 *                 description: Product name in Chinese
 *               nameEn:
 *                 type: string
 *                 description: Product name in English
 *               slug:
 *                 type: string
 *                 description: URL-friendly identifier
 *               sku:
 *                 type: string
 *                 description: Stock keeping unit
 *               descriptionZh:
 *                 type: string
 *                 description: Product description in Chinese
 *               descriptionEn:
 *                 type: string
 *                 description: Product description in English
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: Product price
 *               categoryId:
 *                 type: string
 *                 description: Category ID
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *                 default: DRAFT
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: 产品创建成功
 *       400:
 *         description: Bad request (duplicate slug/SKU or validation error)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateProductSchema.parse(body);

    const product = await ProductService.create(validatedData);

    return NextResponse.json({
      success: true,
      data: product,
      message: "产品创建成功",
    });
  } catch (error) {
    console.error("创建产品失败:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "产品slug或SKU已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "创建产品失败" },
      { status: 500 },
    );
  }
}
