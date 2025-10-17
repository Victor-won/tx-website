import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("开始创建轮播图数据...");

  const banners = [
    {
      title: "智能光网络解决方案",
      titleEn: "Intelligent Optical Network Solutions",
      description: "为数据中心提供高速、可靠的光网络连接方案，支持100G/400G超高速传输",
      descriptionEn: "Providing high-speed, reliable optical network solutions for data centers, supporting 100G/400G ultra-high-speed transmission",
      highlight: "创新技术",
      highlightEn: "Innovative Technology",
      image: "/SL-021920-28230-15.jpg",
      buttonText: "了解更多",
      buttonTextEn: "Learn More",
      buttonLink: "/products",
      color: "from-blue-600 to-purple-700",
      order: 1,
      status: true,
    },
    {
      title: "5G网络设备",
      titleEn: "5G Network Equipment",
      description: "全系列5G网络设备，助力企业数字化转型，构建高速、稳定的通信网络",
      descriptionEn: "Complete range of 5G network equipment to help enterprises with digital transformation and build high-speed, stable communication networks",
      highlight: "5G时代",
      highlightEn: "5G Era",
      image: "/SL-021920-28230-15.jpg",
      buttonText: "查看产品",
      buttonTextEn: "View Products",
      buttonLink: "/products",
      color: "from-purple-600 to-pink-700",
      order: 2,
      status: true,
    },
    {
      title: "企业级网络解决方案",
      titleEn: "Enterprise Network Solutions",
      description: "为中小企业提供一站式网络解决方案，包括路由器、交换机、光模块等全套设备",
      descriptionEn: "Providing one-stop network solutions for SMEs, including routers, switches, optical modules and complete equipment",
      highlight: "专业服务",
      highlightEn: "Professional Service",
      image: "/SL-021920-28230-15.jpg",
      buttonText: "联系我们",
      buttonTextEn: "Contact Us",
      buttonLink: "/contact",
      color: "from-indigo-600 to-blue-700",
      order: 3,
      status: true,
    },
  ];

  for (const banner of banners) {
    const created = await prisma.banner.create({
      data: banner,
    });
    console.log(`✓ 创建轮播图: ${created.title}`);
  }

  console.log("轮播图数据创建完成！");
}

main()
  .catch((e) => {
    console.error("创建失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
