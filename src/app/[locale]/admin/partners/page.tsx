"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Building2,
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  nameEn: string | null;
  logo: string;
  website: string | null;
  order: number;
  status: boolean;
}

export default function AdminPartnersPage() {
  const locale = useLocale();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Partner>>({});

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/partners");
      const data = await response.json();
      if (data.success) {
        setPartners(data.data);
      }
    } catch (error) {
      console.error("获取合作伙伴失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setIsCreating(false);
    setFormData(partner);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: "",
      nameEn: "",
      logo: "",
      website: "",
      order: 0,
      status: true,
    });
  };

  const handleSave = async () => {
    if (!editingId && !isCreating) return;

    try {
      if (isCreating) {
        // Create new partner
        const response = await fetch("/api/partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchPartners();
          setIsCreating(false);
          setFormData({});
        }
      } else {
        // Update existing partner
        const response = await fetch(`/api/partners/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchPartners();
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
      const response = await fetch(`/api/partners/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchPartners();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const handleToggleStatus = async (partner: Partner) => {
    try {
      const response = await fetch(`/api/partners/${partner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...partner, status: !partner.status }),
      });

      if (response.ok) {
        await fetchPartners();
      }
    } catch (error) {
      console.error("更新状态失败:", error);
    }
  };

  const renderForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">
            {locale === "zh" ? "名称（中文）" : "Name (Chinese)"}
          </label>
          <Input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {locale === "zh" ? "名称（英文）" : "Name (English)"}
          </label>
          <Input
            value={formData.nameEn || ""}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">
            {locale === "zh" ? "Logo URL" : "Logo URL"}
          </label>
          <Input
            value={formData.logo || ""}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {locale === "zh" ? "网站链接" : "Website"}
          </label>
          <Input
            value={formData.website || ""}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://..."
          />
        </div>
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
          {locale === "zh" ? "合作伙伴管理" : "Partner Management"}
        </h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          {locale === "zh" ? "添加合作伙伴" : "Add Partner"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* 创建新合作伙伴表单 */}
        {isCreating && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {locale === "zh" ? "添加新合作伙伴" : "Add New Partner"}
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

        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {partner.name}
                  <Badge variant={partner.status ? "default" : "secondary"}>
                    {partner.status
                      ? locale === "zh"
                        ? "启用"
                        : "Active"
                      : locale === "zh"
                      ? "禁用"
                      : "Inactive"}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  {editingId === partner.id ? (
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
                        onClick={() => handleEdit(partner)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {locale === "zh" ? "编辑" : "Edit"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(partner)}
                      >
                        {partner.status
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
                        onClick={() => handleDelete(partner.id)}
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
              {editingId === partner.id ? (
                renderForm()
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-24 bg-gray-100 rounded flex items-center justify-center overflow-hidden p-4">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain grayscale"
                        />
                      ) : (
                        <Building2 className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      {partner.website && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">
                            {locale === "zh" ? "网站：" : "Website: "}
                          </span>
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {partner.website}
                          </a>
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">
                          {locale === "zh" ? "排序：" : "Order: "}
                        </span>
                        {partner.order}
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
