import { useMemo, useState } from 'react';
import { computeSpectrum } from '../domain/fourier';
import { generateSignal, type SignalConfig } from '../domain/signal';
import { useAudioSignal } from '../hooks/useAudioSignal';
import SignalPlot from './SignalPlot';
import SpectrumPlot from './SpectrumPlot';

type ExperimentProps = {
  initialConfig: SignalConfig;
};

function updatePrimaryComponent(
  config: SignalConfig,
  property: 'frequency' | 'amplitude' | 'phase',
  value: number,
): SignalConfig {
  const [primary = { frequency: 1, amplitude: 1, phase: 0 }, ...rest] = config.components;
  return { ...config, components: [{ ...primary, [property]: value }, ...rest] };
}

export default function Experiment({ initialConfig }: ExperimentProps) {
  const [config, setConfig] = useState<SignalConfig>(() => structuredClone(initialConfig));
  const samples = useMemo(() => generateSignal(config), [config]);
  const spectrum = useMemo(
    () => computeSpectrum(samples, config.sampleRate),
    [samples, config.sampleRate],
  );
  const primary = config.components[0] ?? { frequency: 1, amplitude: 1, phase: 0 };
  const { play, stop, error, isPlaying } = useAudioSignal(config.components);

  return (
    <section className="experiment" aria-labelledby="experiment-title">
      <div className="experiment-heading">
        <div>
          <p className="eyebrow">互动实验</p>
          <h2 id="experiment-title">调整参数，观察两种视角</h2>
        </div>
        <div className="experiment-actions">
          <button type="button" className="button-secondary" onClick={() => void (isPlaying ? stop() : play())}>
            {isPlaying ? '暂停声音' : '播放声音'}
          </button>
          <button
            type="button"
            className="button-quiet"
            onClick={() => {
              stop();
              setConfig(structuredClone(initialConfig));
            }}
          >
            恢复默认
          </button>
        </div>
      </div>

      <p className="audio-note">播放时会按比例移入可听频段，频率之间的高低关系保持不变。</p>
      {error ? <p className="notice" role="status">{error}</p> : null}

      <div className="controls" aria-label="信号参数">
        <label>
          <span><strong>频率</strong><output>{primary.frequency} Hz</output></span>
          <input
            aria-label="频率"
            type="range"
            min="1"
            max={Math.max(4, config.sampleRate / 2)}
            step="1"
            value={primary.frequency}
            onChange={(event) =>
              setConfig((current) => updatePrimaryComponent(current, 'frequency', Number(event.target.value)))
            }
          />
        </label>
        <label>
          <span><strong>振幅</strong><output>{primary.amplitude.toFixed(2)}</output></span>
          <input
            aria-label="振幅"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={primary.amplitude}
            onChange={(event) =>
              setConfig((current) => updatePrimaryComponent(current, 'amplitude', Number(event.target.value)))
            }
          />
        </label>
        <label>
          <span><strong>相位</strong><output>{Math.round((primary.phase * 180) / Math.PI)}°</output></span>
          <input
            aria-label="相位"
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={primary.phase}
            onChange={(event) =>
              setConfig((current) => updatePrimaryComponent(current, 'phase', Number(event.target.value)))
            }
          />
        </label>
      </div>

      <div className="plot-stack">
        <figure className="plot">
          <figcaption><strong>时域</strong><span>信号随时间变化</span></figcaption>
          <SignalPlot samples={samples} />
        </figure>
        <figure className="plot">
          <figcaption><strong>频域</strong><span>不同频率的相对强度</span></figcaption>
          <SpectrumPlot bins={spectrum} />
        </figure>
      </div>
    </section>
  );
}
