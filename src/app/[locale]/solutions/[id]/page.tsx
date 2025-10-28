"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Cpu,
  Shield,
  Zap,
  Globe,
  Database,
  Cloud,
  Lock,
  Smartphone,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface Feature {
  title: string;
  titleEn?: string;
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

export default function SolutionDetailPage() {
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const [solution, setSolution] = useState<Solution | null>(null);
  const [relatedSolutions, setRelatedSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSolution();
    }
  }, [id]);

  const fetchSolution = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/solutions/${id}`);
      const data = await response.json();

      if (data.success && data.data) {
        setSolution(data.data);
        fetchRelatedSolutions();
      }
    } catch (error) {
      console.error("获取解决方案详情失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedSolutions = async () => {
    try {
      const response = await fetch("/api/solutions?status=true&limit=3");
      const data = await response.json();

      if (data.success && data.data) {
        setRelatedSolutions(data.data.filter((s: Solution) => s.id !== id).slice(0, 3));
      }
    } catch (error) {
      console.error("获取相关解决方案失败:", error);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/4" />
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-96 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!solution) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-12">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === "zh" ? "解决方案未找到" : "Solution Not Found"}
                </h1>
                <p className="text-gray-600 mb-6">
                  {locale === "zh"
                    ? "抱歉，我们找不到您要查找的解决方案。"
                    : "Sorry, we couldn't find the solution you're looking for."}
                </p>
                <Button asChild>
                  <Link href={`/${locale}/solutions`}>
                    {locale === "zh" ? "返回解决方案列表" : "Back to Solutions"}
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const title = locale === "en" && solution.titleEn ? solution.titleEn : solution.title;
  const description =
    locale === "en" && solution.descriptionEn ? solution.descriptionEn : solution.description;
  const IconComponent = iconMap[solution.icon] || Cpu;

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href={`/${locale}`} className="hover:text-primary">
                {locale === "zh" ? "首页" : "Home"}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/solutions`} className="hover:text-primary">
                {locale === "zh" ? "解决方案" : "Solutions"}
              </Link>
              <span>/</span>
              <span className="text-gray-900">{title}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/${locale}/solutions`} className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {locale === "zh" ? "返回列表" : "Back to List"}
            </Link>
          </Button>

          {/* Hero Section */}
          <Card className="overflow-hidden mb-12">
            <div className={`h-2 bg-gradient-to-r ${solution.color}`} />
            <CardHeader className="bg-gradient-to-br from-gray-50 to-white p-12">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div
                  className={`w-20 h-20 rounded-2xl ${solution.iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-4xl font-bold text-gray-900 mb-4">{title}</CardTitle>
                  <p className="text-xl text-gray-600 leading-relaxed">{description}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Features Section */}
          {solution.features && Array.isArray(solution.features) && solution.features.length > 0 && (
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {locale === "zh" ? "核心特性" : "Key Features"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {solution.features.map((feature, index) => {
                    const featureTitle =
                      locale === "en" && feature.titleEn ? feature.titleEn : feature.title;
                    const featureDesc =
                      locale === "en" && feature.descriptionEn
                        ? feature.descriptionEn
                        : feature.description;

                    return (
                      <div key={index} className="flex gap-4 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${solution.iconBg} flex items-center justify-center`}>
                          <Check className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {featureTitle}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">{featureDesc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">
                {locale === "zh" ? "为什么选择我们" : "Why Choose Us"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {locale === "zh" ? "专业可靠" : "Professional & Reliable"}
                  </h3>
                  <p className="text-gray-600">
                    {locale === "zh"
                      ? "多年行业经验，值得信赖的技术团队"
                      : "Years of industry experience with a trusted technical team"}
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {locale === "zh" ? "快速部署" : "Quick Deployment"}
                  </h3>
                  <p className="text-gray-600">
                    {locale === "zh"
                      ? "高效的实施流程，快速上线投入使用"
                      : "Efficient implementation process for quick go-live"}
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {locale === "zh" ? "全方位支持" : "Comprehensive Support"}
                  </h3>
                  <p className="text-gray-600">
                    {locale === "zh"
                      ? "7x24小时技术支持，及时响应您的需求"
                      : "24/7 technical support with timely response"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                {locale === "zh" ? "准备开始了吗？" : "Ready to Get Started?"}
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {locale === "zh"
                  ? "联系我们的专家团队，获取定制化的解决方案"
                  : "Contact our expert team for a customized solution"}
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href={`/${locale}/contact`}>
                  {locale === "zh" ? "联系我们" : "Contact Us"}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Related Solutions */}
          {relatedSolutions.length > 0 && (
            <div className="mt-16">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {locale === "zh" ? "相关解决方案" : "Related Solutions"}
                </h2>
                <Separator />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedSolutions.map((relatedSolution) => {
                  const relatedTitle =
                    locale === "en" && relatedSolution.titleEn
                      ? relatedSolution.titleEn
                      : relatedSolution.title;
                  const relatedDesc =
                    locale === "en" && relatedSolution.descriptionEn
                      ? relatedSolution.descriptionEn
                      : relatedSolution.description;
                  const RelatedIcon = iconMap[relatedSolution.icon] || Cpu;

                  return (
                    <Link
                      key={relatedSolution.id}
                      href={`/${locale}/solutions/${relatedSolution.id}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300">
                        <div className={`h-1 bg-gradient-to-r ${relatedSolution.color}`} />
                        <CardHeader>
                          <div
                            className={`w-12 h-12 rounded-xl ${relatedSolution.iconBg} flex items-center justify-center mb-4`}
                          >
                            <RelatedIcon className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {relatedTitle}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">{relatedDesc}</p>
                          <Button variant="link" className="p-0 h-auto group/link">
                            <span className="inline-flex items-center gap-1">
                              {locale === "zh" ? "了解更多" : "Learn More"}
                              <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                            </span>
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
