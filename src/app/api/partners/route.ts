import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Get all partners
 *     tags:
 *       - Partners
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Partners retrieved successfully
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = {
      ...(status !== null && { status: status === "true" }),
    };

    const partners = await prisma.partner.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: partners,
    });
  } catch (error) {
    console.error("获取合作伙伴列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取合作伙伴列表失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Create a partner
 *     tags:
 *       - Partners
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - logo
 *             properties:
 *               name:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               logo:
 *                 type: string
 *               website:
 *                 type: string
 *               order:
 *                 type: integer
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Partner created successfully
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameEn, logo, website, order, status } = body;

    if (!name || !logo) {
      return NextResponse.json(
        { success: false, error: "请填写所有必填字段" },
        { status: 400 },
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        nameEn,
        logo,
        website,
        order: order || 0,
        status: status !== undefined ? status : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: partner,
      message: "合作伙伴创建成功",
    });
  } catch (error) {
    console.error("创建合作伙伴失败:", error);
    return NextResponse.json(
      { success: false, error: "创建合作伙伴失败" },
      { status: 500 },
    );
  }
}
