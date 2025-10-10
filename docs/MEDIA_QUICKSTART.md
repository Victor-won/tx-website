# 资源库快速开始指南

## 🚀 快速开始

### 1. 启动开发服务器

```bash
# 启动开发服务器
DATABASE_URL="mysql://root:123123@localhost:3306/tx_website" npm run dev
```

### 2. 访问资源库

打开浏览器访问: `http://localhost:3000/zh/admin/media`

### 3. 登录管理后台

使用管理员账号登录后台管理系统。

### 4. 开始使用

#### 上传文件

**方式一: 点击上传**
1. 点击页面右上角的"上传文件"按钮
2. 选择一个或多个文件(最多20个)
3. 等待上传完成

**方式二: 拖拽上传**
1. 直接将文件拖拽到上传区域
2. 等待上传完成

#### 管理文件

**搜索文件**
- 在搜索框输入关键词,实时搜索文件

**筛选文件**
- 使用"类型"下拉框按文件类型筛选
- 使用"文件夹"下拉框按文件夹筛选

**预览文件**
- 点击文件卡片上的"眼睛"图标预览文件
- 查看文件详细信息

**复制URL**
- 点击"复制"图标复制文件访问地址
- 在预览窗口也可以复制完整URL

**删除文件**
- 单个删除: 点击"垃圾桶"图标
- 批量删除: 勾选多个文件,点击"删除选中"按钮

## 📋 功能特性

### ✅ 已实现功能

- [x] 单文件上传
- [x] 批量文件上传 (最多20个)
- [x] 拖拽上传
- [x] 文件列表展示 (网格视图)
- [x] 文件搜索
- [x] 文件类型筛选
- [x] 文件夹筛选
- [x] 文件预览
- [x] URL复制
- [x] 单个文件删除
- [x] 批量文件删除 (最多50个)
- [x] 分页功能
- [x] 文件类型自动识别
- [x] 文件大小限制
- [x] 危险文件拦截
- [x] 文件名安全化
- [x] 权限控制 (仅管理员)

### 🔒 安全特性

- **文件类型验证**: MIME类型 + 扩展名双重验证
- **危险文件拦截**: 禁止上传可执行文件
- **文件大小限制**: 根据类型设置不同限制
- **文件名安全**: 自动生成唯一安全文件名
- **路径遍历防护**: 防止路径遍历攻击
- **权限验证**: API层面session验证

### 📊 支持的文件类型

| 类型 | 格式 | 最大大小 |
|-----|------|---------|
| 图片 | JPEG, PNG, GIF, WebP, SVG | 10MB |
| 视频 | MP4, WebM, OGG, MOV | 100MB |
| 音频 | MP3, OGG, WAV, WebM | 20MB |
| 文档 | PDF, DOC, DOCX, XLS, XLSX, TXT | 20MB |
| 压缩包 | ZIP, RAR, 7Z | 50MB |

## 🛠️ 技术实现

### 核心文件

```
lib/
  upload.ts              # 文件上传工具类
services/
  mediaService.ts        # 媒体文件服务
types/
  media.ts              # 类型定义
src/app/api/media/
  route.ts              # 文件列表API
  upload/route.ts       # 单文件上传API
  upload/batch/route.ts # 批量上传API
  delete/batch/route.ts # 批量删除API
  folders/route.ts      # 文件夹列表API
  [id]/route.ts         # 单文件操作API
src/app/[locale]/admin/media/
  page.tsx              # 资源库管理页面
```

### 数据库表

```sql
CREATE TABLE MediaFile (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,           -- 原始文件名
  fileName VARCHAR,       -- 存储文件名
  url VARCHAR,            -- 访问URL
  path VARCHAR,           -- 文件路径
  mimeType VARCHAR,       -- MIME类型
  size INT,               -- 文件大小
  width INT,              -- 图片宽度
  height INT,             -- 图片高度
  alt VARCHAR,            -- 替代文本
  caption VARCHAR,        -- 说明
  folder VARCHAR,         -- 文件夹
  fileType ENUM,          -- 文件类型
  uploadedBy VARCHAR,     -- 上传者
  isPublic BOOLEAN,       -- 是否公开
  createdAt DATETIME,     -- 创建时间
  updatedAt DATETIME      -- 更新时间
);
```

## 🎯 使用场景

### 场景1: 上传文章配图

1. 访问资源库页面
2. 上传图片文件
3. 点击"复制"按钮复制图片URL
4. 在文章编辑器中使用该URL

### 场景2: 批量上传产品图片

1. 准备好所有产品图片
2. 拖拽所有图片到上传区域
3. 等待批量上传完成
4. 使用筛选功能查看刚上传的图片

### 场景3: 管理文档文件

1. 上传PDF、Word等文档
2. 使用"文档"类型筛选查看所有文档
3. 为文档添加说明文字
4. 分享文档URL给用户

## ⚠️ 注意事项

1. **文件大小**: 不要上传超过限制的文件
2. **文件类型**: 确保文件类型在支持列表中
3. **批量操作**: 批量上传最多20个,批量删除最多50个
4. **删除确认**: 删除文件前请确认,删除后无法恢复
5. **URL复制**: 复制的URL是相对路径,需要加上域名访问

## 🐛 常见问题

**Q: 上传失败怎么办?**
A: 检查文件大小和类型是否符合要求,查看浏览器控制台错误信息

**Q: 文件上传后无法访问?**
A: 检查文件路径是否正确,确认public/uploads目录权限

**Q: 如何删除多个文件?**
A: 勾选要删除的文件,然后点击"删除选中"按钮

**Q: 支持上传视频吗?**
A: 支持,最大100MB,格式为MP4、WebM、OGG、MOV

**Q: 可以修改文件吗?**
A: 可以修改文件的元信息(名称、描述等),但不能替换文件本身

## 📝 下一步

1. 查看完整文档: [MEDIA_LIBRARY.md](./MEDIA_LIBRARY.md)
2. 了解API接口: 查看文档中的API部分
3. 扩展功能: 根据需求添加自定义功能
