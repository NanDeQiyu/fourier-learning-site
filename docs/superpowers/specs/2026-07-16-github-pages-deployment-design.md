# GitHub Pages 部署设计

## 目标

将现有 Vite 单页网站部署到 `https://nandeqiyu.github.io/fourier-learning-site/`，并在 `master` 分支更新时自动重新发布。

## 方案

- 将仓库从私有改为公开，以使用 GitHub Free 的 Pages 能力。
- 将 Vite 的 `base` 设置为 `/fourier-learning-site/`，保证项目子路径下的静态资源地址正确。
- 使用 GitHub Actions 在 Node.js 22 环境中安装锁定依赖、执行生产构建，并发布 `dist/`。
- 工作流只在 `master` 推送或手动触发时部署，并使用 GitHub Pages 官方权限模型。

## 验证

- 自动测试验证 Vite 基础路径和部署工作流中的关键约束。
- 本地执行全部测试和生产构建。
- 合并后等待 GitHub Actions 完成，并对线上地址执行 HTTP 和页面标题检查。

## 范围

本次只增加部署能力，不修改课程内容、视觉样式或交互逻辑。
