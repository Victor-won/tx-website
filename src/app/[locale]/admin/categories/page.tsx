"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { pinyin } from "pinyin-pro";

export const dynamic = "force-dynamic";

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  description: string | null;
  descriptionEn: string | null;
  image: string | null;
  model: "POST" | "PRODUCT";
  parentId: string | null;
  parent?: {
    id: string;
    name: string;
    model: "POST" | "PRODUCT";
  } | null;
  children?: Category[];
  _count?: {
    posts: number;
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  image: string;
  model: "POST" | "PRODUCT";
  parentId: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    nameEn: "",
    slug: "",
    description: "",
    descriptionEn: "",
    image: "",
    model: "POST",
    parentId: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchAllCategories();
  }, [currentPage, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/categories?${params}`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("获取分类列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await fetch("/api/categories?limit=1000");
      const data = await response.json();
      if (data.success) {
        setAllCategories(data.data);
      }
    } catch (error) {
      console.error("获取所有分类失败:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      const promises = [];

      // 翻译名称
      if (formData.name && !formData.nameEn) {
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: formData.name, targetLang: "en" }),
          }).then((res) => res.json())
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      // 翻译描述
      if (formData.description && !formData.descriptionEn) {
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: formData.description,
              targetLang: "en",
            }),
          }).then((res) => res.json())
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      const [nameResult, descriptionResult] = await Promise.all(promises);

      setFormData((prev) => ({
        ...prev,
        nameEn: nameResult?.data?.translatedText || prev.nameEn,
        descriptionEn:
          descriptionResult?.data?.translatedText || prev.descriptionEn,
      }));
    } catch (error) {
      console.error("翻译失败:", error);
      alert("翻译失败，请重试");
    } finally {
      setTranslating(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        name: formData.name,
        nameEn: formData.nameEn || undefined,
        slug: formData.slug,
        description: formData.description || undefined,
        descriptionEn: formData.descriptionEn || undefined,
        image: formData.image || undefined,
        model: formData.model,
        parentId: formData.parentId || null,
      };

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          nameEn: "",
          slug: "",
          description: "",
          descriptionEn: "",
          image: "",
          model: "POST",
          parentId: "",
        });
        fetchCategories();
        fetchAllCategories();
      } else {
        alert(data.error || "创建分类失败");
      }
    } catch (error) {
      console.error("创建分类失败:", error);
      alert("创建分类失败");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setFormLoading(true);

    try {
      const payload = {
        name: formData.name,
        nameEn: formData.nameEn || "",
        slug: formData.slug,
        description: formData.description || "",
        descriptionEn: formData.descriptionEn || "",
        image: formData.image || "",
        model: formData.model,
        parentId: formData.parentId || null,
      };

      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
        setFormData({
          name: "",
          nameEn: "",
          slug: "",
          description: "",
          descriptionEn: "",
          image: "",
          model: "POST",
          parentId: "",
        });
        fetchCategories();
        fetchAllCategories();
      } else {
        alert(data.error || "更新分类失败");
      }
    } catch (error) {
      console.error("更新分类失败:", error);
      alert("更新分类失败");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setFormLoading(true);

    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
        fetchCategories();
        fetchAllCategories();
      } else {
        alert(data.error || "删除分类失败");
      }
    } catch (error) {
      console.error("删除分类失败:", error);
      alert("删除分类失败");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      nameEn: category.nameEn || "",
      slug: category.slug,
      description: category.description || "",
      descriptionEn: category.descriptionEn || "",
      image: category.image || "",
      model: category.model,
      parentId: category.parentId || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    // 检测是否包含中文字符
    const hasChinese = /[\u4e00-\u9fa5]/.test(name);

    if (hasChinese) {
      // 将中文转换为拼音
      const pinyinText = pinyin(name, {
        toneType: 'none', // 不带声调
        type: 'array', // 返回数组
      }).join('');

      return pinyinText
        .toLowerCase()
        .replace(/\s+/g, '-') // 空格替换为连字符
        .replace(/[^\w\-]+/g, '') // 移除特殊字符
        .replace(/\-\-+/g, '-') // 多个连字符替换为单个
        .replace(/^-+/, '') // 移除开头的连字符
        .replace(/-+$/, ''); // 移除结尾的连字符
    }

    // 英文或其他字符的处理
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
          <p className="mt-1 text-sm text-gray-500">共 {total} 个分类</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ 新建分类</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>创建分类</DialogTitle>
              <DialogDescription>填写以下信息创建新分类</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1">
                <div className="flex justify-end mb-2">
                  <Button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={translating || formLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    {translating ? "翻译中..." : "🌐 自动翻译为英文"}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-name">分类名称 (中文) *</Label>
                  <Input
                    id="create-name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: generateSlug(name),
                      });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-name-en">分类名称 (英文)</Label>
                  <Input
                    id="create-name-en"
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder="Category Name (English)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-slug">Slug *</Label>
                  <Input
                    id="create-slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-description">描述 (中文)</Label>
                  <textarea
                    id="create-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
                    placeholder="分类描述..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-description-en">描述 (英文)</Label>
                  <textarea
                    id="create-description-en"
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionEn: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
                    placeholder="Category Description (English)..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-image">分类图片</Label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-model">分类模型 *</Label>
                  <select
                    id="create-model"
                    value={formData.model}
                    onChange={(e) => {
                      const newModel = e.target.value as "POST" | "PRODUCT";
                      setFormData({
                        ...formData,
                        model: newModel,
                        parentId: "" // 切换模型时清空父分类选择
                      });
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="POST">文章分类</option>
                    <option value="PRODUCT">产品分类</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-parent">父分类</Label>
                  <select
                    id="create-parent"
                    value={formData.parentId}
                    onChange={(e) =>
                      setFormData({ ...formData, parentId: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">无 (顶级分类)</option>
                    {allCategories
                      .filter((cat) => cat.model === formData.model)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.parent ? `  └─ ${cat.name}` : cat.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setFormData({
                      name: "",
                      nameEn: "",
                      slug: "",
                      description: "",
                      descriptionEn: "",
                      image: "",
                      model: "POST",
                      parentId: "",
                    });
                  }}
                  disabled={formLoading}
                >
                  取消
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "创建中..." : "创建"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索框 */}
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="搜索分类 (名称或描述)"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* 分类表格 */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                模型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                父分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                使用统计
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-10 h-10 rounded-md object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    category.model === "POST"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {category.model === "POST" ? "文章" : "产品"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.parent ? category.parent.name : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    文章: {category._count?.posts || 0} / 产品:{" "}
                    {category._count?.products || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditDialog(category)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => openDeleteDialog(category)}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            上一页
          </Button>
          <span className="text-sm text-gray-700">
            第 {currentPage} / {totalPages} 页
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            下一页
          </Button>
        </div>
      )}

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑分类</DialogTitle>
            <DialogDescription>修改分类信息</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="flex flex-col flex-1 overflow-hidden">
            <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1">
              <div className="flex justify-end mb-2">
                <Button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={translating || formLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  {translating ? "翻译中..." : "🌐 自动翻译为英文"}
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">分类名称 (中文) *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name-en">分类名称 (英文)</Label>
                <Input
                  id="edit-name-en"
                  value={formData.nameEn}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEn: e.target.value })
                  }
                  placeholder="Category Name (English)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug *</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">描述 (中文)</Label>
                <textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
                  placeholder="分类描述..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description-en">描述 (英文)</Label>
                <textarea
                  id="edit-description-en"
                  value={formData.descriptionEn}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionEn: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
                  placeholder="Category Description (English)..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">分类图片</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">分类模型 *</Label>
                <select
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) => {
                    const newModel = e.target.value as "POST" | "PRODUCT";
                    setFormData({
                      ...formData,
                      model: newModel,
                      parentId: "" // 切换模型时清空父分类选择
                    });
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="POST">文章分类</option>
                  <option value="PRODUCT">产品分类</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parent">父分类</Label>
                <select
                  id="edit-parent"
                  value={formData.parentId}
                  onChange={(e) =>
                    setFormData({ ...formData, parentId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">无 (顶级分类)</option>
                  {allCategories
                    .filter((cat) => cat.id !== selectedCategory?.id && cat.model === formData.model)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.parent ? `  └─ ${cat.name}` : cat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedCategory(null);
                  setFormData({
                    name: "",
                    nameEn: "",
                    slug: "",
                    description: "",
                    descriptionEn: "",
                    image: "",
                    model: "POST",
                    parentId: "",
                  });
                }}
                disabled={formLoading}
              >
                取消
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "更新中..." : "更新"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除分类 &quot;{selectedCategory?.name}&quot; 吗?
              此操作不可恢复。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCategory(null);
              }}
              disabled={formLoading}
            >
              取消
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={formLoading}
            >
              {formLoading ? "删除中..." : "删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
