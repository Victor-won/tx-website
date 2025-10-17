"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Partner {
    id: string;
    name: string;
    nameEn: string | null;
    logo: string;
    website: string | null;
}

export default function PartnerSection() {
    const locale = useLocale();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPartners() {
            try {
                const response = await fetch("/api/partners?status=true");
                const data = await response.json();
                if (data.success) {
                    setPartners(data.data);
                }
            } catch (error) {
                console.error("获取合作伙伴失败:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPartners();
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

    if (partners.length === 0) {
        return null;
    }

    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                        {locale === "zh" ? "合作伙伴" : "Our Partners"}
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        {locale === "zh" ? "携手共赢，与全球合作伙伴共建云端生态" : "Win-win cooperation, building cloud ecosystem with global partners"}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-12">
                    {partners.map((partner) => {
                        const name = locale === "en" && partner.nameEn ? partner.nameEn : partner.name;

                        return (
                            <Card
                                key={partner.id}
                                className="w-40 h-20 flex items-center justify-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                                onClick={() => {
                                    if (partner.website) {
                                        window.open(partner.website, "_blank");
                                    }
                                }}
                            >
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <img
                                        src={partner.logo}
                                        alt={name}
                                        className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                                        onError={(e) => {
                                            // 如果图片加载失败，显示文字
                                            e.currentTarget.style.display = 'none';
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `<span class="text-sm font-medium text-gray-700">${name}</span>`;
                                            }
                                        }}
                                    />
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="text-center">
                    <Button size="lg" asChild>
                        <a href={`/${locale}/contact`}>
                            {locale === "zh" ? "加入合作伙伴计划" : "Join Partnership Program"}
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
