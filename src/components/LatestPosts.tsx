"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

interface Post {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt?: string;
  excerptEn?: string;
  featuredImage?: string;
  category?: {
    id: string;
    name: string;
    nameEn: string;
  };
  createdAt: string;
  publishedAt?: string;
}

export function LatestPosts() {
  const locale = useLocale();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts?limit=6&status=PUBLISHED");
        const data = await response.json();
        if (data.success) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground">{locale === "zh" ? "加载中..." : "Loading..."}</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div>
      {/* 标题区域 */}
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {locale === "zh" ? "企业资讯" : "Corporate Information"}
          </h2>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/posts`} className="inline-flex items-center gap-2">
            <span className="hidden sm:inline">{locale === "zh" ? "查看全部" : "View All"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* 文章网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts.map((post, index) => {
          const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
          const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;

          return (
            <Card
              key={post.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {post.featuredImage && (
                <Link href={`/${locale}/posts/${post.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              )}

              <CardHeader>
                {post.category && (
                  <Badge variant="outline" className="w-fit mb-2 text-xs px-2 py-0.5">
                    <Link
                      href={`/${locale}/posts?category=${post.category.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {locale === "en" ? post.category.nameEn : post.category.name}
                    </Link>
                  </Badge>
                )}
                <CardTitle className="text-base md:text-lg line-clamp-2 group-hover:text-primary transition-colors font-bold text-gray-900">
                  <Link href={`/${locale}/posts/${post.slug}`}>
                    {title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {excerpt && (
                  <CardDescription className="text-sm line-clamp-3 leading-relaxed text-gray-600">
                    {excerpt}
                  </CardDescription>
                )}
              </CardContent>

              <CardFooter className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.publishedAt || post.createdAt}>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                      locale === "zh" ? "zh-CN" : "en-US"
                    )}
                  </time>
                </div>
                <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
                  <Link href={`/${locale}/posts/${post.slug}`} className="inline-flex items-center gap-1">
                    {locale === "zh" ? "阅读" : "Read"}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
