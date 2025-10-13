import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { PostService } from "../../../../../services/postService";
import { UpdatePostSchema } from "../../../../../types";

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     description: Retrieve a single post by its ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
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
 *         description: Post not found
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
    const post = await PostService.getById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("获取文章详情失败:", error);
    return NextResponse.json(
      { success: false, error: "获取文章详情失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update post
 *     description: Update an existing post by ID (requires ADMIN role)
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titleZh:
 *                 type: string
 *               titleEn:
 *                 type: string
 *               slug:
 *                 type: string
 *               contentZh:
 *                 type: string
 *               contentEn:
 *                 type: string
 *               excerptZh:
 *                 type: string
 *               excerptEn:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               featuredImageUrl:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Post updated successfully
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
 *                   example: 文章更新成功
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
 *         description: Post not found
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
    const validatedData = UpdatePostSchema.parse(body);

    const post = await PostService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: post,
      message: "文章更新成功",
    });
  } catch (error) {
    console.error("更新文章失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "文章slug已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "更新文章失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete post
 *     description: Delete a post by ID (requires ADMIN role)
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
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
 *                   example: 文章删除成功
 *       403:
 *         description: Forbidden (requires ADMIN role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Post not found
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
    await PostService.delete(id);

    return NextResponse.json({
      success: true,
      message: "文章删除成功",
    });
  } catch (error) {
    console.error("删除文章失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "删除文章失败" },
      { status: 500 },
    );
  }
}
