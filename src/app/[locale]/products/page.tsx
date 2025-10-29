"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SiteLayout from "@/components/SiteLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Heart, Share2, ArrowRight, Search, Filter } from "lucide-react";
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
  priceDisplay: string | null;
  priceDisplayEn: string | null;
  rating: number | null;
  features: Array<{ title: string; titleEn?: string; description: string; descriptionEn?: string; icon?: string }> | null;
  featuredImage: string | null;
  stock: number;
  category?: {
    id: string;
    name: string;
    nameEn: string | null;
  } | null;
}

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
}

export default function ProductsPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
        status: "ACTIVE",
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { categoryId: selectedCategory }),
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
      const response = await fetch("/api/categories?limit=100");
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

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    setCurrentPage(1);
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* 页面标题 */}
        <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                {locale === "zh" ? "产品中心" : "Products"}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {locale === "zh" ? "探索我们的产品" : "Explore Our Products"}
              </h1>
              <p className="text-lg text-white/90">
                {locale === "zh"
                  ? "为您提供高品质的通信产品与解决方案"
                  : "Providing high-quality communication products and solutions"}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏筛选 */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    {locale === "zh" ? "筛选" : "Filter"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 搜索框 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "搜索产品" : "Search Products"}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={locale === "zh" ? "输入关键词..." : "Enter keywords..."}
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* 分类筛选 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {locale === "zh" ? "产品分类" : "Categories"}
                    </label>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === "" ? "default" : "outline"}
                        className="w-full justify-start"
                        size="sm"
                        onClick={() => handleCategoryFilter("")}
                      >
                        {locale === "zh" ? "全部" : "All"}
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          className="w-full justify-start"
                          size="sm"
                          onClick={() => handleCategoryFilter(category.id)}
                        >
                          {locale === "en" && category.nameEn ? category.nameEn : category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* 主要内容区 */}
            <main className="flex-1">
              {/* 结果统计 */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {locale === "zh"
                    ? `共找到 ${total} 个产品`
                    : `Found ${total} products`}
                </p>
              </div>

              {/* 产品列表 */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden animate-pulse">
                      <div className="w-full aspect-square bg-gray-200" />
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 rounded w-16" />
                          <div className="h-6 bg-gray-200 rounded w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center">
                    <p className="text-gray-500 text-lg">
                      {locale === "zh" ? "没有找到相关产品" : "No products found"}
                    </p>
                  </div>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>

                  {/* 分页 */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        {locale === "zh" ? "上一页" : "Previous"}
                      </Button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        {locale === "zh" ? "下一页" : "Next"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const locale = useLocale();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const name = locale === "en" && product.nameEn ? product.nameEn : product.name;
  const description = product.shortDesc
    ? (locale === "en" && product.shortDescEn ? product.shortDescEn : product.shortDesc)
    : (locale === "en" && product.descriptionEn ? product.descriptionEn : product.description);
  const tag = locale === "en" && product.tagEn ? product.tagEn : product.tag;
  const priceDisplay = locale === "en" && product.priceDisplayEn ? product.priceDisplayEn : product.priceDisplay;

  const inStock = product.stock > 0;
  const rating = product.rating ? Number(product.rating) : 5.0;

  // 预加载图片
  useEffect(() => {
    const img = new Image();
    img.src = product.featuredImage || '/SL-021920-28230-15.jpg';
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true);
  }, [product.featuredImage]);

  return (
    <Card
      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-gray-100/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 图片区域 */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        <div
          className={`w-full h-full bg-cover bg-center transform transition-all duration-700 ${
            isLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${product.featuredImage || '/SL-021920-28230-15.jpg'}')` }}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {tag && (
          <div className="absolute top-6 left-6">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-xs px-2 py-1">
              {tag}
            </Badge>
          </div>
        )}

        {priceDisplay && (
          <div className="absolute top-6 right-6">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-primary text-xs px-2 py-1">
              {priceDisplay}
            </Badge>
          </div>
        )}

        <div
          className={`absolute bottom-6 left-6 right-6 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="flex-1 backdrop-blur-md text-xs" asChild>
              <Link href={`/${locale}/products/${product.id}`}>
                {locale === "zh" ? "查看详情" : "View Details"}
              </Link>
            </Button>
            <Button size="icon" variant="secondary" className="backdrop-blur-md h-8 w-8">
              <Heart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-3.5 h-3.5 fill-current"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">{rating.toFixed(1)}</span>
          </div>
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0.5 ${
              inStock ? "text-green-600 border-green-200" : "text-gray-600 border-gray-200"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full mr-1 ${
                inStock ? "bg-green-500 animate-pulse" : "bg-gray-500"
              }`}
            />
            {inStock ? (locale === "zh" ? "现货" : "In Stock") : (locale === "zh" ? "缺货" : "Out of Stock")}
          </Badge>
        </div>

        <CardTitle className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {name}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-3 leading-relaxed text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {product.features && Array.isArray(product.features) && product.features.length > 0 ? (
            product.features.slice(0, 3).map((feature, idx) => {
              const featureText = locale === "en" && feature.titleEn ? feature.titleEn : feature.title;
              return (
                <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                  {featureText}
                </Badge>
              );
            })
          ) : (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {locale === "zh" ? "暂无特性" : "No features"}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-6 border-t">
        <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs font-semibold group/link">
          <Link href={`/${locale}/products/${product.id}`} className="inline-flex items-center gap-1">
            {locale === "zh" ? "了解更多" : "Learn More"}
            <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-red-500">
            <Heart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
