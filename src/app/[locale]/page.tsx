"use client";

import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { LatestPosts } from "@/components/LatestPosts";
import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// 轮播图组件
function Carousel() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      image: '/SL-021920-28230-15.jpg',
      title: t('hero.slide1.title'),
      description: t('hero.slide1.description'),
      highlight: t('hero.slide1.highlight'),
      color: 'from-blue-600 to-purple-700'
    },
    {
      image: '/SL-021920-28230-15.jpg',
      title: t('hero.slide2.title'),
      description: t('hero.slide2.description'),
      highlight: t('hero.slide2.highlight'),
      color: 'from-purple-600 to-pink-700'
    },
    {
      image: '/SL-021920-28230-15.jpg',
      title: t('hero.slide3.title'),
      description: t('hero.slide3.description'),
      highlight: t('hero.slide3.highlight'),
      color: 'from-indigo-600 to-blue-700'
    }
  ];

  // 初始化可见性
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 重置自动播放计时器
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 7000); // 增加轮播间隔，让用户有更多时间阅读内容
  };

  // 自动轮播效果
  useEffect(() => {
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 切换到下一张幻灯片
  const nextSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );

    // 重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  // 切换到上一张幻灯片
  const prevSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );

    // 重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  // 点击指示器切换幻灯片
  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(index);
    resetTimer();

    // 重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  // 处理鼠标悬停暂停轮播
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // 处理鼠标离开继续轮播
  const handleMouseLeave = () => {
    resetTimer();
  };

  return (
    <div
      ref={carouselRef}
      className={`relative h-[600px] md:h-[700px] overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-purple-600/10 animate-gradient-x"></div>

      <div
        className="flex transition-all duration-800 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 relative overflow-hidden"
          >
            {/* 背景图片 */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-8000 ease-out"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: currentIndex === index ? 'scale(1.1)' : 'scale(1.05)',
                filter: currentIndex === index ? 'brightness(0.7)' : 'brightness(0.5)'
              }}
            >
              {/* 动态渐变遮罩 */}
              <div className={`absolute inset-0 bg-gradient-to-r transition-all duration-1000 ${
                currentIndex === index
                  ? `${slide.color} opacity-70`
                  : 'from-gray-800/50 to-gray-900/50 opacity-80'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                <div className="container mx-auto px-6 lg:px-12 h-full flex items-center">
                  <div className={`max-w-xl md:max-w-3xl transition-all duration-1000 transform ${
                    currentIndex === index
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}>
                    {/* 高亮标签 */}
                    <div className={`inline-block mb-4 transition-all duration-700 delay-200 ${
                      currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/30 animate-glow">
                        ✨ {slide.highlight}
                      </span>
                    </div>

                    <h1 className={`text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight transition-all duration-800 delay-300 ${
                      currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                        {slide.title}
                      </span>
                    </h1>

                    <p className={`text-lg md:text-xl lg:text-2xl text-white/95 mb-10 leading-relaxed transition-all duration-800 delay-500 ${
                      currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      {slide.description}
                    </p>

                    <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-800 delay-700 ${
                      currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      <button className="btn-gradient px-8 py-4 font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3">
                        <span>{t('hero.slide1.button1')}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>

                      <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 hover-lift">
                        {t('hero.slide1.button2')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 左右导航按钮 */}
      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 focus:outline-none hover-lift border border-white/20 hover:border-white/40"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 focus:outline-none hover-lift border border-white/20 hover:border-white/40"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 轮播指示器 */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-500 ease-out rounded-full border border-white/30 backdrop-blur-sm hover:bg-white/30 ${
              index === currentIndex
                ? 'bg-white w-12 md:w-16 h-3 md:h-4 shadow-lg'
                : 'bg-white/50 hover:bg-white/70 w-3 md:w-4 h-3 md:h-4'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* 进度条 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-white to-white/80 transition-all duration-7000 ease-linear"
          style={{
            width: currentIndex === 0 ? '0%' : '100%',
            animationPlayState: isTransitioning ? 'paused' : 'running'
          }}
        ></div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <SiteLayout>
      <Carousel />
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

      {/* Latest Posts Section */}
      <LatestPosts />
    </SiteLayout>
  );
}
