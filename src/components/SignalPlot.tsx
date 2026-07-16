import { useEffect, useRef } from 'react';
import { buildSignalPath } from './plots';

type SignalPlotProps = {
  samples: number[];
};

export default function SignalPlot({ samples }: SignalPlotProps) {
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

      context.strokeStyle = '#e5e7eb';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, height / 2);
      context.lineTo(width, height / 2);
      context.stroke();

      const maximum = samples.reduce((value, sample) => Math.max(value, Math.abs(sample)), 1);
      const points = buildSignalPath(samples.map((sample) => sample / maximum), width, height);
      if (points.length === 0) return;

      context.strokeStyle = '#2563eb';
      context.lineWidth = 2;
      context.lineJoin = 'round';
      context.beginPath();
      points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.stroke();
    };

    draw();
    if (!('ResizeObserver' in window)) return;
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [samples]);

  return <canvas ref={canvasRef} className="plot-canvas" role="img" aria-label="时域波形图" />;
}
