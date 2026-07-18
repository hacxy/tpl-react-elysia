# Fullstack Template

A monorepo fullstack template based on Bun workspaces, including a backend API server and a React frontend.

> English | [中文](README.zh-CN.md)

## Tech Stack

| Layer            | Technology                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| Runtime          | [Bun](https://bun.sh/)                                                                                  |
| Backend          | [Elysia](https://elysiajs.com/) + [Prisma](https://www.prisma.io/) + SQLite                             |
| Frontend         | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [React Router](https://reactrouter.com/) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/)                                                                |
| Linting          | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) + lint-staged + commitlint             |
| Testing          | [Vitest](https://vitest.dev/) (unit) + [Playwright](https://playwright.dev/) (E2E)                      |
| CI/CD            | [GitHub Actions](https://github.com/features/actions)                                                   |

## Project Structure

```
tpl-react-elysia/
├── apps/
│   ├── server/          # Elysia API server (port 1118)
│   └── web/             # React frontend (port 5173)
├── .github/workflows/   # GitHub Actions CI
├── .husky/              # Git hooks
├── eslint.config.js     # ESLint config (recommended + TypeScript)
├── .prettierrc          # Prettier config
└── package.json         # Root workspace config
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0

### Install

```bash
bun install
```

### Initialize the database

```bash
cd apps/server
bun run prisma:generate
bun run prisma:push
```

### Development

```bash
bun dev
```

This starts both the backend server (http://localhost:1118) and the frontend dev server (http://localhost:5173) simultaneously.

---

## Server (`apps/server`)

A high-performance REST API server built with [Elysia](https://elysiajs.com/) on the Bun runtime.

### Directory Structure

```
apps/server/
├── prisma/              # Prisma schema and migrations
│   ├── schema.prisma    # Database schema
│   └── migrations/      # SQL migration files
├── src/
│   ├── modules/         # Feature modules (auth, etc.)
│   │   └── auth/        # Auth module (routes, service, model)
│   ├── plugins/         # Elysia plugins (jwt, log, openapi)
│   ├── utils/           # Utility functions
│   ├── common/          # Common instances (prisma)
│   ├── app.ts           # Elysia app instance
│   └── index.ts         # Entry point
└── .env                 # Environment variables
```

### Key Features

- **Elysia** — fast, type-safe web framework with end-to-end type inference
- **Prisma** — type-safe ORM with auto-generated client
- **SQLite** via `@libsql/client` — lightweight database
- **JWT Authentication** — `@elysiajs/jwt` for token-based auth
- **Swagger / Scalar UI** — auto-generated API docs at `/scalar`
- **Hot reload** — `bun --watch` restarts on file changes

### API Endpoints

| Method | Path            | Description                |
| ------ | --------------- | -------------------------- |
| POST   | `/auth/sign-up` | User registration          |
| POST   | `/auth/sign-in` | User login (returns JWT)   |
| GET    | `/auth/users`   | List users (requires auth) |

Full interactive documentation: http://localhost:1118/scalar (dev only)

### Database Scripts

Run from `apps/server`:

| Script                    | Description                |
| ------------------------- | -------------------------- |
| `bun run prisma:generate` | Generate Prisma client     |
| `bun run prisma:push`     | Push schema to database    |
| `bun run prisma:migrate`  | Create and apply migration |
| `bun run prisma:seed`     | Seed the database          |

---

## Web (`apps/web`)

A React 19 single-page application built with [Vite](https://vitejs.dev/).

### Directory Structure

```
apps/web/
├── e2e/                 # Playwright end-to-end tests
├── public/              # Static assets served as-is
└── src/
    ├── components/      # Reusable components (AuthGuard)
    ├── layouts/         # Shared layout components (RootLayout)
    ├── pages/           # One component per route (Home, Login, Register, Users)
    ├── router/          # React Router configuration
    ├── services/        # API service functions
    ├── store/           # Zustand stores (auth, counter)
    ├── test/            # Test setup
    ├── App.tsx          # Root component
    └── main.tsx         # Entry point
```

### Key Features

- **React 19** — latest React with concurrent features
- **React Router** — client-side routing with nested layouts
- **Zustand** — lightweight global state management
- **Vite** — instant HMR dev server and optimized production build
- **Vitest** — unit testing with jsdom environment
- **Playwright** — E2E tests with browser automation

### Routes

| Path        | Component | Auth Required |
| ----------- | --------- | ------------- |
| `/`         | Home      | Yes           |
| `/login`    | Login     | No            |
| `/register` | Register  | No            |
| `/users`    | Users     | Yes           |
| `/about`    | About     | Yes           |

### Dev Server

```bash
bun dev   # from repo root, or:
cd apps/web && bun dev
```

Runs at http://localhost:5173 with HMR enabled.

### Tests

```bash
cd apps/web
bun test            # unit tests
bun test:e2e        # E2E tests (headless)
bun test:e2e:ui     # E2E tests (interactive UI mode)
```

---

## Scripts (root)

| Script           | Description                      |
| ---------------- | -------------------------------- |
| `bun dev`        | Start all workspaces in dev mode |
| `bun dev:web`    | Start only frontend              |
| `bun dev:server` | Start only backend               |
| `bun build`      | Build all workspaces             |
| `bun lint`       | Run ESLint across project        |
| `bun lint:fix`   | Auto-fix lint issues             |
| `bun format`     | Format code with Prettier        |
| `bun test`       | Run all tests                    |

---

## Git Conventions

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) format, enforced by [commitlint](https://commitlint.js.org/). [lint-staged](https://github.com/okonet/lint-staged) runs ESLint and Prettier on staged files before each commit.

```
feat: add user login
fix: handle null response from API
chore: update dependencies
```

---

## CI/CD

GitHub Actions workflow runs on push/PR to `main`:

1. **Lint** — ESLint check
2. **Test** — Vitest unit tests

---

## License

[MIT](LICENSE)
