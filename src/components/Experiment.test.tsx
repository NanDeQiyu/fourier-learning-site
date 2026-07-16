import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import Experiment from './Experiment';

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

const initialConfig = {
  sampleRate: 64,
  duration: 1,
  components: [{ frequency: 4, amplitude: 1, phase: 0 }],
};

describe('Experiment', () => {
  it('调整频率后更新显示值', () => {
    render(<Experiment initialConfig={initialConfig} />);

    fireEvent.change(screen.getByRole('slider', { name: '频率' }), {
      target: { value: '8' },
    });

    expect(screen.getByText('8 Hz')).toBeInTheDocument();
  });

  it('恢复默认参数', async () => {
    const user = userEvent.setup();
    render(<Experiment initialConfig={initialConfig} />);
    fireEvent.change(screen.getByRole('slider', { name: '振幅' }), {
      target: { value: '0.3' },
    });

    await user.click(screen.getByRole('button', { name: '恢复默认' }));

    expect(screen.getByText('1.00')).toBeInTheDocument();
  });

  it('声音不可用时仍保留图形实验', async () => {
    const user = userEvent.setup();
    render(<Experiment initialConfig={initialConfig} />);

    await user.click(screen.getByRole('button', { name: '播放声音' }));

    expect(screen.getByText('声音暂时无法播放，波形实验仍可继续。')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '时域波形图' })).toBeInTheDocument();
  });
});
