import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { PostService } from "../../../../../services/postService";
import { UpdatePostSchema } from "../../../../../types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await PostService.getById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("获取文章详情失败:", error);
    return NextResponse.json(
      { success: false, error: "获取文章详情失败" },
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
    const validatedData = UpdatePostSchema.parse(body);

    const post = await PostService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: post,
      message: "文章更新成功",
    });
  } catch (error) {
    console.error("更新文章失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "文章slug已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "更新文章失败" },
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
    await PostService.delete(id);

    return NextResponse.json({
      success: true,
      message: "文章删除成功",
    });
  } catch (error) {
    console.error("删除文章失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "删除文章失败" },
      { status: 500 },
    );
  }
}
