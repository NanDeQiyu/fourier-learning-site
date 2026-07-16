export type SpectrumBin = {
  frequency: number;
  magnitude: number;
};

export function computeSpectrum(samples: number[], sampleRate: number): SpectrumBin[] {
  const size = samples.length;
  if (size === 0 || sampleRate <= 0) {
    return [];
  }

  return Array.from({ length: Math.floor(size / 2) + 1 }, (_, frequencyIndex) => {
    let real = 0;
    let imaginary = 0;

    for (let sampleIndex = 0; sampleIndex < size; sampleIndex += 1) {
      const angle = (2 * Math.PI * frequencyIndex * sampleIndex) / size;
      real += samples[sampleIndex] * Math.cos(angle);
      imaginary -= samples[sampleIndex] * Math.sin(angle);
    }

    return {
      frequency: (frequencyIndex * sampleRate) / size,
      magnitude: (2 * Math.hypot(real, imaginary)) / size,
    };
  });
}
