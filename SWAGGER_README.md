# Swagger API 文档

本项目已集成 Swagger/OpenAPI 文档系统,可以方便地查看和测试所有 API 接口。

## 访问文档

启动开发服务器后,访问以下地址查看 API 文档:

- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api/docs

## 已完成的配置

### 1. 安装的依赖

在 `package.json` 中已添加:
```json
{
  "dependencies": {
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-react": "^5.11.0"
  },
  "devDependencies": {
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-react": "^4.18.3"
  }
}
```

运行以下命令安装依赖:
```bash
npm install
```

### 2. 文件结构

```
src/
├── lib/
│   └── swagger.ts              # Swagger 配置文件
├── app/
│   ├── api/
│   │   ├── docs/
│   │   │   └── route.ts        # OpenAPI JSON 接口
│   │   ├── products/
│   │   │   └── route.ts        # 产品 API (已添加文档注释)
│   │   └── categories/
│   │       └── route.ts        # 分类 API (已添加文档注释)
│   └── api-docs/
│       └── page.tsx            # Swagger UI 页面
```

### 3. Swagger 配置

配置文件位于 `src/lib/swagger.ts`,包含:

- **基本信息**: API 标题、版本、描述
- **服务器配置**: 开发和生产环境 URL
- **安全方案**: Bearer Token 认证
- **通用 Schema**: 错误响应、分页响应等
- **标签分类**: Products, Categories, Posts, Media, Auth, Admin

### 4. API 文档注释示例

已为以下 API 添加了完整的文档注释:

- `GET /api/products` - 获取产品列表
- `POST /api/products` - 创建新产品
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建新分类

## 为其他 API 添加文档

为任何 API 路由添加文档注释的示例:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: 接口简介
 *     description: 详细描述
 *     tags:
 *       - YourTag
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: 参数说明
 *     responses:
 *       200:
 *         description: 成功响应
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  // 你的代码
}
```

### POST 请求示例

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: 创建资源
 *     tags:
 *       - YourTag
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *             properties:
 *               field1:
 *                 type: string
 *               field2:
 *                 type: number
 *     responses:
 *       200:
 *         description: 创建成功
 */
export async function POST(request: NextRequest) {
  // 你的代码
}
```

## 使用 Swagger UI

1. 启动开发服务器:
   ```bash
   npm run dev
   ```

2. 打开浏览器访问: http://localhost:3000/api-docs

3. 在 Swagger UI 中你可以:
   - 查看所有 API 接口
   - 查看请求/响应格式
   - 直接测试 API（点击 "Try it out"）
   - 查看响应示例
   - 下载 OpenAPI 规范

## 添加认证

对于需要认证的接口:

1. 在 Swagger UI 右上角点击 "Authorize"
2. 输入 Bearer Token
3. 点击 "Authorize" 确认
4. 现在可以测试需要认证的接口

## 自定义配置

如需修改 Swagger 配置,编辑 `src/lib/swagger.ts`:

- 添加新的标签
- 修改服务器 URL
- 添加新的通用 Schema
- 配置其他认证方式

## 下一步

建议为以下 API 添加文档注释:

- `/api/posts` - 文章管理
- `/api/media` - 媒体文件管理
- `/api/auth` - 认证接口
- `/api/admin` - 管理员接口
- 所有的 `[id]` 动态路由（GET, PUT, DELETE）

## 参考资源

- [OpenAPI 3.0 规范](https://swagger.io/specification/)
- [swagger-jsdoc 文档](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-react 文档](https://github.com/swagger-api/swagger-ui)
