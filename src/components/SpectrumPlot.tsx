import { useEffect, useRef } from 'react';
import type { SpectrumBin } from '../domain/fourier';
import { buildSpectrumBars } from './plots';

type SpectrumPlotProps = {
  bins: SpectrumBin[];
};

export default function SpectrumPlot({ bins }: SpectrumPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const context = canvas.getContext('2d');
      if (!context) return;

      const width = Math.max(1, canvas.clientWidth || 640);
      const height = Math.max(1, canvas.clientHeight || 240);
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#374151';
      buildSpectrumBars(bins, width, height).forEach((bar) => {
        context.fillRect(bar.x, bar.y, bar.width, bar.height);
      });
    };

    draw();
    if (!('ResizeObserver' in window)) return;
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [bins]);

  return <canvas ref={canvasRef} className="plot-canvas" role="img" aria-label="频域幅度谱" />;
}
