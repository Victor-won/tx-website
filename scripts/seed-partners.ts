import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始创建合作伙伴数据...');

  // 清空现有数据
  await prisma.partner.deleteMany({});

  const partners = [
    {
      name: '华为技术有限公司',
      nameEn: 'Huawei Technologies',
      logo: '/uploads/general/1760074450501-17ci7jx0-junjun.jpg',
      website: 'https://www.huawei.com',
      order: 1,
      status: true,
    },
    {
      name: '中国电信',
      nameEn: 'China Telecom',
      logo: '/uploads/general/1760074450501-17ci7jx0-junjun.jpg',
      website: 'https://www.chinatelecom.com.cn',
      order: 2,
      status: true,
    },
    {
      name: '中国移动',
      nameEn: 'China Mobile',
      logo: '/uploads/general/1760074450501-17ci7jx0-junjun.jpg',
      website: 'https://www.chinamobile.com',
      order: 3,
      status: true,
    },
    {
      name: '中国联通',
      nameEn: 'China Unicom',
      logo: '/uploads/general/1760074450501-17ci7jx0-junjun.jpg',
      website: 'https://www.chinaunicom.com.cn',
      order: 4,
      status: true,
    },
    {
      name: '阿里云',
      nameEn: 'Alibaba Cloud',
      logo: '/uploads/general/1760074242212-uwa9tnc4-junjun.jpg',
      website: 'https://www.aliyun.com',
      order: 5,
      status: true,
    },
    {
      name: '腾讯云',
      nameEn: 'Tencent Cloud',
      logo: '/uploads/general/1760074242212-uwa9tnc4-junjun.jpg',
      website: 'https://cloud.tencent.com',
      order: 6,
      status: true,
    },
    {
      name: '思科系统公司',
      nameEn: 'Cisco Systems',
      logo: '/uploads/general/1760074423325-hpwoiipr-________.jpeg',
      website: 'https://www.cisco.com',
      order: 7,
      status: true,
    },
    {
      name: '浪潮集团',
      nameEn: 'Inspur Group',
      logo: '/uploads/general/1760074423325-hpwoiipr-________.jpeg',
      website: 'https://www.inspur.com',
      order: 8,
      status: true,
    },
  ];

  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
    console.log(`创建合作伙伴: ${partner.name}`);
  }

  console.log('合作伙伴数据创建完成！');
}

main()
  .catch((e) => {
    console.error('错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
