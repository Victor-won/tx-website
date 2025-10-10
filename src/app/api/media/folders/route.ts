import { NextRequest, NextResponse } from "next/server";
import { MediaService } from "../../../../../services/mediaService";

export async function GET(request: NextRequest) {
  try {
    const folders = await MediaService.getFolders();

    return NextResponse.json({
      success: true,
      data: folders,
    });
  } catch (error) {
    console.error("获取文件夹列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取文件夹列表失败" },
      { status: 500 },
    );
  }
}
