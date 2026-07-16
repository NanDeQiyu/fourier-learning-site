import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import SignalPlot from './SignalPlot';
import SpectrumPlot from './SpectrumPlot';
import { buildSignalPath, buildSpectrumBars } from './plots';

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

describe('plot coordinate helpers', () => {
  it('将波形映射到画布范围', () => {
    expect(buildSignalPath([-1, 0, 1], 100, 60)).toEqual([
      { x: 0, y: 60 },
      { x: 50, y: 30 },
      { x: 100, y: 0 },
    ]);
  });

  it('将频谱幅值映射为归一化柱形', () => {
    const bars = buildSpectrumBars(
      [
        { frequency: 0, magnitude: 0.5 },
        { frequency: 1, magnitude: 1 },
      ],
      100,
      60,
    );

    expect(bars).toEqual([
      { x: 0, y: 30, width: 48, height: 30 },
      { x: 50, y: 0, width: 48, height: 60 },
    ]);
  });
});

describe('plot components', () => {
  it('为两个图表提供中文无障碍名称', () => {
    render(
      <>
        <SignalPlot samples={[0, 1, 0]} />
        <SpectrumPlot bins={[{ frequency: 1, magnitude: 1 }]} />
      </>,
    );

    expect(screen.getByRole('img', { name: '时域波形图' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '频域幅度谱' })).toBeInTheDocument();
  });
});
