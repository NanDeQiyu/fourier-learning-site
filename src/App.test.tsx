import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('显示中文学习入口', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '看见傅里叶变换' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始学习' })).toBeInTheDocument();
  });
});
