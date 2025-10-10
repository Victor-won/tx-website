import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/auth";
import { MediaService } from "../../../../../../services/mediaService";
import { z } from "zod";

const BatchDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "至少选择一个文件"),
});

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
    const { ids } = BatchDeleteSchema.parse(body);

    // 限制批量删除数量
    if (ids.length > 50) {
      return NextResponse.json(
        { success: false, error: "单次最多删除50个文件" },
        { status: 400 },
      );
    }

    await MediaService.batchDelete(ids);

    return NextResponse.json({
      success: true,
      message: `成功删除 ${ids.length} 个文件`,
    });
  } catch (error) {
    console.error("批量删除失败:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "批量删除失败" },
      { status: 500 },
    );
  }
}
