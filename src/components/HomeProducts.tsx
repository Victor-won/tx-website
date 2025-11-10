"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, Share2, ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  nameEn: string | null;
  description: string;
  descriptionEn: string | null;
  tag: string | null;
  tagEn: string | null;
  priceDisplay: string | null;
  priceDisplayEn: string | null;
  rating: number | null;
  features: Array<{ title: string; titleEn?: string; description: string; descriptionEn?: string; icon?: string }> | null;
  featuredImage: string | null;
  stock: number;
}

export default function HomeProducts() {
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products?limit=6&status=ACTIVE");
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("获取产品列表失败:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <Card className="overflow-hidden">
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
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{locale === "zh" ? "暂无产品" : "No products available"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
      {products.map((product, index) => {
        const name = locale === "en" && product.nameEn ? product.nameEn : product.name;
        const description = locale === "en" && product.descriptionEn ? product.descriptionEn : product.description;
        const tag = locale === "en" && product.tagEn ? product.tagEn : product.tag;
        const priceDisplay = locale === "en" && product.priceDisplayEn ? product.priceDisplayEn : product.priceDisplay;

        return (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              name,
              description,
              tag,
              priceDisplay,
            }}
            index={index}
          />
        );
      })}
    </div>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: {
    id: string;
    name: string;
    description: string;
    tag: string | null;
    priceDisplay: string | null;
    rating: number | null;
    features: Array<{ title: string; titleEn?: string; description: string; descriptionEn?: string; icon?: string }> | null;
    featuredImage: string | null;
    stock: number;
  };
  index: number;
}) {
  const locale = useLocale();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inStock = product.stock > 0;
  const rating = product.rating ? Number(product.rating) : 5.0;

  // 预加载图片
  useEffect(() => {
    const img = new Image();
    img.src = product.featuredImage || '/SL-021920-28230-15.jpg';
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true); // 即使加载失败也显示
  }, [product.featuredImage]);

  return (
    <Card
      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-gray-100/50 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/${locale}/products/${product.id}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 图片区域 */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        {/* 加载状态指示器 */}
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

        {/* 渐变遮罩 */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* 产品标签 */}
        {product.tag && (
          <div className="absolute top-6 left-6">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-xs px-2 py-1">
              {product.tag}
            </Badge>
          </div>
        )}

        {/* 价格标签 */}
        {product.priceDisplay && (
          <div className="absolute top-6 right-6">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-primary text-xs px-2 py-1">
              {product.priceDisplay}
            </Badge>
          </div>
        )}

        {/* 悬停显示的操作按钮 */}
        <div
          className={`absolute bottom-6 left-6 right-6 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 backdrop-blur-md text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/${locale}/products/${product.id}`;
              }}
            >
              {locale === "zh" ? "快速查看" : "Quick View"}
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="backdrop-blur-md h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <CardHeader>
        {/* 产品评分和状态 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-3.5 h-3.5 fill-current transition-all duration-300 hover:scale-110"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">{rating.toFixed(1)}</span>
          </div>
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0.5 ${
              inStock
                ? "text-green-600 border-green-200"
                : "text-gray-600 border-gray-200"
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

        <CardTitle className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-3 leading-relaxed text-gray-600">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* 产品特性 */}
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
    </Card>
  );
}
