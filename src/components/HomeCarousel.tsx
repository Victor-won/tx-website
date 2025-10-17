"use client";

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Banner {
    id: string;
    title: string;
    titleEn: string | null;
    description: string;
    descriptionEn: string | null;
    highlight: string | null;
    highlightEn: string | null;
    image: string;
    buttonText: string | null;
    buttonTextEn: string | null;
    buttonLink: string | null;
    color: string;
}

function Carousel() {
    const locale = useLocale();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 获取轮播图数据
    useEffect(() => {
        async function fetchBanners() {
            try {
                const response = await fetch('/api/banners?status=true');
                const data = await response.json();
                if (data.success) {
                    setBanners(data.data);
                }
            } catch (error) {
                console.error('获取轮播图失败:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchBanners();
    }, []);

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
        }, 7000);
    };

    // 自动轮播效果
    useEffect(() => {
        if (banners.length > 0) {
            resetTimer();
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [banners]);

    // 切换到下一张幻灯片
    const nextSlide = () => {
        if (isTransitioning || banners.length === 0) return;

        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));

        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    };

    // 切换到上一张幻灯片
    const prevSlide = () => {
        if (isTransitioning || banners.length === 0) return;

        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));

        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    };

    // 点击指示器切换幻灯片
    const handleDotClick = (index: number) => {
        if (isTransitioning || index === currentIndex || banners.length === 0) return;

        setIsTransitioning(true);
        setCurrentIndex(index);
        resetTimer();

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

    if (loading) {
        return (
            <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (banners.length === 0) {
        return null;
    }

    return (
        <div
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
                {banners.map((banner, index) => {
                    const title = locale === "en" && banner.titleEn ? banner.titleEn : banner.title;
                    const description = locale === "en" && banner.descriptionEn ? banner.descriptionEn : banner.description;
                    const highlight = locale === "en" && banner.highlightEn ? banner.highlightEn : banner.highlight;
                    const buttonText = locale === "en" && banner.buttonTextEn ? banner.buttonTextEn : banner.buttonText;

                    return (
                        <div key={banner.id} className="w-full flex-shrink-0 relative overflow-hidden">
                            {/* 背景图片 */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-8000 ease-out"
                                style={{
                                    backgroundImage: `url(${banner.image})`,
                                    transform: currentIndex === index ? 'scale(1.1)' : 'scale(1.05)',
                                    filter: currentIndex === index ? 'brightness(0.7)' : 'brightness(0.5)',
                                }}
                            >
                                {/* 动态渐变遮罩 */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-r transition-all duration-1000 ${
                                        currentIndex === index
                                            ? `${banner.color} opacity-70`
                                            : 'from-gray-800/50 to-gray-900/50 opacity-80'
                                    }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    <div className="container mx-auto px-6 lg:px-12 h-full flex items-center">
                                        <div
                                            className={`max-w-xl md:max-w-3xl transition-all duration-1000 transform ${
                                                currentIndex === index
                                                    ? 'opacity-100 translate-y-0 scale-100'
                                                    : 'opacity-0 translate-y-8 scale-95'
                                            }`}
                                        >
                                            {/* 高亮标签 */}
                                            {highlight && (
                                                <div
                                                    className={`inline-block mb-6 transition-all duration-700 delay-200 ${
                                                        currentIndex === index
                                                            ? 'opacity-100 translate-y-0'
                                                            : 'opacity-0 translate-y-4'
                                                    }`}
                                                >
                                                    <Badge variant="secondary" className="bg-white/30 backdrop-blur-md text-white text-sm border border-white/30">
                                                        ✨ {highlight}
                                                    </Badge>
                                                </div>
                                            )}

                                            <h1
                                                className={`text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight transition-all duration-800 delay-300 ${
                                                    currentIndex === index
                                                        ? 'opacity-100 translate-y-0'
                                                        : 'opacity-0 translate-y-8'
                                                }`}
                                            >
                                                <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                                                    {title}
                                                </span>
                                            </h1>

                                            <p
                                                className={`text-lg md:text-xl lg:text-2xl text-white/95 mb-8 leading-relaxed transition-all duration-800 delay-500 ${
                                                    currentIndex === index
                                                        ? 'opacity-100 translate-y-0'
                                                        : 'opacity-0 translate-y-8'
                                                }`}
                                            >
                                                {description}
                                            </p>

                                            {buttonText && banner.buttonLink && (
                                                <div
                                                    className={`transition-all duration-800 delay-700 ${
                                                        currentIndex === index
                                                            ? 'opacity-100 translate-y-0'
                                                            : 'opacity-0 translate-y-8'
                                                    }`}
                                                >
                                                    <Button size="lg" variant="secondary" asChild className="shadow-2xl hover:shadow-blue-500/25 hover:scale-105">
                                                        <a href={banner.buttonLink}>
                                                            <span>{buttonText}</span>
                                                            <ArrowRight className="ml-2 w-5 h-5" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 左右导航按钮 */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white border border-white/20 hover:border-white/40"
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white border border-white/20 hover:border-white/40"
                onClick={nextSlide}
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </Button>

            {/* 轮播指示器 */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
                {banners.map((_, index) => (
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
                        animationPlayState: isTransitioning ? 'paused' : 'running',
                    }}
                ></div>
            </div>
        </div>
    );
}
export default Carousel;
