import { useCallback, useEffect, useRef, useState } from 'react';
import type { SignalComponent } from '../domain/signal';

type AudioNodes = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

export function useAudioSignal(components: SignalComponent[]) {
  const contextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNodes[]>([]);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const stopNodes = useCallback(() => {
    nodesRef.current.forEach(({ oscillator, gain }) => {
      try {
        oscillator.stop();
      } catch {
        // 已停止的节点不需要再次处理。
      }
      oscillator.disconnect();
      gain.disconnect();
    });
    nodesRef.current = [];
  }, []);

  const stop = useCallback(() => {
    stopNodes();
    setIsPlaying(false);
  }, [stopNodes]);

  const play = useCallback(async () => {
    try {
      stopNodes();
      if (!window.AudioContext) throw new Error('AudioContext unavailable');
      const context = contextRef.current ?? new window.AudioContext();
      contextRef.current = context;
      await context.resume();

      nodesRef.current = components.map((component) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const audibleFrequency = Math.min(1200, Math.max(80, component.frequency * 40));
        oscillator.frequency.value = audibleFrequency;
        gain.gain.value = component.amplitude / Math.max(1, components.length * 2);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        return { oscillator, gain };
      });

      setError('');
      setIsPlaying(true);
    } catch {
      setError('声音暂时无法播放，波形实验仍可继续。');
      setIsPlaying(false);
    }
  }, [components, stopNodes]);

  useEffect(
    () => () => {
      stopNodes();
      void contextRef.current?.close();
      contextRef.current = null;
    },
    [stopNodes],
  );

  return { play, stop, error, isPlaying };
}
