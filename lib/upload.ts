import { writeFile, mkdir } from "node:fs/promises";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { MediaFileType } from "../types/media";

// 文件类型配置
export const FILE_TYPE_CONFIG = {
  IMAGE: {
    mimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    maxSize: 10 * 1024 * 1024, // 10MB
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
  VIDEO: {
    mimeTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
    maxSize: 100 * 1024 * 1024, // 100MB
    extensions: [".mp4", ".webm", ".ogg", ".mov"],
  },
  AUDIO: {
    mimeTypes: ["audio/mpeg", "audio/ogg", "audio/wav", "audio/webm"],
    maxSize: 20 * 1024 * 1024, // 20MB
    extensions: [".mp3", ".ogg", ".wav", ".webm"],
  },
  DOCUMENT: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ],
    maxSize: 20 * 1024 * 1024, // 20MB
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt"],
  },
  ARCHIVE: {
    mimeTypes: ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed"],
    maxSize: 50 * 1024 * 1024, // 50MB
    extensions: [".zip", ".rar", ".7z"],
  },
};

// 危险文件扩展名黑名单
const DANGEROUS_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".pif",
  ".scr",
  ".vbs",
  ".js",
  ".jar",
  ".msi",
  ".app",
  ".deb",
  ".rpm",
  ".sh",
  ".php",
  ".asp",
  ".aspx",
  ".jsp",
];

export class UploadError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

/**
 * 获取文件类型
 */
export function getFileType(mimeType: string): MediaFileType {
  for (const [type, config] of Object.entries(FILE_TYPE_CONFIG)) {
    if (config.mimeTypes.includes(mimeType)) {
      return type as MediaFileType;
    }
  }
  return MediaFileType.OTHER;
}

/**
 * 验证文件安全性
 */
export function validateFileSecurity(file: File): void {
  const ext = path.extname(file.name).toLowerCase();

  // 检查危险文件扩展名
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    throw new UploadError(
      `不允许上传 ${ext} 类型的文件，存在安全风险`,
      "DANGEROUS_FILE_TYPE",
    );
  }

  // 检查文件名是否包含路径遍历字符
  if (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\")) {
    throw new UploadError("文件名包含非法字符", "INVALID_FILE_NAME");
  }
}

/**
 * 验证文件类型和大小
 */
export function validateFile(file: File): { fileType: MediaFileType; maxSize: number } {
  validateFileSecurity(file);

  const fileType = getFileType(file.type);
  const config = FILE_TYPE_CONFIG[fileType as keyof typeof FILE_TYPE_CONFIG];

  if (!config) {
    // 对于 OTHER 类型，使用默认限制
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new UploadError(
        `文件大小不能超过 10MB`,
        "FILE_TOO_LARGE",
      );
    }
    return {
      fileType: MediaFileType.OTHER,
      maxSize,
    };
  }

  // 验证 MIME 类型
  if (!config.mimeTypes.includes(file.type)) {
    throw new UploadError(
      `不支持的文件类型: ${file.type}`,
      "UNSUPPORTED_FILE_TYPE",
    );
  }

  // 验证文件扩展名
  const ext = path.extname(file.name).toLowerCase();
  if (!config.extensions.includes(ext)) {
    throw new UploadError(
      `不支持的文件扩展名: ${ext}`,
      "UNSUPPORTED_FILE_EXTENSION",
    );
  }

  // 验证文件大小
  if (file.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(2);
    throw new UploadError(
      `文件大小不能超过 ${maxSizeMB}MB`,
      "FILE_TOO_LARGE",
    );
  }

  return { fileType, maxSize: config.maxSize };
}

/**
 * 生成安全的文件名
 */
export function generateSafeFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 50);

  return `${timestamp}-${randomStr}-${baseName}${ext}`;
}

/**
 * 确保目录存在
 */
async function ensureDir(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * 保存文件到磁盘
 */
export async function saveFile(
  file: File,
  folder?: string,
): Promise<{
  fileName: string;
  filePath: string;
  url: string;
  width?: number;
  height?: number;
}> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = generateSafeFileName(file.name);
  const uploadDir = path.join(
    process.cwd(),
    "public/uploads",
    folder || "general",
  );

  await ensureDir(uploadDir);

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  // 生成URL
  const url = `/api/uploads/${folder || "general"}/${fileName}`;

  // 如果是图片，尝试获取尺寸
  let width: number | undefined;
  let height: number | undefined;

  if (file.type.startsWith("image/")) {
    try {
      // 这里可以使用图片处理库获取尺寸
      // 暂时返回 undefined
    } catch (error) {
      console.error("Failed to get image dimensions:", error);
    }
  }

  return {
    fileName,
    filePath: path.relative(process.cwd(), filePath),
    url,
    width,
    height,
  };
}

/**
 * 删除文件
 */
export async function deleteFile(filePath: string): Promise<void> {
  const fullPath = path.join(process.cwd(), filePath);
  if (existsSync(fullPath)) {
    await unlink(fullPath);
  }
}

/**
 * 批量删除文件
 */
export async function deleteFiles(filePaths: string[]): Promise<void> {
  await Promise.all(filePaths.map((filePath) => deleteFile(filePath)));
}
