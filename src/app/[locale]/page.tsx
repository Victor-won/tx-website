"use client";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { LatestPosts } from "@/components/LatestPosts";
import SiteLayout from "@/components/SiteLayout";
import Carousel from "@/components/HomeCarousel";
import PartnerSection from "@/components/HomePartner";
import HomeProducts from "@/components/HomeProducts";
import SolutionSection from "@/components/HomeSolutions";

export default function Home() {
  const { data: session } = useSession();
  const t = useTranslations();
  const locale = useLocale();

  return (
      <SiteLayout>
          {/* 轮播图 */}
          <Carousel />

          {/* 产品展示区域 */}
          <section className="py-16 md:py-12 bg-gradient-to-b bg-gray-100">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  {/* 标题区域 */}
                  <div className="text-center mb-12 md:mb-16">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                          {t('products.title')}
                      </h2>
                      <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                          {t('products.description')}
                      </p>
                  </div>
                  {/* 产品卡片网格 */}
                  <HomeProducts />
              </div>
          </section>

          {/* 解决方案区域 */}
          <section>
              <div className="animate-on-scroll fade-in">
                  <SolutionSection />
              </div>
          </section>

          {/* 最新文章区域 */}
          <section className="py-16 md:py-12 bg-gray-100">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <LatestPosts />
              </div>
          </section>

          {/* 合作伙伴区域 */}
          <section>
              <div className="animate-on-scroll fade-in">
                  <PartnerSection />
              </div>
          </section>
      </SiteLayout>
  );
}
