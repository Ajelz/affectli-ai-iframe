import { useRef, useEffect } from 'react';

const colorMap = {
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  purple: '#a855f7',
  orange: '#f97316',
};

export default function Sparkline({ data, color = 'blue', height = 40 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const h = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, h);

    // Calculate points
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 4;

    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * (width - padding * 2) + padding,
      y: h - padding - ((value - min) / range) * (h - padding * 2),
    }));

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, `${colorMap[color]}30`);
    gradient.addColorStop(1, `${colorMap[color]}05`);

    ctx.beginPath();
    ctx.moveTo(points[0].x, h);
    points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = colorMap[color];
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw end point
    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = colorMap[color];
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = `${colorMap[color]}30`;
    ctx.fill();
  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={height}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
}
