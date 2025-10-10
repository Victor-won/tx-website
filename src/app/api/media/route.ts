import { NextRequest, NextResponse } from "next/server";
import { MediaService } from "../../../../services/mediaService";
import { CreateMediaFileSchema } from "../../../../types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;
    const mimeType = searchParams.get("mimeType") || undefined;
    const folder = searchParams.get("folder") || undefined;
    const fileType = searchParams.get("fileType") || undefined;

    const result = await MediaService.getAll({
      page,
      limit,
      search,
      mimeType,
      folder,
      fileType,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("获取媒体文件列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取媒体文件列表失败" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateMediaFileSchema.parse(body);

    const mediaFile = await MediaService.create(validatedData);

    return NextResponse.json({
      success: true,
      data: mediaFile,
      message: "媒体文件创建成功",
    });
  } catch (error) {
    console.error("创建媒体文件失败:", error);

    return NextResponse.json(
      { success: false, error: "创建媒体文件失败" },
      { status: 500 },
    );
  }
}
