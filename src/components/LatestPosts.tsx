"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

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
        <div className="text-gray-500">{locale === "zh" ? "加载中..." : "Loading..."}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            {locale === "zh" ? "企业资讯" : "Corporate information"}
          </h2>
          <Link
            href={`/${locale}/posts`}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {locale === "zh" ? "查看全部" : "View All"}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
            const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;

            return (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.featuredImage && (
                  <Link href={`/${locale}/posts/${post.slug}`}>
                    <img
                      src={post.featuredImage}
                      alt={title}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                )}
                <div className="p-6">
                  {post.category && (
                    <Link
                      href={`/${locale}/posts?category=${post.category.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {locale === "en" ? post.category.nameEn : post.category.name }
                    </Link>
                  )}
                  <h3 className="text-xl font-bold mt-2 mb-2">
                    <Link
                      href={`/${locale}/posts/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {title}
                    </Link>
                  </h3>
                  {excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
                  )}
                  <div className="text-sm text-gray-500">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                      locale === "zh" ? "zh-CN" : "en-US"
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
