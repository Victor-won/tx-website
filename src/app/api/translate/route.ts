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
  // MyMemory API 限制单次请求最大 500 字符
  const MAX_LENGTH = 500;

  // 如果文本太长，需要分块翻译
  if (text.length > MAX_LENGTH) {
    return await translateLongText(text, targetLang);
  }

  const encodedText = encodeURIComponent(text);
  const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=zh|${targetLang}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Translation API error:", response.status, errorText);
    throw new Error(`Translation API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText;
  }

  if (data.responseStatus === 403) {
    throw new Error("翻译服务配额已用完，请稍后重试");
  }

  console.error("Translation API response:", data);
  throw new Error(data.responseDetails || "Translation failed");
}

// 翻译长文本（分块处理）
async function translateLongText(text: string, targetLang: string): Promise<string> {
  const MAX_LENGTH = 500;
  const chunks: string[] = [];

  // 按句子分割文本
  const sentences = text.split(/([。！？\n.!?]+)/);
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > MAX_LENGTH && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  // 翻译每个块（添加延迟避免速率限制）
  const translatedChunks: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    if (i > 0) {
      // 每次请求之间等待 1 秒，避免触发速率限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const encodedText = encodeURIComponent(chunks[i]);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=zh|${targetLang}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Translation API error (chunk ${i + 1}/${chunks.length}):`, response.status, errorText);
      throw new Error(`Translation failed at chunk ${i + 1}/${chunks.length}: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      translatedChunks.push(data.responseData.translatedText);
    } else if (data.responseStatus === 403) {
      throw new Error("翻译服务配额已用完，请稍后重试");
    } else {
      console.error(`Translation API response (chunk ${i + 1}/${chunks.length}):`, data);
      throw new Error(data.responseDetails || `Translation failed at chunk ${i + 1}/${chunks.length}`);
    }
  }

  return translatedChunks.join("");
}

// 翻译 HTML，保留结构和标签（特别是图片）
async function translateHtml(html: string, targetLang: string): Promise<string> {
  // 检查 HTML 长度，如果太长（超过 10000 字符），建议分段处理
  if (html.length > 10000) {
    throw new Error("HTML 内容过长（超过 10000 字符），建议分段翻译或使用专业翻译服务");
  }

  // 保存所有 HTML 标签的映射
  const tagMap: { [key: string]: string } = {};
  let tagCounter = 0;

  // 将所有 HTML 标签替换为占位符（使用数字和下划线，避免大小写问题）
  let processedHtml = html.replace(/<[^>]+>/g, (match) => {
    const placeholder = `__HTMLTAG${tagCounter}__`;
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

  // 翻译纯文本（会自动处理长文本分块）
  const translatedText = await translatePlainText(processedHtml, targetLang);

  // 将占位符还原为原始 HTML 标签（支持大小写不敏感的匹配，以及空格插入）
  let result = translatedText;
  for (const [placeholder, tag] of Object.entries(tagMap)) {
    // 创建一个灵活的正则表达式，可以匹配带有或不带空格的占位符
    // 例如：__HTMLTAG0__ 或 __ HTMLTAG0 __ 或 __htmltag0__ 或 __ htmltag 0 __
    // 将 __HTMLTAG0__ 转换为 __\s*HTMLTAG\s*0\s*__
    const flexiblePattern = placeholder
      .replace(/_/g, '_\\s*')  // 允许下划线后有空格
      .replace(/([A-Z]+)/g, '$1\\s*')  // 允许字母后有空格
      .replace(/(\d+)/g, '$1\\s*');  // 允许数字后有空格

    // 创建大小写不敏感的正则表达式
    const regex = new RegExp(flexiblePattern, 'gi');
    result = result.replace(regex, tag);
  }

  return result;
}

/**
 * @swagger
 * /api/translate:
 *   post:
 *     summary: Translate text
 *     description: Translate text from Chinese to target language (requires ADMIN role)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to translate (supports plain text and HTML)
 *               targetLang:
 *                 type: string
 *                 default: en
 *                 description: Target language code (e.g., en, es, fr)
 *     responses:
 *       200:
 *         description: Translation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     originalText:
 *                       type: string
 *                     translatedText:
 *                       type: string
 *                     targetLang:
 *                       type: string
 *       400:
 *         description: Bad request (empty text)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (requires ADMIN role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

    let errorMessage = "翻译失败，请稍后重试";

    if (error instanceof Error) {
      // 提供更具体的错误信息
      if (error.message.includes("配额已用完")) {
        errorMessage = "翻译服务配额已用完，请稍后重试";
      } else if (error.message.includes("内容过长")) {
        errorMessage = error.message;
      } else if (error.message.includes("chunk")) {
        errorMessage = "翻译长文本时出错，请尝试缩短文本或稍后重试";
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
