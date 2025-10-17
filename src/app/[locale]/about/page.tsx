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

  const milestones = [
    {
      year: "2024",
      title: locale === "zh" ? "技术突破" : "Technology Breakthrough",
      description: locale === "zh"
        ? "成功研发800G光模块，进入超高速光通信领域"
        : "Successfully developed 800G optical modules, entering ultra-high-speed optical communication field",
    },
    {
      year: "2022",
      title: locale === "zh" ? "全球化布局" : "Global Expansion",
      description: locale === "zh"
        ? "在欧美设立研发中心，服务全球客户"
        : "Established R&D centers in Europe and America, serving global customers",
    },
    {
      year: "2020",
      title: locale === "zh" ? "产品创新" : "Product Innovation",
      description: locale === "zh"
        ? "推出400G数据中心解决方案，获得行业认可"
        : "Launched 400G data center solutions, gaining industry recognition",
    },
    {
      year: "2018",
      title: locale === "zh" ? "市场拓展" : "Market Expansion",
      description: locale === "zh"
        ? "业务覆盖亚太地区，成为区域领先供应商"
        : "Expanded business across Asia-Pacific, becoming regional leading supplier",
    },
    {
      year: "2015",
      title: locale === "zh" ? "技术积累" : "Technology Foundation",
      description: locale === "zh"
        ? "建立核心技术团队，奠定研发基础"
        : "Established core technical team, laying R&D foundation",
    },
    {
      year: "2010",
      title: locale === "zh" ? "公司成立" : "Company Founded",
      description: locale === "zh"
        ? "公司成立，开始光通信产品研发"
        : "Company founded, started optical communication product R&D",
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
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                {locale === "zh" ? "关于我们" : "About Us"}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {locale === "zh" ? "引领光通信技术创新" : "Leading Optical Communication Innovation"}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {locale === "zh"
                  ? "我们致力于为全球客户提供高性能、高可靠的光通信产品和解决方案，推动数字化转型，共创美好未来。"
                  : "We are committed to providing high-performance, highly reliable optical communication products and solutions to global customers, driving digital transformation and creating a better future together."}
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
                {locale === "zh" ? "公司简介" : "Company Profile"}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {locale === "zh"
                  ? "专注光通信领域十余年，我们始终坚持技术创新，为客户创造价值"
                  : "Focusing on optical communications for over a decade, we consistently pursue technological innovation to create value for customers"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{locale === "zh" ? "我们的使命" : "Our Mission"}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {locale === "zh"
                      ? "通过持续的技术创新和优质的产品服务，为全球客户提供领先的光通信解决方案，推动信息技术发展，助力数字经济腾飞。"
                      : "Through continuous technological innovation and quality products and services, we provide leading optical communication solutions to global customers, driving information technology development and facilitating the rise of the digital economy."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{locale === "zh" ? "我们的愿景" : "Our Vision"}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {locale === "zh"
                      ? "成为全球领先的光通信设备供应商，以卓越的技术和服务赢得客户信赖，为构建全球信息高速公路贡献力量。"
                      : "To become a globally leading optical communication equipment supplier, earning customer trust through excellent technology and service, contributing to building the global information superhighway."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {locale === "zh" ? "核心价值观" : "Core Values"}
              </h2>
              <p className="text-lg text-gray-600">
                {locale === "zh"
                  ? "我们的价值观指引着企业发展方向"
                  : "Our values guide our corporate development"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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

          {/* Development Milestones */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {locale === "zh" ? "发展历程" : "Development Milestones"}
              </h2>
              <p className="text-lg text-gray-600">
                {locale === "zh"
                  ? "见证我们的成长与突破"
                  : "Witness our growth and breakthroughs"}
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-lg hidden md:block z-10" />

                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <Card className="hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-primary text-white">{milestone.year}</Badge>
                          </div>
                          <CardTitle className="text-xl">{milestone.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {locale === "zh" ? "资质认证" : "Certifications"}
              </h2>
              <p className="text-lg text-gray-600">
                {locale === "zh"
                  ? "获得多项国际认证，品质值得信赖"
                  : "Multiple international certifications, trustworthy quality"}
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
                {locale === "zh" ? "携手共创未来" : "Let's Create the Future Together"}
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {locale === "zh"
                  ? "如果您对我们的产品和服务感兴趣，欢迎与我们联系"
                  : "If you are interested in our products and services, please contact us"}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" variant="secondary" asChild>
                  <Link href={`/${locale}/contact`}>
                    {locale === "zh" ? "联系我们" : "Contact Us"}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30" asChild>
                  <Link href={`/${locale}/products`}>
                    {locale === "zh" ? "查看产品" : "View Products"}
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
