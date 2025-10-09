import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "无权限访问" },
        { status: 403 },
      );
    }

    const total = await prisma.user.count();

    return NextResponse.json({
      success: true,
      pagination: { total },
    });
  } catch (error) {
    console.error("获取用户统计失败:", error);
    return NextResponse.json(
      { success: false, error: "获取用户统计失败" },
      { status: 500 },
    );
  }
}
