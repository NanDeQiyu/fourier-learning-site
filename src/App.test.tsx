import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

beforeEach(() => localStorage.clear());

describe('App', () => {
  it('显示中文学习入口', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '看见傅里叶变换' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始学习' })).toBeInTheDocument();
  });

  it('从首页进入第一章并显示完整课程导航', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '开始学习' }));

    expect(screen.getByRole('heading', { name: '从声音与波形认识信号' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '课程章节' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /第\s*6\s*章/ })).toHaveLength(1);
  });

  it('从本地进度继续学习', async () => {
    localStorage.setItem(
      'fourier-progress-v1',
      JSON.stringify({ version: 1, currentChapter: 'transform', completed: ['signal'] }),
    );
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '继续上次进度' }));

    expect(screen.getByRole('heading', { name: '傅里叶变换与频谱' })).toBeInTheDocument();
    expect(screen.getAllByText('已完成 1 / 6 章').length).toBeGreaterThanOrEqual(2);
  });
});
