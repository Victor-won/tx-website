import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      return NextResponse.json(
        { success: false, error: "合作伙伴不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: partner,
    });
  } catch (error) {
    console.error("获取合作伙伴失败:", error);
    return NextResponse.json(
      { success: false, error: "获取合作伙伴失败" },
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

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        ...body,
        nameEn: body.nameEn || null,
        website: body.website || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: partner,
      message: "更新成功",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "合作伙伴不存在" },
        { status: 404 }
      );
    }
    console.error("更新合作伙伴失败:", error);
    return NextResponse.json(
      { success: false, error: "更新合作伙伴失败" },
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
    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "删除成功",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "合作伙伴不存在" },
        { status: 404 }
      );
    }
    console.error("删除合作伙伴失败:", error);
    return NextResponse.json(
      { success: false, error: "删除合作伙伴失败" },
      { status: 500 }
    );
  }
}
