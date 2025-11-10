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
  Cpu,
  Shield,
  Server,
  Building,
} from "lucide-react";

interface Solution {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  icon: string;
  color: string;
  iconBg: string;
  features: Array<string | { text: string; textEn?: string }> | null;
  order: number;
  status: boolean;
}

const iconOptions = [
  { value: "Cpu", label: "CPU", component: Cpu },
  { value: "Shield", label: "Shield", component: Shield },
  { value: "Server", label: "Server", component: Server },
  { value: "Building", label: "Building", component: Building },
];

export default function AdminSolutionsPage() {
  const locale = useLocale();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Solution>>({});
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/solutions");
      const data = await response.json();
      if (data.success) {
        setSolutions(data.data);
      }
    } catch (error) {
      console.error("获取解决方案失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (solution: Solution) => {
    setEditingId(solution.id);
    setIsCreating(false);
    setFormData(solution);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      icon: "Cpu",
      color: "text-blue-600",
      iconBg: "bg-blue-500",
      features: [],
      order: 0,
      status: true,
    });
  };

  const handleSave = async () => {
    if (!editingId && !isCreating) return;

    try {
      if (isCreating) {
        // Create new solution
        const response = await fetch("/api/solutions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchSolutions();
          setIsCreating(false);
          setFormData({});
        }
      } else {
        // Update existing solution
        const response = await fetch(`/api/solutions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchSolutions();
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

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      const promises = [];

      // 翻译标题
      if (formData.title && !formData.titleEn) {
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: formData.title, targetLang: "en" }),
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

      // 翻译特性列表
      const featurePromises: Promise<any>[] = [];
      if (formData.features && formData.features.length > 0) {
        formData.features.forEach((feature) => {
          const featureObj =
            typeof feature === "string" ? { text: feature, textEn: "" } : feature;
          if (featureObj.text && !featureObj.textEn) {
            featurePromises.push(
              fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  text: featureObj.text,
                  targetLang: "en",
                }),
              }).then((res) => res.json())
            );
          } else {
            featurePromises.push(Promise.resolve(null));
          }
        });
      }

      const [titleResult, descriptionResult] = await Promise.all(promises);
      const featureResults = await Promise.all(featurePromises);

      // 更新翻译后的特性
      const translatedFeatures = formData.features?.map((feature, index) => {
        const featureObj =
          typeof feature === "string" ? { text: feature, textEn: "" } : feature;
        const translation = featureResults[index];
        return {
          ...featureObj,
          textEn: translation?.data?.translatedText || featureObj.textEn || "",
        };
      });

      setFormData((prev) => ({
        ...prev,
        titleEn: titleResult?.data?.translatedText || prev.titleEn,
        descriptionEn:
          descriptionResult?.data?.translatedText || prev.descriptionEn,
        features: translatedFeatures || prev.features,
      }));
    } catch (error) {
      console.error("翻译失败:", error);
      alert(locale === "zh" ? "翻译失败，请重试" : "Translation failed, please try again");
    } finally {
      setTranslating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === "zh" ? "确定要删除吗？" : "Are you sure?")) {
      return;
    }

    try {
      const response = await fetch(`/api/solutions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchSolutions();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const handleToggleStatus = async (solution: Solution) => {
    try {
      const response = await fetch(`/api/solutions/${solution.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...solution, status: !solution.status }),
      });

      if (response.ok) {
        await fetchSolutions();
      }
    } catch (error) {
      console.error("更新状态失败:", error);
    }
  };

  const handleAddFeature = () => {
    const features = formData.features || [];
    setFormData({
      ...formData,
      features: [...features, { text: "", textEn: "" }],
    });
  };

  const handleRemoveFeature = (index: number) => {
    const features = formData.features || [];
    setFormData({
      ...formData,
      features: features.filter((_, i) => i !== index),
    });
  };

  const handleFeatureChange = (
    index: number,
    field: "text" | "textEn",
    value: string
  ) => {
    const features = formData.features || [];
    const updatedFeatures = [...features];
    const currentFeature = updatedFeatures[index];

    if (typeof currentFeature === "string") {
      updatedFeatures[index] = { text: currentFeature, textEn: "" };
    }

    updatedFeatures[index] = {
      ...(typeof updatedFeatures[index] === "object"
        ? updatedFeatures[index]
        : { text: "", textEn: "" }),
      [field]: value,
    };

    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const renderForm = () => (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button
          type="button"
          onClick={handleAutoTranslate}
          disabled={translating}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          {translating ? (locale === "zh" ? "翻译中..." : "Translating...") : "🌐 " + (locale === "zh" ? "自动翻译为英文" : "Auto Translate to English")}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">
            {locale === "zh" ? "标题（中文）" : "Title (Chinese)"}
          </label>
          <Input
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            {locale === "zh" ? "描述（中文）" : "Description (Chinese)"}
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
            {locale === "zh" ? "描述（英文）" : "Description (English)"}
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
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium">
            {locale === "zh" ? "图标" : "Icon"}
          </label>
          <select
            className="w-full border rounded-md p-2"
            value={formData.icon || "Cpu"}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          >
            {iconOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">
            {locale === "zh" ? "文字颜色" : "Text Color"}
          </label>
          <Input
            value={formData.color || ""}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="text-blue-600"
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {locale === "zh" ? "背景颜色" : "Background Color"}
          </label>
          <Input
            value={formData.iconBg || ""}
            onChange={(e) => setFormData({ ...formData, iconBg: e.target.value })}
            placeholder="bg-blue-500"
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
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">
            {locale === "zh" ? "特性列表" : "Features"}
          </label>
          <Button size="sm" variant="outline" onClick={handleAddFeature}>
            <Plus className="w-4 h-4 mr-1" />
            {locale === "zh" ? "添加特性" : "Add Feature"}
          </Button>
        </div>
        <div className="space-y-2">
          {(formData.features || []).map((feature, index) => {
            const featureObj =
              typeof feature === "string" ? { text: feature, textEn: "" } : feature;
            return (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={locale === "zh" ? "中文特性" : "Feature (CN)"}
                  value={featureObj.text}
                  onChange={(e) =>
                    handleFeatureChange(index, "text", e.target.value)
                  }
                />
                <Input
                  placeholder={locale === "zh" ? "英文特性" : "Feature (EN)"}
                  value={featureObj.textEn || ""}
                  onChange={(e) =>
                    handleFeatureChange(index, "textEn", e.target.value)
                  }
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveFeature(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

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
          {locale === "zh" ? "解决方案管理" : "Solution Management"}
        </h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          {locale === "zh" ? "添加解决方案" : "Add Solution"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* 创建新解决方案表单 */}
        {isCreating && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {locale === "zh" ? "添加新解决方案" : "Add New Solution"}
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-1" />
                    {locale === "zh" ? "保存" : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-1" />
                    {locale === "zh" ? "取消" : "Cancel"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderForm()}</CardContent>
          </Card>
        )}

        {solutions.map((solution) => {
          const IconComponent =
            iconOptions.find((opt) => opt.value === solution.icon)?.component ||
            Cpu;

          return (
            <Card key={solution.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 ${solution.iconBg} rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    {solution.title}
                    <Badge variant={solution.status ? "default" : "secondary"}>
                      {solution.status
                        ? locale === "zh"
                          ? "启用"
                          : "Active"
                        : locale === "zh"
                        ? "禁用"
                        : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    {editingId === solution.id ? (
                      <>
                        <Button size="sm" onClick={handleSave}>
                          <Save className="w-4 h-4 mr-1" />
                          {locale === "zh" ? "保存" : "Save"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-1" />
                          {locale === "zh" ? "取消" : "Cancel"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(solution)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          {locale === "zh" ? "编辑" : "Edit"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(solution)}
                        >
                          {solution.status
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
                          onClick={() => handleDelete(solution.id)}
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
                {editingId === solution.id ? (
                  renderForm()
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">
                      {solution.description}
                    </p>
                    {solution.features && solution.features.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">
                          {locale === "zh" ? "特性：" : "Features:"}
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {solution.features.map((feature, idx) => {
                            const featureText =
                              typeof feature === "string" ? feature : feature.text;
                            return (
                              <li key={idx} className="text-sm text-gray-600">
                                {featureText}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">
                        {locale === "zh" ? "排序：" : "Order: "}
                      </span>
                      {solution.order}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
