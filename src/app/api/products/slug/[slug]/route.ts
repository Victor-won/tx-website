import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "../../../../../../services/productService";

/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     description: Retrieve a single product by its slug
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
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
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const product = await ProductService.getBySlug(slug);

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
