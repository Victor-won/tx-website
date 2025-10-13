import { useTranslations } from "next-intl";
import { useState } from "react";

// 产品卡片组件
export default function ProductCard({ index }: { index: number }) {
    const t = useTranslations();
    const products = [
        {
            name: t('products.items.switch.name'),
            description: t('products.items.switch.description'),
            tag: t('products.items.switch.tag'),
            price: t('products.items.switch.price'),
            features: [
                t('products.items.switch.features.0'),
                t('products.items.switch.features.1'),
                t('products.items.switch.features.2'),
            ],
        },
        {
            name: t('products.items.dispatch.name'),
            description: t('products.items.dispatch.description'),
            tag: t('products.items.dispatch.tag'),
            price: t('products.items.dispatch.price'),
            features: [
                t('products.items.dispatch.features.0'),
                t('products.items.dispatch.features.1'),
                t('products.items.dispatch.features.2'),
            ],
        },
        {
            name: t('products.items.optical.name'),
            description: t('products.items.optical.description'),
            tag: t('products.items.optical.tag'),
            price: t('products.items.optical.price'),
            features: [
                t('products.items.optical.features.0'),
                t('products.items.optical.features.1'),
                t('products.items.optical.features.2'),
            ],
        },
        {
            name: t('products.items.junction.name'),
            description: t('products.items.junction.description'),
            tag: t('products.items.junction.tag'),
            price: t('products.items.junction.price'),
            features: [
                t('products.items.junction.features.0'),
                t('products.items.junction.features.1'),
                t('products.items.junction.features.2'),
            ],
        },
        {
            name: t('products.items.management.name'),
            description: t('products.items.management.description'),
            tag: t('products.items.management.tag'),
            price: t('products.items.management.price'),
            features: [
                t('products.items.management.features.0'),
                t('products.items.management.features.1'),
                t('products.items.management.features.2'),
            ],
        },
        {
            name: t('products.items.security.name'),
            description: t('products.items.security.description'),
            tag: t('products.items.security.tag'),
            price: t('products.items.security.price'),
            features: [
                t('products.items.security.features.0'),
                t('products.items.security.features.1'),
                t('products.items.security.features.2'),
            ],
        },
    ];

    const product = products[index - 1] || products[0];
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <article
            className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift border border-gray-100/50 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 图片区域 */}
            <div className="relative h-64 overflow-hidden">
                {/* 加载状态指示器 */}
                {!isLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                )}

                <div
                    className={`w-full h-full bg-cover bg-center transform transition-all duration-700 ${
                        isLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url('/SL-021920-28230-15.jpg')` }}
                    onLoad={() => setIsLoaded(true)}
                />

                {/* 渐变遮罩 */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                ></div>

                {/* 产品标签 */}
                <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm animate-glow border border-white/20">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {product.tag}
                    </span>
                </div>

                {/* 价格标签 */}
                <div className="absolute top-6 right-6">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-primary font-medium text-sm rounded-full shadow-md">
                        {product.price}
                    </span>
                </div>

                {/* 悬停显示的操作按钮 */}
                <div
                    className={`absolute bottom-6 left-6 right-6 transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                >
                    <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-primary font-medium hover:bg-white transition-all duration-300 hover-scale shadow-lg">
                            {t('products.items.switch.quickView')}
                        </button>
                        <button className="px-4 py-2.5 bg-primary/90 backdrop-blur-md rounded-full text-white hover:bg-primary transition-all duration-300 hover-scale shadow-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 内容区域 */}
            <div className="p-8 relative">
                {/* 产品评分和状态 */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className="w-4 h-4 fill-current transition-all duration-300 hover:scale-110"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">5.0</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium">{t('products.items.switch.inStock')}</span>
                    </div>
                </div>

                {/* 产品标题 */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {product.name}
                </h3>

                {/* 产品描述 */}
                <p className="text-gray-600 mb-6 text-sm line-clamp-3 leading-relaxed">{product.description}</p>

                {/* 产品特性 */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(product.features) ? (
                            product.features.map((feature, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                                >
                                    {feature}
                                </span>
                            ))
                        ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                                {product.features}
                            </span>
                        )}
                    </div>
                </div>

                {/* 操作区域 */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <a
                        href="/post"
                        className="inline-flex items-center text-primary font-semibold text-sm group-hover:text-primary-light transition-all duration-300 hover:gap-3 gap-2"
                    >
                        {t('products.items.switch.viewDetails')}
                        <svg
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-all duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </a>

                    {/* 分享和收藏 */}
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 hover-scale shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                />
                            </svg>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover-scale shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 背景装饰 */}
                <div
                    className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-full transition-all duration-500 ${
                        isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-0'
                    }`}
                ></div>
            </div>
        </article>
    );
}
