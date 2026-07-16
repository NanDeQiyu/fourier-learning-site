# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the Vite application through GitHub Pages on every push to `master`.

**Architecture:** Vite emits the static site to `dist/` with a repository-scoped base path. A GitHub Actions workflow builds that output and deploys it with the official Pages actions.

**Tech Stack:** Vite 8, React 19, pnpm, GitHub Actions, GitHub Pages

## Global Constraints

- The public URL is `https://nandeqiyu.github.io/fourier-learning-site/`.
- Deployment must not change lesson content or UI behavior.
- The workflow deploys only from `master` or a manual dispatch.

---

### Task 1: Deployment contract

**Files:**
- Create: `src/deployment.test.ts`
- Modify: `vite.config.ts`
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: the existing `pnpm build` command and Vite `dist/` output.
- Produces: a repository-relative asset base and an automatic Pages deployment.

- [ ] **Step 1: Write the failing deployment test**

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import viteConfig from '../vite.config';

describe('GitHub Pages deployment', () => {
  it('uses the repository path as the Vite base', () => {
    expect(viteConfig.base).toBe('/fourier-learning-site/');
  });

  it('builds master and publishes dist through GitHub Pages', () => {
    const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
    expect(workflow).toContain("branches: ['master']");
    expect(workflow).toContain('pnpm build');
    expect(workflow).toContain("path: './dist'");
    expect(workflow).toContain('actions/deploy-pages');
  });
});
```

- [ ] **Step 2: Run the deployment test and verify it fails**

Run: `pnpm test src/deployment.test.ts`

Expected: FAIL because the base is still `./` and the workflow does not exist.

- [ ] **Step 3: Add the minimal deployment configuration**

Set `base` to `/fourier-learning-site/` and add a workflow that checks out `master`, enables pnpm through Corepack on Node.js 22, installs with the lockfile, runs `pnpm build`, uploads `dist/`, and deploys with the official Pages actions.

- [ ] **Step 4: Run the deployment test and full verification**

Run: `pnpm test && pnpm build`

Expected: 22 tests pass and the Vite production build completes successfully.

- [ ] **Step 5: Commit**

```bash
git add src/deployment.test.ts vite.config.ts .github/workflows/deploy.yml docs/superpowers
git commit -m "deploy: add GitHub Pages workflow"
```

### Task 2: Publish and verify

**Files:**
- No additional local files.

**Interfaces:**
- Consumes: the verified deployment commit.
- Produces: the public GitHub Pages URL.

- [ ] **Step 1: Make the repository public and enable Pages with GitHub Actions**

Run the GitHub repository visibility and Pages API commands for `NanDeQiyu/fourier-learning-site`.

- [ ] **Step 2: Push the deployment branch and merge it into `master`**

Push `agent/deploy-github-pages`, open a pull request into `master`, and merge after checks pass.

- [ ] **Step 3: Verify the deployment**

Wait for the Pages workflow to succeed, then confirm the public URL returns HTTP 200 and the document title is `看见傅里叶变换`.
