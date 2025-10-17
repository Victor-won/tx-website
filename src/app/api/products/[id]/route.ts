import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "../../../../../services/productService";
import { UpdateProductSchema } from "../../../../../types";

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a single product by its ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
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
 *       404:
 *         description: Product not found
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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await ProductService.getById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "产品不存在" },
        { status: 404 },
      );
    }

    // Convert Decimal fields to numbers for proper JSON serialization
    const serializedProduct = {
      ...product,
      price: product.price ? Number(product.price) : product.price,
      salePrice: product.salePrice ? Number(product.salePrice) : product.salePrice,
      rating: product.rating ? Number(product.rating) : product.rating,
    };

    return NextResponse.json({
      success: true,
      data: serializedProduct,
    });
  } catch (error) {
    console.error("获取产品详情失败:", error);
    return NextResponse.json(
      { success: false, error: "获取产品详情失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     description: Update an existing product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameZh:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               slug:
 *                 type: string
 *               sku:
 *                 type: string
 *               descriptionZh:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: decimal
 *               categoryId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   example: 产品更新成功
 *       400:
 *         description: Bad request (duplicate slug/SKU)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
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
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateProductSchema.parse(body);

    const product = await ProductService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: product,
      message: "产品更新成功",
    });
  } catch (error) {
    console.error("更新产品失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { success: false, error: "产品不存在" },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "产品slug或SKU已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "更新产品失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Delete a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 产品删除成功
 *       404:
 *         description: Product not found
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await ProductService.delete(id);

    return NextResponse.json({
      success: true,
      message: "产品删除成功",
    });
  } catch (error) {
    console.error("删除产品失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { success: false, error: "产品不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "删除产品失败" },
      { status: 500 },
    );
  }
}
