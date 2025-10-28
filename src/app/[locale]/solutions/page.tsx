"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Shield, Zap, Globe, Database, Cloud, Lock, Smartphone } from "lucide-react";

interface Feature {
  text: string;
  textEn?: string;
  description: string;
  descriptionEn?: string;
}

interface Solution {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  icon: string;
  color: string;
  iconBg: string;
  features: Feature[] | null;
  order: number;
  status: boolean;
}

const iconMap: Record<string, any> = {
  Cpu,
  Shield,
  Zap,
  Globe,
  Database,
  Cloud,
  Lock,
  Smartphone,
};

export default function SolutionsPage() {
  const locale = useLocale();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/solutions?status=true");
      const data = await response.json();

      if (data.success) {
        setSolutions(data.data);
      }
    } catch (error) {
      console.error("获取解决方案列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto" />
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {locale === "zh" ? "解决方案" : "Solutions"}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              {locale === "zh"
                ? "为您的业务提供专业、可靠的技术解决方案"
                : "Professional and reliable technical solutions for your business"}
            </p>
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {solutions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {locale === "zh" ? "暂无解决方案" : "No solutions available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => {
                const title = locale === "en" && solution.titleEn ? solution.titleEn : solution.title;
                const description =
                  locale === "en" && solution.descriptionEn
                    ? solution.descriptionEn
                    : solution.description;
                const IconComponent = iconMap[solution.icon] || Cpu;

                return (
                    <Link
                        key={solution.id}
                        href={`/${locale}/solutions/${solution.id}`}
                        className="group"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <Card className="h-full hover:shadow-2xl transition-all duration-500 border-gray-100/50 overflow-hidden">
                            {/* Icon Header */}
                            <div className={`h-2 bg-gradient-to-r ${solution.color}`} />
                            <CardHeader className="flex flex-row items-center">
                                <div
                                    className={`w-16 h-16 rounded-2xl ${solution.iconBg} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 mr-5`}
                                >
                                    <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                    {title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <CardDescription className="text-base line-clamp-3 leading-relaxed">
                                    {description}
                                </CardDescription>

                                {/* Features Preview */}
                                {solution.features &&
                                    Array.isArray(solution.features) &&
                                    solution.features.length > 0 && (
                                        <div className="space-y-2 pt-4 border-t">
                                            {solution.features.slice(0, 3).map((feature, idx) => {
                                                const featureTitle =
                                                    locale === 'en' && feature.textEn ? feature.textEn : feature.text;
                                                return (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="mt-0.5 bg-primary/10 text-primary hover:bg-primary/20"
                                                        >
                                                            ✓
                                                        </Badge>
                                                        <span className="text-sm text-gray-600">{featureTitle}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                {/* View Details Button */}
                                <div className="pt-4 flex justify-center">
                                    <Button
                                        variant="outline"
                                        className="w-full group/btn bg-primary text-white hover:bg-primary/90 hover:text-white"
                                        asChild
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            {locale === 'zh' ? '了解更多' : 'Learn More'}
                                            <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {locale === "zh" ? "需要定制化解决方案？" : "Need a Custom Solution?"}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {locale === "zh"
                ? "我们的专家团队随时准备为您提供量身定制的解决方案"
                : "Our expert team is ready to provide you with a tailored solution"}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/${locale}/contact`}>
                {locale === "zh" ? "联系我们" : "Contact Us"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
