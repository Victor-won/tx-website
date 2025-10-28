import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import SiteLayout from "@/components/SiteLayout";

export const dynamic = "force-dynamic";

interface Post {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  excerpt?: string;
  excerptEn?: string;
  featuredImage?: string;
  status: string;
  category?: {
    id: string;
    name: string;
    nameEn?: string;
  };
  author: {
    id: string;
    name?: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface PostPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

async function getPostById(id: string): Promise<Post | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success && data.data ? data.data : null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getRelatedPosts(categoryId: string, currentPostId: string, limit: number = 3) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(
      `${baseUrl}/api/posts?categoryId=${categoryId}&limit=${limit + 1}&status=PUBLISHED`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const posts = data.data || [];
    return posts.filter((p: Post) => p.id !== currentPostId).slice(0, limit);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

function RelatedPostCard({ post, locale }: { post: Post; locale: string }) {
  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;

  return (
    <Link
      href={`/${locale}/posts/${post.id}`}
      className="group flex gap-4 bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={title}
          className="w-24 h-24 object-cover rounded flex-shrink-0"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
            locale === "zh" ? "zh-CN" : "en-US"
          )}
        </p>
      </div>
    </Link>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;

  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const content = locale === "en" && post.contentEn ? post.contentEn : post.content;

  const relatedPosts = post.category
    ? await getRelatedPosts(post.category.id, post.id)
    : [];

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gray-50">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">
              {locale === "zh" ? "首页" : "Home"}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/posts`} className="hover:text-blue-600">
              {locale === "zh" ? "文章" : "Posts"}
            </Link>
            {post.category && (
              <>
                <span className="mx-2">/</span>
                <Link
                  href={`/${locale}/posts?category=${post.category.id}`}
                  className="hover:text-blue-600"
                >
                  {locale === "en" && post.category.nameEn ? post.category.nameEn : post.category.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900">{title}</span>
          </nav>

        {/* Post Header */}
        <header className="mb-8">
          {post.category && (
            <Link
              href={`/${locale}/posts?category=${post.category.id}`}
              className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium mb-4"
            >
              {locale === "en" && post.category.nameEn ? post.category.nameEn : post.category.name}
            </Link>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {post.author.name || post.author.email}
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                locale === "zh" ? "zh-CN" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featuredImage}
              alt={title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Post Footer */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {locale === "zh" ? "最后更新：" : "Last updated: "}
              {new Date(post.updatedAt).toLocaleDateString(
                locale === "zh" ? "zh-CN" : "en-US"
              )}
            </div>
            <div className="flex gap-2">
              {/* Share buttons placeholder */}
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">
              {locale === "zh" ? "相关文章" : "Related Posts"}
            </h2>
            <div className="space-y-4">
              {relatedPosts.map((relatedPost: Post) => (
                <RelatedPostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
    </SiteLayout>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps) {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;
  const post = await getPostById(id);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;

  return {
    title: title,
    description: excerpt || title,
    openGraph: {
      title: title,
      description: excerpt || title,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name || post.author.email],
    },
  };
}
