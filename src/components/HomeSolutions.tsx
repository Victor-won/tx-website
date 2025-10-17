"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Cpu, Shield, Server, Building } from "lucide-react";

interface Solution {
    id: string;
    title: string;
    titleEn: string | null;
    description: string;
    descriptionEn: string | null;
    icon: string;
    color: string;
    iconBg: string;
    features: Array<string | { text: string; textEn?: string }> | null;
}

const iconMap: { [key: string]: any } = {
    Cpu,
    Shield,
    Server,
    Building,
};

export default function SolutionSection() {
    const locale = useLocale();
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSolutions() {
            try {
                const response = await fetch("/api/solutions?status=true");
                const data = await response.json();
                if (data.success) {
                    setSolutions(data.data);
                }
            } catch (error) {
                console.error("获取解决方案失败:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSolutions();
    }, []);

    if (loading) {
        return (
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (solutions.length === 0) {
        return null;
    }

    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* 标题部分 */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                        {locale === "zh" ? "全面的通信解决方案" : "Comprehensive Communication Solutions"}
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                        {locale === "zh"
                            ? "通过整合硬件、软件，现已形成完整的解决方案组，以满足不同客户的业务需求，助力企业数字化转型"
                            : "By integrating hardware and software, we have formed a complete solution suite to meet different customer business needs and help enterprises with digital transformation"}
                    </p>
                </div>

                {/* 解决方案卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {solutions.map((solution, index) => {
                        const Icon = iconMap[solution.icon] || Cpu;
                        const title = locale === "en" && solution.titleEn ? solution.titleEn : solution.title;
                        const description = locale === "en" && solution.descriptionEn ? solution.descriptionEn : solution.description;

                        return (
                            <Card
                                key={solution.id}
                                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-gray-100/50"
                            >
                                <CardHeader>
                                    <div className="flex items-start gap-5 mb-4">
                                        <div
                                            className={`w-14 h-14 ${solution.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
                                            {title}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-sm md:text-base leading-relaxed text-gray-600">
                                        {description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* 特点列表 */}
                                    {solution.features && Array.isArray(solution.features) && solution.features.length > 0 && (
                                        <ul className="space-y-3">
                                            {solution.features.map((feature, idx) => {
                                                // 处理两种格式：字符串或对象
                                                const featureText = typeof feature === 'string'
                                                    ? feature
                                                    : (locale === "en" && feature.textEn ? feature.textEn : feature.text);

                                                return (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">{featureText}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}

                                    {/* 行动按钮 */}
                                    <Button variant="outline" className="w-full group/btn" asChild>
                                        <a href={`/${locale}/posts`}>
                                            {locale === "zh" ? "了解更多" : "Learn More"}
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* CTA 卡片 */}
                <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-0 shadow-xl">
                    <CardContent className="p-8 md:p-12 text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-3">
                            {locale === "zh" ? "需要定制解决方案？" : "Need a Custom Solution?"}
                        </h3>
                        <p className="max-w-2xl mx-auto mb-8 text-sm md:text-base text-primary-foreground/90">
                            {locale === "zh"
                                ? "我们的专家团队可以根据您的具体需求，量身定制最适合您企业的通信解决方案"
                                : "Our expert team can customize the most suitable communication solution for your enterprise based on your specific needs"}
                        </p>
                        <Button size="lg" variant="secondary" asChild className="shadow-lg hover:shadow-xl">
                            <a href={`/${locale}/contact`} className="inline-flex items-center">
                                {locale === "zh" ? "联系我们的专家团队" : "Contact Our Expert Team"}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
