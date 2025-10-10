import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { validateFile, saveFile, getFileType } from "../../../../../lib/upload";
import { MediaService } from "../../../../../services/mediaService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "无权限访问" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string | null;
    const alt = formData.get("alt") as string | null;
    const caption = formData.get("caption") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "未找到文件" },
        { status: 400 },
      );
    }

    // 验证文件
    const { fileType } = validateFile(file);

    // 保存文件
    const savedFile = await saveFile(file, folder || undefined);

    // 创建数据库记录
    const mediaFile = await MediaService.create({
      name: file.name,
      fileName: savedFile.fileName,
      url: savedFile.url,
      path: savedFile.filePath,
      mimeType: file.type,
      size: file.size,
      width: savedFile.width,
      height: savedFile.height,
      alt: alt || undefined,
      caption: caption || undefined,
      folder: folder || undefined,
      fileType,
      uploadedBy: session.user.id,
      isPublic: true,
    });

    return NextResponse.json({
      success: true,
      data: mediaFile,
      message: "文件上传成功",
    });
  } catch (error) {
    console.error("文件上传失败:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "文件上传失败" },
      { status: 500 },
    );
  }
}
