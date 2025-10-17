import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const solution = await prisma.solution.findUnique({
      where: { id },
    });

    if (!solution) {
      return NextResponse.json(
        { success: false, error: "解决方案不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: solution,
    });
  } catch (error) {
    console.error("获取解决方案失败:", error);
    return NextResponse.json(
      { success: false, error: "获取解决方案失败" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const solution = await prisma.solution.update({
      where: { id },
      data: {
        ...body,
        titleEn: body.titleEn || null,
        descriptionEn: body.descriptionEn || null,
        features: body.features || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: solution,
      message: "更新成功",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "解决方案不存在" },
        { status: 404 }
      );
    }
    console.error("更新解决方案失败:", error);
    return NextResponse.json(
      { success: false, error: "更新解决方案失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.solution.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "删除成功",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "解决方案不存在" },
        { status: 404 }
      );
    }
    console.error("删除解决方案失败:", error);
    return NextResponse.json(
      { success: false, error: "删除解决方案失败" },
      { status: 500 }
    );
  }
}
