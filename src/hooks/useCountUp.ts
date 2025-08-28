import { useState, useEffect } from 'react';

interface CountUpOptions {
  start?: number;
  duration?: number;
  useEasing?: boolean;
  useGrouping?: boolean;
  separator?: string;
  decimal?: string;
  prefix?: string;
  suffix?: string;
}

export const useCountUp = (
  end: number, 
  options: CountUpOptions = {}
): string => {
  const {
    start = 0,
    duration = 2000,
    useEasing = true,
    useGrouping = true,
    prefix = '',
    suffix = ''
  } = options;

  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function (easeOutQuart)
      const easedProgress = useEasing 
        ? 1 - Math.pow(1 - progress, 4)
        : progress;

      const currentCount = start + (end - start) * easedProgress;
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, start, duration, useEasing]);

  const formatNumber = (num: number): string => {
    const roundedNum = Math.round(num);
    let formattedNumber = roundedNum.toString();

    if (useGrouping && roundedNum >= 1000) {
      formattedNumber = roundedNum.toLocaleString('ko-KR', {
        useGrouping: true
      });
    }

    return `${prefix}${formattedNumber}${suffix}`;
  };

  return formatNumber(count);
};