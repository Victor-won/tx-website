import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CategoryService } from "../../../../../services/categoryService";
import { UpdateCategorySchema } from "../../../../../types";
import { authOptions } from "../../../../../lib/auth";

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a single category by its ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
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
 *         description: Category not found
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
    const category = await CategoryService.getById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "分类不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("获取分类详情失败:", error);
    return NextResponse.json(
      { success: false, error: "获取分类详情失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     description: Update an existing category by ID (requires ADMIN role)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
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
 *               descriptionZh:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 nullable: true
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Category updated successfully
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
 *                   example: 分类更新成功
 *       400:
 *         description: Bad request (duplicate slug)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (requires ADMIN role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Category not found
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
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "无权限访问" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateCategorySchema.parse(body);

    const category = await CategoryService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: category,
      message: "分类更新成功",
    });
  } catch (error) {
    console.error("更新分类失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { success: false, error: "分类不存在" },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "分类slug已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "更新分类失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     description: Delete a category by ID (requires ADMIN role)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
 *                   example: 分类删除成功
 *       403:
 *         description: Forbidden (requires ADMIN role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Category not found
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
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "无权限访问" },
        { status: 403 },
      );
    }

    const { id } = await params;
    await CategoryService.delete(id);

    return NextResponse.json({
      success: true,
      message: "分类删除成功",
    });
  } catch (error) {
    console.error("删除分类失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { success: false, error: "分类不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "删除分类失败" },
      { status: 500 },
    );
  }
}
