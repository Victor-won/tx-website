import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/auth";
import { validateFile, saveFile, getFileType } from "../../../../../../lib/upload";
import { MediaService } from "../../../../../../services/mediaService";

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
    const files = formData.getAll("files") as File[];
    const folder = formData.get("folder") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "未找到文件" },
        { status: 400 },
      );
    }

    // 限制批量上传数量
    if (files.length > 20) {
      return NextResponse.json(
        { success: false, error: "单次最多上传20个文件" },
        { status: 400 },
      );
    }

    const results = {
      success: [],
      failed: [],
    };

    // 并发上传文件
    await Promise.all(
      files.map(async (file) => {
        try {
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
            folder: folder || undefined,
            fileType,
            uploadedBy: session.user.id,
            isPublic: true,
          });

          results.success.push({
            fileName: file.name,
            data: mediaFile,
          });
        } catch (error) {
          console.error(`上传文件 ${file.name} 失败:`, error);
          results.failed.push({
            fileName: file.name,
            error: error instanceof Error ? error.message : "上传失败",
          });
        }
      }),
    );

    const hasErrors = results.failed.length > 0;
    const message = hasErrors
      ? `成功上传 ${results.success.length} 个文件, ${results.failed.length} 个失败`
      : `成功上传 ${results.success.length} 个文件`;

    return NextResponse.json({
      success: results.failed.length === 0,
      data: results,
      message,
    });
  } catch (error) {
    console.error("批量上传失败:", error);

    return NextResponse.json(
      { success: false, error: "批量上传失败" },
      { status: 500 },
    );
  }
}
