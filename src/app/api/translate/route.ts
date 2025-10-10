import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

// 使用免费的翻译服务 - 这里使用 MyMemory Translation API (免费，无需 API Key)
// 或者你可以替换为 Google Translate API, DeepL API 等
async function translateText(text: string, targetLang: string = "en"): Promise<string> {
  if (!text || text.trim() === "") {
    return "";
  }

  try {
    const isHtml = /<[^>]*>/.test(text);

    if (isHtml) {
      // 如果是 HTML，提取文本节点进行翻译，保留 HTML 结构
      return await translateHtml(text, targetLang);
    } else {
      // 纯文本直接翻译
      return await translatePlainText(text, targetLang);
    }
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

// 翻译纯文本
async function translatePlainText(text: string, targetLang: string): Promise<string> {
  const encodedText = encodeURIComponent(text);
  const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=zh|${targetLang}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error("Translation API request failed");
  }

  const data = await response.json();

  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText;
  }

  throw new Error("Translation failed");
}

// 翻译 HTML，保留结构和标签（特别是图片）
async function translateHtml(html: string, targetLang: string): Promise<string> {
  // 保存所有 HTML 标签的映射
  const tagMap: { [key: string]: string } = {};
  let tagCounter = 0;

  // 将所有 HTML 标签替换为占位符
  let processedHtml = html.replace(/<[^>]+>/g, (match) => {
    const placeholder = `{{TAG_${tagCounter}}}`;
    tagMap[placeholder] = match;
    tagCounter++;
    return placeholder;
  });

  // 清理多余的空格
  processedHtml = processedHtml.replace(/\s+/g, " ").trim();

  if (!processedHtml) {
    // 如果没有文本内容，直接返回原 HTML
    return html;
  }

  // 翻译纯文本
  const translatedText = await translatePlainText(processedHtml, targetLang);

  // 将占位符还原为原始 HTML 标签
  let result = translatedText;
  for (const [placeholder, tag] of Object.entries(tagMap)) {
    result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), tag);
  }

  return result;
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
    const { text, targetLang = "en" } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: "文本不能为空" },
        { status: 400 },
      );
    }

    const translatedText = await translateText(text, targetLang);

    return NextResponse.json({
      success: true,
      data: {
        originalText: text,
        translatedText,
        targetLang,
      },
    });
  } catch (error) {
    console.error("翻译失败:", error);
    return NextResponse.json(
      { success: false, error: "翻译失败，请稍后重试" },
      { status: 500 },
    );
  }
}
