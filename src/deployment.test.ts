/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import viteConfig from '../vite.config';

describe('GitHub Pages deployment', () => {
  it('uses the repository path as the Vite base', () => {
    expect(viteConfig.base).toBe('/fourier-learning-site/');
  });

  it('builds master and publishes dist through GitHub Pages', () => {
    const workflows = import.meta.glob('../.github/workflows/deploy.yml', {
      eager: true,
      import: 'default',
      query: '?raw',
    }) as Record<string, string>;
    const workflow = Object.values(workflows)[0];

    expect(workflow).toBeDefined();
    expect(workflow).toContain("branches: ['master']");
    expect(workflow).toContain('pnpm build');
    expect(workflow).toContain("path: './dist'");
    expect(workflow).toContain('actions/deploy-pages');
  });
});
