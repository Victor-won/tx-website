import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get all banners
 *     description: Retrieve all active banners ordered by order field
 *     tags:
 *       - Banners
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = {
      ...(status !== null && { status: status === "true" }),
    };

    const banners = await prisma.banner.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("获取轮播图列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取轮播图列表失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Create a new banner
 *     tags:
 *       - Banners
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               titleEn:
 *                 type: string
 *               description:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               highlight:
 *                 type: string
 *               highlightEn:
 *                 type: string
 *               image:
 *                 type: string
 *               buttonText:
 *                 type: string
 *               buttonTextEn:
 *                 type: string
 *               buttonLink:
 *                 type: string
 *               color:
 *                 type: string
 *               order:
 *                 type: integer
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Banner created successfully
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      highlight,
      highlightEn,
      image,
      buttonText,
      buttonTextEn,
      buttonLink,
      color,
      order,
      status,
    } = body;

    if (!title || !description || !image) {
      return NextResponse.json(
        { success: false, error: "请填写所有必填字段" },
        { status: 400 },
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        titleEn: titleEn || null,
        description,
        descriptionEn: descriptionEn || null,
        highlight: highlight || null,
        highlightEn: highlightEn || null,
        image,
        buttonText: buttonText || null,
        buttonTextEn: buttonTextEn || null,
        buttonLink: buttonLink || null,
        color: color || "from-blue-600 to-purple-700",
        order: order || 0,
        status: status !== undefined ? status : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: banner,
      message: "轮播图创建成功",
    });
  } catch (error) {
    console.error("创建轮播图失败:", error);
    return NextResponse.json(
      { success: false, error: "创建轮播图失败" },
      { status: 500 },
    );
  }
}
