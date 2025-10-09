import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CategoryService } from "../../../../../services/categoryService";
import { UpdateCategorySchema } from "../../../../../types";
import { authOptions } from "../../../../../lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const category = await CategoryService.getById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "分类不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("获取分类详情失败:", error);
    return NextResponse.json(
      { success: false, error: "获取分类详情失败" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "无权限访问" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateCategorySchema.parse(body);

    const category = await CategoryService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: category,
      message: "分类更新成功",
    });
  } catch (error) {
    console.error("更新分类失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { success: false, error: "分类不存在" },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "分类slug已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "更新分类失败" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "无权限访问" },
        { status: 403 },
      );
    }

    const { id } = await params;
    await CategoryService.delete(id);

    return NextResponse.json({
      success: true,
      message: "分类删除成功",
    });
  } catch (error) {
    console.error("删除分类失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { success: false, error: "分类不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "删除分类失败" },
      { status: 500 },
    );
  }
}
