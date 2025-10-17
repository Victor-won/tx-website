import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

/**
 * @swagger
 * /api/solutions:
 *   get:
 *     summary: Get all solutions
 *     description: Retrieve all active solutions ordered by order field
 *     tags:
 *       - Solutions
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Solutions retrieved successfully
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = {
      ...(status !== null && { status: status === "true" }),
    };

    const solutions = await prisma.solution.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: solutions,
    });
  } catch (error) {
    console.error("获取解决方案列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取解决方案列表失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/solutions:
 *   post:
 *     summary: Create a new solution
 *     tags:
 *       - Solutions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - icon
 *             properties:
 *               title:
 *                 type: string
 *               titleEn:
 *                 type: string
 *               description:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               iconBg:
 *                 type: string
 *               features:
 *                 type: object
 *               order:
 *                 type: integer
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Solution created successfully
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      icon,
      color,
      iconBg,
      features,
      order,
      status,
    } = body;

    if (!title || !description || !icon) {
      return NextResponse.json(
        { success: false, error: "请填写所有必填字段" },
        { status: 400 },
      );
    }

    const solution = await prisma.solution.create({
      data: {
        title,
        titleEn: titleEn || null,
        description,
        descriptionEn: descriptionEn || null,
        icon,
        color: color || "from-blue-500 to-blue-600",
        iconBg: iconBg || "bg-blue-600",
        features: features || null,
        order: order || 0,
        status: status !== undefined ? status : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: solution,
      message: "解决方案创建成功",
    });
  } catch (error) {
    console.error("创建解决方案失败:", error);
    return NextResponse.json(
      { success: false, error: "创建解决方案失败" },
      { status: 500 },
    );
  }
}
