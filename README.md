# badfive

5 人羽毛球双打 15 局计分器（Vue 3 + Vite SPA）。所有比赛数据保存在浏览器 `localStorage`，每场比赛拥有独立 ID，可在历史列表中切换查看。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建输出在 `dist/`。

## 部署到 Cloudflare Pages

两种方式，选其一：

### 1. 直接连接 Git 仓库（推荐）

在 Cloudflare Dashboard → Pages → Create project → Connect to Git，选择本仓库，配置：

- Build command: `npm run build`
- Build output directory: `dist`

后续 push 会自动部署。

### 2. 命令行部署（wrangler）

```bash
npm run build
npx wrangler login          # 首次
npx wrangler pages deploy dist --project-name badfive
```

或使用 `npm run deploy`。
