// 合作伙伴部分
export default function PartnerSection() {
    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-blue-900 mb-4">合作伙伴</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">携手共赢，与全球合作伙伴共建云端生态</p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-32 h-16 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                            <span className="text-gray-600 font-medium">合作伙伴 {index + 1}</span>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="/post"
                        className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        加入合作伙伴计划
                    </a>
                </div>
            </div>
        </div>
    );
}
