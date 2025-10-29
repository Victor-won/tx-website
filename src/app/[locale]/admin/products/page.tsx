"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Specification, Feature } from "@/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move } from "lucide-react";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  name: string;
  nameEn: string | null;
  description: string;
  descriptionEn: string | null;
  shortDesc: string | null;
  shortDescEn: string | null;
  tag: string | null;
  tagEn: string | null;
  priceDisplay: string | null;
  priceDisplayEn: string | null;
  rating: number | null;
  specifications: Specification[] | null;
  features: Feature[] | null;
  price: number;
  salePrice: number | null;
  sku: string;
  stock: number;
  status: string;
  featuredImage: string | null;
  images: string[] | null;
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
    nameEn: string | null;
  } | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
}

interface ProductFormData {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  shortDesc: string;
  shortDescEn: string;
  tag: string;
  tagEn: string;
  priceDisplay: string;
  priceDisplayEn: string;
  rating: string;
  specifications: Specification[];
  features: Feature[];
  price: string;
  salePrice: string;
  stock: string;
  status: string;
  featuredImage: string;
  images: string[];
  categoryId: string;
}

// 可拖拽的规格项组件
function SortableSpecificationItem({
  spec,
  index,
  onUpdate,
  onRemove,
}: {
  spec: Specification;
  index: number;
  onUpdate: (index: number, field: keyof Specification, value: string) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `spec-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 space-y-2 ${isDragging ? "bg-gray-50" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move text-gray-400 hover:text-gray-600"
            title="拖拽排序"
          >
            <Move />
          </div>
          <span className="text-sm font-medium">规格 {index + 1}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          删除
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="规格名 (中文)"
          value={spec.name}
          onChange={(e) => onUpdate(index, "name", e.target.value)}
        />
        <Input
          placeholder="规格名 (英文)"
          value={spec.nameEn || ""}
          onChange={(e) => onUpdate(index, "nameEn", e.target.value)}
        />
        <Input
          placeholder="规格值 (中文)"
          value={spec.value}
          onChange={(e) => onUpdate(index, "value", e.target.value)}
        />
        <Input
          placeholder="规格值 (英文)"
          value={spec.valueEn || ""}
          onChange={(e) => onUpdate(index, "valueEn", e.target.value)}
        />
      </div>
    </div>
  );
}

// 可拖拽的特性项组件
function SortableFeatureItem({
  feature,
  index,
  onUpdate,
  onRemove,
}: {
  feature: Feature;
  index: number;
  onUpdate: (index: number, field: keyof Feature, value: string) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `feature-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 space-y-2 ${isDragging ? "bg-gray-50" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move text-gray-400 hover:text-gray-600"
            title="拖拽排序"
          >
            <Move />
          </div>
          <span className="text-sm font-medium">特性 {index + 1}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          删除
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="特性标题 (中文)"
          value={feature.title}
          onChange={(e) => onUpdate(index, "title", e.target.value)}
        />
        <Input
          placeholder="特性标题 (英文)"
          value={feature.titleEn || ""}
          onChange={(e) => onUpdate(index, "titleEn", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <textarea
          placeholder="特性描述 (中文)"
          value={feature.description}
          onChange={(e) => onUpdate(index, "description", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[60px]"
        />
        <textarea
          placeholder="特性描述 (英文)"
          value={feature.descriptionEn || ""}
          onChange={(e) => onUpdate(index, "descriptionEn", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[60px]"
        />
      </div>
      <Input
        placeholder="图标 (可选)"
        value={feature.icon || ""}
        onChange={(e) => onUpdate(index, "icon", e.target.value)}
      />
    </div>
  );
}

// 可拖拽的表格行组件
function SortableProductRow({
  product,
  locale,
  onView,
  onEdit,
  onCopy,
  onDelete,
}: {
  product: Product;
  locale: string;
  onView: (id: string) => void;
  onEdit: (product: Product) => void;
  onCopy: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className={isDragging ? "bg-gray-50" : ""}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move text-gray-400 hover:text-gray-600"
          title="拖拽排序"
        >
          <Move />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {product.featuredImage && (
            <img
              src={product.featuredImage}
              alt={product.name}
              className="w-10 h-10 rounded-md object-cover mr-3"
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{product.category?.name || "-"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">¥{product.price}</div>
        {product.salePrice && (
          <div className="text-sm text-red-600">¥{product.salePrice}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            product.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : product.status === "INACTIVE"
              ? "bg-gray-100 text-gray-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.status === "ACTIVE"
            ? "正常"
            : product.status === "INACTIVE"
            ? "下架"
            : "缺货"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onView(product.id)}
          className="text-indigo-600 hover:text-indigo-900 mr-4"
          title="在新标签页中查看前台详情页"
        >
          查看
        </button>
        <button
          onClick={() => onEdit(product)}
          className="text-blue-600 hover:text-blue-900 mr-4"
        >
          编辑
        </button>
        <button
          onClick={() => onCopy(product)}
          className="text-green-600 hover:text-green-900 mr-4"
        >
          复制
        </button>
        <button
          onClick={() => onDelete(product)}
          className="text-red-600 hover:text-red-900"
        >
          删除
        </button>
      </td>
    </tr>
  );
}

export default function ProductsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "zh";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    shortDesc: "",
    shortDescEn: "",
    tag: "",
    tagEn: "",
    priceDisplay: "",
    priceDisplayEn: "",
    rating: "",
    specifications: [],
    features: [],
    price: "",
    salePrice: "",
    stock: "0",
    status: "ACTIVE",
    featuredImage: "",
    images: [],
    categoryId: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
    price?: string;
    stock?: string;
  }>({});

  // 拖拽传感器配置
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 处理拖拽结束
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);

      // 更新本地状态
      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);

      // 准备更新数据
      const updates = newProducts.map((product, index) => ({
        id: product.id,
        order: index,
      }));

      // 发送到后端保存
      try {
        const response = await fetch("/api/products/order", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates }),
        });

        const data = await response.json();
        if (!data.success) {
          // 如果保存失败，恢复原来的顺序
          fetchProducts();
          alert("保存排序失败，请重试");
        }
      } catch (error) {
        console.error("保存排序失败:", error);
        fetchProducts();
        alert("保存排序失败，请重试");
      }
    }
  };

  // 处理规格拖拽结束
  const handleSpecificationDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = parseInt(String(active.id).replace("spec-", ""));
      const overIndex = parseInt(String(over.id).replace("spec-", ""));

      const newSpecifications = arrayMove(formData.specifications, activeIndex, overIndex);
      setFormData({ ...formData, specifications: newSpecifications });
    }
  };

  // 处理特性拖拽结束
  const handleFeatureDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = parseInt(String(active.id).replace("feature-", ""));
      const overIndex = parseInt(String(over.id).replace("feature-", ""));

      const newFeatures = arrayMove(formData.features, activeIndex, overIndex);
      setFormData({ ...formData, features: newFeatures });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("获取产品列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?limit=1000");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("获取分类列表失败:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      description?: string;
      price?: string;
      stock?: string;
    } = {};

    // 验证必填字段
    if (!formData.name.trim()) {
      errors.name = "产品名称(中文)不能为空";
    }

    if (!formData.description.trim()) {
      errors.description = "产品描述(中文)不能为空";
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      errors.price = "价格必须大于等于0";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = "库存必须大于等于0";
    }

    setFormErrors(errors);

    // 如果有错误，返回 false
    if (Object.keys(errors).length > 0) {
      alert("请填写所有必填字段并确保数据有效");
      return false;
    }

    return true;
  };

  const handleAutoTranslate = async () => {
    // 检查是否有需要翻译的内容
    const hasBasicContent = formData.name || formData.description || formData.shortDesc || formData.tag || formData.priceDisplay;
    const hasSpecifications = formData.specifications.some(spec => spec.name || spec.value);
    const hasFeatures = formData.features.some(feature => feature.title || feature.description);

    if (!hasBasicContent && !hasSpecifications && !hasFeatures) {
      alert("请先填写需要翻译的中文内容");
      return;
    }

    setTranslating(true);
    console.log("开始自动翻译...");

    try {
      type TranslateResult =
        | { field: string; data: any }
        | { field: "specification"; subfield: "name" | "value"; index: number; data: any }
        | { field: "feature"; subfield: "title" | "description"; index: number; data: any };

      const promises: Promise<TranslateResult>[] = [];

      // 翻译基础字段
      if (formData.name) {
        console.log("准备翻译名称:", formData.name);
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: formData.name, targetLang: "en" }),
          }).then(async (res) => {
            const data = await res.json();
            console.log("名称翻译结果:", data);
            return { field: "name", data };
          })
        );
      }

      if (formData.description) {
        console.log("准备翻译描述 (长度:", formData.description.length, ")");
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
            console.log("描述翻译结果:", data.success ? "成功" : data.error);
            return { field: "description", data };
          })
        );
      }

      if (formData.shortDesc) {
        console.log("准备翻译简短描述:", formData.shortDesc);
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: formData.shortDesc,
              targetLang: "en",
            }),
          }).then(async (res) => {
            const data = await res.json();
            console.log("简短描述翻译结果:", data);
            return { field: "shortDesc", data };
          })
        );
      }

      if (formData.tag) {
        console.log("准备翻译标签:", formData.tag);
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: formData.tag,
              targetLang: "en",
            }),
          }).then(async (res) => {
            const data = await res.json();
            console.log("标签翻译结果:", data);
            return { field: "tag", data };
          })
        );
      }

      if (formData.priceDisplay) {
        console.log("准备翻译价格显示:", formData.priceDisplay);
        promises.push(
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: formData.priceDisplay,
              targetLang: "en",
            }),
          }).then(async (res) => {
            const data = await res.json();
            console.log("价格显示翻译结果:", data);
            return { field: "priceDisplay", data };
          })
        );
      }

      // 翻译规格（specifications）
      formData.specifications.forEach((spec, index) => {
        if (spec.name) {
          console.log(`准备翻译规格 ${index + 1} 名称:`, spec.name);
          promises.push(
            fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: spec.name, targetLang: "en" }),
            }).then(async (res) => {
              const data = await res.json();
              console.log(`规格 ${index + 1} 名称翻译结果:`, data);
              return { field: "specification", subfield: "name", index, data };
            })
          );
        }

        if (spec.value) {
          console.log(`准备翻译规格 ${index + 1} 值:`, spec.value);
          promises.push(
            fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: spec.value, targetLang: "en" }),
            }).then(async (res) => {
              const data = await res.json();
              console.log(`规格 ${index + 1} 值翻译结果:`, data);
              return { field: "specification", subfield: "value", index, data };
            })
          );
        }
      });

      // 翻译特性（features）
      formData.features.forEach((feature, index) => {
        if (feature.title) {
          console.log(`准备翻译特性 ${index + 1} 标题:`, feature.title);
          promises.push(
            fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: feature.title, targetLang: "en" }),
            }).then(async (res) => {
              const data = await res.json();
              console.log(`特性 ${index + 1} 标题翻译结果:`, data);
              return { field: "feature", subfield: "title", index, data };
            })
          );
        }

        if (feature.description) {
          console.log(`准备翻译特性 ${index + 1} 描述:`, feature.description);
          promises.push(
            fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: feature.description, targetLang: "en" }),
            }).then(async (res) => {
              const data = await res.json();
              console.log(`特性 ${index + 1} 描述翻译结果:`, data);
              return { field: "feature", subfield: "description", index, data };
            })
          );
        }
      });

      console.log(`等待所有翻译完成... (共 ${promises.length} 个请求)`);
      const results = await Promise.all(promises);
      console.log("所有翻译完成:", results);

      // 更新表单数据
      const updates: Partial<ProductFormData> = {};
      const newSpecifications = [...formData.specifications];
      const newFeatures = [...formData.features];
      let translatedCount = 0;
      let failedFields: string[] = [];

      results.forEach((result) => {
        if (!result) return;

        if (result.field === "specification" && "subfield" in result && "index" in result) {
          if (result.data?.success && result.data?.data?.translatedText) {
            if (result.subfield === "name") {
              newSpecifications[result.index].nameEn = result.data.data.translatedText;
              translatedCount++;
            } else if (result.subfield === "value") {
              newSpecifications[result.index].valueEn = result.data.data.translatedText;
              translatedCount++;
            }
          } else {
            failedFields.push(`规格 ${result.index + 1} ${result.subfield === "name" ? "名称" : "值"}`);
          }
        } else if (result.field === "feature" && "subfield" in result && "index" in result) {
          if (result.data?.success && result.data?.data?.translatedText) {
            if (result.subfield === "title") {
              newFeatures[result.index].titleEn = result.data.data.translatedText;
              translatedCount++;
            } else if (result.subfield === "description") {
              newFeatures[result.index].descriptionEn = result.data.data.translatedText;
              translatedCount++;
            }
          } else {
            failedFields.push(`特性 ${result.index + 1} ${result.subfield === "title" ? "标题" : "描述"}`);
          }
        } else {
          // 基础字段
          if (result.data?.success && result.data?.data?.translatedText) {
            if (result.field === "name") {
              updates.nameEn = result.data.data.translatedText;
              translatedCount++;
            } else if (result.field === "description") {
              updates.descriptionEn = result.data.data.translatedText;
              translatedCount++;
            } else if (result.field === "shortDesc") {
              updates.shortDescEn = result.data.data.translatedText;
              translatedCount++;
            } else if (result.field === "tag") {
              updates.tagEn = result.data.data.translatedText;
              translatedCount++;
            } else if (result.field === "priceDisplay") {
              updates.priceDisplayEn = result.data.data.translatedText;
              translatedCount++;
            }
          } else {
            const fieldNameMap: Record<string, string> = {
              name: "名称",
              description: "描述",
              shortDesc: "简短描述",
              tag: "标签",
              priceDisplay: "价格显示"
            };
            failedFields.push(fieldNameMap[result.field] || result.field);
          }
        }
      });

      updates.specifications = newSpecifications;
      updates.features = newFeatures;

      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));

      console.log("翻译完成，更新了", translatedCount, "个字段");

      // 显示结果
      if (translatedCount > 0 && failedFields.length === 0) {
        alert(`翻译成功！已翻译 ${translatedCount} 个字段`);
      } else if (translatedCount > 0 && failedFields.length > 0) {
        alert(`部分翻译成功！已翻译 ${translatedCount} 个字段\n失败字段: ${failedFields.join(", ")}`);
      } else {
        alert("翻译失败，请检查网络连接或稍后重试");
      }
    } catch (error) {
      console.error("翻译失败:", error);
      alert("翻译失败，请重试\n错误: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setTranslating(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        name: formData.name,
        nameEn: formData.nameEn || undefined,
        description: formData.description,
        descriptionEn: formData.descriptionEn || undefined,
        shortDesc: formData.shortDesc || undefined,
        shortDescEn: formData.shortDescEn || undefined,
        tag: formData.tag || undefined,
        tagEn: formData.tagEn || undefined,
        priceDisplay: formData.priceDisplay || undefined,
        priceDisplayEn: formData.priceDisplayEn || undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        specifications: formData.specifications.length > 0 ? formData.specifications : undefined,
        features: formData.features.length > 0 ? formData.features : undefined,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        stock: parseInt(formData.stock),
        status: formData.status,
        featuredImage: formData.featuredImage || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        categoryId: formData.categoryId || null,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setIsCreateDialogOpen(false);
        resetForm();
        fetchProducts();
      } else {
        alert(data.error || "创建产品失败");
      }
    } catch (error) {
      console.error("创建产品失败:", error);
      alert("创建产品失败");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // 验证表单
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        name: formData.name,
        nameEn: formData.nameEn || undefined,
        description: formData.description,
        descriptionEn: formData.descriptionEn || undefined,
        shortDesc: formData.shortDesc || undefined,
        shortDescEn: formData.shortDescEn || undefined,
        tag: formData.tag || undefined,
        tagEn: formData.tagEn || undefined,
        priceDisplay: formData.priceDisplay || undefined,
        priceDisplayEn: formData.priceDisplayEn || undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        specifications: formData.specifications.length > 0 ? formData.specifications : undefined,
        features: formData.features.length > 0 ? formData.features : undefined,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        stock: parseInt(formData.stock),
        status: formData.status,
        featuredImage: formData.featuredImage || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        categoryId: formData.categoryId || null,
      };

      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
        resetForm();
        fetchProducts();
      } else {
        alert(data.error || "更新产品失败");
      }
    } catch (error) {
      console.error("更新产品失败:", error);
      alert("更新产品失败");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setFormLoading(true);

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
        fetchProducts();
      } else {
        alert(data.error || "删除产品失败");
      }
    } catch (error) {
      console.error("删除产品失败:", error);
      alert("删除产品失败");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCopyProduct = async (product: Product) => {
    try {
      const payload = {
        name: `${product.name} (副本)`,
        nameEn: product.nameEn ? `${product.nameEn} (Copy)` : undefined,
        description: product.description,
        descriptionEn: product.descriptionEn || undefined,
        shortDesc: product.shortDesc || undefined,
        shortDescEn: product.shortDescEn || undefined,
        tag: product.tag || undefined,
        tagEn: product.tagEn || undefined,
        priceDisplay: product.priceDisplay || undefined,
        priceDisplayEn: product.priceDisplayEn || undefined,
        rating: product.rating || undefined,
        specifications: product.specifications || undefined,
        features: product.features || undefined,
        price: product.price,
        salePrice: product.salePrice || undefined,
        stock: product.stock,
        status: "INACTIVE",
        featuredImage: product.featuredImage || undefined,
        images: product.images || undefined,
        categoryId: product.categoryId || null,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert("产品复制成功！");
        fetchProducts();
      } else {
        alert(data.error || "复制产品失败");
      }
    } catch (error) {
      console.error("复制产品失败:", error);
      alert("复制产品失败");
    }
  };

  const handleViewProduct = (id: string) => {
    window.open(`/${locale}/products/${id}`, "_blank");
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      nameEn: product.nameEn || "",
      description: product.description,
      descriptionEn: product.descriptionEn || "",
      shortDesc: product.shortDesc || "",
      shortDescEn: product.shortDescEn || "",
      tag: product.tag || "",
      tagEn: product.tagEn || "",
      priceDisplay: product.priceDisplay || "",
      priceDisplayEn: product.priceDisplayEn || "",
      rating: product.rating?.toString() || "",
      specifications: (product.specifications as Specification[]) || [],
      features: (product.features as Feature[]) || [],
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || "",
      stock: product.stock.toString(),
      status: product.status,
      featuredImage: product.featuredImage || "",
      images: (product.images as string[]) || [],
      categoryId: product.categoryId || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      shortDesc: "",
      shortDescEn: "",
      tag: "",
      tagEn: "",
      priceDisplay: "",
      priceDisplayEn: "",
      rating: "",
      specifications: [],
      features: [],
      price: "",
      salePrice: "",
      stock: "0",
      status: "ACTIVE",
      featuredImage: "",
      images: [],
      categoryId: "",
    });
    setFormErrors({});
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [
        ...formData.specifications,
        { name: "", nameEn: "", value: "", valueEn: "" },
      ],
    });
  };

  const removeSpecification = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index),
    });
  };

  const updateSpecification = (index: number, field: keyof Specification, value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [
        ...formData.features,
        { title: "", titleEn: "", description: "", descriptionEn: "", icon: "" },
      ],
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const addImage = (url: string) => {
    setFormData({
      ...formData,
      images: [...formData.images, url],
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
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
                  <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
                  <p className="mt-1 text-sm text-gray-500">共 {total} 个产品</p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                      <Button onClick={resetForm}>+ 新建产品</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                      <DialogHeader>
                          <DialogTitle>创建产品</DialogTitle>
                          <DialogDescription>填写以下信息创建新产品</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateProduct} className="flex flex-col flex-1 overflow-hidden">
                          <div className="space-y-6 py-4 px-6 overflow-y-auto flex-1">
                              {/* 基本信息 */}
                              <div className="space-y-4">
                                  <h3 className="text-lg font-medium">基本信息</h3>

                                  <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                          <Label htmlFor="create-name">
                                              产品名称 (中文) <span className="text-red-600">*</span>
                                          </Label>
                                          <Input
                                              id="create-name"
                                              value={formData.name}
                                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                              required
                                              className={formErrors.name ? 'border-red-500' : ''}
                                          />
                                          {formErrors.name && (
                                              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                          )}
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor="create-name-en">产品名称 (英文)</Label>
                                          <Input
                                              id="create-name-en"
                                              value={formData.nameEn}
                                              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                              placeholder="Product Name"
                                          />
                                      </div>
                                  </div>

                                  <div className="space-y-2">
                                      <Label htmlFor="create-category">分类</Label>
                                      <select
                                          id="create-category"
                                          value={formData.categoryId}
                                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                                      >
                                          <option value="">无分类</option>
                                          {categories.map((cat) => (
                                              <option key={cat.id} value={cat.id}>
                                                  {cat.name}
                                              </option>
                                          ))}
                                      </select>
                                  </div>

                                  <div className="space-y-2">
                                      <Label htmlFor="create-short-desc">简短描述 (中文)</Label>
                                      <textarea
                                          id="create-short-desc"
                                          value={formData.shortDesc}
                                          onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                                          className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[60px]"
                                          placeholder="简短的产品描述..."
                                      />
                                  </div>

                                  <div className="space-y-2">
                                      <Label htmlFor="create-short-desc-en">简短描述 (英文)</Label>
                                      <textarea
                                          id="create-short-desc-en"
                                          value={formData.shortDescEn}
                                          onChange={(e) => setFormData({ ...formData, shortDescEn: e.target.value })}
                                          className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[60px]"
                                          placeholder="Short product description..."
                                      />
                                  </div>

                                  {/* <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                          <Label htmlFor="create-tag">产品标签 (中文)</Label>
                                          <Input
                                              id="create-tag"
                                              value={formData.tag}
                                              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                              placeholder="核心产品、热门产品等"
                                          />
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor="create-tag-en">产品标签 (英文)</Label>
                                          <Input
                                              id="create-tag-en"
                                              value={formData.tagEn}
                                              onChange={(e) => setFormData({ ...formData, tagEn: e.target.value })}
                                              placeholder="Core Product, Popular Product"
                                          />
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                          <Label htmlFor="create-price-display">价格显示 (中文)</Label>
                                          <Input
                                              id="create-price-display"
                                              value={formData.priceDisplay}
                                              onChange={(e) =>
                                                  setFormData({ ...formData, priceDisplay: e.target.value })
                                              }
                                              placeholder="联系获取、面议等"
                                          />
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor="create-price-display-en">价格显示 (英文)</Label>
                                          <Input
                                              id="create-price-display-en"
                                              value={formData.priceDisplayEn}
                                              onChange={(e) =>
                                                  setFormData({ ...formData, priceDisplayEn: e.target.value })
                                              }
                                              placeholder="Contact us, Negotiable"
                                          />
                                      </div>
                                  </div>

                                  <div className="space-y-2">
                                      <Label htmlFor="create-rating">产品评分 (1.0-5.0)</Label>
                                      <Input
                                          id="create-rating"
                                          type="number"
                                          step="0.1"
                                          min="1"
                                          max="5"
                                          value={formData.rating}
                                          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                          placeholder="5.0"
                                      />
                                  </div> */}
                              </div>

                              {/* 详细描述 */}
                              <div className="space-y-4">
                                  <h3 className="text-lg font-medium">详细描述</h3>

                                  <div className="space-y-2">
                                      <Label>
                                          产品描述 (中文) <span className="text-red-600">*</span>
                                      </Label>
                                      <RichTextEditor
                                          value={formData.description}
                                          onChange={(value) => setFormData({ ...formData, description: value })}
                                          placeholder="产品详细描述..."
                                      />
                                      {formErrors.description && (
                                          <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                      )}
                                  </div>

                                  <div className="space-y-2">
                                      <Label>产品描述 (英文)</Label>
                                      <RichTextEditor
                                          value={formData.descriptionEn}
                                          onChange={(value) => setFormData({ ...formData, descriptionEn: value })}
                                          placeholder="Product description..."
                                      />
                                  </div>
                              </div>

                              {/* 价格和库存 */}
                              <div className="space-y-4">
                                  <h3 className="text-lg font-medium">价格和库存</h3>

                                  <div className="grid grid-cols-3 gap-4">
                                      <div className="space-y-2">
                                          <Label htmlFor="create-price">
                                              价格 (¥) <span className="text-red-600">*</span>
                                          </Label>
                                          <Input
                                              id="create-price"
                                              type="number"
                                              step="0.01"
                                              min="0"
                                              value={formData.price}
                                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                              required
                                              className={formErrors.price ? 'border-red-500' : ''}
                                          />
                                          {formErrors.price && (
                                              <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                                          )}
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor="create-sale-price">促销价 (¥)</Label>
                                          <Input
                                              id="create-sale-price"
                                              type="number"
                                              step="0.01"
                                              min="0"
                                              value={formData.salePrice}
                                              onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                          />
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor="create-stock">
                                              库存 <span className="text-red-600">*</span>
                                          </Label>
                                          <Input
                                              id="create-stock"
                                              type="number"
                                              min="0"
                                              value={formData.stock}
                                              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                              required
                                              className={formErrors.stock ? 'border-red-500' : ''}
                                          />
                                          {formErrors.stock && (
                                              <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>
                                          )}
                                      </div>
                                  </div>

                                  <div className="space-y-2">
                                      <Label htmlFor="create-status">
                                          状态 <span className="text-red-600">*</span>
                                      </Label>
                                      <select
                                          id="create-status"
                                          value={formData.status}
                                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                                          required
                                      >
                                          <option value="ACTIVE">正常</option>
                                          <option value="INACTIVE">下架</option>
                                          <option value="OUT_OF_STOCK">缺货</option>
                                      </select>
                                  </div>
                              </div>

                              {/* 产品图片 */}
                              <div className="space-y-4">
                                  <h3 className="text-lg font-medium">产品图片</h3>

                                  <div className="space-y-2">
                                      <Label>封面图片</Label>
                                      <ImageUpload
                                          value={formData.featuredImage}
                                          onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                                      />
                                  </div>

                                  <div className="space-y-2">
                                      <Label>产品图片库</Label>
                                      <div className="grid grid-cols-4 gap-4">
                                          {formData.images.map((image, index) => (
                                              <div key={index} className="relative">
                                                  <img
                                                      src={image}
                                                      alt={`产品图片 ${index + 1}`}
                                                      className="w-full h-32 object-cover rounded border"
                                                  />
                                                  <button
                                                      type="button"
                                                      onClick={() => removeImage(index)}
                                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                  >
                                                      ×
                                                  </button>
                                              </div>
                                          ))}
                                          <ImageUpload value="" onChange={(url) => addImage(url)} clearAfterUpload={true} />
                                      </div>
                                  </div>
                              </div>

                              {/* 产品规格 */}
                              <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                      <h3 className="text-lg font-medium">产品规格</h3>
                                      <Button type="button" onClick={addSpecification} size="sm" variant="outline">
                                          + 添加规格
                                      </Button>
                                  </div>

                                  <DndContext
                                      sensors={sensors}
                                      collisionDetection={closestCenter}
                                      onDragEnd={handleSpecificationDragEnd}
                                  >
                                      <SortableContext
                                          items={formData.specifications.map((_, i) => `spec-${i}`)}
                                          strategy={verticalListSortingStrategy}
                                      >
                                          {formData.specifications.map((spec, index) => (
                                              <SortableSpecificationItem
                                                  key={`spec-${index}`}
                                                  spec={spec}
                                                  index={index}
                                                  onUpdate={updateSpecification}
                                                  onRemove={removeSpecification}
                                              />
                                          ))}
                                      </SortableContext>
                                  </DndContext>
                              </div>

                              {/* 产品特性 */}
                              <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                      <h3 className="text-lg font-medium">产品特性</h3>
                                      <Button type="button" onClick={addFeature} size="sm" variant="outline">
                                          + 添加特性
                                      </Button>
                                  </div>

                                  <DndContext
                                      sensors={sensors}
                                      collisionDetection={closestCenter}
                                      onDragEnd={handleFeatureDragEnd}
                                  >
                                      <SortableContext
                                          items={formData.features.map((_, i) => `feature-${i}`)}
                                          strategy={verticalListSortingStrategy}
                                      >
                                          {formData.features.map((feature, index) => (
                                              <SortableFeatureItem
                                                  key={`feature-${index}`}
                                                  feature={feature}
                                                  index={index}
                                                  onUpdate={updateFeature}
                                                  onRemove={removeFeature}
                                              />
                                          ))}
                                      </SortableContext>
                                  </DndContext>
                              </div>
                          </div>
                          <DialogFooter>
                              <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                      setIsCreateDialogOpen(false);
                                      resetForm();
                                  }}
                                  disabled={formLoading}
                              >
                                  取消
                              </Button>
                              <Button
                                  type="button"
                                  onClick={handleAutoTranslate}
                                  disabled={translating || formLoading}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  size="sm"
                              >
                                  {translating ? '翻译中...' : '🌐 自动翻译为英文'}
                              </Button>
                              <Button type="submit" disabled={formLoading}>
                                  {formLoading ? '创建中...' : '创建'}
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
                  placeholder="搜索产品 (名称或SKU)"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="max-w-md"
              />
          </div>

          {/* 产品表格 */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  排序
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  产品
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  分类
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  价格
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  库存
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  状态
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  操作
                              </th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          <SortableContext items={products.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                              {products.map((product) => (
                                  <SortableProductRow
                                      key={product.id}
                                      product={product}
                                      locale={locale}
                                      onView={handleViewProduct}
                                      onEdit={openEditDialog}
                                      onCopy={handleCopyProduct}
                                      onDelete={openDeleteDialog}
                                  />
                              ))}
                          </SortableContext>
                      </tbody>
                  </table>
              </DndContext>
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
              <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                      <DialogTitle>编辑产品</DialogTitle>
                      <DialogDescription>修改产品信息</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditProduct} className="flex flex-col flex-1 overflow-hidden">
                      <div className="space-y-6 py-4 px-6 overflow-y-auto flex-1">
                          {/* 基本信息 */}
                          <div className="space-y-4">
                              <h3 className="text-lg font-medium">基本信息</h3>

                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-name">
                                          产品名称 (中文) <span className="text-red-600">*</span>
                                      </Label>
                                      <Input
                                          id="edit-name"
                                          value={formData.name}
                                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                          required
                                          className={formErrors.name ? 'border-red-500' : ''}
                                      />
                                      {formErrors.name && (
                                          <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                      )}
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-name-en">产品名称 (英文)</Label>
                                      <Input
                                          id="edit-name-en"
                                          value={formData.nameEn}
                                          onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                          placeholder="Product Name"
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <Label htmlFor="edit-category">分类</Label>
                                  <select
                                      id="edit-category"
                                      value={formData.categoryId}
                                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                                  >
                                      <option value="">无分类</option>
                                      {categories.map((cat) => (
                                          <option key={cat.id} value={cat.id}>
                                              {cat.name}
                                          </option>
                                      ))}
                                  </select>
                              </div>

                              <div className="space-y-2">
                                  <Label htmlFor="edit-short-desc">简短描述 (中文)</Label>
                                  <textarea
                                      id="edit-short-desc"
                                      value={formData.shortDesc}
                                      onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                                      className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[60px]"
                                      placeholder="简短的产品描述..."
                                  />
                              </div>

                              <div className="space-y-2">
                                  <Label htmlFor="edit-short-desc-en">简短描述 (英文)</Label>
                                  <textarea
                                      id="edit-short-desc-en"
                                      value={formData.shortDescEn}
                                      onChange={(e) => setFormData({ ...formData, shortDescEn: e.target.value })}
                                      className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[60px]"
                                      placeholder="Short product description..."
                                  />
                              </div>

                              {/* <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-tag">产品标签 (中文)</Label>
                                      <Input
                                          id="edit-tag"
                                          value={formData.tag}
                                          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                          placeholder="核心产品、热门产品等"
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-tag-en">产品标签 (英文)</Label>
                                      <Input
                                          id="edit-tag-en"
                                          value={formData.tagEn}
                                          onChange={(e) => setFormData({ ...formData, tagEn: e.target.value })}
                                          placeholder="Core Product, Popular Product"
                                      />
                                  </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-price-display">价格显示 (中文)</Label>
                                      <Input
                                          id="edit-price-display"
                                          value={formData.priceDisplay}
                                          onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                                          placeholder="联系获取、面议等"
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-price-display-en">价格显示 (英文)</Label>
                                      <Input
                                          id="edit-price-display-en"
                                          value={formData.priceDisplayEn}
                                          onChange={(e) => setFormData({ ...formData, priceDisplayEn: e.target.value })}
                                          placeholder="Contact us, Negotiable"
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <Label htmlFor="edit-rating">产品评分 (1.0-5.0)</Label>
                                  <Input
                                      id="edit-rating"
                                      type="number"
                                      step="0.1"
                                      min="1"
                                      max="5"
                                      value={formData.rating}
                                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                      placeholder="5.0"
                                  />
                              </div> */}
                          </div>

                          {/* 详细描述 */}
                          <div className="space-y-4">
                              <h3 className="text-lg font-medium">详细描述</h3>

                              <div className="space-y-2">
                                  <Label>
                                      产品描述 (中文) <span className="text-red-600">*</span>
                                  </Label>
                                  <RichTextEditor
                                      value={formData.description}
                                      onChange={(value) => setFormData({ ...formData, description: value })}
                                      placeholder="产品详细描述..."
                                  />
                                  {formErrors.description && (
                                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                  )}
                              </div>

                              <div className="space-y-2">
                                  <Label>产品描述 (英文)</Label>
                                  <RichTextEditor
                                      value={formData.descriptionEn}
                                      onChange={(value) => setFormData({ ...formData, descriptionEn: value })}
                                      placeholder="Product description..."
                                  />
                              </div>
                          </div>

                          {/* 价格和库存 */}
                          <div className="space-y-4">
                              <h3 className="text-lg font-medium">价格和库存</h3>

                              <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-price">
                                          价格 (¥) <span className="text-red-600">*</span>
                                      </Label>
                                      <Input
                                          id="edit-price"
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          value={formData.price}
                                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                          required
                                          className={formErrors.price ? 'border-red-500' : ''}
                                      />
                                      {formErrors.price && (
                                          <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                                      )}
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-sale-price">促销价 (¥)</Label>
                                      <Input
                                          id="edit-sale-price"
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          value={formData.salePrice}
                                          onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-stock">库存 *</Label>
                                      <Input
                                          id="edit-stock"
                                          type="number"
                                          min="0"
                                          value={formData.stock}
                                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                          required
                                          className={formErrors.stock ? 'border-red-500' : ''}
                                      />
                                      {formErrors.stock && (
                                          <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>
                                      )}
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <Label htmlFor="edit-status">
                                      状态 <span className="text-red-600">*</span>
                                  </Label>
                                  <select
                                      id="edit-status"
                                      value={formData.status}
                                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                                      required
                                  >
                                      <option value="ACTIVE">正常</option>
                                      <option value="INACTIVE">下架</option>
                                      <option value="OUT_OF_STOCK">缺货</option>
                                  </select>
                              </div>
                          </div>

                          {/* 产品图片 */}
                          <div className="space-y-4">
                              <h3 className="text-lg font-medium">产品图片</h3>

                              <div className="space-y-2">
                                  <Label>封面图片</Label>
                                  <ImageUpload
                                      value={formData.featuredImage}
                                      onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                                  />
                              </div>

                              <div className="space-y-2">
                                  <Label>产品图片库</Label>
                                  <div className="grid grid-cols-4 gap-4">
                                      {formData.images.map((image, index) => (
                                          <div key={index} className="relative">
                                              <img
                                                  src={image}
                                                  alt={`产品图片 ${index + 1}`}
                                                  className="w-full h-32 object-cover rounded border"
                                              />
                                              <button
                                                  type="button"
                                                  onClick={() => removeImage(index)}
                                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                              >
                                                  ×
                                              </button>
                                          </div>
                                      ))}
                                      <ImageUpload value="" onChange={(url) => addImage(url)} clearAfterUpload={true} />
                                  </div>
                              </div>
                          </div>

                          {/* 产品规格 */}
                          <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-medium">产品规格</h3>
                                  <Button type="button" onClick={addSpecification} size="sm" variant="outline">
                                      + 添加规格
                                  </Button>
                              </div>

                              <DndContext
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragEnd={handleSpecificationDragEnd}
                              >
                                  <SortableContext
                                      items={formData.specifications.map((_, i) => `spec-${i}`)}
                                      strategy={verticalListSortingStrategy}
                                  >
                                      {formData.specifications.map((spec, index) => (
                                          <SortableSpecificationItem
                                              key={`spec-${index}`}
                                              spec={spec}
                                              index={index}
                                              onUpdate={updateSpecification}
                                              onRemove={removeSpecification}
                                          />
                                      ))}
                                  </SortableContext>
                              </DndContext>
                          </div>

                          {/* 产品特性 */}
                          <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-medium">产品特性</h3>
                                  <Button type="button" onClick={addFeature} size="sm" variant="outline">
                                      + 添加特性
                                  </Button>
                              </div>

                              <DndContext
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragEnd={handleFeatureDragEnd}
                              >
                                  <SortableContext
                                      items={formData.features.map((_, i) => `feature-${i}`)}
                                      strategy={verticalListSortingStrategy}
                                  >
                                      {formData.features.map((feature, index) => (
                                          <SortableFeatureItem
                                              key={`feature-${index}`}
                                              feature={feature}
                                              index={index}
                                              onUpdate={updateFeature}
                                              onRemove={removeFeature}
                                          />
                                      ))}
                                  </SortableContext>
                              </DndContext>
                          </div>
                      </div>
                      <DialogFooter>
                          <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                  setIsEditDialogOpen(false);
                                  setSelectedProduct(null);
                                  resetForm();
                              }}
                              disabled={formLoading}
                          >
                              取消
                          </Button>{' '}
                          <Button
                              type="button"
                              onClick={handleAutoTranslate}
                              disabled={translating || formLoading}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                          >
                              {translating ? '翻译中...' : '🌐 自动翻译为英文'}
                          </Button>
                          <Button type="submit" disabled={formLoading}>
                              {formLoading ? '更新中...' : '更新'}
                          </Button>
                      </DialogFooter>
                  </form>
              </DialogContent>
          </Dialog>

          {/* 删除确认对话框 */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="max-w-1xl">
                  <DialogHeader>
                      <DialogTitle>确认删除</DialogTitle>
                      <DialogDescription>
                          确定要删除产品 &quot;{selectedProduct?.name}&quot; 吗? 此操作不可恢复。
                      </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                      <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                              setIsDeleteDialogOpen(false);
                              setSelectedProduct(null);
                          }}
                          disabled={formLoading}
                      >
                          取消
                      </Button>
                      <Button type="button" variant="destructive" onClick={handleDeleteProduct} disabled={formLoading}>
                          {formLoading ? '删除中...' : '删除'}
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      </div>
  );
}
