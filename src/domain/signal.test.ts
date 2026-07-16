import { describe, expect, it } from 'vitest';
import { clampSignalConfig, generateSignal } from './signal';

describe('generateSignal', () => {
  it('生成指定长度的单一正弦波', () => {
    const samples = generateSignal({
      sampleRate: 8,
      duration: 1,
      components: [{ frequency: 1, amplitude: 1, phase: 0 }],
    });

    expect(samples).toHaveLength(8);
    expect(samples[2]).toBeCloseTo(1, 6);
    expect(samples[6]).toBeCloseTo(-1, 6);
  });

  it('限制不安全的参数范围', () => {
    const config = clampSignalConfig({
      sampleRate: 2,
      duration: 9,
      components: [{ frequency: 90, amplitude: 5, phase: -1 }],
    });

    expect(config.sampleRate).toBe(8);
    expect(config.duration).toBe(1);
    expect(config.components[0]).toEqual({ frequency: 4, amplitude: 1, phase: 0 });
  });
});
