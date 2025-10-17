import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

/**
 * GET single banner by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { success: false, error: "轮播图不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error("获取轮播图失败:", error);
    return NextResponse.json(
      { success: false, error: "获取轮播图失败" },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update banner
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...body,
        titleEn: body.titleEn || null,
        descriptionEn: body.descriptionEn || null,
        highlight: body.highlight || null,
        highlightEn: body.highlightEn || null,
        buttonText: body.buttonText || null,
        buttonTextEn: body.buttonTextEn || null,
        buttonLink: body.buttonLink || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: banner,
      message: "更新成功",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "轮播图不存在" },
        { status: 404 }
      );
    }
    console.error("更新轮播图失败:", error);
    return NextResponse.json(
      { success: false, error: "更新轮播图失败" },
      { status: 500 }
    );
  }
}

/**
 * DELETE banner
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "删除成功",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "轮播图不存在" },
        { status: 404 }
      );
    }
    console.error("删除轮播图失败:", error);
    return NextResponse.json(
      { success: false, error: "删除轮播图失败" },
      { status: 500 }
    );
  }
}
