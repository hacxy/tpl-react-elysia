# react-template

基于 React 19 + TypeScript + Vite 的前端项目模板，开箱即用。

## 技术栈

| 分类     | 技术                                                     |
| -------- | -------------------------------------------------------- |
| 框架     | React 19                                                 |
| 语言     | TypeScript 6                                             |
| 构建工具 | Vite 8                                                   |
| 路由     | React Router 8                                           |
| 状态管理 | Zustand 5                                                |
| 代码规范 | ESLint（@eslint/js + typescript-eslint + @eslint-react） |
| 格式化   | Prettier                                                 |
| 单元测试 | Vitest + @testing-library/react                          |
| E2E 测试 | Playwright                                               |
| 覆盖率   | vite-plugin-istanbul + nyc / Vitest v8                   |
| Git 规范 | husky + lint-staged + commitlint                         |

## 项目结构

```
src/
├── assets/        # 静态资源
├── layouts/       # 布局组件
├── pages/         # 页面组件（Home、About、NotFound）
├── router/        # 路由配置
├── store/         # Zustand 状态
├── test/          # 测试配置
├── App.tsx
└── main.tsx
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产产物
npm run build

# 预览构建结果
npm run preview
```

## 代码规范

```bash
# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix

# Prettier 格式化
npm run format

# 检查格式
npm run format:check
```

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范，由 commitlint 在 `commit-msg` 阶段自动校验。

## 测试

```bash
# 运行单元测试
npm test

# 单元测试 watch 模式
npm run test:watch

# 单元测试覆盖率
npm run test:coverage

# 运行 E2E 测试
npm run test:e2e

# 打开 Playwright UI 模式
npm run test:e2e:ui

# 生成 E2E 覆盖率报告
npm run coverage:report
```
