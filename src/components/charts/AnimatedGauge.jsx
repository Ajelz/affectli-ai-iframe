import { useEffect, useRef, useState } from 'react';
import { Chart, ArcElement, DoughnutController } from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, DoughnutController);

const colorPresets = {
  teal: {
    main: '#1A2032',
    gradient: ['#1A2032', '#2A3044'],
    track: '#E5E7EB',
  },
  navy: {
    main: '#1A2032',
    gradient: ['#1A2032', '#2A3044'],
    track: '#E5E7EB',
  },
  green: {
    main: '#10B981',
    gradient: ['#059669', '#10B981'],
    track: '#E5E7EB',
  },
  red: {
    main: '#EF4444',
    gradient: ['#DC2626', '#EF4444'],
    track: '#FEE2E2',
  },
  orange: {
    main: '#F59E0B',
    gradient: ['#D97706', '#F59E0B'],
    track: '#FEF3C7',
  },
};

export default function AnimatedGauge({
  value = 0,
  maxValue = 100,
  size = 120,
  strokeWidth = 12,
  color = 'teal',
  label = '',
  showValue = true,
  suffix = '%',
  animationDuration = 1000,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);

  const colors = colorPresets[color] || colorPresets.teal;
  const percentage = Math.min((value / maxValue) * 100, 100);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, colors.gradient[0]);
    gradient.addColorStop(1, colors.gradient[1]);

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 100], // Start at 0
          backgroundColor: [gradient, colors.track],
          borderWidth: 0,
          circumference: 270,
          rotation: 225,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        cutout: `${((size - strokeWidth * 2) / size) * 100}%`,
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
        animation: {
          duration: animationDuration,
          easing: 'easeOutQuart',
        },
      },
    });

    // Animate to target value
    setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.data.datasets[0].data = [percentage, 100 - percentage];
        chartRef.current.update();
      }
    }, 50);

    // Animate display value
    const startTime = performance.now();
    const animateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setDisplayValue(Math.round(easeProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    requestAnimationFrame(animateValue);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [value, maxValue, size, strokeWidth, color, animationDuration]);

  return (
    <div className="gauge-container" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ width: size, height: size }}
      />
      {showValue && (
        <div className="gauge-center-text">
          <div className="gauge-value" style={{ fontSize: size * 0.22 }}>
            {displayValue}{suffix}
          </div>
          {label && (
            <div className="gauge-label" style={{ fontSize: size * 0.1 }}>
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
