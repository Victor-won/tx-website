"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "开始输入内容...",
}: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none p-4",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("仅支持图片格式 (JPEG, PNG, GIF, WebP)");
      return;
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("文件大小不能超过 5MB");
      return;
    }

    // 上传文件
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        editor.chain().focus().setImage({ src: data.data.url }).run();
      } else {
        alert(data.error || "上传失败");
      }
    } catch (error) {
      console.error("上传失败:", error);
      alert("上传失败");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addImage = () => {
    // 触发文件选择
    fileInputRef.current?.click();
  };

  const addImageByUrl = () => {
    const url = window.prompt("输入图片URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt("输入链接URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        {uploading && (
          <div className="w-full mb-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            上传图片中...
          </div>
        )}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
          title="粗体"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
          title="斜体"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("strike") ? "bg-gray-300" : ""
          }`}
          title="删除线"
        >
          <s>S</s>
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
          }`}
          title="标题1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
          }`}
          title="标题2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""
          }`}
          title="标题3"
        >
          H3
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("bulletList") ? "bg-gray-300" : ""
          }`}
          title="无序列表"
        >
          • 列表
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("orderedList") ? "bg-gray-300" : ""
          }`}
          title="有序列表"
        >
          1. 列表
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("blockquote") ? "bg-gray-300" : ""
          }`}
          title="引用"
        >
          &quot;
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("codeBlock") ? "bg-gray-300" : ""
          }`}
          title="代码块"
        >
          &lt;/&gt;
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            editor.isActive("link") ? "bg-gray-300" : ""
          }`}
          title="链接"
        >
          🔗
        </button>
        <div className="relative inline-block">
          <button
            type="button"
            onClick={addImage}
            disabled={uploading}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="上传图片"
          >
            🖼️ 上传
          </button>
        </div>
        <button
          type="button"
          onClick={addImageByUrl}
          disabled={uploading}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="图片URL"
        >
          🔗 URL
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded hover:bg-gray-200"
          title="分割线"
        >
          ―
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
          title="撤销"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
          title="重做"
        >
          ↷
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
