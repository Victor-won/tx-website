import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "../../../../../services/productService";
import { UpdateProductSchema } from "../../../../../types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await ProductService.getById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "产品不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("获取产品详情失败:", error);
    return NextResponse.json(
      { success: false, error: "获取产品详情失败" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateProductSchema.parse(body);

    const product = await ProductService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: product,
      message: "产品更新成功",
    });
  } catch (error) {
    console.error("更新产品失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { success: false, error: "产品不存在" },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "产品slug或SKU已存在" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "更新产品失败" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await ProductService.delete(id);

    return NextResponse.json({
      success: true,
      message: "产品删除成功",
    });
  } catch (error) {
    console.error("删除产品失败:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { success: false, error: "产品不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "删除产品失败" },
      { status: 500 },
    );
  }
}
