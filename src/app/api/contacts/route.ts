import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { ContactStatus } from "@prisma/client";

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts (Admin only)
 *     description: Retrieve a paginated list of contact messages
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, REPLIED, RESOLVED, ARCHIVED]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const statusParam = searchParams.get("status");
    const status = statusParam ? (statusParam as ContactStatus) : undefined;
    const search = searchParams.get("search") || undefined;

    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { company: { contains: search } },
          { subject: { contains: search } },
        ],
      }),
    };

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取联系列表失败:", error);
    return NextResponse.json(
      { success: false, error: "获取联系列表失败" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Submit a contact message
 *     description: Create a new contact message from website visitors
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact message submitted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message } = body;

    // 基本验证
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "请填写所有必填字段" },
        { status: 400 },
      );
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "邮箱格式不正确" },
        { status: 400 },
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject,
        message,
        status: ContactStatus.PENDING,
      },
    });

    // 这里可以添加发送邮件通知的逻辑
    // await sendEmailNotification(contact);

    return NextResponse.json({
      success: true,
      data: contact,
      message: "留言提交成功，我们会尽快与您联系",
    });
  } catch (error) {
    console.error("提交留言失败:", error);
    return NextResponse.json(
      { success: false, error: "提交留言失败，请稍后重试" },
      { status: 500 },
    );
  }
}
