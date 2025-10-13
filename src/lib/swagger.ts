import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TX Website API Documentation",
      version: "1.0.0",
      description: "API documentation for TX Website",
      contact: {
        name: "API Support",
        email: "support@tx-website.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.tx-website.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "错误信息",
            },
          },
        },
        PaginationResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {},
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "number",
                  example: 1,
                },
                limit: {
                  type: "number",
                  example: 10,
                },
                total: {
                  type: "number",
                  example: 100,
                },
                totalPages: {
                  type: "number",
                  example: 10,
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Products",
        description: "产品管理相关接口",
      },
      {
        name: "Categories",
        description: "分类管理相关接口",
      },
      {
        name: "Posts",
        description: "文章管理相关接口",
      },
      {
        name: "Media",
        description: "媒体文件管理相关接口",
      },
      {
        name: "Auth",
        description: "认证相关接口",
      },
      {
        name: "Admin",
        description: "管理员相关接口",
      },
    ],
  },
  apis: [
    "./src/app/api/**/route.ts",
    "./src/app/api/**/route.tsx",
    "./src/types/**/*.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
