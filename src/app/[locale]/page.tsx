"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const { data: session } = useSession();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <h1 className="text-2xl font-bold text-gray-900">TX Website</h1>
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link
                href={`/${locale}`}
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                {t("nav.home")}
              </Link>
              <Link
                href={`/${locale}/products`}
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                {t("nav.products")}
              </Link>
              <Link
                href={`/${locale}/posts`}
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                {t("nav.posts")}
              </Link>
              <Link
                href={`/${locale}/categories`}
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                {t("nav.categories")}
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              {session ? (
                <>
                  <span className="text-sm text-gray-600">
                    {t("home.welcome", { name: session.user.name || "User" })}
                  </span>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href={`/${locale}/admin`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      {t("nav.admin")}
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    {t("nav.signout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/auth/signin`}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    {t("nav.signin")}
                  </Link>
                  <Link
                    href={`/${locale}/auth/signup`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t("nav.signup")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {t("home.title")}
          </h2>
          <p className="mt-4 text-xl text-gray-600">{t("home.subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">
                      {locale === "zh" ? "产" : "P"}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("home.productManagement")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {t("home.productDescription")}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/api/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {t("home.viewApi")}
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">
                      {locale === "zh" ? "文" : "A"}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("home.postManagement")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {t("home.postDescription")}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/api/posts"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  {t("home.viewApi")}
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">
                      {locale === "zh" ? "类" : "C"}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("home.categoryManagement")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {t("home.categoryDescription")}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/api/categories"
                  className="text-sm font-medium text-purple-600 hover:text-purple-500"
                >
                  {t("home.viewApi")}
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">
                      {locale === "zh" ? "媒" : "M"}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("home.mediaLibrary")}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {t("home.mediaDescription")}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/api/media"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  {t("home.viewApi")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("home.apiEndpoints")}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  {t("api.products.title")}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>GET /api/products - {t("api.products.list")}</li>
                  <li>POST /api/products - {t("api.products.create")}</li>
                  <li>GET /api/products/[id] - {t("api.products.get")}</li>
                  <li>PUT /api/products/[id] - {t("api.products.update")}</li>
                  <li>
                    DELETE /api/products/[id] - {t("api.products.delete")}
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  {t("api.posts.title")}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>GET /api/posts - {t("api.posts.list")}</li>
                  <li>POST /api/posts - {t("api.posts.create")}</li>
                  <li>GET /api/posts/[id] - {t("api.posts.get")}</li>
                  <li>PUT /api/posts/[id] - {t("api.posts.update")}</li>
                  <li>DELETE /api/posts/[id] - {t("api.posts.delete")}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  {t("api.categories.title")}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>GET /api/categories - {t("api.categories.list")}</li>
                  <li>POST /api/categories - {t("api.categories.create")}</li>
                  <li>GET /api/categories/[id] - {t("api.categories.get")}</li>
                  <li>
                    PUT /api/categories/[id] - {t("api.categories.update")}
                  </li>
                  <li>
                    DELETE /api/categories/[id] - {t("api.categories.delete")}
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  {t("api.media.title")}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>GET /api/media - {t("api.media.list")}</li>
                  <li>POST /api/media - {t("api.media.create")}</li>
                  <li>GET /api/media/[id] - {t("api.media.get")}</li>
                  <li>PUT /api/media/[id] - {t("api.media.update")}</li>
                  <li>DELETE /api/media/[id] - {t("api.media.delete")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            {t("home.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}
