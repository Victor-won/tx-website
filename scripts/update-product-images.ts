import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("开始更新产品图片...");

  // 更新产品图片为通用占位图
  const productImages = {
    "10g-sfp-plus-optical-module": "/uploads/general/1760074214448-w5dtgj93-________.jpeg",
    "25g-sfp28-optical-module": "/uploads/general/1760074214448-w5dtgj93-________.jpeg",
    "40g-qsfp-plus-optical-module": "/uploads/general/1760074214448-w5dtgj93-________.jpeg",
    "100g-qsfp28-optical-module": "/uploads/general/1760074214448-w5dtgj93-________.jpeg",
    "48-port-gigabit-switch": "/uploads/general/1760074242212-uwa9tnc4-junjun.jpg",
    "24-port-10gbe-switch": "/uploads/general/1760074242212-uwa9tnc4-junjun.jpg",
    "enterprise-gigabit-router": "/uploads/general/1760074423325-hpwoiipr-________.jpeg",
    "5g-industrial-router": "/uploads/general/1760074423325-hpwoiipr-________.jpeg",
    "sm-fiber-patch-cord-lc-lc": "/uploads/general/1760074450501-17ci7jx0-junjun.jpg",
    "mm-fiber-patch-cord-sc-sc": "/uploads/general/1760074450501-17ci7jx0-junjun.jpg",
    "cat6-ethernet-cable": "/uploads/general/1760074450501-17ci7jx0-junjun.jpg",
  };

  for (const [slug, image] of Object.entries(productImages)) {
    try {
      const product = await prisma.product.update({
        where: { slug },
        data: {
          featuredImage: image,
          images: [image, "/SL-021920-28230-15.jpg"], // 添加多张图片
        },
      });
      console.log(`✓ 更新产品图片: ${product.name} -> ${image}`);
    } catch (error) {
      console.error(`✗ 更新产品图片失败: ${slug}`, error);
    }
  }

  console.log("\n产品图片更新完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
