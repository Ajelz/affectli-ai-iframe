import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animating numbers from 0 to target value
 * @param {number} target - The target number to count up to
 * @param {number} duration - Animation duration in milliseconds (default: 1500)
 * @param {number} delay - Delay before starting animation in milliseconds (default: 0)
 * @returns {number} - The current animated value
 */
export default function useCountUp(target, duration = 1500, delay = 0) {
  const [count, setCount] = useState(0);
  const hasAnimatedRef = useRef(false);
  const frameRef = useRef(null);
  const targetRef = useRef(target);

  useEffect(() => {
    // Only animate once on mount, or if target changes significantly
    if (hasAnimatedRef.current && Math.abs(targetRef.current - target) < 1) {
      return;
    }

    targetRef.current = target;
    hasAnimatedRef.current = true;

    if (target <= 0) {
      setCount(0);
      return;
    }

    let startTime = null;

    // Easing function for smooth deceleration
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      // Handle decimal numbers
      if (Number.isInteger(target)) {
        setCount(Math.floor(easedProgress * target));
      } else {
        const decimalPlaces = target.toString().split('.')[1]?.length || 1;
        setCount(parseFloat((easedProgress * target).toFixed(Math.min(decimalPlaces, 2))));
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    // Start after delay
    const timeoutId = setTimeout(() => {
      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration, delay]);

  return count;
}

/**
 * Format number with locale-specific separators
 * @param {number} num - The number to format
 * @param {boolean} isRTL - Whether to use Arabic locale
 * @returns {string} - Formatted number string
 */
export function formatNumber(num, isRTL = false) {
  return num.toLocaleString(isRTL ? 'ar-LY' : 'en-US');
}

/**
 * Format percentage with locale-specific formatting
 * @param {number} num - The number to format as percentage
 * @param {boolean} isRTL - Whether to use Arabic locale
 * @returns {string} - Formatted percentage string
 */
export function formatPercent(num, isRTL = false) {
  return `${num.toLocaleString(isRTL ? 'ar-LY' : 'en-US')}%`;
}
