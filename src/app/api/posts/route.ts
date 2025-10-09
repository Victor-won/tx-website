import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { PostService } from "../../../../services/postService";
import { CreatePostSchema } from "../../../../types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;

    const result = await PostService.getAll({
      page,
      limit,
      search,
      status,
      categoryId,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取文章列表失败" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "无权限访问" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { authorId, ...postData } = body;

    if (!authorId) {
      return NextResponse.json(
        { success: false, error: "作者ID不能为空" },
        { status: 400 },
      );
    }

    const validatedData = CreatePostSchema.parse(postData);

    const post = await PostService.create({
      ...validatedData,
      authorId,
    });

    return NextResponse.json({
      success: true,
      data: post,
      message: "文章创建成功",
    });
  } catch (error) {
    console.error("创建文章失败:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "文章slug已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "创建文章失败" },
      { status: 500 },
    );
  }
}
