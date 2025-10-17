import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("开始创建文章数据...");

  // 首先获取或创建用户（文章作者）
  let author = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!author) {
    author = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "系统管理员",
        password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u", // password: admin123
        role: "ADMIN",
      },
    });
    console.log("✓ 创建管理员用户");
  }

  // 获取或创建文章分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "news" },
      update: {},
      create: {
        name: "新闻动态",
        nameEn: "News",
        slug: "news",
        description: "最新行业新闻和公司动态",
        descriptionEn: "Latest industry news and company updates",
      },
    }),
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: {
        name: "技术文章",
        nameEn: "Technology",
        slug: "technology",
        description: "技术分享和深度解析",
        descriptionEn: "Technical articles and in-depth analysis",
      },
    }),
    prisma.category.upsert({
      where: { slug: "solutions" },
      update: {},
      create: {
        name: "解决方案",
        nameEn: "Solutions",
        slug: "solutions",
        description: "行业解决方案和应用案例",
        descriptionEn: "Industry solutions and application cases",
      },
    }),
    prisma.category.upsert({
      where: { slug: "insights" },
      update: {},
      create: {
        name: "行业洞察",
        nameEn: "Insights",
        slug: "insights",
        description: "行业趋势和市场分析",
        descriptionEn: "Industry trends and market analysis",
      },
    }),
  ]);

  console.log(`✓ 创建/更新了 ${categories.length} 个分类`);

  // 创建文章数据
  const posts = [
    {
      title: "5G网络加速数据中心互连升级",
      titleEn: "5G Networks Accelerate Data Center Interconnect Upgrades",
      slug: "5g-networks-accelerate-dci-upgrades",
      content: `
<h2>5G时代的数据中心互连需求</h2>

<p>随着5G网络的大规模商用部署，数据中心之间的互连需求呈现爆发式增长。5G应用场景如超高清视频、云游戏、工业互联网等对网络带宽和延迟提出了更高要求，推动数据中心互连(DCI)技术快速升级。</p>

<h3>主要技术趋势</h3>

<ul>
  <li><strong>400G/800G光模块普及：</strong>为满足5G流量增长需求，数据中心正在加速部署400G和800G高速光模块</li>
  <li><strong>相干光技术应用：</strong>相干光技术在长距离DCI场景中的应用越来越广泛</li>
  <li><strong>可编程网络：</strong>基于SDN的可编程网络架构提供更灵活的带宽调度能力</li>
  <li><strong>边缘计算布局：</strong>为降低延迟，边缘数据中心建设加速</li>
</ul>

<h3>市场机遇</h3>

<p>根据市场研究机构预测，全球DCI市场规模将在未来5年保持20%以上的年复合增长率。这为光通信设备供应商带来了巨大的市场机遇。</p>

<blockquote>
"5G网络的发展不仅改变了移动通信，更深刻影响了整个数据中心产业链。" - 行业专家
</blockquote>

<h3>技术挑战</h3>

<p>尽管市场前景广阔，但技术升级也面临诸多挑战：</p>

<ol>
  <li>功耗管理：高速光模块的功耗控制</li>
  <li>成本优化：降低400G/800G产品成本</li>
  <li>互操作性：确保多厂商设备的兼容性</li>
  <li>运维复杂度：简化网络管理和故障排查</li>
</ol>

<p>作为光通信设备领域的领先企业，我们持续投入研发，为客户提供高性能、低功耗的创新产品，助力5G时代的数据中心建设。</p>
      `,
      contentEn: `
<h2>Data Center Interconnect Demands in the 5G Era</h2>

<p>With the large-scale commercial deployment of 5G networks, the demand for data center interconnection has shown explosive growth. 5G application scenarios such as ultra-high-definition video, cloud gaming, and industrial internet have raised higher requirements for network bandwidth and latency, driving rapid upgrades in Data Center Interconnect (DCI) technology.</p>

<h3>Key Technology Trends</h3>

<ul>
  <li><strong>400G/800G Optical Module Adoption:</strong> Data centers are accelerating deployment of 400G and 800G high-speed optical modules to meet 5G traffic growth</li>
  <li><strong>Coherent Optical Technology:</strong> Coherent optical technology is increasingly applied in long-distance DCI scenarios</li>
  <li><strong>Programmable Networks:</strong> SDN-based programmable network architectures provide more flexible bandwidth scheduling</li>
  <li><strong>Edge Computing Layout:</strong> Edge data center construction accelerates to reduce latency</li>
</ul>

<h3>Market Opportunities</h3>

<p>According to market research firms, the global DCI market is expected to maintain a CAGR of over 20% in the next five years, presenting enormous opportunities for optical communication equipment suppliers.</p>

<blockquote>
"5G development has not only transformed mobile communications but profoundly impacted the entire data center industry chain." - Industry Expert
</blockquote>

<h3>Technical Challenges</h3>

<p>Despite promising market prospects, technology upgrades face many challenges:</p>

<ol>
  <li>Power Management: Power consumption control for high-speed optical modules</li>
  <li>Cost Optimization: Reducing costs of 400G/800G products</li>
  <li>Interoperability: Ensuring compatibility across multi-vendor equipment</li>
  <li>Operational Complexity: Simplifying network management and troubleshooting</li>
</ol>

<p>As a leading enterprise in optical communication equipment, we continue to invest in R&D to provide customers with high-performance, low-power innovative products, supporting data center construction in the 5G era.</p>
      `,
      excerpt: "5G商用推动数据中心互连技术快速升级，400G/800G光模块、相干光技术成为主流趋势。",
      excerptEn: "5G commercialization drives rapid DCI technology upgrades, with 400G/800G optical modules and coherent optics becoming mainstream.",
      featuredImage: "/uploads/general/1760074214448-w5dtgj93-________.jpeg",
      status: "PUBLISHED",
      categoryId: categories[0].id, // 新闻动态
      publishedAt: new Date("2025-01-10"),
    },
    {
      title: "光模块技术演进：从10G到800G的跨越",
      titleEn: "Optical Module Evolution: From 10G to 800G",
      slug: "optical-module-evolution-10g-to-800g",
      content: `
<h2>光模块技术的发展历程</h2>

<p>光模块作为光通信网络的核心组件，其技术演进见证了整个通信行业的发展。从最初的10G到如今的800G，每一次跨越都代表着技术的重大突破。</p>

<h3>技术代际划分</h3>

<h4>第一代：10G/40G时代（2010-2015）</h4>
<p>这个时期，10G SFP+和40G QSFP+成为数据中心的主流选择。主要特点：</p>
<ul>
  <li>采用NRZ调制技术</li>
  <li>单波长传输</li>
  <li>功耗相对较高（3.5W-5W）</li>
  <li>传输距离受限（10km-40km）</li>
</ul>

<h4>第二代：25G/100G时代（2015-2020）</h4>
<p>25G SFP28和100G QSFP28开始普及，技术进步显著：</p>
<ul>
  <li>PAM4调制技术引入</li>
  <li>功耗优化到2.5W-3.5W</li>
  <li>更高的集成度</li>
  <li>支持更远传输距离</li>
</ul>

<h4>第三代：400G/800G时代（2020至今）</h4>
<p>当前最先进的技术代表：</p>
<ul>
  <li>QSFP-DD/OSFP封装</li>
  <li>8通道PAM4调制</li>
  <li>硅光集成技术</li>
  <li>DSP芯片应用</li>
  <li>功耗控制在12W-15W</li>
</ul>

<h3>关键技术突破</h3>

<h4>1. 调制技术</h4>
<p>从简单的NRZ（非归零码）到PAM4（四电平脉冲幅度调制），再到未来可能的PAM8，调制技术的进步使得在相同带宽下可以传输更多数据。</p>

<h4>2. 封装技术</h4>
<p>封装尺寸的演进：SFP → SFP+ → SFP28 → QSFP → QSFP+ → QSFP28 → QSFP-DD/OSFP，每一代都在追求更高的端口密度和更好的散热性能。</p>

<h4>3. 硅光集成</h4>
<p>硅光子技术的应用大幅降低了光模块的制造成本，同时提高了集成度和可靠性。</p>

<h4>4. DSP技术</h4>
<p>数字信号处理技术的引入，极大改善了信号质量，延长了传输距离，并降低了功耗。</p>

<h3>市场趋势分析</h3>

<table border="1" cellpadding="10">
  <tr>
    <th>速率</th>
    <th>当前市场占比</th>
    <th>未来3年预测</th>
    <th>主要应用场景</th>
  </tr>
  <tr>
    <td>10G/25G</td>
    <td>40%</td>
    <td>20%</td>
    <td>企业网络、小型数据中心</td>
  </tr>
  <tr>
    <td>40G/100G</td>
    <td>35%</td>
    <td>30%</td>
    <td>中型数据中心、城域网</td>
  </tr>
  <tr>
    <td>400G</td>
    <td>20%</td>
    <td>35%</td>
    <td>超大型数据中心、云服务商</td>
  </tr>
  <tr>
    <td>800G</td>
    <td>5%</td>
    <td>15%</td>
    <td>超算中心、AI训练集群</td>
  </tr>
</table>

<h3>未来展望</h3>

<p>展望未来，光模块技术将继续向更高速率、更低功耗、更高集成度方向发展。1.6T光模块已经在研发中，预计2026-2027年开始商用部署。</p>

<p>同时，随着AI、大数据、云计算等应用的爆发式增长，对光模块的需求将保持强劲增长势头。我们将继续加大研发投入，为客户提供业界领先的产品和解决方案。</p>
      `,
      contentEn: `
<h2>The Development History of Optical Modules</h2>

<p>As the core component of optical communication networks, optical module technology evolution has witnessed the development of the entire communications industry. From the initial 10G to today's 800G, each leap represents a major technological breakthrough.</p>

<h3>Technology Generation Classification</h3>

<h4>First Generation: 10G/40G Era (2010-2015)</h4>
<p>During this period, 10G SFP+ and 40G QSFP+ became mainstream choices for data centers. Key features:</p>
<ul>
  <li>NRZ modulation technology</li>
  <li>Single wavelength transmission</li>
  <li>Relatively high power consumption (3.5W-5W)</li>
  <li>Limited transmission distance (10km-40km)</li>
</ul>

<h4>Second Generation: 25G/100G Era (2015-2020)</h4>
<p>25G SFP28 and 100G QSFP28 began to proliferate with significant technological progress:</p>
<ul>
  <li>Introduction of PAM4 modulation technology</li>
  <li>Power consumption optimized to 2.5W-3.5W</li>
  <li>Higher integration</li>
  <li>Support for longer transmission distances</li>
</ul>

<h4>Third Generation: 400G/800G Era (2020-Present)</h4>
<p>Current state-of-the-art technology representatives:</p>
<ul>
  <li>QSFP-DD/OSFP packaging</li>
  <li>8-lane PAM4 modulation</li>
  <li>Silicon photonics integration</li>
  <li>DSP chip application</li>
  <li>Power consumption controlled at 12W-15W</li>
</ul>

<h3>Key Technological Breakthroughs</h3>

<h4>1. Modulation Technology</h4>
<p>From simple NRZ to PAM4, and potentially PAM8 in the future, advances in modulation technology enable transmission of more data within the same bandwidth.</p>

<h4>2. Packaging Technology</h4>
<p>Package size evolution: SFP → SFP+ → SFP28 → QSFP → QSFP+ → QSFP28 → QSFP-DD/OSFP, each generation pursuing higher port density and better thermal performance.</p>

<h4>3. Silicon Photonics Integration</h4>
<p>Silicon photonics technology application significantly reduces optical module manufacturing costs while improving integration and reliability.</p>

<h4>4. DSP Technology</h4>
<p>Digital signal processing technology introduction greatly improves signal quality, extends transmission distance, and reduces power consumption.</p>

<h3>Market Trend Analysis</h3>

<table border="1" cellpadding="10">
  <tr>
    <th>Speed</th>
    <th>Current Market Share</th>
    <th>3-Year Forecast</th>
    <th>Main Applications</th>
  </tr>
  <tr>
    <td>10G/25G</td>
    <td>40%</td>
    <td>20%</td>
    <td>Enterprise networks, Small data centers</td>
  </tr>
  <tr>
    <td>40G/100G</td>
    <td>35%</td>
    <td>30%</td>
    <td>Medium data centers, Metro networks</td>
  </tr>
  <tr>
    <td>400G</td>
    <td>20%</td>
    <td>35%</td>
    <td>Hyperscale data centers, Cloud providers</td>
  </tr>
  <tr>
    <td>800G</td>
    <td>5%</td>
    <td>15%</td>
    <td>Supercomputing centers, AI training clusters</td>
  </tr>
</table>

<h3>Future Outlook</h3>

<p>Looking ahead, optical module technology will continue to develop towards higher speeds, lower power consumption, and higher integration. 1.6T optical modules are already in development, expected to begin commercial deployment in 2026-2027.</p>

<p>Meanwhile, with explosive growth in AI, big data, and cloud computing applications, demand for optical modules will maintain strong growth momentum. We will continue to increase R&D investment to provide customers with industry-leading products and solutions.</p>
      `,
      excerpt: "深入解析光模块技术从10G到800G的演进历程，探讨关键技术突破和未来发展趋势。",
      excerptEn: "In-depth analysis of optical module technology evolution from 10G to 800G, discussing key breakthroughs and future trends.",
      featuredImage: "/uploads/general/1760074214448-w5dtgj93-________.jpeg",
      status: "PUBLISHED",
      categoryId: categories[1].id, // 技术文章
      publishedAt: new Date("2025-01-08"),
    },
    {
      title: "智慧城市建设中的光网络解决方案",
      titleEn: "Optical Network Solutions for Smart City Development",
      slug: "optical-networks-for-smart-cities",
      content: `
<h2>智慧城市的网络基础设施需求</h2>

<p>智慧城市建设需要构建一个高速、可靠、全覆盖的通信网络基础设施。光网络技术凭借其大带宽、低延迟、高可靠性的特点，成为智慧城市网络建设的首选方案。</p>

<h3>智慧城市应用场景</h3>

<h4>1. 智慧交通</h4>
<ul>
  <li>实时交通监控和信号控制</li>
  <li>智能停车系统</li>
  <li>公共交通调度</li>
  <li>车路协同系统</li>
</ul>

<p><strong>网络需求：</strong>大量高清视频回传，要求低延迟（<20ms），高可靠性（99.99%）</p>

<h4>2. 智慧安防</h4>
<ul>
  <li>城市级视频监控系统</li>
  <li>人脸识别系统</li>
  <li>应急指挥系统</li>
  <li>一键报警系统</li>
</ul>

<p><strong>网络需求：</strong>海量视频数据传输，需要TB级带宽，7×24小时不间断运行</p>

<h4>3. 智慧医疗</h4>
<ul>
  <li>远程医疗会诊</li>
  <li>医疗影像传输</li>
  <li>智慧病房</li>
  <li>应急救护系统</li>
</ul>

<p><strong>网络需求：</strong>超低延迟（<10ms），高带宽（10Gbps+），绝对可靠</p>

<h4>4. 智慧教育</h4>
<ul>
  <li>远程互动教学</li>
  <li>教育资源共享</li>
  <li>智慧校园管理</li>
  <li>在线考试系统</li>
</ul>

<h3>光网络解决方案架构</h3>

<h4>三层网络架构</h4>

<div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #0066cc;">
<p><strong>核心层：</strong></p>
<ul>
  <li>400G/800G高速光模块</li>
  <li>OTN设备</li>
  <li>双平面冗余设计</li>
  <li>核心机房互联</li>
</ul>

<p><strong>汇聚层：</strong></p>
<ul>
  <li>100G/200G光模块</li>
  <li>汇聚交换机</li>
  <li>区域数据中心互联</li>
  <li>边缘计算节点</li>
</ul>

<p><strong>接入层：</strong></p>
<ul>
  <li>10G/25G光模块</li>
  <li>PON设备</li>
  <li>物联网网关</li>
  <li>终端设备接入</li>
</ul>
</div>

<h3>技术特点</h3>

<h4>1. 高带宽</h4>
<p>采用波分复用(WDM)技术，单根光纤可承载数十个波长，总带宽达到数十Tbps，轻松应对智慧城市海量数据传输需求。</p>

<h4>2. 低延迟</h4>
<p>光纤传输延迟仅为0.005ms/km，配合边缘计算架构，可实现端到端延迟<10ms，满足实时应用需求。</p>

<h4>3. 高可靠性</h4>
<ul>
  <li>双路由保护：<50ms切换时间</li>
  <li>设备冗余：N+1备份</li>
  <li>电源冗余：双路市电+UPS</li>
  <li>MTBF>100,000小时</li>
</ul>

<h4>4. 绿色节能</h4>
<ul>
  <li>采用低功耗光模块</li>
  <li>智能休眠技术</li>
  <li>自然冷却设计</li>
  <li>相比传统铜缆方案节能40%以上</li>
</ul>

<h3>成功案例分享</h3>

<h4>某一线城市智慧城市项目</h4>

<p><strong>项目规模：</strong></p>
<ul>
  <li>覆盖面积：1,200平方公里</li>
  <li>接入点位：50,000+</li>
  <li>视频监控：15,000路4K高清</li>
  <li>物联网设备：200,000+</li>
</ul>

<p><strong>网络架构：</strong></p>
<ul>
  <li>核心层：800G QSFP-DD光模块</li>
  <li>汇聚层：100G QSFP28光模块</li>
  <li>接入层：25G SFP28光模块</li>
  <li>总带宽：50Tbps</li>
</ul>

<p><strong>项目成果：</strong></p>
<ul>
  <li>网络可用性达到99.99%</li>
  <li>平均延迟<8ms</li>
  <li>支持城市级AI计算平台</li>
  <li>能耗降低45%</li>
</ul>

<h3>未来发展方向</h3>

<ol>
  <li><strong>全光网2.0：</strong>向城市末梢延伸，实现光纤到桌面、到设备</li>
  <li><strong>智能运维：</strong>基于AI的网络自动化运维和故障预测</li>
  <li><strong>算力网络：</strong>网络与计算深度融合，实现算力按需调度</li>
  <li><strong>量子通信：</strong>在关键领域引入量子密钥分发，提升安全性</li>
</ol>

<p>我们致力于为智慧城市建设提供端到端的光网络解决方案，从咨询规划、设备供应到实施部署、运维服务，全方位支撑智慧城市的数字化转型。</p>
      `,
      contentEn: `
<h2>Network Infrastructure Requirements for Smart Cities</h2>

<p>Smart city development requires building high-speed, reliable, and fully-covered communication network infrastructure. Optical network technology, with its high bandwidth, low latency, and high reliability, has become the preferred solution for smart city network construction.</p>

<h3>Smart City Application Scenarios</h3>

<h4>1. Smart Transportation</h4>
<ul>
  <li>Real-time traffic monitoring and signal control</li>
  <li>Intelligent parking systems</li>
  <li>Public transportation scheduling</li>
  <li>Vehicle-road cooperative systems</li>
</ul>

<p><strong>Network Requirements:</strong> Large-scale HD video backhaul, requiring low latency (<20ms), high reliability (99.99%)</p>

<h4>2. Smart Security</h4>
<ul>
  <li>City-wide video surveillance systems</li>
  <li>Facial recognition systems</li>
  <li>Emergency command systems</li>
  <li>One-touch alarm systems</li>
</ul>

<p><strong>Network Requirements:</strong> Massive video data transmission, requiring TB-level bandwidth, 7×24 continuous operation</p>

<h4>3. Smart Healthcare</h4>
<ul>
  <li>Telemedicine consultations</li>
  <li>Medical image transmission</li>
  <li>Smart wards</li>
  <li>Emergency rescue systems</li>
</ul>

<p><strong>Network Requirements:</strong> Ultra-low latency (<10ms), high bandwidth (10Gbps+), absolute reliability</p>

<h4>4. Smart Education</h4>
<ul>
  <li>Remote interactive teaching</li>
  <li>Educational resource sharing</li>
  <li>Smart campus management</li>
  <li>Online examination systems</li>
</ul>

<h3>Optical Network Solution Architecture</h3>

<h4>Three-Layer Network Architecture</h4>

<div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #0066cc;">
<p><strong>Core Layer:</strong></p>
<ul>
  <li>400G/800G high-speed optical modules</li>
  <li>OTN equipment</li>
  <li>Dual-plane redundancy design</li>
  <li>Core data center interconnection</li>
</ul>

<p><strong>Aggregation Layer:</strong></p>
<ul>
  <li>100G/200G optical modules</li>
  <li>Aggregation switches</li>
  <li>Regional data center interconnection</li>
  <li>Edge computing nodes</li>
</ul>

<p><strong>Access Layer:</strong></p>
<ul>
  <li>10G/25G optical modules</li>
  <li>PON equipment</li>
  <li>IoT gateways</li>
  <li>Terminal device access</li>
</ul>
</div>

<h3>Technical Features</h3>

<h4>1. High Bandwidth</h4>
<p>Using WDM technology, a single fiber can carry dozens of wavelengths with total bandwidth reaching tens of Tbps, easily meeting smart city massive data transmission needs.</p>

<h4>2. Low Latency</h4>
<p>Fiber transmission delay is only 0.005ms/km. Combined with edge computing architecture, end-to-end latency <10ms can be achieved, meeting real-time application requirements.</p>

<h4>3. High Reliability</h4>
<ul>
  <li>Dual-route protection: <50ms switching time</li>
  <li>Equipment redundancy: N+1 backup</li>
  <li>Power redundancy: Dual utility power + UPS</li>
  <li>MTBF>100,000 hours</li>
</ul>

<h4>4. Green and Energy-Efficient</h4>
<ul>
  <li>Low-power optical modules</li>
  <li>Intelligent sleep technology</li>
  <li>Natural cooling design</li>
  <li>40%+ energy savings vs traditional copper solutions</li>
</ul>

<h3>Success Case Study</h3>

<h4>Tier-1 City Smart City Project</h4>

<p><strong>Project Scale:</strong></p>
<ul>
  <li>Coverage area: 1,200 square kilometers</li>
  <li>Access points: 50,000+</li>
  <li>Video surveillance: 15,000 4K HD streams</li>
  <li>IoT devices: 200,000+</li>
</ul>

<p><strong>Network Architecture:</strong></p>
<ul>
  <li>Core layer: 800G QSFP-DD optical modules</li>
  <li>Aggregation layer: 100G QSFP28 optical modules</li>
  <li>Access layer: 25G SFP28 optical modules</li>
  <li>Total bandwidth: 50Tbps</li>
</ul>

<p><strong>Project Results:</strong></p>
<ul>
  <li>Network availability reached 99.99%</li>
  <li>Average latency <8ms</li>
  <li>Supports city-level AI computing platform</li>
  <li>45% energy consumption reduction</li>
</ul>

<h3>Future Development Directions</h3>

<ol>
  <li><strong>All-Optical Network 2.0:</strong> Extending to city periphery, achieving fiber to desktop and device</li>
  <li><strong>Intelligent O&M:</strong> AI-based network automation and fault prediction</li>
  <li><strong>Computing Power Network:</strong> Deep integration of network and computing, on-demand computing power scheduling</li>
  <li><strong>Quantum Communication:</strong> Introducing quantum key distribution in critical areas to enhance security</li>
</ol>

<p>We are committed to providing end-to-end optical network solutions for smart city construction, from consulting and planning, equipment supply to implementation and O&M services, comprehensively supporting digital transformation of smart cities.</p>
      `,
      excerpt: "探讨智慧城市建设中的光网络解决方案，分享成功案例和最佳实践。",
      excerptEn: "Exploring optical network solutions for smart city development, sharing success cases and best practices.",
      featuredImage: "/uploads/general/1760074242212-uwa9tnc4-junjun.jpg",
      status: "PUBLISHED",
      categoryId: categories[2].id, // 解决方案
      publishedAt: new Date("2025-01-05"),
    },
    {
      title: "AI算力网络建设趋势与挑战",
      titleEn: "AI Computing Network Construction Trends and Challenges",
      slug: "ai-computing-network-trends-challenges",
      content: `
<h2>AI算力时代的网络需求</h2>

<p>随着人工智能技术的快速发展，大模型训练对算力和网络的需求呈指数级增长。构建高性能的AI算力网络，成为支撑AI发展的关键基础设施。</p>

<h3>AI训练对网络的核心需求</h3>

<h4>1. 超大带宽</h4>
<p>大模型训练需要在数千个GPU之间进行频繁的参数同步，每次同步的数据量可达数GB甚至数十GB。要求网络提供：</p>
<ul>
  <li>单机柜带宽：>1Tbps</li>
  <li>机柜间带宽：400Gbps-800Gbps</li>
  <li>集群总带宽：数十Pbps</li>
</ul>

<h4>2. 超低延迟</h4>
<p>参数同步的延迟直接影响训练效率。延迟每增加1微秒，可能导致训练时间增加数小时。要求：</p>
<ul>
  <li>机柜内延迟：<1微秒</li>
  <li>机柜间延迟：<10微秒</li>
  <li>抖动：<0.1微秒</li>
</ul>

<h4>3. 无损传输</h4>
<p>集合通信对丢包极其敏感，即使0.01%的丢包率也会导致训练效率大幅下降。必须实现：</p>
<ul>
  <li>零丢包传输</li>
  <li>完整的流控机制</li>
  <li>智能拥塞管理</li>
</ul>

<h3>技术解决方案</h3>

<h4>InfiniBand vs Ethernet</h4>

<table border="1" cellpadding="10" style="width:100%; border-collapse: collapse;">
  <tr style="background: #f5f5f5;">
    <th>特性</th>
    <th>InfiniBand</th>
    <th>以太网（RoCE v2）</th>
  </tr>
  <tr>
    <td>带宽</td>
    <td>400Gbps (NDR)</td>
    <td>400Gbps-800Gbps</td>
  </tr>
  <tr>
    <td>延迟</td>
    <td>~0.6微秒</td>
    <td>~2微秒</td>
  </tr>
  <tr>
    <td>丢包率</td>
    <td><10^-15</td>
    <td><10^-12（需PFC）</td>
  </tr>
  <tr>
    <td>生态成熟度</td>
    <td>高</td>
    <td>快速发展中</td>
  </tr>
  <tr>
    <td>成本</td>
    <td>较高</td>
    <td>相对较低</td>
  </tr>
  <tr>
    <td>部署复杂度</td>
    <td>中等</td>
    <td>较低</td>
  </tr>
</table>

<h4>网络拓扑选择</h4>

<p><strong>1. Fat-Tree拓扑</strong></p>
<ul>
  <li>优点：无阻塞，对称带宽</li>
  <li>缺点：跳数较多，成本较高</li>
  <li>适用：中小规模集群（<10,000 GPU）</li>
</ul>

<p><strong>2. Rail-Optimized拓扑</strong></p>
<ul>
  <li>优点：低延迟，高吞吐</li>
  <li>缺点：复杂度较高</li>
  <li>适用：大规模训练集群（>10,000 GPU）</li>
</ul>

<p><strong>3. Dragonfly+拓扑</strong></p>
<ul>
  <li>优点：极低跳数，可扩展性强</li>
  <li>缺点：需要全局路由优化</li>
  <li>适用：超大规模集群（>50,000 GPU）</li>
</ul>

<h3>关键技术</h3>

<h4>1. 800G光模块</h4>
<p>800G光模块成为AI算力网络的主力产品，主要特点：</p>
<ul>
  <li>8×100G PAM4调制</li>
  <li>功耗<15W</li>
  <li>支持2km传输（FR8）</li>
  <li>热插拔，易维护</li>
</ul>

<h4>2. 拥塞控制</h4>
<p>多种拥塞控制机制协同工作：</p>
<ul>
  <li><strong>PFC (Priority Flow Control)：</strong>链路级流控</li>
  <li><strong>ECN (Explicit Congestion Notification)：</strong>拥塞标记</li>
  <li><strong>DCQCN：</strong>端到端拥塞控制</li>
  <li><strong>智能路由：</strong>负载均衡和拥塞规避</li>
</ul>

<h4>3. 网络遥测</h4>
<p>实时监控网络状态：</p>
<ul>
  <li>微秒级延迟监测</li>
  <li>逐包丢包检测</li>
  <li>拥塞点定位</li>
  <li>流量热点识别</li>
</ul>

<h3>实际部署案例</h3>

<h4>某AI公司10,000卡训练集群</h4>

<p><strong>配置方案：</strong></p>
<ul>
  <li>GPU：10,000张H100/H800</li>
  <li>网络：800G InfiniBand NDR</li>
  <li>拓扑：3-tier Fat-Tree</li>
  <li>光模块：800G QSFP-DD SR8</li>
  <li>交换机：64口800G Leaf + 32口800G Spine</li>
</ul>

<p><strong>性能指标：</strong></p>
<ul>
  <li>全对全带宽：>6.4Pbps</li>
  <li>平均延迟：1.2微秒</li>
  <li>丢包率：<10^-14</li>
  <li>集合通信效率：>95%</li>
</ul>

<p><strong>业务效果：</strong></p>
<ul>
  <li>千亿参数模型训练时间从60天缩短到30天</li>
  <li>GPU利用率从65%提升到90%</li>
  <li>训练成本降低40%</li>
</ul>

<h3>面临的挑战</h3>

<ol>
  <li><strong>规模挑战：</strong>如何构建10万卡级别的统一训练集群</li>
  <li><strong>功耗挑战：</strong>网络功耗占比从5%上升到15%</li>
  <li><strong>成本挑战：</strong>网络成本占比从10%上升到25%</li>
  <li><strong>运维挑战：</strong>故障诊断和性能优化复杂度指数级增长</li>
  <li><strong>演进挑战：</strong>如何平滑升级到1.6T/3.2T网络</li>
</ol>

<h3>未来展望</h3>

<p>未来3-5年，AI算力网络将朝着以下方向发展：</p>

<ul>
  <li><strong>更高速率：</strong>1.6T/3.2T光模块商用</li>
  <li><strong>更低延迟：</strong>光电融合，实现亚微秒延迟</li>
  <li><strong>更大规模：</strong>支持百万卡级别训练集群</li>
  <li><strong>更智能：</strong>AI驱动的网络自优化</li>
  <li><strong>更节能：</strong>网络能效比提升5倍以上</li>
</ul>

<p>作为光通信领域的创新企业，我们深耕AI算力网络市场，为客户提供高性能、高可靠、易运维的网络解决方案，助力AI技术发展。</p>
      `,
      contentEn: `
<h2>Network Requirements in the AI Computing Era</h2>

<p>With the rapid development of artificial intelligence technology, the demand for computing power and networks for large model training has grown exponentially. Building high-performance AI computing networks has become critical infrastructure supporting AI development.</p>

<h3>Core Network Requirements for AI Training</h3>

<h4>1. Ultra-High Bandwidth</h4>
<p>Large model training requires frequent parameter synchronization among thousands of GPUs, with each synchronization involving GB to tens of GB of data. Network requirements:</p>
<ul>
  <li>Single rack bandwidth: >1Tbps</li>
  <li>Inter-rack bandwidth: 400Gbps-800Gbps</li>
  <li>Cluster total bandwidth: Tens of Pbps</li>
</ul>

<h4>2. Ultra-Low Latency</h4>
<p>Parameter synchronization latency directly affects training efficiency. Each additional microsecond of delay may increase training time by hours. Requirements:</p>
<ul>
  <li>Intra-rack latency: <1 microsecond</li>
  <li>Inter-rack latency: <10 microseconds</li>
  <li>Jitter: <0.1 microseconds</li>
</ul>

<h4>3. Lossless Transmission</h4>
<p>Collective communications are extremely sensitive to packet loss. Even 0.01% loss significantly reduces training efficiency. Must achieve:</p>
<ul>
  <li>Zero packet loss transmission</li>
  <li>Complete flow control mechanism</li>
  <li>Intelligent congestion management</li>
</ul>

<h3>Technical Solutions</h3>

<h4>InfiniBand vs Ethernet</h4>

<table border="1" cellpadding="10" style="width:100%; border-collapse: collapse;">
  <tr style="background: #f5f5f5;">
    <th>Feature</th>
    <th>InfiniBand</th>
    <th>Ethernet (RoCE v2)</th>
  </tr>
  <tr>
    <td>Bandwidth</td>
    <td>400Gbps (NDR)</td>
    <td>400Gbps-800Gbps</td>
  </tr>
  <tr>
    <td>Latency</td>
    <td>~0.6 microseconds</td>
    <td>~2 microseconds</td>
  </tr>
  <tr>
    <td>Packet Loss</td>
    <td><10^-15</td>
    <td><10^-12 (with PFC)</td>
  </tr>
  <tr>
    <td>Ecosystem Maturity</td>
    <td>High</td>
    <td>Rapidly Developing</td>
  </tr>
  <tr>
    <td>Cost</td>
    <td>Higher</td>
    <td>Relatively Lower</td>
  </tr>
  <tr>
    <td>Deployment Complexity</td>
    <td>Medium</td>
    <td>Lower</td>
  </tr>
</table>

<h4>Network Topology Selection</h4>

<p><strong>1. Fat-Tree Topology</strong></p>
<ul>
  <li>Pros: Non-blocking, symmetric bandwidth</li>
  <li>Cons: More hops, higher cost</li>
  <li>Suitable for: Small-medium clusters (<10,000 GPUs)</li>
</ul>

<p><strong>2. Rail-Optimized Topology</strong></p>
<ul>
  <li>Pros: Low latency, high throughput</li>
  <li>Cons: Higher complexity</li>
  <li>Suitable for: Large training clusters (>10,000 GPUs)</li>
</ul>

<p><strong>3. Dragonfly+ Topology</strong></p>
<ul>
  <li>Pros: Minimal hops, highly scalable</li>
  <li>Cons: Requires global routing optimization</li>
  <li>Suitable for: Ultra-large clusters (>50,000 GPUs)</li>
</ul>

<h3>Key Technologies</h3>

<h4>1. 800G Optical Modules</h4>
<p>800G optical modules are the workhorse of AI computing networks, featuring:</p>
<ul>
  <li>8×100G PAM4 modulation</li>
  <li>Power consumption <15W</li>
  <li>Supports 2km transmission (FR8)</li>
  <li>Hot-swappable, easy maintenance</li>
</ul>

<h4>2. Congestion Control</h4>
<p>Multiple congestion control mechanisms work together:</p>
<ul>
  <li><strong>PFC (Priority Flow Control):</strong> Link-level flow control</li>
  <li><strong>ECN (Explicit Congestion Notification):</strong> Congestion marking</li>
  <li><strong>DCQCN:</strong> End-to-end congestion control</li>
  <li><strong>Smart Routing:</strong> Load balancing and congestion avoidance</li>
</ul>

<h4>3. Network Telemetry</h4>
<p>Real-time network state monitoring:</p>
<ul>
  <li>Microsecond-level latency monitoring</li>
  <li>Per-packet loss detection</li>
  <li>Congestion point localization</li>
  <li>Traffic hotspot identification</li>
</ul>

<h3>Actual Deployment Case</h3>

<h4>AI Company 10,000-Card Training Cluster</h4>

<p><strong>Configuration:</strong></p>
<ul>
  <li>GPUs: 10,000 H100/H800 cards</li>
  <li>Network: 800G InfiniBand NDR</li>
  <li>Topology: 3-tier Fat-Tree</li>
  <li>Optical Modules: 800G QSFP-DD SR8</li>
  <li>Switches: 64-port 800G Leaf + 32-port 800G Spine</li>
</ul>

<p><strong>Performance Metrics:</strong></p>
<ul>
  <li>All-to-all bandwidth: >6.4Pbps</li>
  <li>Average latency: 1.2 microseconds</li>
  <li>Packet loss rate: <10^-14</li>
  <li>Collective communication efficiency: >95%</li>
</ul>

<p><strong>Business Results:</strong></p>
<ul>
  <li>100B parameter model training time reduced from 60 to 30 days</li>
  <li>GPU utilization improved from 65% to 90%</li>
  <li>Training costs reduced by 40%</li>
</ul>

<h3>Challenges Faced</h3>

<ol>
  <li><strong>Scale Challenge:</strong> How to build unified training clusters with 100K cards</li>
  <li><strong>Power Challenge:</strong> Network power consumption ratio increased from 5% to 15%</li>
  <li><strong>Cost Challenge:</strong> Network cost ratio increased from 10% to 25%</li>
  <li><strong>O&M Challenge:</strong> Exponential growth in fault diagnosis and performance optimization complexity</li>
  <li><strong>Evolution Challenge:</strong> How to smoothly upgrade to 1.6T/3.2T networks</li>
</ol>

<h3>Future Outlook</h3>

<p>In the next 3-5 years, AI computing networks will develop in these directions:</p>

<ul>
  <li><strong>Higher Speeds:</strong> 1.6T/3.2T optical module commercialization</li>
  <li><strong>Lower Latency:</strong> Optical-electrical integration, sub-microsecond latency</li>
  <li><strong>Larger Scale:</strong> Support for million-card training clusters</li>
  <li><strong>More Intelligent:</strong> AI-driven network self-optimization</li>
  <li><strong>More Energy-Efficient:</strong> 5x+ improvement in network energy efficiency</li>
</ul>

<p>As an innovative enterprise in optical communications, we focus on the AI computing network market, providing customers with high-performance, high-reliability, easy-to-maintain network solutions to support AI technology development.</p>
      `,
      excerpt: "深入分析AI算力网络的技术需求、解决方案和实际部署案例，展望未来发展方向。",
      excerptEn: "In-depth analysis of AI computing network technical requirements, solutions, and deployment cases, with future outlook.",
      featuredImage: "/uploads/general/1760074214448-w5dtgj93-________.jpeg",
      status: "PUBLISHED",
      categoryId: categories[3].id, // 行业洞察
      publishedAt: new Date("2025-01-03"),
    },
    {
      title: "数据中心绿色节能技术实践",
      titleEn: "Green Energy-Saving Technology Practices in Data Centers",
      slug: "green-energy-saving-data-center-practices",
      content: `
<h2>数据中心能耗现状</h2>

<p>数据中心是能源消耗大户，全球数据中心耗电量占总用电量的2-3%。随着数字化转型加速，这一比例还在持续上升。绿色节能成为数据中心建设的必答题。</p>

<h3>能耗构成分析</h3>

<div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
<p><strong>典型数据中心能耗分布：</strong></p>
<ul>
  <li>IT设备：45%（服务器、存储、网络设备）</li>
  <li>制冷系统：35%（空调、冷水机组）</li>
  <li>供电系统：10%（UPS、变压器等损耗）</li>
  <li>照明及其他：10%</li>
</ul>
</div>

<h3>网络设备节能技术</h3>

<h4>1. 低功耗光模块</h4>

<p>新一代光模块通过以下技术实现节能：</p>

<ul>
  <li><strong>先进工艺：</strong>采用7nm/5nm芯片工艺，功耗降低30%</li>
  <li><strong>硅光集成：</strong>集成度提升10倍，功耗降低40%</li>
  <li><strong>PAM4调制：</strong>相同速率下功耗降低25%</li>
  <li><strong>智能功率管理：</strong>根据流量动态调整功耗</li>
</ul>

<table border="1" cellpadding="10" style="width:100%; border-collapse: collapse; margin: 20px 0;">
  <tr style="background: #e9ecef;">
    <th>光模块类型</th>
    <th>传统功耗</th>
    <th>节能方案功耗</th>
    <th>节能比例</th>
  </tr>
  <tr>
    <td>100G QSFP28</td>
    <td>3.5W</td>
    <td>2.0W</td>
    <td>43%</td>
  </tr>
  <tr>
    <td>400G QSFP-DD</td>
    <td>14W</td>
    <td>10W</td>
    <td>29%</td>
  </tr>
  <tr>
    <td>800G QSFP-DD</td>
    <td>22W</td>
    <td>15W</td>
    <td>32%</td>
  </tr>
</table>

<h4>2. 智能休眠技术</h4>

<p>在业务低峰期，网络设备可以进入休眠模式：</p>

<ul>
  <li><strong>端口休眠：</strong>空闲端口自动降低功耗至10%</li>
  <li><strong>部分休眠：</strong>非关键功能模块进入低功耗模式</li>
  <li><strong>快速唤醒：</strong>检测到流量后100ms内恢复正常</li>
  <li><strong>智能调度：</strong>根据业务预测提前唤醒</li>
</ul>

<h4>3. 液冷技术</h4>

<p>高密度设备采用液冷方案：</p>

<ul>
  <li>散热效率比风冷提升10倍</li>
  <li>PUE从1.8降低到1.2</li>
  <li>设备可靠性提升30%</li>
  <li>噪音降低40dB</li>
</ul>

<h3>供电系统优化</h3>

<h4>高压直流供电(HVDC)</h4>

<p>相比传统AC供电，HVDC具有显著优势：</p>

<ul>
  <li>减少AC/DC转换环节，效率提升3-5%</li>
  <li>UPS配置可减少30%</li>
  <li>线缆损耗降低40%</li>
  <li>系统可靠性提升</li>
</ul>

<h4>分布式供电架构</h4>

<ul>
  <li>机柜级电源，减少长距离传输损耗</li>
  <li>模块化设计，按需扩容</li>
  <li>效率曲线更优，在20%-100%负载下效率均>95%</li>
</ul>

<h3>制冷系统创新</h3>

<h4>1. 自然冷却</h4>

<p>充分利用自然冷源：</p>

<ul>
  <li><strong>Free Cooling：</strong>室外温度<15℃时，直接引入冷空气</li>
  <li><strong>蒸发冷却：</strong>利用水蒸发降温，PUE降低0.2</li>
  <li><strong>地源热泵：</strong>利用地下恒温，全年节能30%</li>
</ul>

<h4>2. AI智能调优</h4>

<p>基于AI的制冷系统优化：</p>

<ul>
  <li>实时监测温湿度、功耗等数百个参数</li>
  <li>AI模型预测最优制冷策略</li>
  <li>自动调节冷水机组、水泵、风机</li>
  <li>制冷能耗降低15-20%</li>
</ul>

<h3>实施案例</h3>

<h4>某超大型数据中心绿色改造项目</h4>

<p><strong>项目背景：</strong></p>
<ul>
  <li>总机柜数：10,000个</li>
  <li>IT负载：50MW</li>
  <li>改造前PUE：1.8</li>
  <li>年电费：2.5亿元</li>
</ul>

<p><strong>改造方案：</strong></p>

<ol>
  <li><strong>网络设备升级</strong>
    <ul>
      <li>更换新一代低功耗光模块</li>
      <li>部署智能休眠功能</li>
      <li>优化网络拓扑</li>
    </ul>
  </li>
  <li><strong>供电系统优化</strong>
    <ul>
      <li>AC供电升级为HVDC</li>
      <li>部署分布式电源</li>
      <li>更换高效UPS</li>
    </ul>
  </li>
  <li><strong>制冷系统改造</strong>
    <ul>
      <li>部署Free Cooling系统</li>
      <li>AI智能控制系统</li>
      <li>局部液冷改造</li>
    </ul>
  </li>
  <li><strong>管理优化</strong>
    <ul>
      <li>能耗实时监控平台</li>
      <li>碳排放管理系统</li>
      <li>能效KPI考核</li>
    </ul>
  </li>
</ol>

<p><strong>改造成果：</strong></p>

<div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
<ul>
  <li>PUE从1.8降至1.25</li>
  <li>年节电量：1,500万度</li>
  <li>年节省电费：1,200万元</li>
  <li>碳排放减少：12,000吨/年</li>
  <li>投资回收期：3.2年</li>
</ul>
</div>

<h3>绿色数据中心认证</h3>

<p>我们帮助客户获得多项绿色认证：</p>

<ul>
  <li><strong>国际认证：</strong>
    <ul>
      <li>LEED（绿色建筑认证）</li>
      <li>ENERGY STAR（能源之星）</li>
      <li>Uptime Institute（运营效率认证）</li>
    </ul>
  </li>
  <li><strong>国内认证：</strong>
    <ul>
      <li>绿色数据中心（工信部）</li>
      <li>国家绿色机房（中国电子学会）</li>
      <li>碳中和数据中心</li>
    </ul>
  </li>
</ul>

<h3>政策与标准</h3>

<h4>国内政策</h4>
<ul>
  <li>《新建数据中心PUE<1.3》（发改委，2021）</li>
  <li>《碳达峰碳中和行动方案》（国务院，2021）</li>
  <li>《"十四五"信息通信行业发展规划》（工信部，2021）</li>
</ul>

<h4>国际标准</h4>
<ul>
  <li>ISO 50001能源管理体系</li>
  <li>EN 50600欧洲数据中心标准</li>
  <li>TIA-942数据中心电信基础设施标准</li>
</ul>

<h3>未来趋势</h3>

<ol>
  <li><strong>零碳数据中心</strong>
    <ul>
      <li>100%使用可再生能源</li>
      <li>碳捕捉与封存技术</li>
      <li>碳汇补偿机制</li>
    </ul>
  </li>
  <li><strong>余热回收</strong>
    <ul>
      <li>数据中心余热用于城市供暖</li>
      <li>热电联产</li>
      <li>农业温室加热</li>
    </ul>
  </li>
  <li><strong>边缘计算</strong>
    <ul>
      <li>就近部署，减少传输能耗</li>
      <li>利用本地可再生能源</li>
      <li>弹性伸缩，按需供能</li>
    </ul>
  </li>
</ol>

<p>我们致力于提供全方位的绿色数据中心解决方案，从规划设计到产品选型，从系统集成到运维优化，帮助客户实现经济效益与环境效益的双赢。</p>
      `,
      contentEn: `
<h2>Current Status of Data Center Energy Consumption</h2>

<p>Data centers are major energy consumers, accounting for 2-3% of global electricity consumption. With accelerating digital transformation, this proportion continues to rise. Green energy-saving has become a mandatory requirement for data center construction.</p>

<h3>Energy Consumption Analysis</h3>

<div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
<p><strong>Typical Data Center Energy Distribution:</strong></p>
<ul>
  <li>IT Equipment: 45% (servers, storage, network equipment)</li>
  <li>Cooling System: 35% (AC, chillers)</li>
  <li>Power System: 10% (UPS, transformer losses)</li>
  <li>Lighting & Others: 10%</li>
</ul>
</div>

<h3>Network Equipment Energy-Saving Technologies</h3>

<h4>1. Low-Power Optical Modules</h4>

<p>Next-generation optical modules achieve energy savings through:</p>

<ul>
  <li><strong>Advanced Process:</strong> 7nm/5nm chip process, 30% power reduction</li>
  <li><strong>Silicon Photonics:</strong> 10x integration improvement, 40% power reduction</li>
  <li><strong>PAM4 Modulation:</strong> 25% power reduction at same speed</li>
  <li><strong>Smart Power Management:</strong> Dynamic power adjustment based on traffic</li>
</ul>

<table border="1" cellpadding="10" style="width:100%; border-collapse: collapse; margin: 20px 0;">
  <tr style="background: #e9ecef;">
    <th>Optical Module Type</th>
    <th>Traditional Power</th>
    <th>Energy-Saving Power</th>
    <th>Savings</th>
  </tr>
  <tr>
    <td>100G QSFP28</td>
    <td>3.5W</td>
    <td>2.0W</td>
    <td>43%</td>
  </tr>
  <tr>
    <td>400G QSFP-DD</td>
    <td>14W</td>
    <td>10W</td>
    <td>29%</td>
  </tr>
  <tr>
    <td>800G QSFP-DD</td>
    <td>22W</td>
    <td>15W</td>
    <td>32%</td>
  </tr>
</table>

<h4>2. Smart Sleep Technology</h4>

<p>During off-peak periods, network equipment can enter sleep mode:</p>

<ul>
  <li><strong>Port Sleep:</strong> Idle ports automatically reduce power to 10%</li>
  <li><strong>Partial Sleep:</strong> Non-critical function modules enter low-power mode</li>
  <li><strong>Quick Wake:</strong> Resume normal operation within 100ms upon traffic detection</li>
  <li><strong>Smart Scheduling:</strong> Pre-wake based on business forecasting</li>
</ul>

<h4>3. Liquid Cooling Technology</h4>

<p>High-density equipment using liquid cooling solutions:</p>

<ul>
  <li>10x cooling efficiency improvement vs air cooling</li>
  <li>PUE reduced from 1.8 to 1.2</li>
  <li>30% improvement in equipment reliability</li>
  <li>40dB noise reduction</li>
</ul>

<h3>Power System Optimization</h3>

<h4>High-Voltage Direct Current (HVDC)</h4>

<p>HVDC has significant advantages over traditional AC power:</p>

<ul>
  <li>Reduced AC/DC conversion stages, 3-5% efficiency improvement</li>
  <li>30% reduction in UPS configuration</li>
  <li>40% reduction in cable losses</li>
  <li>Improved system reliability</li>
</ul>

<h4>Distributed Power Architecture</h4>

<ul>
  <li>Rack-level power supply, reduced long-distance transmission losses</li>
  <li>Modular design, expansion on demand</li>
  <li>Optimized efficiency curve, >95% efficiency at 20%-100% load</li>
</ul>

<h3>Cooling System Innovation</h3>

<h4>1. Natural Cooling</h4>

<p>Fully utilize natural cooling sources:</p>

<ul>
  <li><strong>Free Cooling:</strong> Direct outdoor air when temperature <15℃</li>
  <li><strong>Evaporative Cooling:</strong> Water evaporation cooling, PUE reduction of 0.2</li>
  <li><strong>Ground Source Heat Pump:</strong> Underground constant temperature, 30% annual energy savings</li>
</ul>

<h4>2. AI Smart Optimization</h4>

<p>AI-based cooling system optimization:</p>

<ul>
  <li>Real-time monitoring of hundreds of parameters including temperature, humidity, power</li>
  <li>AI models predict optimal cooling strategy</li>
  <li>Automatic adjustment of chillers, pumps, fans</li>
  <li>15-20% reduction in cooling energy consumption</li>
</ul>

<h3>Implementation Case</h3>

<h4>Hyperscale Data Center Green Renovation Project</h4>

<p><strong>Project Background:</strong></p>
<ul>
  <li>Total racks: 10,000</li>
  <li>IT load: 50MW</li>
  <li>Pre-renovation PUE: 1.8</li>
  <li>Annual electricity cost: 250M RMB</li>
</ul>

<p><strong>Renovation Plan:</strong></p>

<ol>
  <li><strong>Network Equipment Upgrade</strong>
    <ul>
      <li>Replace with new-generation low-power optical modules</li>
      <li>Deploy smart sleep functionality</li>
      <li>Optimize network topology</li>
    </ul>
  </li>
  <li><strong>Power System Optimization</strong>
    <ul>
      <li>AC power upgraded to HVDC</li>
      <li>Deploy distributed power supplies</li>
      <li>Replace with high-efficiency UPS</li>
    </ul>
  </li>
  <li><strong>Cooling System Renovation</strong>
    <ul>
      <li>Deploy Free Cooling system</li>
      <li>AI smart control system</li>
      <li>Partial liquid cooling renovation</li>
    </ul>
  </li>
  <li><strong>Management Optimization</strong>
    <ul>
      <li>Real-time energy monitoring platform</li>
      <li>Carbon emission management system</li>
      <li>Energy efficiency KPI assessment</li>
    </ul>
  </li>
</ol>

<p><strong>Renovation Results:</strong></p>

<div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
<ul>
  <li>PUE reduced from 1.8 to 1.25</li>
  <li>Annual electricity savings: 15M kWh</li>
  <li>Annual cost savings: 12M RMB</li>
  <li>Carbon emission reduction: 12,000 tons/year</li>
  <li>Investment payback period: 3.2 years</li>
</ul>
</div>

<h3>Green Data Center Certification</h3>

<p>We help customers obtain multiple green certifications:</p>

<ul>
  <li><strong>International Certifications:</strong>
    <ul>
      <li>LEED (Green Building Certification)</li>
      <li>ENERGY STAR</li>
      <li>Uptime Institute (Operational Efficiency Certification)</li>
    </ul>
  </li>
  <li><strong>Domestic Certifications:</strong>
    <ul>
      <li>Green Data Center (MIIT)</li>
      <li>National Green Machine Room (Chinese Institute of Electronics)</li>
      <li>Carbon Neutral Data Center</li>
    </ul>
  </li>
</ul>

<h3>Policies and Standards</h3>

<h4>Domestic Policies</h4>
<ul>
  <li>"New Data Centers PUE<1.3" (NDRC, 2021)</li>
  <li>"Carbon Peak Carbon Neutrality Action Plan" (State Council, 2021)</li>
  <li>"14th Five-Year Information and Communication Industry Development Plan" (MIIT, 2021)</li>
</ul>

<h4>International Standards</h4>
<ul>
  <li>ISO 50001 Energy Management System</li>
  <li>EN 50600 European Data Center Standard</li>
  <li>TIA-942 Data Center Telecommunications Infrastructure Standard</li>
</ul>

<h3>Future Trends</h3>

<ol>
  <li><strong>Zero-Carbon Data Centers</strong>
    <ul>
      <li>100% renewable energy use</li>
      <li>Carbon capture and storage technology</li>
      <li>Carbon offset mechanisms</li>
    </ul>
  </li>
  <li><strong>Waste Heat Recovery</strong>
    <ul>
      <li>Data center waste heat for urban heating</li>
      <li>Combined heat and power</li>
      <li>Agricultural greenhouse heating</li>
    </ul>
  </li>
  <li><strong>Edge Computing</strong>
    <ul>
      <li>Local deployment, reduced transmission energy consumption</li>
      <li>Utilize local renewable energy</li>
      <li>Elastic scaling, energy on demand</li>
    </ul>
  </li>
</ol>

<p>We are committed to providing comprehensive green data center solutions, from planning and design to product selection, from system integration to operations optimization, helping customers achieve win-win economic and environmental benefits.</p>
      `,
      excerpt: "分享数据中心绿色节能技术实践，包括低功耗设备、智能制冷和可再生能源利用。",
      excerptEn: "Sharing green energy-saving technology practices in data centers, including low-power equipment, smart cooling, and renewable energy utilization.",
      featuredImage: "/uploads/general/1760074242212-uwa9tnc4-junjun.jpg",
      status: "PUBLISHED",
      categoryId: categories[2].id, // 解决方案
      publishedAt: new Date("2025-01-01"),
    },
  ];

  // 创建文章
  for (const post of posts) {
    try {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {
          ...post,
          authorId: author.id,
        },
        create: {
          ...post,
          authorId: author.id,
        },
      });
      console.log(`✓ 创建文章: ${post.title}`);
    } catch (error) {
      console.error(`✗ 创建文章失败: ${post.title}`, error);
    }
  }

  console.log("\n文章数据创建完成！");
  console.log(`共创建 ${posts.length} 篇文章`);
  console.log(`共创建/更新 ${categories.length} 个分类`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
