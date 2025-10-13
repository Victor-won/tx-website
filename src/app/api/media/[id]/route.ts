import { NextRequest, NextResponse } from "next/server";
import { MediaService } from "../../../../../services/mediaService";
import { UpdateMediaFileSchema } from "../../../../../types";

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Get media file by ID
 *     description: Retrieve a single media file by its ID
 *     tags:
 *       - Media
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media file ID
 *     responses:
 *       200:
 *         description: Media file retrieved successfully
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
 *         description: Media file not found
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
    const mediaFile = await MediaService.getById(id);

    if (!mediaFile) {
      return NextResponse.json(
        { success: false, error: "媒体文件不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: mediaFile,
    });
  } catch (error) {
    console.error("获取媒体文件详情失败:", error);
    return NextResponse.json(
      { success: false, error: "获取媒体文件详情失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/media/{id}:
 *   put:
 *     summary: Update media file
 *     description: Update an existing media file record
 *     tags:
 *       - Media
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alt:
 *                 type: string
 *               caption:
 *                 type: string
 *               folder:
 *                 type: string
 *     responses:
 *       200:
 *         description: Media file updated successfully
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
 *                   example: 媒体文件更新成功
 *       404:
 *         description: Media file not found
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
    const validatedData = UpdateMediaFileSchema.parse(body);

    const mediaFile = await MediaService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: mediaFile,
      message: "媒体文件更新成功",
    });
  } catch (error) {
    console.error("更新媒体文件失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { success: false, error: "媒体文件不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "更新媒体文件失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Delete media file
 *     description: Delete a media file by ID
 *     tags:
 *       - Media
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media file ID
 *     responses:
 *       200:
 *         description: Media file deleted successfully
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
 *                   example: 媒体文件删除成功
 *       404:
 *         description: Media file not found
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
    await MediaService.delete(id);

    return NextResponse.json({
      success: true,
      message: "媒体文件删除成功",
    });
  } catch (error) {
    console.error("删除媒体文件失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { success: false, error: "媒体文件不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "删除媒体文件失败" },
      { status: 500 },
    );
  }
}
