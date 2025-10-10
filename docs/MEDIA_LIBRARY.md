# 资源库功能文档

## 功能概述

完善的后台资源库管理系统,支持文件的增删改查、批量上传、路径复制、文件预览等功能,并内置完善的安全验证机制。

## 主要功能

### 1. 文件上传
- **单文件上传**: 支持单个文件上传
- **批量上传**: 一次最多上传 20 个文件
- **拖拽上传**: 支持拖拽文件到指定区域上传
- **文件类型限制**:
  - 图片: JPEG, PNG, GIF, WebP, SVG (最大 10MB)
  - 视频: MP4, WebM, OGG, MOV (最大 100MB)
  - 音频: MP3, OGG, WAV, WebM (最大 20MB)
  - 文档: PDF, DOC, DOCX, XLS, XLSX, TXT (最大 20MB)
  - 压缩包: ZIP, RAR, 7Z (最大 50MB)

### 2. 文件管理
- **列表展示**: 网格视图展示所有文件,支持分页
- **搜索功能**: 支持按文件名、描述等关键词搜索
- **筛选功能**:
  - 按文件类型筛选 (图片/视频/音频/文档/压缩包/其他)
  - 按文件夹筛选
- **批量选择**: 支持全选和多选
- **批量删除**: 一次最多删除 50 个文件

### 3. 文件操作
- **预览**: 点击预览按钮查看文件详情
- **复制URL**: 一键复制文件访问URL
- **删除**: 删除文件(同时删除物理文件和数据库记录)
- **编辑**: 更新文件元信息

### 4. 安全特性

#### 文件上传安全
- **文件类型验证**:
  - 验证文件 MIME 类型
  - 验证文件扩展名
  - 双重验证确保文件类型正确

- **危险文件拦截**:
  - 禁止上传可执行文件 (.exe, .bat, .cmd, .com, .sh, .php, .asp, .jsp 等)
  - 防止上传包含路径遍历字符的文件

- **文件大小限制**:
  - 根据文件类型设置不同的大小限制
  - 防止服务器存储空间被恶意占用

- **文件名安全化**:
  - 自动生成唯一文件名(时间戳 + 随机字符串)
  - 防止文件名冲突
  - 移除文件名中的非法字符

#### 权限控制
- 仅管理员(ADMIN)可以上传、删除文件
- API 层面进行 session 验证

## 数据模型

### MediaFile 表结构

```prisma
model MediaFile {
  id        String         @id @default(cuid())
  name      String         // 原始文件名
  fileName  String         // 存储文件名
  url       String         // 访问URL
  path      String         // 文件存储路径
  mimeType  String         // MIME类型
  size      Int            // 文件大小(字节)
  width     Int?           // 图片宽度
  height    Int?           // 图片高度
  alt       String?        // 替代文本
  caption   String?        // 说明文字
  folder    String?        // 文件夹分类
  fileType  MediaFileType  // 文件类型枚举
  uploadedBy String?       // 上传者ID
  isPublic  Boolean        // 是否公开
  createdAt DateTime       // 创建时间
  updatedAt DateTime       // 更新时间
}

enum MediaFileType {
  IMAGE      // 图片
  VIDEO      // 视频
  AUDIO      // 音频
  DOCUMENT   // 文档
  ARCHIVE    // 压缩包
  OTHER      // 其他
}
```

## API 接口

### 1. 获取文件列表
```
GET /api/media
Query Parameters:
  - page: 页码 (默认 1)
  - limit: 每页数量 (默认 20)
  - search: 搜索关键词
  - mimeType: MIME类型筛选
  - folder: 文件夹筛选
  - fileType: 文件类型筛选
```

### 2. 单文件上传
```
POST /api/media/upload
Content-Type: multipart/form-data
Body:
  - file: File (必需)
  - folder: String (可选)
  - alt: String (可选)
  - caption: String (可选)
```

### 3. 批量上传
```
POST /api/media/upload/batch
Content-Type: multipart/form-data
Body:
  - files: File[] (必需,最多20个)
  - folder: String (可选)
```

### 4. 获取文件详情
```
GET /api/media/:id
```

### 5. 更新文件信息
```
PUT /api/media/:id
Body: {
  name?: string
  alt?: string
  caption?: string
  ...
}
```

### 6. 删除单个文件
```
DELETE /api/media/:id
```

### 7. 批量删除
```
POST /api/media/delete/batch
Body: {
  ids: string[] (最多50个)
}
```

### 8. 获取文件夹列表
```
GET /api/media/folders
```

## 文件存储结构

```
public/
  uploads/
    general/      # 默认文件夹
      {timestamp}-{random}-{filename}.ext
    images/       # 图片文件夹
    documents/    # 文档文件夹
    ...
```

## 使用说明

### 页面访问
访问后台管理页面: `/admin/media`

### 上传文件
1. 点击"上传文件"按钮选择文件
2. 或直接拖拽文件到上传区域
3. 支持同时选择多个文件进行批量上传

### 搜索和筛选
1. 在搜索框输入关键词搜索文件
2. 使用类型下拉框按文件类型筛选
3. 使用文件夹下拉框按文件夹筛选

### 文件操作
1. **预览**: 点击眼睛图标预览文件详情
2. **复制URL**: 点击复制图标复制文件URL
3. **删除**: 点击垃圾桶图标删除文件
4. **批量删除**: 勾选多个文件后点击"删除选中"按钮

## 安全最佳实践

1. **定期备份**: 定期备份上传的文件和数据库
2. **监控存储**: 监控磁盘使用情况,防止恶意占用
3. **访问控制**: 确保只有管理员可以上传和删除文件
4. **文件扫描**: 建议集成病毒扫描工具扫描上传文件
5. **CDN加速**: 对于大量静态文件,建议使用CDN加速访问

## 技术栈

- **前端**: React 19, Next.js 15, TypeScript, Tailwind CSS, Lucide Icons
- **后端**: Next.js API Routes, Prisma ORM
- **数据库**: MySQL
- **文件存储**: 本地文件系统 (可扩展至云存储如 S3, OSS 等)

## 扩展建议

1. **云存储集成**: 支持上传到阿里云OSS、AWS S3等云存储服务
2. **图片处理**: 集成图片压缩、缩略图生成、水印添加等功能
3. **视频处理**: 支持视频转码、截图等功能
4. **统计分析**: 添加文件下载统计、热门文件分析等功能
5. **CDN集成**: 自动同步文件到CDN加速节点
6. **文件版本控制**: 保留文件历史版本,支持版本回退

## 故障排查

### 上传失败
1. 检查文件大小是否超过限制
2. 检查文件类型是否支持
3. 检查磁盘空间是否充足
4. 查看浏览器控制台和服务器日志

### 文件无法访问
1. 检查文件是否存在于存储路径
2. 检查文件权限设置
3. 检查API路由配置

### 删除失败
1. 检查文件是否被其他记录引用
2. 检查文件权限
3. 查看服务器错误日志

## 维护建议

1. 定期清理未使用的文件
2. 监控存储空间使用情况
3. 定期备份重要文件
4. 审查上传日志,发现异常行为
5. 更新安全规则,应对新的安全威胁
