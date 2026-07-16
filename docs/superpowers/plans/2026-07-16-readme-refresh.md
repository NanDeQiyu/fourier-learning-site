# README Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将仓库根目录 README 更新为包含在线体验、六章课程概览、本地运行、验证和自动部署说明的实用型项目首页。

**Architecture:** 仅修改 `README.md`，信息来源固定为线上 GitHub Pages 地址、`src/content/chapters.ts`、`package.json` 和 `.github/workflows/deploy.yml`。不调整应用代码、依赖或部署配置。

**Tech Stack:** Markdown、React/Vite 项目现有 pnpm 脚本、GitHub Pages

## Global Constraints

- 在线地址必须是 `https://nandeqiyu.github.io/fourier-learning-site/`。
- 六章名称必须与 `src/content/chapters.ts` 完全一致。
- 本地命令必须与 `package.json` 中的 `dev`、`test` 和 `build` 脚本一致。
- 部署说明必须与 `.github/workflows/deploy.yml` 的 `master` 分支触发规则一致。
- 仅修改 `README.md`，不改课程代码和配置。

---

### Task 1: 更新项目 README

**Files:**
- Modify: `README.md`
- Reference: `src/content/chapters.ts`
- Reference: `package.json`
- Reference: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: 当前线上地址、六章课程标题、pnpm 脚本和 GitHub Pages 工作流触发条件。
- Produces: 面向仓库访客的完整项目说明，不产生代码接口。

- [x] **Step 1: 重写 README 内容结构**

将 `README.md` 整理为以下顺序，并保留已有准确说明：

```markdown
# 看见傅里叶变换

一个面向大学生的全中文傅里叶变换互动学习网站。课程通过讲解、公式、实时波形、频谱、声音与即时练习，帮助学习者从直观现象逐步理解傅里叶变换。

> [在线体验：打开「看见傅里叶变换」](https://nandeqiyu.github.io/fourier-learning-site/)

## 课程内容

1. 从声音与波形认识信号
2. 频率、振幅和相位
3. 把复杂波形拆成正弦波
4. 傅里叶变换与频谱
5. 采样、混叠与离散傅里叶变换
6. 工程应用
```

在课程列表之后依次保留或整理 `主要功能`、`本地运行`、`测试与构建`、`部署`、`音频说明`。部署段明确说明：推送到 `master` 分支后，GitHub Actions 会安装依赖、构建项目并发布到 GitHub Pages。

- [x] **Step 2: 检查 Markdown 和来源一致性**

运行：

```powershell
rg -n "在线体验|从声音与波形认识信号|频率、振幅和相位|把复杂波形拆成正弦波|傅里叶变换与频谱|采样、混叠与离散傅里叶变换|工程应用|master|pnpm install|pnpm dev|pnpm test|pnpm build" README.md
```

预期：所有在线入口、六章标题、分支名和四条命令均能在 `README.md` 中找到。

运行：

```powershell
git diff --check
```

预期：命令无输出且退出码为 0，表示没有空白符错误。

- [x] **Step 3: 验证在线链接**

运行：

```powershell
curl.exe -L -I https://nandeqiyu.github.io/fourier-learning-site/
```

预期：响应包含 `HTTP/1.1 200 OK`。

- [x] **Step 4: 提交 README 更新**

```powershell
git add README.md docs/superpowers/plans/2026-07-16-readme-refresh.md
git commit -m "docs: refresh README with live site"
```

预期：提交包含更新后的 `README.md` 和本实施计划。
