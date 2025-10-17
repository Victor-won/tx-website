import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *       404:
 *         description: Contact not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "联系记录不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("获取联系记录失败:", error);
    return NextResponse.json(
      { success: false, error: "获取联系记录失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update contact
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, REPLIED, RESOLVED, ARCHIVED]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({
      success: true,
      data: contact,
      message: "更新成功",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "联系记录不存在" },
        { status: 404 },
      );
    }
    console.error("更新联系记录失败:", error);
    return NextResponse.json(
      { success: false, error: "更新联系记录失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete contact
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "删除成功",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "联系记录不存在" },
        { status: 404 },
      );
    }
    console.error("删除联系记录失败:", error);
    return NextResponse.json(
      { success: false, error: "删除联系记录失败" },
      { status: 500 },
    );
  }
}
