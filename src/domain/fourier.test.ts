import { describe, expect, it } from 'vitest';
import { computeSpectrum } from './fourier';
import { generateSignal } from './signal';

describe('computeSpectrum', () => {
  it('在单一正弦波频率处产生最大峰值', () => {
    const samples = generateSignal({
      sampleRate: 64,
      duration: 1,
      components: [{ frequency: 8, amplitude: 1, phase: 0 }],
    });
    const spectrum = computeSpectrum(samples, 64);
    const peak = spectrum.reduce((best, bin) => (bin.magnitude > best.magnitude ? bin : best));

    expect(peak.frequency).toBe(8);
    expect(peak.magnitude).toBeCloseTo(1, 5);
  });

  it('为空信号返回空频谱', () => {
    expect(computeSpectrum([], 64)).toEqual([]);
  });
});
