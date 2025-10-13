"use client";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { LatestPosts } from "@/components/LatestPosts";
import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";
import Carousel from "@/components/HomeCarousel";
import PartnerSection from "@/components/HomePartner";
import ProductCard from "@/components/HomeProduct";
import SolutionSection from "@/components/HomeSolutions";

export default function Home() {
  const { data: session } = useSession();
  const t = useTranslations();
  const locale = useLocale();

  return (
      <SiteLayout>
          {/* 轮播图 */}
          <Carousel />
          {/* 产品展示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
              {Array.from({ length: 6 }).map((_, index) => (
                  <div
                      key={index}
                      className={`animate-on-scroll ${
                          index % 3 === 0 ? 'bounce-in' : index % 3 === 1 ? 'scale-in' : 'slide-up'
                      } delay-${(index % 3) * 150 + 200}`}
                  >
                      <ProductCard index={index + 1} />
                  </div>
              ))}
          </div>
          {/* 解决方案 */}
          <div className="animate-on-scroll rotate-in delay-300">
              <SolutionSection />
          </div>
          {/* 最新文章 */}
          <LatestPosts />
          {/* 合作伙伴 */}
          <div className="animate-on-scroll bounce-in delay-500">
              <PartnerSection />
          </div>
      </SiteLayout>
  );
}
