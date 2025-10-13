// 解决方案部分
export default function SolutionSection() {
    // 模拟解决方案数据
    const solutions = [
        {
            title: '企业通信解决方案',
            description: '为各类企业提供全面的通信系统解决方案，包括内部通信、客户服务、远程办公等多方面需求',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-600',
        },
        {
            title: '公共安全通信系统',
            description: '为公安、消防、应急等部门提供专业的通信指挥调度系统，确保关键时刻通信畅通',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                </svg>
            ),
            color: 'from-indigo-500 to-indigo-600',
            iconBg: 'bg-indigo-600',
        },
    ];

    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* 标题部分 */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                            定制解决方案
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight">
                        全面的通信解决方案
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        申瓯通过整合其硬件、软件，现已形成完整的解决方案组，以满足不同客户的业务需求，助力企业数字化转型
                    </p>
                </div>

                {/* 解决方案卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {solutions.map((solution, index) => (
                        <div
                            key={index}
                            className={`animate-on-scroll slide-up delay-${
                                index * 100 + 100
                            } rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group m-4`}
                        >
                            {/* 渐变背景卡片 */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-1">
                                <div className="bg-white rounded-lg p-8 h-full">
                                    {/* 图标和标题区域 */}
                                    <div className="flex items-start mb-6 gap-5">
                                        <div
                                            className={`w-14 h-14 ${solution.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}
                                        >
                                            {solution.icon}
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                                            {solution.title}
                                        </h3>
                                    </div>

                                    {/* 描述文字 */}
                                    <p className="text-gray-600 mb-8 leading-relaxed">{solution.description}</p>

                                    {/* 特点列表 */}
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-green-500 mt-0.5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="text-gray-700 text-sm">高性能可靠，7×24小时稳定运行</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-green-500 mt-0.5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="text-gray-700 text-sm">
                                                灵活扩展，适应企业不同发展阶段
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-green-500 mt-0.5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="text-gray-700 text-sm">简易部署，快速实现业务价值</span>
                                        </li>
                                    </ul>

                                    {/* 行动按钮 */}
                                    <a
                                        href="/post"
                                        className="inline-flex items-center px-6 py-3 bg-white border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        了解更多
                                        <svg
                                            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 额外信息卡片 */}
                <div className="mt-16 bg-gradient-to-r from-primary to-primary-dark rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-8 md:p-12 text-center text-white">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">需要定制解决方案？</h3>
                        <p className="max-w-2xl mx-auto mb-8 text-blue-100">
                            我们的专家团队可以根据您的具体需求，量身定制最适合您企业的通信解决方案
                        </p>
                        <a
                            href="/post"
                            className="inline-flex items-center px-8 py-4 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            联系我们的专家团队
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
