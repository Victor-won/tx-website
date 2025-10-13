import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload image for categories
 *     description: Upload an image file for category use (requires ADMIN role)
 *     tags:
 *       - Media
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
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
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: /api/uploads/categories/1234567890-abc123.jpg
 *                     filename:
 *                       type: string
 *                     size:
 *                       type: integer
 *                     type:
 *                       type: string
 *       400:
 *         description: Bad request (no file, invalid type, size exceeded)
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "未找到文件" },
        { status: 400 },
      );
    }

    // 验证文件类型
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "仅支持图片格式 (JPEG, PNG, GIF, WebP)" },
        { status: 400 },
      );
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "文件大小不能超过 5MB" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.name);
    const filename = `${timestamp}-${randomStr}${ext}`;

    // 保存文件
    const uploadDir = path.join(process.cwd(), "public/uploads/categories");
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // 返回相对URL (通过API路由访问)
    const url = `/api/uploads/categories/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error("文件上传失败:", error);
    return NextResponse.json(
      { success: false, error: "文件上传失败" },
      { status: 500 },
    );
  }
}
