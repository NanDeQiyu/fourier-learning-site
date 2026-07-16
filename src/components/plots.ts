import type { SpectrumBin } from '../domain/fourier';

export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };

export function buildSignalPath(samples: number[], width: number, height: number): Point[] {
  if (samples.length === 0 || width <= 0 || height <= 0) {
    return [];
  }

  return samples.map((value, index) => ({
    x: samples.length === 1 ? 0 : (index / (samples.length - 1)) * width,
    y: ((1 - Math.max(-1, Math.min(1, value))) * height) / 2,
  }));
}

export function buildSpectrumBars(
  bins: SpectrumBin[],
  width: number,
  height: number,
): Rect[] {
  const visibleBins = bins.slice(0, 48);
  if (visibleBins.length === 0 || width <= 0 || height <= 0) {
    return [];
  }

  const maximum = visibleBins.reduce((value, bin) => Math.max(value, bin.magnitude), 0) || 1;
  const slotWidth = width / visibleBins.length;
  const barWidth = Math.max(1, slotWidth - 2);

  return visibleBins.map((bin, index) => {
    const barHeight = (bin.magnitude / maximum) * height;
    return {
      x: index * slotWidth,
      y: height - barHeight,
      width: barWidth,
      height: barHeight,
    };
  });
}
