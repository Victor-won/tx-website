"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ReactNode } from "react";

interface SiteLayoutProps {
  children: ReactNode;
}

interface NavLink {
  href: string;
  label: string;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { data: session } = useSession();
  const t = useTranslations();
  const locale = useLocale();
  const navMaps: NavLink[] = [
    { href: `/${locale}/products`, label: t('nav.products') },
    { href: `/${locale}`, label: t('nav.solutions') },
    { href: `/${locale}/posts`, label: t('nav.projectCollaboration') },
    { href: `/${locale}/categories`, label: t('nav.about') },
    { href: `/${locale}/categories`, label: t('nav.contact') },
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
          <header className="bg-white/85 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all duration-300 border-b border-gray-100/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-4">
                      <div className="flex justify-start">
                          <Link href={`/${locale}`}>
                              <h1 className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors">
                                  TX Website
                              </h1>
                          </Link>
                      </div>
                      <nav className="hidden md:flex space-x-10 flex-1 justify-center">
                          {navMaps.map((link, index) => (
                              <Link
                                  key={index}
                                  href={link.href}
                                  className="relative text-gray-700 hover:text-primary font-medium text-base transition-all duration-300 group py-2"
                              >
                                  {link.label}
                                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full rounded-full"></span>
                              </Link>
                          ))}
                      </nav>
                      <div className="flex items-center space-x-4">
                          <LanguageSwitcher />
                          {session ? (
                              <>
                                  <span className="text-sm text-gray-600 hidden md:inline">
                                      {t('home.welcome', { name: session.user.name || 'User' })}
                                  </span>
                                  {session.user.role === 'ADMIN' && (
                                      <Link
                                          href={`/${locale}/admin`}
                                          className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                      >
                                          {t('nav.admin')}
                                      </Link>
                                  )}
                                  <button
                                      onClick={() => signOut()}
                                      className="text-sm font-medium text-gray-500 hover:text-white transition-colors"
                                  >
                                      {t('nav.signout')}
                                  </button>
                              </>
                          ) : (
                              <>
                                  <Link
                                      href={`/${locale}/auth/signin`}
                                      className="text-sm font-medium text-gray-500 hover:text-white transition-colors"
                                  >
                                      {t('nav.signin')}
                                  </Link>
                                  <Link
                                      href={`/${locale}/auth/signup`}
                                      className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                  >
                                      {t('nav.signup')}
                                  </Link>
                              </>
                          )}
                      </div>
                  </div>
              </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-gray-800 border-t mt-auto">
              <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                          <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                              {locale === 'zh' ? '关于我们' : 'About'}
                          </h3>
                          <p className="text-sm text-gray-400">
                              TX Website -{' '}
                              {locale === 'zh' ? '现代化的内容管理系统' : 'Modern Content Management System'}
                          </p>
                      </div>
                      <div>
                          <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                              {locale === 'zh' ? '快速链接' : 'Quick Links'}
                          </h3>
                          <ul className="space-y-2">
                              <li>
                                  <Link href={`/${locale}/posts`} className="text-sm text-gray-400 hover:text-white">
                                      {t('nav.posts')}
                                  </Link>
                              </li>
                              <li>
                                  <Link href={`/${locale}/products`} className="text-sm text-gray-400 hover:text-white">
                                      {t('nav.products')}
                                  </Link>
                              </li>
                              <li>
                                  <Link
                                      href={`/${locale}/categories`}
                                      className="text-sm text-gray-400 hover:text-white"
                                  >
                                      {t('nav.categories')}
                                  </Link>
                              </li>
                          </ul>
                      </div>
                      <div>
                          <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                              {locale === 'zh' ? '联系方式' : 'Contact'}
                          </h3>
                          <p className="text-sm text-gray-400">Email: contact@txwebsite.com</p>
                      </div>
                  </div>
                  <div className="mt-8 border-t border-gray-900 pt-8">
                      <p className="text-center text-sm text-gray-400">{t('home.copyright')}</p>
                  </div>
              </div>
          </footer>
      </div>
  );
}
