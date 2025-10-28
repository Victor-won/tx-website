"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import SiteLayout from "@/components/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Globe,
  MessageSquare,
  Building2,
} from "lucide-react";

export default function ContactPage() {
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: MapPin,
      title: locale === "zh" ? "地址" : "Address",
      content: locale === "zh"
        ? "中国·江苏·南京市栖霞区软件产业基地5栋"
        : "Building 5, Software Industry Base, Qixia District, Nanjing, Jiangsu, China",
      link: "https://maps.google.com",
    },
    {
      icon: Phone,
      title: locale === "zh" ? "联系电话" : "Phone",
      content: "+86 15314119610",
      link: "tel:+8615314119610",
    },
    {
      icon: Mail,
      title: locale === "zh" ? "电子邮箱" : "Email",
      content: "wang.alex8877@gmail.com",
      link: "mailto:wang.alex8877@gmail.com",
    }
  ];

  const officeLocations = [
    {
      city: locale === "zh" ? "深圳总部" : "Shenzhen HQ",
      address: locale === "zh"
        ? "南山区科技园南区软件产业基地5栋"
        : "Building 5, Software Industry Base, Nanshan",
      phone: "+86 755 8888 8888",
      email: "shenzhen@example.com",
    },
    {
      city: locale === "zh" ? "北京分公司" : "Beijing Office",
      address: locale === "zh"
        ? "海淀区中关村软件园二期"
        : "Zhongguancun Software Park Phase II, Haidian",
      phone: "+86 10 8888 8888",
      email: "beijing@example.com",
    },
    {
      city: locale === "zh" ? "上海分公司" : "Shanghai Office",
      address: locale === "zh"
        ? "浦东新区张江高科技园区"
        : "Zhangjiang Hi-Tech Park, Pudong",
      phone: "+86 21 8888 8888",
      email: "shanghai@example.com",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        // 重置表单
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
        });

        // 3秒后重置提交状态
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else {
        alert(data.error || (locale === "zh" ? "提交失败，请稍后重试" : "Submit failed, please try again later"));
      }
    } catch (error) {
      console.error("提交失败:", error);
      alert(locale === "zh" ? "提交失败，请稍后重试" : "Submit failed, please try again later");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
                {locale === "zh" ? "联系我们" : "Contact Us"}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {locale === "zh" ? "让我们开始对话" : "Let's Start a Conversation"}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {locale === "zh"
                  ? "无论您有任何问题或需求，我们的专业团队随时准备为您提供帮助"
                  : "Whatever questions or needs you have, our professional team is ready to help"}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    {locale === "zh" ? "快速联系" : "Quick Contact"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <info.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-sm text-gray-600 hover:text-primary transition-colors"
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-600">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <Card className="overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative group cursor-pointer">
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                  <div className="text-center relative z-10">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-3 group-hover:text-primary transition-colors" />
                    <p className="text-gray-600 group-hover:text-primary transition-colors">
                      {locale === "zh" ? "点击查看地图" : "Click to view map"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {locale === "zh" ? "发送消息" : "Send Message"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "zh"
                      ? "填写表单，我们会尽快与您联系"
                      : "Fill out the form and we'll get back to you soon"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {locale === "zh" ? "提交成功！" : "Successfully Submitted!"}
                      </h3>
                      <p className="text-gray-600">
                        {locale === "zh"
                          ? "感谢您的留言，我们会尽快回复您"
                          : "Thank you for your message, we'll reply soon"}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {locale === "zh" ? "姓名" : "Name"} <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={locale === "zh" ? "请输入您的姓名" : "Enter your name"}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {locale === "zh" ? "邮箱" : "Email"} <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={locale === "zh" ? "请输入您的邮箱" : "Enter your email"}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {locale === "zh" ? "电话" : "Phone"}
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={locale === "zh" ? "请输入您的电话" : "Enter your phone"}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {locale === "zh" ? "公司" : "Company"}
                          </label>
                          <Input
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder={locale === "zh" ? "请输入公司名称" : "Enter company name"}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {locale === "zh" ? "主题" : "Subject"} <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder={locale === "zh" ? "请输入主题" : "Enter subject"}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {locale === "zh" ? "留言内容" : "Message"} <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder={locale === "zh" ? "请输入您的留言..." : "Enter your message..."}
                          rows={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            {locale === "zh" ? "发送中..." : "Sending..."}
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            {locale === "zh" ? "发送消息" : "Send Message"}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
            <CardContent className="py-8">
              <div className="text-center">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {locale === "zh" ? "还有其他问题？" : "Have More Questions?"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {locale === "zh"
                    ? "查看我们的常见问题解答或浏览产品文档"
                    : "Check our FAQ or browse product documentation"}
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button variant="outline" asChild>
                    <a href="#faq">{locale === "zh" ? "常见问题" : "FAQ"}</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="#docs">{locale === "zh" ? "产品文档" : "Documentation"}</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
