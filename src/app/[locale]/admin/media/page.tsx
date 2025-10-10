"use client";

import { useEffect, useState, useRef } from "react";
import {
  Upload,
  Image,
  FileText,
  Film,
  Music,
  Archive,
  File,
  Trash2,
  Copy,
  Search,
  Filter,
  X,
  Check,
  Loader2,
  Download,
  Eye,
  FolderOpen
} from "lucide-react";

export const dynamic = "force-dynamic";

// 文件类型图标映射
const FILE_TYPE_ICONS = {
  IMAGE: Image,
  VIDEO: Film,
  AUDIO: Music,
  DOCUMENT: FileText,
  ARCHIVE: Archive,
  OTHER: File,
};

// 文件类型颜色映射
const FILE_TYPE_COLORS = {
  IMAGE: "text-blue-600",
  VIDEO: "text-purple-600",
  AUDIO: "text-green-600",
  DOCUMENT: "text-orange-600",
  ARCHIVE: "text-gray-600",
  OTHER: "text-gray-400",
};

interface MediaFile {
  id: string;
  name: string;
  fileName: string;
  url: string;
  path: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  folder?: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterFolder, setFilterFolder] = useState<string>("");
  const [folders, setFolders] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载文件列表
  const loadFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(searchTerm && { search: searchTerm }),
        ...(filterType && { fileType: filterType }),
        ...(filterFolder && { folder: filterFolder }),
      });

      const response = await fetch(`/api/media?${params}`);
      const data = await response.json();

      if (data.success) {
        setFiles(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("加载文件失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 加载文件夹列表
  const loadFolders = async () => {
    try {
      const response = await fetch("/api/media/folders");
      const data = await response.json();
      if (data.success) {
        setFolders(data.data);
      }
    } catch (error) {
      console.error("加载文件夹失败:", error);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [page, searchTerm, filterType, filterFolder]);

  useEffect(() => {
    loadFolders();
  }, []);

  // 文件上传处理
  const handleFileUpload = async (fileList: FileList) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      filesArray.forEach((file) => {
        formData.append("files", file);
      });

      const endpoint = filesArray.length === 1
        ? "/api/media/upload"
        : "/api/media/upload/batch";

      if (filesArray.length === 1) {
        formData.delete("files");
        formData.append("file", filesArray[0]);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || "上传成功");
        loadFiles();
        loadFolders();
      } else {
        alert(data.error || "上传失败");
      }
    } catch (error) {
      console.error("上传失败:", error);
      alert("上传失败");
    } finally {
      setUploading(false);
    }
  };

  // 删除选中文件
  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    if (!confirm(`确定要删除选中的 ${selectedFiles.size} 个文件吗?`)) {
      return;
    }

    try {
      const response = await fetch("/api/media/delete/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedFiles) }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setSelectedFiles(new Set());
        loadFiles();
      } else {
        alert(data.error || "删除失败");
      }
    } catch (error) {
      console.error("删除失败:", error);
      alert("删除失败");
    }
  };

  // 删除单个文件
  const handleDeleteFile = async (id: string) => {
    if (!confirm("确定要删除这个文件吗?")) return;

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        loadFiles();
      } else {
        alert(data.error || "删除失败");
      }
    } catch (error) {
      console.error("删除失败:", error);
      alert("删除失败");
    }
  };

  // 复制URL
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error("复制失败:", error);
      alert("复制失败");
    }
  };

  // 拖拽处理
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // 选择文件处理
  const toggleFileSelection = (id: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFiles(newSelected);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((f) => f.id)));
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">媒体库</h1>
          <p className="mt-1 text-sm text-gray-600">管理网站媒体文件</p>
        </div>

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "上传中..." : "上传文件"}
          </button>

          {selectedFiles.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              删除选中 ({selectedFiles.size})
            </button>
          )}
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索文件..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有类型</option>
          <option value="IMAGE">图片</option>
          <option value="VIDEO">视频</option>
          <option value="AUDIO">音频</option>
          <option value="DOCUMENT">文档</option>
          <option value="ARCHIVE">压缩包</option>
          <option value="OTHER">其他</option>
        </select>

        <select
          value={filterFolder}
          onChange={(e) => setFilterFolder(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有文件夹</option>
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
        </select>
      </div>

      {/* 拖拽上传区域 */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600">
          拖拽文件到此处上传,或{" "}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            点击选择文件
          </button>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          支持批量上传,单次最多20个文件
        </p>
      </div>

      {/* 文件列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          暂无文件
        </div>
      ) : (
        <>
          {/* 全选checkbox */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={selectedFiles.size === files.length && files.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {selectedFiles.size > 0
                ? `已选中 ${selectedFiles.size} 个文件`
                : "全选"}
            </span>
          </div>

          {/* 文件网格 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map((file) => {
              const Icon = FILE_TYPE_ICONS[file.fileType as keyof typeof FILE_TYPE_ICONS] || File;
              const colorClass = FILE_TYPE_COLORS[file.fileType as keyof typeof FILE_TYPE_COLORS] || "text-gray-400";
              const isSelected = selectedFiles.has(file.id);

              return (
                <div
                  key={file.id}
                  className={`relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                    isSelected ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {/* 选择checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFileSelection(file.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* 文件预览 */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    {file.fileType === "IMAGE" ? (
                      <img
                        src={file.url}
                        alt={file.alt || file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className={`w-16 h-16 ${colorClass}`} />
                    )}

                    {/* 悬浮操作按钮 */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                        title="预览"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleCopyUrl(file.url)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                        title="复制URL"
                      >
                        {copiedUrl === file.url ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-700" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* 文件信息 */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(file.size)}
                    </p>
                    {file.folder && (
                      <div className="flex items-center gap-1 mt-1">
                        <FolderOpen className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{file.folder}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="text-sm text-gray-600">
                第 {page} / {totalPages} 页
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}

      {/* 预览模态框 */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {previewFile.fileType === "IMAGE" ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.alt || previewFile.name}
                  className="w-full h-auto"
                />
              ) : (
                <div className="text-center py-12">
                  <File className="w-24 h-24 mx-auto text-gray-400" />
                  <p className="mt-4 text-gray-600">无法预览此文件类型</p>
                </div>
              )}

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">文件名:</span>
                  <span className="font-medium">{previewFile.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">大小:</span>
                  <span className="font-medium">{formatFileSize(previewFile.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">类型:</span>
                  <span className="font-medium">{previewFile.mimeType}</span>
                </div>
                {previewFile.width && previewFile.height && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">尺寸:</span>
                    <span className="font-medium">{previewFile.width} × {previewFile.height}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">URL:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-xs truncate">
                      {previewFile.url}
                    </code>
                    <button
                      onClick={() => handleCopyUrl(previewFile.url)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {copiedUrl === previewFile.url ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
