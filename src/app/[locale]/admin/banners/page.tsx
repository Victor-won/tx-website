"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
} from "lucide-react";

interface Banner {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  highlight: string | null;
  highlightEn: string | null;
  image: string;
  buttonText: string | null;
  buttonTextEn: string | null;
  buttonLink: string | null;
  color: string;
  order: number;
  status: boolean;
}

export default function AdminBannersPage() {
  const locale = useLocale();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Banner>>({});
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/banners");
      const data = await response.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error("获取轮播图失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setIsCreating(false);
    setFormData(banner);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      highlight: "",
      highlightEn: "",
      image: "",
      buttonText: "",
      buttonTextEn: "",
      buttonLink: "",
      color: "from-blue-600 to-purple-700",
      order: 0,
      status: true,
    });
  };

  const handleSave = async () => {
    if (!editingId && !isCreating) return;

    try {
      if (isCreating) {
        // Create new banner
        const response = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchBanners();
          setIsCreating(false);
          setFormData({});
        }
      } else {
        // Update existing banner
        const response = await fetch(`/api/banners/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchBanners();
          setEditingId(null);
          setFormData({});
        }
      }
    } catch (error) {
      console.error("保存失败:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === "zh" ? "确定要删除吗？" : "Are you sure?")) {
      return;
    }

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBanners();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...banner, status: !banner.status }),
      });

      if (response.ok) {
        await fetchBanners();
      }
    } catch (error) {
      console.error("更新状态失败:", error);
    }
  };

  const handleAutoTranslate = async () => {
    // 检查是否有需要翻译的内容
    const hasContent =
      formData.title ||
      formData.description ||
      formData.highlight ||
      formData.buttonText;

    if (!hasContent) {
      alert(locale === "zh" ? "请先填写需要翻译的中文内容" : "Please fill in Chinese content first");
      return;
    }

    setTranslating(true);
    console.log("开始自动翻译...");

    try {
      type TranslateResult = { field: string; data: any };

      const promises: Promise<TranslateResult>[] = [];

      // 翻译标题
      if (formData.title) {
        console.log("准备翻译标题:", formData.title);
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: formData.title,
              targetLang: "en",
            }),
          }).then(async (res) => {
            const data = await res.json();
            console.log("标题翻译结果:", data);
            return { field: "title", data };
          })
        );
      }

      // 翻译描述
      if (formData.description) {
        console.log("准备翻译描述:", formData.description);
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: formData.description,
              targetLang: "en",
            }),
          }).then(async (res) => {
            const data = await res.json();
            console.log("描述翻译结果:", data);
            return { field: "description", data };
          })
        );
      }

      // 翻译高亮标签
      if (formData.highlight) {
        console.log("准备翻译高亮标签:", formData.highlight);
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: formData.highlight,
              targetLang: "en",
            }),
          }).then(async (res) => {
            const data = await res.json();
            console.log("高亮标签翻译结果:", data);
            return { field: "highlight", data };
          })
        );
      }

      // 翻译按钮文本
      if (formData.buttonText) {
        console.log("准备翻译按钮文本:", formData.buttonText);
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: formData.buttonText,
              targetLang: "en",
            }),
          }).then(async (res) => {
            const data = await res.json();
            console.log("按钮文本翻译结果:", data);
            return { field: "buttonText", data };
          })
        );
      }

      console.log(`等待所有翻译完成... (共 ${promises.length} 个请求)`);
      const results = await Promise.all(promises);
      console.log("所有翻译完成:", results);

      // 更新表单数据
      const updates: Partial<Banner> = {};
      let translatedCount = 0;
      let failedFields: string[] = [];

      results.forEach((result) => {
        if (!result) return;

        if (result.data?.success && result.data?.data?.translatedText) {
          if (result.field === "title") {
            updates.titleEn = result.data.data.translatedText;
            translatedCount++;
          } else if (result.field === "description") {
            updates.descriptionEn = result.data.data.translatedText;
            translatedCount++;
          } else if (result.field === "highlight") {
            updates.highlightEn = result.data.data.translatedText;
            translatedCount++;
          } else if (result.field === "buttonText") {
            updates.buttonTextEn = result.data.data.translatedText;
            translatedCount++;
          }
        } else {
          const fieldNameMap: Record<string, string> = {
            title: locale === "zh" ? "标题" : "Title",
            description: locale === "zh" ? "描述" : "Description",
            highlight: locale === "zh" ? "高亮标签" : "Highlight",
            buttonText: locale === "zh" ? "按钮文本" : "Button Text",
          };
          failedFields.push(fieldNameMap[result.field] || result.field);
        }
      });

      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));

      console.log("翻译完成，更新了", translatedCount, "个字段");

      // 显示结果
      if (translatedCount > 0 && failedFields.length === 0) {
        alert(
          locale === "zh"
            ? `翻译成功！已翻译 ${translatedCount} 个字段`
            : `Translation successful! Translated ${translatedCount} fields`
        );
      } else if (translatedCount > 0 && failedFields.length > 0) {
        alert(
          locale === "zh"
            ? `部分翻译成功！已翻译 ${translatedCount} 个字段\n失败字段: ${failedFields.join(", ")}`
            : `Partial translation successful! Translated ${translatedCount} fields\nFailed fields: ${failedFields.join(", ")}`
        );
      } else {
        alert(
          locale === "zh"
            ? "翻译失败，请检查网络连接或稍后重试"
            : "Translation failed, please check network or try again later"
        );
      }
    } catch (error) {
      console.error("翻译失败:", error);
      alert(
        locale === "zh"
          ? "翻译失败，请重试\n错误: " + (error instanceof Error ? error.message : String(error))
          : "Translation failed\nError: " + (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {locale === "zh" ? "轮播图管理" : "Banner Management"}
        </h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          {locale === "zh" ? "添加轮播图" : "Add Banner"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* 创建新轮播图表单 */}
        {isCreating && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {locale === "zh" ? "添加新轮播图" : "Add New Banner"}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAutoTranslate}
                    disabled={translating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {translating
                      ? locale === "zh"
                        ? "翻译中..."
                        : "Translating..."
                      : locale === "zh"
                      ? "🌐 自动翻译"
                      : "🌐 Auto Translate"}
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={translating}>
                    <Save className="w-4 h-4 mr-1" />
                    {locale === "zh" ? "保存" : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={translating}
                  >
                    <X className="w-4 h-4 mr-1" />
                    {locale === "zh" ? "取消" : "Cancel"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "标题（中文）" : "Title (Chinese)"}
                    </label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "标题（英文）" : "Title (English)"}
                    </label>
                    <Input
                      value={formData.titleEn || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, titleEn: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh"
                        ? "描述（中文）"
                        : "Description (Chinese)"}
                    </label>
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh"
                        ? "描述（英文）"
                        : "Description (English)"}
                    </label>
                    <Textarea
                      value={formData.descriptionEn || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionEn: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "高亮标签（中文）" : "Highlight (Chinese)"}
                    </label>
                    <Input
                      value={formData.highlight || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, highlight: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "高亮标签（英文）" : "Highlight (English)"}
                    </label>
                    <Input
                      value={formData.highlightEn || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, highlightEn: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "按钮文本（中文）" : "Button Text (Chinese)"}
                    </label>
                    <Input
                      value={formData.buttonText || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, buttonText: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "按钮文本（英文）" : "Button Text (English)"}
                    </label>
                    <Input
                      value={formData.buttonTextEn || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, buttonTextEn: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "图片URL" : "Image URL"}
                    </label>
                    <Input
                      value={formData.image || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "按钮链接" : "Button Link"}
                    </label>
                    <Input
                      value={formData.buttonLink || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buttonLink: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "颜色" : "Color"}
                    </label>
                    <Input
                      value={formData.color || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      placeholder="from-blue-600 to-purple-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "排序" : "Order"}
                    </label>
                    <Input
                      type="number"
                      value={formData.order || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {banner.title}
                  <Badge variant={banner.status ? "default" : "secondary"}>
                    {banner.status
                      ? locale === "zh"
                        ? "启用"
                        : "Active"
                      : locale === "zh"
                      ? "禁用"
                      : "Inactive"}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  {editingId === banner.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={handleAutoTranslate}
                        disabled={translating}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {translating
                          ? locale === "zh"
                            ? "翻译中..."
                            : "Translating..."
                          : locale === "zh"
                          ? "🌐 自动翻译"
                          : "🌐 Auto Translate"}
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={translating}>
                        <Save className="w-4 h-4 mr-1" />
                        {locale === "zh" ? "保存" : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={translating}
                      >
                        <X className="w-4 h-4 mr-1" />
                        {locale === "zh" ? "取消" : "Cancel"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(banner)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {locale === "zh" ? "编辑" : "Edit"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(banner)}
                      >
                        {banner.status
                          ? locale === "zh"
                            ? "禁用"
                            : "Disable"
                          : locale === "zh"
                          ? "启用"
                          : "Enable"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {locale === "zh" ? "删除" : "Delete"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === banner.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "标题（中文）" : "Title (Chinese)"}
                      </label>
                      <Input
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "标题（英文）" : "Title (English)"}
                      </label>
                      <Input
                        value={formData.titleEn || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, titleEn: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh"
                          ? "描述（中文）"
                          : "Description (Chinese)"}
                      </label>
                      <Textarea
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh"
                          ? "描述（英文）"
                          : "Description (English)"}
                      </label>
                      <Textarea
                        value={formData.descriptionEn || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descriptionEn: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "高亮标签（中文）" : "Highlight (Chinese)"}
                      </label>
                      <Input
                        value={formData.highlight || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, highlight: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "高亮标签（英文）" : "Highlight (English)"}
                      </label>
                      <Input
                        value={formData.highlightEn || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, highlightEn: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "按钮文本（中文）" : "Button Text (Chinese)"}
                      </label>
                      <Input
                        value={formData.buttonText || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, buttonText: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "按钮文本（英文）" : "Button Text (English)"}
                      </label>
                      <Input
                        value={formData.buttonTextEn || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, buttonTextEn: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "图片URL" : "Image URL"}
                      </label>
                      <Input
                        value={formData.image || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "按钮链接" : "Button Link"}
                      </label>
                      <Input
                        value={formData.buttonLink || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            buttonLink: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "颜色" : "Color"}
                      </label>
                      <Input
                        value={formData.color || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        placeholder="from-blue-600 to-purple-700"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {locale === "zh" ? "排序" : "Order"}
                      </label>
                      <Input
                        type="number"
                        value={formData.order || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start gap-4">
                    <div className="w-48 h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        {banner.description}
                      </p>
                      {banner.buttonLink && (
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">
                            {locale === "zh" ? "链接：" : "Link: "}
                          </span>
                          {banner.buttonLink}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">
                          {locale === "zh" ? "排序：" : "Order: "}
                        </span>
                        {banner.order}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
