import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "../../../../../services/productService";

/**
 * @swagger
 * /api/products/order:
 *   put:
 *     summary: Update product order
 *     description: Batch update product order for drag and drop sorting
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     order:
 *                       type: number
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       500:
 *         description: Server error
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: "updates必须是数组" },
        { status: 400 }
      );
    }

    await ProductService.updateOrder(updates);

    return NextResponse.json({
      success: true,
      message: "产品排序更新成功",
    });
  } catch (error) {
    console.error("更新产品排序失败:", error);
    return NextResponse.json(
      { success: false, error: "更新产品排序失败" },
      { status: 500 }
    );
  }
}
