import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("开始创建解决方案数据...");

  const solutions = [
    {
      title: "企业通信解决方案",
      titleEn: "Enterprise Communication Solutions",
      description: "为各类企业提供全面的通信系统解决方案，包括内部通信、客户服务、远程办公等多方面需求",
      descriptionEn: "Providing comprehensive communication system solutions for all types of enterprises, including internal communication, customer service, remote work and other needs",
      icon: "Cpu",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-600",
      features: [
        "高性能可靠，7×24小时稳定运行",
        "灵活扩展，适应企业不同发展阶段",
        "简易部署，快速实现业务价值",
      ],
      order: 1,
      status: true,
    },
    {
      title: "公共安全通信系统",
      titleEn: "Public Safety Communication System",
      description: "为公安、消防、应急等部门提供专业的通信指挥调度系统，确保关键时刻通信畅通",
      descriptionEn: "Providing professional communication command and dispatch systems for public security, fire fighting, emergency and other departments to ensure smooth communication at critical moments",
      icon: "Shield",
      color: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-600",
      features: [
        "高性能可靠，7×24小时稳定运行",
        "灵活扩展，适应企业不同发展阶段",
        "简易部署，快速实现业务价值",
      ],
      order: 2,
      status: true,
    },
  ];

  for (const solution of solutions) {
    const created = await prisma.solution.create({
      data: solution,
    });
    console.log(`✓ 创建解决方案: ${created.title}`);
  }

  console.log("解决方案数据创建完成！");
}

main()
  .catch((e) => {
    console.error("创建失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
