# Fullstack Template

基于 Bun workspaces 的全栈 Monorepo 模板，包含后端 API 服务和 React 前端。

> [English](README.md) | 中文

## 技术栈

| 层级     | 技术                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------- |
| 运行时   | [Bun](https://bun.sh/)                                                                                  |
| 后端     | [Elysia](https://elysiajs.com/) + [Prisma](https://www.prisma.io/) + SQLite                             |
| 前端     | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [React Router](https://reactrouter.com/) |
| 状态管理 | [Zustand](https://zustand-demo.pmnd.rs/)                                                                |
| 代码规范 | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) + lint-staged + commitlint             |
| 测试     | [Vitest](https://vitest.dev/)（单元测试）+ [Playwright](https://playwright.dev/)（E2E）                 |
| CI/CD    | [GitHub Actions](https://github.com/features/actions)                                                   |

## 项目结构

```
tpl-react-elysia/
├── apps/
│   ├── server/          # Elysia API 服务（端口 1118）
│   └── web/             # React 前端（端口 5173）
├── .github/workflows/   # GitHub Actions CI
├── .husky/              # Git hooks
├── eslint.config.js     # ESLint 配置（recommended + TypeScript）
├── .prettierrc          # Prettier 配置
└── package.json         # 根工作区配置
```

## 快速开始

### 前置要求

- [Bun](https://bun.sh/) >= 1.0

### 安装依赖

```bash
bun install
```

### 初始化数据库

```bash
cd apps/server
bun run prisma:generate
bun run prisma:push
```

### 启动开发环境

```bash
bun dev
```

同时启动后端服务（http://localhost:1118）和前端开发服务器（http://localhost:5173）。

---

## 后端服务 (`apps/server`)

基于 Bun 运行时，使用 [Elysia](https://elysiajs.com/) 构建的高性能 REST API 服务。

### 目录结构

```
apps/server/
├── prisma/              # Prisma schema 和迁移文件
│   ├── schema.prisma    # 数据库 schema
│   └── migrations/      # SQL 迁移文件
├── src/
│   ├── modules/         # 功能模块（auth 等）
│   │   └── auth/        # 认证模块（路由、服务、模型）
│   ├── plugins/         # Elysia 插件（jwt、log、openapi）
│   ├── utils/           # 工具函数
│   ├── common/          # 公共实例（prisma）
│   ├── app.ts           # Elysia 应用实例
│   └── index.ts         # 入口文件
└── .env                 # 环境变量
```

### 核心特性

- **Elysia** — 快速、类型安全的 Web 框架，支持端到端类型推导
- **Prisma** — 类型安全的 ORM，自动生成客户端
- **SQLite** via `@libsql/client` — 轻量级数据库
- **JWT 认证** — `@elysiajs/jwt` 实现基于 token 的认证
- **Swagger / Scalar UI** — 在 `/scalar` 自动生成 API 文档
- **热重载** — `bun --watch` 文件变更时自动重启

### API 端点

| 方法 | 路径            | 说明                     |
| ---- | --------------- | ------------------------ |
| POST | `/auth/sign-up` | 用户注册                 |
| POST | `/auth/sign-in` | 用户登录（返回 JWT）     |
| GET  | `/auth/users`   | 获取用户列表（需要认证） |

完整交互文档：http://localhost:1118/scalar（仅开发环境）

### 数据库脚本

在 `apps/server` 目录执行：

| 脚本                      | 说明                 |
| ------------------------- | -------------------- |
| `bun run prisma:generate` | 生成 Prisma 客户端   |
| `bun run prisma:push`     | 推送 schema 到数据库 |
| `bun run prisma:migrate`  | 创建并应用迁移       |
| `bun run prisma:seed`     | 填充种子数据         |

---

## 前端应用 (`apps/web`)

基于 [Vite](https://vitejs.dev/) 构建的 React 19 单页应用。

### 目录结构

```
apps/web/
├── e2e/                 # Playwright 端到端测试
├── public/              # 静态资源（原样提供）
└── src/
    ├── components/      # 可复用组件（AuthGuard）
    ├── layouts/         # 公共布局组件（RootLayout）
    ├── pages/           # 每个路由对应一个组件（Home、Login、Register、Users）
    ├── router/          # React Router 配置
    ├── services/        # API 服务函数
    ├── store/           # Zustand 状态管理（auth、counter）
    ├── test/            # 测试配置
    ├── App.tsx          # 根组件
    └── main.tsx         # 入口文件
```

### 核心特性

- **React 19** — 最新 React，支持并发特性
- **React Router** — 客户端路由，支持嵌套布局
- **Zustand** — 轻量级全局状态管理
- **Vite** — 即时 HMR 开发服务器与优化的生产构建
- **Vitest** — 使用 jsdom 环境的单元测试
- **Playwright** — 基于浏览器自动化的 E2E 测试

### 路由

| 路径        | 组件     | 需要认证 |
| ----------- | -------- | -------- |
| `/`         | Home     | 是       |
| `/login`    | Login    | 否       |
| `/register` | Register | 否       |
| `/users`    | Users    | 是       |
| `/about`    | About    | 是       |

### 开发服务器

```bash
bun dev   # 在根目录执行，或：
cd apps/web && bun dev
```

启动后访问 http://localhost:5173，已启用 HMR。

### 测试

```bash
cd apps/web
bun test            # 单元测试
bun test:e2e        # E2E 测试（无头模式）
bun test:e2e:ui     # E2E 测试（交互式 UI 模式）
```

---

## 根目录脚本

| 脚本             | 说明                     |
| ---------------- | ------------------------ |
| `bun dev`        | 启动所有工作区的开发模式 |
| `bun dev:web`    | 仅启动前端               |
| `bun dev:server` | 仅启动后端               |
| `bun build`      | 构建所有工作区           |
| `bun lint`       | 运行 ESLint 检查         |
| `bun lint:fix`   | 自动修复 lint 问题       |
| `bun format`     | 使用 Prettier 格式化代码 |
| `bun test`       | 运行所有测试             |

---

## Git 提交规范

本项目通过 [commitlint](https://commitlint.js.org/) 校验提交信息格式，并通过 [lint-staged](https://github.com/okonet/lint-staged) 在每次提交前对暂存文件执行 ESLint 和 Prettier 检查。

提交信息须遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

```
feat: 添加用户登录功能
fix: 修复 API 返回空值时的异常
chore: 更新依赖版本
```

---

## CI/CD

GitHub Actions 工作流在 push/PR 到 `main` 时运行：

1. **Lint** — ESLint 检查
2. **Test** — Vitest 单元测试

---

## 许可证

[MIT](LICENSE)
