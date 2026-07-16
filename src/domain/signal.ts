export type SignalComponent = {
  frequency: number;
  amplitude: number;
  phase: number;
};

export type SignalConfig = {
  sampleRate: number;
  duration: number;
  components: SignalComponent[];
};

export function clampSignalConfig(config: SignalConfig): SignalConfig {
  const sampleRate = Math.min(512, Math.max(8, config.sampleRate));
  const duration = Math.min(1, Math.max(0.125, config.duration));

  return {
    sampleRate,
    duration,
    components: config.components.slice(0, 12).map((component) => ({
      frequency: Math.min(sampleRate / 2, Math.max(0, component.frequency)),
      amplitude: Math.min(1, Math.max(0, component.amplitude)),
      phase: Math.min(Math.PI * 2, Math.max(0, component.phase)),
    })),
  };
}

export function generateSignal(input: SignalConfig): number[] {
  const config = clampSignalConfig(input);
  const sampleCount = Math.round(config.sampleRate * config.duration);

  return Array.from({ length: sampleCount }, (_, index) => {
    const time = index / config.sampleRate;
    return config.components.reduce(
      (sum, component) =>
        sum +
        component.amplitude *
          Math.sin(2 * Math.PI * component.frequency * time + component.phase),
      0,
    );
  });
}
