"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu, User, LogOut, Settings } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navMaps: NavLink[] = [
    { href: `/${locale}/products`, label: t('nav.products') },
    { href: `/${locale}`, label: t('nav.solutions') },
    // { href: `/${locale}/posts`, label: t('nav.projectCollaboration') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ];

  const getUserInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
          <header className="bg-white/85 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all duration-300 border-b border-gray-100/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-4">
                      {/* Logo */}
                      <div className="flex justify-start">
                          <Link href={`/${locale}`}>
                              <h1 className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-primary transition-colors">
                                  TX Website
                              </h1>
                          </Link>
                      </div>

                      {/* Desktop Navigation */}
                      <nav className="hidden md:flex flex-1 justify-center">
                          <NavigationMenu>
                              <NavigationMenuList>
                                  {navMaps.map((link, index) => (
                                      <NavigationMenuItem key={index}>
                                          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                              <Link href={link.href}>
                                                  {link.label}
                                              </Link>
                                          </NavigationMenuLink>
                                      </NavigationMenuItem>
                                  ))}
                              </NavigationMenuList>
                          </NavigationMenu>
                      </nav>

                      {/* Right Section */}
                      <div className="flex items-center gap-3">
                          <LanguageSwitcher />

                          {/* Desktop Auth Section */}
                          <div className="hidden md:flex items-center gap-2">
                              {session ? (
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                              <Avatar className="h-10 w-10">
                                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                                      {getUserInitials(session.user.name)}
                                                  </AvatarFallback>
                                              </Avatar>
                                          </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-56" align="end" forceMount>
                                          <DropdownMenuLabel className="font-normal">
                                              <div className="flex flex-col space-y-1">
                                                  <p className="text-sm font-medium leading-none">
                                                      {session.user.name || 'User'}
                                                  </p>
                                                  <p className="text-xs leading-none text-muted-foreground">
                                                      {session.user.email}
                                                  </p>
                                              </div>
                                          </DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          {session.user.role === 'ADMIN' && (
                                              <>
                                                  <DropdownMenuItem asChild>
                                                      <Link href={`/${locale}/admin`} className="cursor-pointer">
                                                          <Settings className="mr-2 h-4 w-4" />
                                                          <span>{t('nav.admin')}</span>
                                                      </Link>
                                                  </DropdownMenuItem>
                                                  <DropdownMenuSeparator />
                                              </>
                                          )}
                                          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                                              <LogOut className="mr-2 h-4 w-4" />
                                              <span>{t('nav.signout')}</span>
                                          </DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              ) : (
                                  <>
                                      <Button variant="ghost" asChild>
                                          <Link href={`/${locale}/auth/signin`}>
                                              {t('nav.signin')}
                                          </Link>
                                      </Button>
                                      <Button asChild>
                                          <Link href={`/${locale}/auth/signup`}>
                                              {t('nav.signup')}
                                          </Link>
                                      </Button>
                                  </>
                              )}
                          </div>

                          {/* Mobile Menu Button */}
                          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                              <SheetTrigger asChild className="md:hidden">
                                  <Button variant="ghost" size="icon">
                                      <Menu className="h-6 w-6" />
                                  </Button>
                              </SheetTrigger>
                              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                  <nav className="flex flex-col gap-4 mt-8">
                                      {/* Mobile Navigation Links */}
                                      {navMaps.map((link, index) => (
                                          <Link
                                              key={index}
                                              href={link.href}
                                              onClick={() => setMobileMenuOpen(false)}
                                              className="text-lg font-medium text-gray-700 hover:text-primary transition-colors py-2"
                                          >
                                              {link.label}
                                          </Link>
                                      ))}

                                      <Separator className="my-4" />

                                      {/* Mobile Auth Section */}
                                      {session ? (
                                          <div className="flex flex-col gap-4">
                                              <div className="flex items-center gap-3 py-2">
                                                  <Avatar className="h-12 w-12">
                                                      <AvatarFallback className="bg-primary text-primary-foreground">
                                                          {getUserInitials(session.user.name)}
                                                      </AvatarFallback>
                                                  </Avatar>
                                                  <div>
                                                      <p className="font-medium">{session.user.name || 'User'}</p>
                                                      <p className="text-sm text-muted-foreground">{session.user.email}</p>
                                                  </div>
                                              </div>
                                              {session.user.role === 'ADMIN' && (
                                                  <Button variant="outline" asChild className="w-full justify-start">
                                                      <Link href={`/${locale}/admin`} onClick={() => setMobileMenuOpen(false)}>
                                                          <Settings className="mr-2 h-4 w-4" />
                                                          {t('nav.admin')}
                                                      </Link>
                                                  </Button>
                                              )}
                                              <Button
                                                  variant="outline"
                                                  onClick={() => {
                                                      signOut();
                                                      setMobileMenuOpen(false);
                                                  }}
                                                  className="w-full justify-start"
                                              >
                                                  <LogOut className="mr-2 h-4 w-4" />
                                                  {t('nav.signout')}
                                              </Button>
                                          </div>
                                      ) : (
                                          <div className="flex flex-col gap-3">
                                              <Button variant="outline" asChild className="w-full">
                                                  <Link href={`/${locale}/auth/signin`} onClick={() => setMobileMenuOpen(false)}>
                                                      {t('nav.signin')}
                                                  </Link>
                                              </Button>
                                              <Button asChild className="w-full">
                                                  <Link href={`/${locale}/auth/signup`} onClick={() => setMobileMenuOpen(false)}>
                                                      {t('nav.signup')}
                                                  </Link>
                                              </Button>
                                          </div>
                                      )}
                                  </nav>
                              </SheetContent>
                          </Sheet>
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
