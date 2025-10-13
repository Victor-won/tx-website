import { NextRequest, NextResponse } from "next/server";
import { MediaService } from "../../../../services/mediaService";
import { CreateMediaFileSchema } from "../../../../types";

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Get all media files
 *     description: Retrieve a paginated list of media files with optional filters
 *     tags:
 *       - Media
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
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: mimeType
 *         schema:
 *           type: string
 *         description: Filter by MIME type (e.g., image/png)
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Filter by folder path
 *       - in: query
 *         name: fileType
 *         schema:
 *           type: string
 *           enum: [image, video, document, other]
 *         description: Filter by file type
 *     responses:
 *       200:
 *         description: Media files retrieved successfully
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
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;
    const mimeType = searchParams.get("mimeType") || undefined;
    const folder = searchParams.get("folder") || undefined;
    const fileType = searchParams.get("fileType") || undefined;

    const result = await MediaService.getAll({
      page,
      limit,
      search,
      mimeType,
      folder,
      fileType,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("获取媒体文件列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取媒体文件列表失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/media:
 *   post:
 *     summary: Create media file record
 *     description: Create a new media file record in the database
 *     tags:
 *       - Media
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *               - originalName
 *               - mimeType
 *               - size
 *               - url
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Stored filename
 *               originalName:
 *                 type: string
 *                 description: Original filename
 *               mimeType:
 *                 type: string
 *                 description: MIME type (e.g., image/jpeg)
 *               size:
 *                 type: integer
 *                 description: File size in bytes
 *               url:
 *                 type: string
 *                 description: File URL
 *               alt:
 *                 type: string
 *                 description: Alternative text
 *               caption:
 *                 type: string
 *                 description: File caption
 *               folder:
 *                 type: string
 *                 description: Folder path
 *     responses:
 *       200:
 *         description: Media file created successfully
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
 *                   example: 媒体文件创建成功
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
    const validatedData = CreateMediaFileSchema.parse(body);

    const mediaFile = await MediaService.create(validatedData);

    return NextResponse.json({
      success: true,
      data: mediaFile,
      message: "媒体文件创建成功",
    });
  } catch (error) {
    console.error("创建媒体文件失败:", error);

    return NextResponse.json(
      { success: false, error: "创建媒体文件失败" },
      { status: 500 },
    );
  }
}
