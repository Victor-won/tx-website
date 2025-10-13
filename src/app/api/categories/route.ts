import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CategoryService } from "../../../../services/categoryService";
import { CreateCategorySchema } from "../../../../types";
import { authOptions } from "../../../../lib/auth";

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a paginated list of categories with optional filters
 *     tags:
 *       - Categories
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
 *         name: parentId
 *         schema:
 *           type: string
 *         description: Parent category ID filter (use 'null' for root categories)
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
    const parentId = searchParams.get("parentId") || undefined;

    const result = await CategoryService.getAll({
      page,
      limit,
      search,
      parentId: parentId === "null" ? null : parentId,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("获取分类列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取分类列表失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category (requires ADMIN role)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameZh
 *               - slug
 *             properties:
 *               nameZh:
 *                 type: string
 *                 description: Category name in Chinese
 *               nameEn:
 *                 type: string
 *                 description: Category name in English
 *               slug:
 *                 type: string
 *                 description: URL-friendly identifier
 *               descriptionZh:
 *                 type: string
 *                 description: Category description in Chinese
 *               descriptionEn:
 *                 type: string
 *                 description: Category description in English
 *               parentId:
 *                 type: string
 *                 nullable: true
 *                 description: Parent category ID
 *               order:
 *                 type: integer
 *                 default: 0
 *                 description: Display order
 *     responses:
 *       200:
 *         description: Category created successfully
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
 *                   example: 分类创建成功
 *       400:
 *         description: Bad request (duplicate slug or validation error)
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "无权限访问" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validatedData = CreateCategorySchema.parse(body);

    const category = await CategoryService.create(validatedData);

    return NextResponse.json({
      success: true,
      data: category,
      message: "分类创建成功",
    });
  } catch (error) {
    console.error("创建分类失败:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "分类slug已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "创建分类失败" },
      { status: 500 },
    );
  }
}
