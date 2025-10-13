import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { PostService } from "../../../../services/postService";
import { CreatePostSchema } from "../../../../types";

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get posts
 *     description: Retrieve a single post by slug or a paginated list of posts
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         description: Post slug (if provided, returns single post)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (for list view)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page (for list view)
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
 *         description: Post status filter
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Category ID filter
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/PaginationResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Post not found (when slug is provided)
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // If slug is provided, get single post by slug
    if (slug) {
      const post = await PostService.getBySlug(slug);
      if (!post) {
        return NextResponse.json(
          { success: false, error: "文章不存在" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: [post], // Return as array for consistency
      });
    }

    // Otherwise, get list of posts
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;

    const result = await PostService.getAll({
      page,
      limit,
      search,
      status,
      categoryId,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取文章列表失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post (requires ADMIN role)
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titleZh
 *               - slug
 *               - authorId
 *             properties:
 *               titleZh:
 *                 type: string
 *                 description: Post title in Chinese
 *               titleEn:
 *                 type: string
 *                 description: Post title in English
 *               slug:
 *                 type: string
 *                 description: URL-friendly identifier
 *               contentZh:
 *                 type: string
 *                 description: Post content in Chinese (HTML)
 *               contentEn:
 *                 type: string
 *                 description: Post content in English (HTML)
 *               excerptZh:
 *                 type: string
 *                 description: Post excerpt in Chinese
 *               excerptEn:
 *                 type: string
 *                 description: Post excerpt in English
 *               authorId:
 *                 type: string
 *                 description: Author user ID
 *               categoryId:
 *                 type: string
 *                 description: Category ID
 *               featuredImageUrl:
 *                 type: string
 *                 description: Featured image URL
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *                 default: DRAFT
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Publication date
 *     responses:
 *       200:
 *         description: Post created successfully
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
 *                   example: 文章创建成功
 *       400:
 *         description: Bad request (missing authorId, duplicate slug, or validation error)
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
    const { authorId, ...postData } = body;

    if (!authorId) {
      return NextResponse.json(
        { success: false, error: "作者ID不能为空" },
        { status: 400 },
      );
    }

    const validatedData = CreatePostSchema.parse(postData);

    const post = await PostService.create({
      ...validatedData,
      authorId,
    });

    return NextResponse.json({
      success: true,
      data: post,
      message: "文章创建成功",
    });
  } catch (error) {
    console.error("创建文章失败:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "文章slug已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "创建文章失败" },
      { status: 500 },
    );
  }
}
