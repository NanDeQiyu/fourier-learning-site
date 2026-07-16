import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Quiz from './Quiz';

const quiz = {
  question: '频谱峰值表示什么？',
  options: ['频率成分', '时间长度', '采样丢失'],
  answer: 0,
  explanation: '峰值对应信号中的主要频率。',
};

describe('Quiz', () => {
  it('答对后解释原因并完成章节', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Quiz quiz={quiz} onComplete={onComplete} />);

    await user.click(screen.getByLabelText('频率成分'));
    await user.click(screen.getByRole('button', { name: '检查答案' }));

    expect(screen.getByText('回答正确')).toBeInTheDocument();
    expect(screen.getByText('峰值对应信号中的主要频率。')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('答错后允许继续尝试', async () => {
    const user = userEvent.setup();
    render(<Quiz quiz={quiz} onComplete={() => undefined} />);

    await user.click(screen.getByLabelText('时间长度'));
    await user.click(screen.getByRole('button', { name: '检查答案' }));

    expect(screen.getByText('再想一想')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '检查答案' })).toBeEnabled();
  });
});
