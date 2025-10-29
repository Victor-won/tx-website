"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, Share2, ShoppingCart, Check, Package, Truck, Shield, X, ZoomIn } from "lucide-react";
import Link from "next/link";

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
  price: number;
  salePrice: number | null;
  priceDisplay: string | null;
  priceDisplayEn: string | null;
  rating: number | null;
  stock: number;
  specifications: Array<{ name: string; nameEn?: string; value: string; valueEn?: string }> | null;
  features: Array<{ title: string; titleEn?: string; description: string; descriptionEn?: string; icon?: string }> | null;
  featuredImage: string | null;
  images: string[] | null;
  category?: {
    id: string;
    name: string;
    nameEn: string | null;
  } | null;
}

export default function ProductDetailPage() {
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (data.success && data.data) {
        setProduct(data.data);
        setSelectedImage(data.data.featuredImage || "/SL-021920-28230-15.jpg");

        // 获取相关产品（同类别的其他产品）
        if (data.data.categoryId) {
          fetchRelatedProducts(data.data.categoryId, data.data.id);
        }
      }
    } catch (error) {
      console.error("获取产品详情失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: string, currentProductId: string) => {
    try {
      const response = await fetch(`/api/products?limit=4&status=ACTIVE&categoryId=${categoryId}`);
      const data = await response.json();

      if (data.success && data.data) {
        // 过滤掉当前产品，只显示其他产品
        const filtered = data.data.filter((p: Product) => p.id !== currentProductId);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (error) {
      console.error("获取相关产品失败:", error);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 rounded" />
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-32 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-12">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === "zh" ? "产品未找到" : "Product Not Found"}
                </h1>
                <p className="text-gray-600 mb-6">
                  {locale === "zh" ? "抱歉，我们找不到您要查找的产品。" : "Sorry, we couldn't find the product you're looking for."}
                </p>
                <Button asChild>
                  <Link href={`/${locale}/products`}>
                    {locale === "zh" ? "返回产品列表" : "Back to Products"}
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const name = locale === "en" && product.nameEn ? product.nameEn : product.name;
  const description = locale === "en" && product.descriptionEn ? product.descriptionEn : product.description;
  const shortDesc = product.shortDesc
    ? (locale === "en" && product.shortDescEn ? product.shortDescEn : product.shortDesc)
    : null;
  const tag = locale === "en" && product.tagEn ? product.tagEn : product.tag;
  const priceDisplay = locale === "en" && product.priceDisplayEn ? product.priceDisplayEn : product.priceDisplay;
  const categoryName = product.category
    ? (locale === "en" && product.category.nameEn ? product.category.nameEn : product.category.name)
    : null;

  const inStock = product.stock > 0;
  const rating = product.rating ? Number(product.rating) : 5.0;
  const allImages = [
    product.featuredImage || "/SL-021920-28230-15.jpg",
    ...(product.images || []),
  ];

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* 面包屑导航 */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href={`/${locale}`} className="hover:text-primary">
                {locale === "zh" ? "首页" : "Home"}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/products`} className="hover:text-primary">
                {locale === "zh" ? "产品" : "Products"}
              </Link>
              {categoryName && (
                <>
                  <span>/</span>
                  <span className="text-gray-900">{categoryName}</span>
                </>
              )}
              <span>/</span>
              <span className="text-gray-900">{name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 左侧：产品图片 */}
            <div className="space-y-4">
              {/* 主图 */}
              <Card className="overflow-hidden group/image cursor-zoom-in" onClick={() => setIsImageZoomed(true)}>
                <div className="relative w-full aspect-square bg-gray-100">
                  <img
                    src={selectedImage}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
                  />
                  {tag && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-primary/80">
                      {tag}
                    </Badge>
                  )}
                  {/* 放大提示 */}
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                      <ZoomIn className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* 缩略图 */}
              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 w-24 ${
                        selectedImage === image
                          ? "border-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 右侧：产品信息 */}
            <div className="space-y-6">
              {/* 标题和评分 */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <Badge
                    variant="outline"
                    className={inStock ? "text-green-600 border-green-200" : "text-gray-600 border-gray-200"}
                  >
                    {inStock ? (locale === "zh" ? "现货" : "In Stock") : (locale === "zh" ? "缺货" : "Out of Stock")}
                  </Badge>
                </div>
                {shortDesc && (
                  <p className="text-lg text-gray-600">{shortDesc}</p>
                )}
              </div>

              <Separator />

              {/* 价格 */}
              <div>
                <div className="flex items-baseline gap-4">
                  {priceDisplay ? (
                    <span className="text-3xl font-bold text-primary">{priceDisplay}</span>
                  ) : (
                    <>
                      {product.salePrice && (
                        <span className="text-3xl font-bold text-primary">
                          ¥{Number(product.salePrice).toFixed(2)}
                        </span>
                      )}
                      <span className={`text-2xl ${product.salePrice ? 'line-through text-gray-400' : 'font-bold text-primary'}`}>
                        ¥{Number(product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* 数量选择和购买按钮 */}

              {/* 服务承诺 */}
              <Card className="bg-gray-50 border-0">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      <span className="text-sm">{locale === "zh" ? "原装正品" : "Genuine Product"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="text-sm">{locale === "zh" ? "快速配送" : "Fast Delivery"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-sm">{locale === "zh" ? "质量保证" : "Quality Guaranteed"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-sm">{locale === "zh" ? "售后无忧" : "After-sales Support"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 详细信息标签页 */}
          <div className="mt-16 space-y-8">
            {/* 产品描述 */}
            <Card>
              <CardHeader>
                <CardTitle>{locale === "zh" ? "产品描述" : "Product Description"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </CardContent>
            </Card>

            {/* 产品特性 */}
            {product.features && product.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{locale === "zh" ? "产品特性" : "Product Features"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.features.map((feature, index) => {
                      const featureTitle = locale === "en" && feature.titleEn ? feature.titleEn : feature.title;
                      const featureDesc = locale === "en" && feature.descriptionEn ? feature.descriptionEn : feature.description;
                      return (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Check className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{featureTitle}</h3>
                            <p className="text-sm text-gray-600">{featureDesc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 产品规格 */}
            {product.specifications && product.specifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{locale === "zh" ? "技术规格" : "Technical Specifications"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {product.specifications.map((spec, index) => {
                      const specName = locale === "en" && spec.nameEn ? spec.nameEn : spec.name;
                      const specValue = locale === "en" && spec.valueEn ? spec.valueEn : spec.value;
                      return (
                        <div key={index} className="py-4 grid grid-cols-3 gap-4">
                          <div className="font-medium text-gray-700">{specName}</div>
                          <div className="col-span-2 text-gray-600">{specValue}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 相关产品推荐 */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {locale === "zh" ? "相关产品推荐" : "Related Products"}
                </h2>
                <p className="text-gray-600 mt-2">
                  {locale === "zh" ? "您可能还对这些产品感兴趣" : "You might also be interested in these products"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedName = locale === "en" && relatedProduct.nameEn ? relatedProduct.nameEn : relatedProduct.name;
                  const relatedDesc = locale === "en" && relatedProduct.descriptionEn ? relatedProduct.descriptionEn : relatedProduct.description;
                  const relatedTag = locale === "en" && relatedProduct.tagEn ? relatedProduct.tagEn : relatedProduct.tag;
                  const relatedRating = relatedProduct.rating ? Number(relatedProduct.rating) : 5.0;
                  const relatedInStock = relatedProduct.stock > 0;

                  return (
                    <Link
                      key={relatedProduct.id}
                      href={`/${locale}/products/${relatedProduct.id}`}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={relatedProduct.featuredImage || "/SL-021920-28230-15.jpg"}
                            alt={relatedName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {relatedTag && (
                            <Badge className="absolute top-2 left-2 text-xs bg-gradient-to-r from-primary to-primary/80">
                              {relatedTag}
                            </Badge>
                          )}
                        </div>
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{relatedRating.toFixed(1)}</span>
                          </div>
                          <CardTitle className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedName}
                          </CardTitle>
                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                            {relatedDesc}
                          </p>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              relatedInStock
                                ? "text-green-600 border-green-200"
                                : "text-gray-600 border-gray-200"
                            }`}
                          >
                            {relatedInStock ? (locale === "zh" ? "现货" : "In Stock") : (locale === "zh" ? "缺货" : "Out of Stock")}
                          </Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 图片放大模态框 */}
      {isImageZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageZoomed(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full h-12 w-12"
            onClick={() => setIsImageZoomed(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt={name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {/* 缩略图导航 */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90vw] overflow-x-auto bg-black/50 backdrop-blur-sm p-2 rounded-lg scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              <div className="flex gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                    }}
                    className={`relative h-16 w-16 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === image
                        ? "border-white scale-110"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </SiteLayout>
  );
}
