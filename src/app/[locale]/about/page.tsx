"use client";

import { useLocale } from "next-intl";
import SiteLayout from "@/components/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Target,
  Award,
  Globe,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  Heart,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const locale = useLocale();

  const stats = [
    {
      icon: Users,
      value: "500+",
      label: locale === "zh" ? "专业团队" : "Professional Team",
      labelEn: "Employees",
    },
    {
      icon: Globe,
      value: "50+",
      label: locale === "zh" ? "服务国家" : "Countries Served",
      labelEn: "Countries",
    },
    {
      icon: Award,
      value: "100+",
      label: locale === "zh" ? "专利技术" : "Patents",
      labelEn: "Patents",
    },
    {
      icon: TrendingUp,
      value: "15+",
      label: locale === "zh" ? "行业经验" : "Years Experience",
      labelEn: "Years",
    },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: locale === "zh" ? "创新驱动" : "Innovation Driven",
      description: locale === "zh"
        ? "持续投入研发，推动技术创新，引领行业发展"
        : "Continuous R&D investment, driving technological innovation and leading industry development",
    },
    {
      icon: Heart,
      title: locale === "zh" ? "客户至上" : "Customer First",
      description: locale === "zh"
        ? "以客户需求为导向，提供优质产品和服务"
        : "Customer-oriented, providing quality products and services",
    },
    {
      icon: CheckCircle2,
      title: locale === "zh" ? "品质保证" : "Quality Assurance",
      description: locale === "zh"
        ? "严格质量控制，确保产品可靠性和稳定性"
        : "Strict quality control ensuring product reliability and stability",
    },
    {
      icon: Zap,
      title: locale === "zh" ? "快速响应" : "Rapid Response",
      description: locale === "zh"
        ? "敏捷高效的服务团队，快速解决客户问题"
        : "Agile and efficient service team, quickly resolving customer issues",
    },
  ];

  const certifications = [
    { name: "ISO 9001", description: locale === "zh" ? "质量管理体系" : "Quality Management" },
    { name: "ISO 14001", description: locale === "zh" ? "环境管理体系" : "Environmental Management" },
    { name: "ISO 45001", description: locale === "zh" ? "职业健康安全" : "Occupational Health & Safety" },
    { name: "TL 9000", description: locale === "zh" ? "电信质量管理" : "Telecom Quality Management" },
  ];

  return (
      <SiteLayout>
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
              {/* Hero Section */}
              <div className="relative bg-gradient-to-r from-primary to-primary/90 text-white overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                      <div
                          className="absolute inset-0"
                          style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          }}
                      />
                  </div>
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                      <div className="max-w-3xl">
                          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                              {locale === 'zh' ? '关于我们' : 'About Us'}
                          </Badge>
                          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                              {locale === 'zh' ? '引领融合通信技术创新' : 'Leading Optical Communication Innovation'}
                          </h1>
                          <p className="text-xl text-white/90 leading-relaxed">
                              {locale === 'zh'
                                  ? '我们致力于为全球客户提供高性能、高可靠的音视频融合通信产品和解决方案，推动IP数字化转型，共创美好未来'
                                  : 'We are committed to providing high-performance, highly reliable audio and video converged communication products and solutions to global customers, promoting IP digital transformation, and creating a better future together.'}
                          </p>
                      </div>
                  </div>
              </div>

              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  {/* Stats Section */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                      {stats.map((stat, index) => (
                          <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                              <CardContent className="pt-6">
                                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                      <stat.icon className="w-8 h-8 text-primary" />
                                  </div>
                                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                                  <div className="text-sm text-gray-600">{stat.label}</div>
                              </CardContent>
                          </Card>
                      ))}
                  </div>

                  {/* Company Introduction */}
                  <div className="mb-20">
                      <div className="text-center mb-12">
                          <h2 className="text-3xl font-bold text-gray-900 mb-4">
                              {locale === 'zh' ? '关于我们' : 'Company Profile'}
                          </h2>
                          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                              {locale === 'zh'
                                  ? '专注融合通信领域十余年，我们始终坚持技术创新，为客户创造价值'
                                  : 'Focusing on the field of integrated communications for more than a decade, we have always adhered to technological innovation to create value for customers.'}
                          </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                          <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
                              <CardHeader>
                                  <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                          <Target className="w-6 h-6 text-primary" />
                                      </div>
                                      <CardTitle>{locale === 'zh' ? '定位目标' : 'Our Mission'}</CardTitle>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-gray-600 leading-relaxed">
                                      {locale === 'zh'
                                          ? '专注语音技术与融合通信解决方案的服务商，为全球客户对接高性价比的国内语音设备、通信集成服务，从需求匹配到落地支持，提供灵活高效的定制化服务。'
                                          : 'A service provider focusing on voice technology and integrated communication solutions, connecting global customers with cost-effective domestic voice equipment and communication integration services, providing flexible and efficient customized services from demand matching to implementation support.'}
                                  </p>
                              </CardContent>
                          </Card>

                          <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
                              <CardHeader>
                                  <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                          <Building2 className="w-6 h-6 text-primary" />
                                      </div>
                                      <CardTitle>{locale === 'zh' ? '经验丰富' : 'Rich Experience'}</CardTitle>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-gray-600 leading-relaxed">
                                      {locale === 'zh'
                                          ? '深耕语音通信领域10年，熟悉国内供应链资源，曾为海外众多企业、通信服务商提供过设备对接与技术支持，对语音网关、融合通信系统等产品的选型、价格优化有丰富经验。'
                                          : 'With a decade of experience in the voice communication field, familiar with domestic supply chain resources, having provided equipment docking and technical support for many overseas enterprises and communication service providers, with rich experience in the selection and price optimization of voice gateways and integrated communication systems.'}
                                  </p>
                              </CardContent>
                          </Card>

                          <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
                              <CardHeader>
                                  <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                          <Building2 className="w-6 h-6 text-primary" />
                                      </div>
                                      <CardTitle>{locale === 'zh' ? '资源优势' : 'Resource Advantages'}</CardTitle>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-gray-600 leading-relaxed">
                                      {locale === 'zh'
                                          ? '国内源头工厂，跳过中间环节，帮你拿到更具价格竞争力的语音设备（如 IP 电话、语音交换机、电话录音设备、融合通信平台等）。'
                                          : 'Domestic source factories, bypassing intermediaries, helping you get more competitively priced voice equipment (such as IP phones, voice switches, telephone recording equipment, integrated communication platforms, etc.).'}
                                  </p>
                              </CardContent>
                          </Card>

                          <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
                              <CardHeader>
                                  <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                          <Building2 className="w-6 h-6 text-primary" />
                                      </div>
                                      <CardTitle>{locale === 'zh' ? '服务灵活' : 'Flexible Service'}</CardTitle>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-gray-600 leading-relaxed">
                                      {locale === 'zh'
                                          ? '个人化对接，响应更快，可根据你的需求（如预算、功能、批量）定制匹配方案，小批量采购也能支持。'
                                          : 'Personalized docking, faster response, customized matching solutions according to your needs (such as budget, functions, batch), and support for small batch procurement.'}
                                  </p>
                              </CardContent>
                          </Card>

                          <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
                              <CardHeader>
                                  <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                          <Building2 className="w-6 h-6 text-primary" />
                                      </div>
                                      <CardTitle>{locale === 'zh' ? '专业支持' : 'Professional Support'}</CardTitle>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-gray-600 leading-relaxed">
                                      {locale === 'zh'
                                          ? '不仅提供产品，还能协助解决基础的技术适配问题（如设备调试、通信协议对接建议），降低你的落地成本。'
                                          : 'Not only providing products, but also assisting in solving basic technical adaptation issues (such as device debugging, communication protocol docking suggestions), reducing your implementation costs.'}
                                  </p>
                              </CardContent>
                          </Card>

                          <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
                              <CardHeader>
                                  <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                          <Building2 className="w-6 h-6 text-primary" />
                                      </div>
                                      <CardTitle>{locale === 'zh' ? '服务理念' : 'Service Philosophy'}</CardTitle>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-gray-600 leading-relaxed">
                                      {locale === 'zh'
                                          ? '以‘精准匹配 + 透明服务’为原则，不赚信息差，只做国内外通信需求的‘桥梁’—— 帮你找到合适的产品，降低采购成本，让技术落地更简单。'
                                          : 'Based on the principle of "accurate matching + transparent service", we do not make information gaps, and only serve as a "bridge" for domestic and foreign communication needs -helping you find the right products, reduce procurement costs, and make technology implementation easier.'}
                                  </p>
                              </CardContent>
                          </Card>
                      </div>
                  </div>

                  {/* Core Values */}
                  <div className="mb-20">
                      <div className="text-center mb-12">
                          <h2 className="text-3xl font-bold text-gray-900 mb-4">
                              {locale === 'zh' ? '核心价值观' : 'Core Values'}
                          </h2>
                          <p className="text-lg text-gray-600">
                              {locale === 'zh'
                                  ? '我们的价值观指引着企业发展方向'
                                  : 'Our values guide our corporate development'}
                          </p>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {values.map((value, index) => (
                              <Card
                                  key={index}
                                  className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                              >
                                  <CardContent className="pt-8">
                                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 mb-4">
                                          <value.icon className="w-8 h-8 text-white" />
                                      </div>
                                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                      <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                                  </CardContent>
                              </Card>
                          ))}
                      </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-20">
                      <div className="text-center mb-12">
                          <h2 className="text-3xl font-bold text-gray-900 mb-4">
                              {locale === 'zh' ? '资质认证' : 'Certifications'}
                          </h2>
                          <p className="text-lg text-gray-600">
                              {locale === 'zh'
                                  ? '获得多项国际认证，品质值得信赖'
                                  : 'Multiple international certifications, trustworthy quality'}
                          </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {certifications.map((cert, index) => (
                              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                                  <CardContent className="pt-8">
                                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                          <Award className="w-8 h-8 text-green-600" />
                                      </div>
                                      <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
                                      <p className="text-sm text-gray-600">{cert.description}</p>
                                  </CardContent>
                              </Card>
                          ))}
                      </div>
                  </div>

                  {/* CTA Section */}
                  <Card className="bg-gradient-to-r from-primary to-primary/90 text-white">
                      <CardContent className="py-12 text-center">
                          <h2 className="text-3xl font-bold mb-4">
                              {locale === 'zh' ? '携手共创未来' : "Let's Create the Future Together"}
                          </h2>
                          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                              {locale === 'zh'
                                  ? '如果您对我们的产品和服务感兴趣，欢迎与我们联系'
                                  : 'If you are interested in our products and services, please contact us'}
                          </p>
                          <div className="flex gap-4 justify-center flex-wrap">
                              <Button size="lg" variant="secondary" asChild>
                                  <Link href={`/${locale}/contact`}>{locale === 'zh' ? '联系我们' : 'Contact Us'}</Link>
                              </Button>
                              <Button
                                  size="lg"
                                  variant="outline"
                                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                                  asChild
                              >
                                  <Link href={`/${locale}/products`}>
                                      {locale === 'zh' ? '查看产品' : 'View Products'}
                                  </Link>
                              </Button>
                          </div>
                      </CardContent>
                  </Card>
              </div>
          </div>
      </SiteLayout>
  );
}
