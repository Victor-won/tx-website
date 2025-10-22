"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { ImageUpload } from "../../../../components/ui/image-upload";
import { RichTextEditor } from "../../../../components/ui/rich-text-editor";

export const dynamic = "force-dynamic";

interface Post {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  content: string;
  contentEn?: string;
  excerpt?: string;
  excerptEn?: string;
  featuredImage?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorId: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    name?: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FormData {
  title: string;
  titleEn: string;
  slug: string;
  content: string;
  contentEn: string;
  excerpt: string;
  excerptEn: string;
  featuredImage: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
}

export default function PostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "zh";
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [formData, setFormData] = useState<FormData>({
    title: "",
    titleEn: "",
    slug: "",
    content: "",
    contentEn: "",
    excerpt: "",
    excerptEn: "",
    featuredImage: "",
    status: "DRAFT",
    categoryId: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [translating, setTranslating] = useState(false);
  const [translatingField, setTranslatingField] = useState<string | null>(null);
  const [translationProgress, setTranslationProgress] = useState({
    current: 0,
    total: 0,
    field: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts();
      fetchCategories();
    }
  }, [status, pagination.page, searchTerm, statusFilter, categoryFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("categoryId", categoryFilter);

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.data);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("获取文章列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?limit=100");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("获取分类列表失败:", error);
    }
  };

  const handleCreatePost = async () => {
    setFormErrors({});

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || undefined,
          authorId: session?.user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsCreateOpen(false);
        resetForm();
        fetchPosts();
      } else {
        alert(data.error || "创建文章失败");
      }
    } catch (error) {
      console.error("创建文章失败:", error);
      alert("创建文章失败");
    }
  };

  const handleUpdatePost = async () => {
    if (!currentPost) return;
    setFormErrors({});

    try {
      const response = await fetch(`/api/posts/${currentPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditOpen(false);
        setCurrentPost(null);
        resetForm();
        fetchPosts();
      } else {
        alert(data.error || "更新文章失败");
      }
    } catch (error) {
      console.error("更新文章失败:", error);
      alert("更新文章失败");
    }
  };

  const handleDeletePost = async () => {
    if (!currentPost) return;

    try {
      const response = await fetch(`/api/posts/${currentPost.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setIsDeleteOpen(false);
        setCurrentPost(null);
        fetchPosts();
      } else {
        alert(data.error || "删除文章失败");
      }
    } catch (error) {
      console.error("删除文章失败:", error);
      alert("删除文章失败");
    }
  };

  const handleCopyPost = async (post: Post) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${post.title} (副本)`,
          titleEn: post.titleEn ? `${post.titleEn} (Copy)` : "",
          slug: `${post.slug}-copy-${Date.now()}`,
          content: post.content,
          contentEn: post.contentEn || "",
          excerpt: post.excerpt || "",
          excerptEn: post.excerptEn || "",
          featuredImage: post.featuredImage || "",
          status: "DRAFT",
          categoryId: post.categoryId || undefined,
          authorId: session?.user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("文章复制成功！");
        fetchPosts();
      } else {
        alert(data.error || "复制文章失败");
      }
    } catch (error) {
      console.error("复制文章失败:", error);
      alert("复制文章失败");
    }
  };

  const handleViewPost = (slug: string) => {
    window.open(`/${locale}/posts/${slug}`, "_blank");
  };

  const openEditDialog = (post: Post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      titleEn: post.titleEn || "",
      slug: post.slug,
      content: post.content,
      contentEn: post.contentEn || "",
      excerpt: post.excerpt || "",
      excerptEn: post.excerptEn || "",
      featuredImage: post.featuredImage || "",
      status: post.status,
      categoryId: post.categoryId || "",
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (post: Post) => {
    setCurrentPost(post);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleEn: "",
      slug: "",
      content: "",
      contentEn: "",
      excerpt: "",
      excerptEn: "",
      featuredImage: "",
      status: "DRAFT",
      categoryId: "",
    });
    setFormErrors({});
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  };

  const handleTitleEnChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      titleEn: value,
      slug: prev.title ? generateSlug(prev.title) : generateSlug(value),
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      DRAFT: "bg-gray-100 text-gray-800",
      PUBLISHED: "bg-green-100 text-green-800",
      ARCHIVED: "bg-red-100 text-red-800",
    };
    const statusLabels = {
      DRAFT: "草稿",
      PUBLISHED: "已发布",
      ARCHIVED: "已归档",
    };
    return (
      <span
        className={`px-2 py-1 text-xs rounded ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  const handleAutoTranslate = async (force = false) => {
    if (!formData.title && !formData.content && !formData.excerpt) {
      alert("请先填写中文内容");
      return;
    }

    setTranslating(true);
    setTranslationProgress({ current: 0, total: 0, field: "" });

    try {
      const toTranslate = [];

      // 收集需要翻译的字段
      if (formData.title && (force || !formData.titleEn)) {
        toTranslate.push({ field: "title", text: formData.title, target: "titleEn" });
      }
      if (formData.excerpt && (force || !formData.excerptEn)) {
        toTranslate.push({ field: "excerpt", text: formData.excerpt, target: "excerptEn" });
      }
      if (formData.content && (force || !formData.contentEn)) {
        toTranslate.push({ field: "content", text: formData.content, target: "contentEn" });
      }

      if (toTranslate.length === 0) {
        alert("所有字段都已翻译！如需重新翻译,请先清空英文内容或使用独立翻译按钮。");
        setTranslating(false);
        return;
      }

      setTranslationProgress({ current: 0, total: toTranslate.length, field: "" });

      // 逐个翻译并更新进度
      for (let i = 0; i < toTranslate.length; i++) {
        const item = toTranslate[i];
        setTranslationProgress({ current: i, total: toTranslate.length, field: item.field });

        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: item.text, targetLang: "en" }),
        });

        const result = await response.json();

        if (result.success && result.data?.translatedText) {
          setFormData((prev) => ({
            ...prev,
            [item.target]: result.data.translatedText,
          }));
        }
      }

      setTranslationProgress({ current: toTranslate.length, total: toTranslate.length, field: "" });
      alert("翻译完成！");
    } catch (error) {
      console.error("翻译失败:", error);
      alert("翻译失败，请稍后重试");
    } finally {
      setTranslating(false);
      setTranslatingField(null);
    }
  };

  const handleTranslateField = async (sourceField: keyof FormData, targetField: keyof FormData, fieldName: string) => {
    const sourceText = formData[sourceField] as string;

    if (!sourceText) {
      alert(`请先填写${fieldName}(中文)`);
      return;
    }

    // 如果目标字段已有内容,询问是否覆盖
    if (formData[targetField] && !confirm(`${fieldName}的英文版本已存在,是否重新翻译并覆盖?`)) {
      return;
    }

    setTranslatingField(fieldName);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, targetLang: "en" }),
      });

      const result = await response.json();

      if (result.success && result.data?.translatedText) {
        setFormData((prev) => ({
          ...prev,
          [targetField]: result.data.translatedText,
        }));
        alert(`${fieldName}翻译完成！`);
      } else {
        alert(`${fieldName}翻译失败`);
      }
    } catch (error) {
      console.error("翻译失败:", error);
      alert(`${fieldName}翻译失败，请稍后重试`);
    } finally {
      setTranslatingField(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">文章管理</h1>
        <p className="text-gray-600">管理您的文章内容</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="搜索文章标题..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        >
          <option value="">全部状态</option>
          <option value="DRAFT">草稿</option>
          <option value="PUBLISHED">已发布</option>
          <option value="ARCHIVED">已归档</option>
        </select>
        <select
          className="px-4 py-2 border rounded-lg"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        >
          <option value="">全部分类</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <button
              onClick={() => {
                resetForm();
                setIsCreateOpen(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              新建文章
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>新建文章</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    标题 (中文) *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium">
                      Title (English)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateField("title", "titleEn", "标题")}
                      disabled={translatingField === "标题" || !formData.title}
                      className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {translatingField === "标题" ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          翻译中
                        </>
                      ) : (
                        <>
                          🌐 翻译
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={formData.titleEn}
                    onChange={(e) => handleTitleEnChange(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded bg-gray-50"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
                {formErrors.slug && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.slug}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    摘要 (中文)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium">
                      Excerpt (English)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateField("excerpt", "excerptEn", "摘要")}
                      disabled={translatingField === "摘要" || !formData.excerpt}
                      className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {translatingField === "摘要" ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          翻译中
                        </>
                      ) : (
                        <>
                          🌐 翻译
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                    value={formData.excerptEn}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerptEn: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleAutoTranslate()}
                  disabled={translating}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {translating ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      翻译中 {translationProgress.total > 0 && `(${translationProgress.current}/${translationProgress.total})`}
                    </>
                  ) : (
                    <>
                      🌐 批量翻译所有字段
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    内容 (中文) *
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: value,
                      }))
                    }
                    placeholder="输入中文内容..."
                  />
                  {formErrors.content && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.content}
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium">
                      Content (English)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateField("content", "contentEn", "内容")}
                      disabled={translatingField === "内容" || !formData.content}
                      className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {translatingField === "内容" ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          翻译中
                        </>
                      ) : (
                        <>
                          🌐 翻译
                        </>
                      )}
                    </button>
                  </div>
                  <RichTextEditor
                    value={formData.contentEn}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        contentEn: value,
                      }))
                    }
                    placeholder="Enter English content..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  封面图片
                </label>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      featuredImage: url,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    分类
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                  >
                    <option value="">无分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    状态
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as FormData["status"],
                      }))
                    }
                  >
                    <option value="DRAFT">草稿</option>
                    <option value="PUBLISHED">已发布</option>
                    <option value="ARCHIVED">已归档</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                创建
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                作者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  暂无文章
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.featuredImage && (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        {post.titleEn && (
                          <div className="text-sm text-gray-500">
                            {post.titleEn}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.category?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.author?.name || post.author?.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewPost(post.slug)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="在新标签页中查看前台详情页"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => openEditDialog(post)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleCopyPost(post)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      复制
                    </button>
                    <button
                      onClick={() => openDeleteDialog(post)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="px-4 py-2">
            第 {pagination.page} / {pagination.totalPages} 页
          </span>
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>编辑文章</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  标题 (中文) *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.title}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={formData.titleEn}
                  onChange={(e) => handleTitleEnChange(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Slug *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded bg-gray-50"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
              />
              {formErrors.slug && (
                <p className="text-red-500 text-sm mt-1">{formErrors.slug}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  摘要 (中文)
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Excerpt (English)
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                  value={formData.excerptEn}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerptEn: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleAutoTranslate()}
                disabled={translating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {translating ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    翻译中...
                  </>
                ) : (
                  <>
                    🌐 自动翻译为英文
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  内容 (中文) *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: value,
                    }))
                  }
                  placeholder="输入中文内容..."
                />
                {formErrors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.content}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Content (English)
                </label>
                <RichTextEditor
                  value={formData.contentEn}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      contentEn: value,
                    }))
                  }
                  placeholder="Enter English content..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                封面图片
              </label>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    featuredImage: url,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  分类
                </label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                >
                  <option value="">无分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  状态
                </label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as FormData["status"],
                    }))
                  }
                >
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">已发布</option>
                  <option value="ARCHIVED">已归档</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                setIsEditOpen(false);
                setCurrentPost(null);
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              取消
            </button>
            <button
              onClick={handleUpdatePost}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              保存
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            确定要删除文章 &quot;{currentPost?.title}&quot; 吗？此操作无法撤销。
          </p>
          <DialogFooter>
            <button
              onClick={() => {
                setIsDeleteOpen(false);
                setCurrentPost(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              取消
            </button>
            <button
              onClick={handleDeletePost}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              删除
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
