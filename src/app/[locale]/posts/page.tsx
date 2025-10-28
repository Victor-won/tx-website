import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";

export const dynamic = "force-dynamic";

interface Post {
  id: string;
  title: string;
  titleEn?: string;

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
    name?: string;
    email: string;
  };
  createdAt: string;
  publishedAt?: string;
}

interface PostsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
  params: Promise<{
    locale: string;
  }>;
}

async function getPosts(page: number = 1, categoryId?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "12",
    status: "PUBLISHED",
  });

  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  const response = await fetch(`${baseUrl}/api/posts?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/categories?limit=100`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

function PostCard({ post, locale }: { post: Post; locale: string }) {
  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const excerpt =
    locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.featuredImage && (
        <Link href={`/${locale}/posts/${post.id}`}>
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
            {locale === "en" && post.category.nameEn ? post.category.nameEn : post.category.name}
          </Link>
        )}
        <h2 className="text-xl font-bold mt-2 mb-2">
          <Link
            href={`/${locale}/posts/${post.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
        </h2>
        {excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.author.name || post.author.email}</span>
          <time>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
              locale === "zh" ? "zh-CN" : "en-US",
            )}
          </time>
        </div>
      </div>
    </article>
  );
}

function Pagination({
  currentPage,
  totalPages,
  locale,
  categoryId,
}: {
  currentPage: number;
  totalPages: number;
  locale: string;
  categoryId?: string;
}) {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const buildUrl = (page: number) => {
    const params = new URLSearchParams({ page: page.toString() });
    if (categoryId) {
      params.append("category", categoryId);
    }
    return `/${locale}/posts?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
        >
          上一页
        </Link>
      )}

      {startPage > 1 && (
        <>
          <Link
            href={buildUrl(1)}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildUrl(page)}
          className={`px-4 py-2 border rounded transition-colors ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Link
            href={buildUrl(totalPages)}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
        >
          下一页
        </Link>
      )}
    </div>
  );
}

export default async function PostsPage({
  searchParams,
  params,
}: PostsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { locale } = resolvedParams;

  const page = parseInt(resolvedSearchParams.page || "1");
  const categoryId = resolvedSearchParams.category;

  const [postsData, categoriesData] = await Promise.all([
    getPosts(page, categoryId),
    getCategories(),
  ]);

  const posts = postsData.data || [];
  const pagination = postsData.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
  };
  const categories = categoriesData.data || [];

  const currentCategory = categoryId
    ? categories.find((c: any) => c.id === categoryId)
    : null;

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {currentCategory
                ? (locale === "en" ? currentCategory.nameEn : currentCategory.name)
                : locale === "zh"
                  ? "资讯"
                  : "Information"}
            </h1>
            {currentCategory?.description && (
              <p className="text-gray-600">{ locale === 'en' ? currentCategory.descriptionEn : currentCategory.description}</p>
            )}
          </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href={`/${locale}/posts`}
              className={`px-4 py-2 rounded-full transition-colors ${
                !categoryId
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {locale === "zh" ? "全部" : "All"}
            </Link>
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/${locale}/posts?category=${category.id}`}
                className={`px-4 py-2 rounded-full transition-colors ${
                  categoryId === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {locale === "en" && category.nameEn ? category.nameEn : category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: Post) => (
                <PostCard key={post.id} post={post} locale={locale} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                locale={locale}
                categoryId={categoryId}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {locale === "zh" ? "暂无文章" : "No articles yet"}
            </p>
          </div>
        )}
      </div>
    </div>
    </SiteLayout>
  );
}
