import { useState, useEffect, useRef } from 'react';

/**
 * 가격이 부드럽게 카운팅되어 올라가는 애니메이션 훅
 */
export const usePriceCountUp = (targetPrice: number, duration: number = 600) => {
  const [displayPrice, setDisplayPrice] = useState(targetPrice);
  const previousPriceRef = useRef(targetPrice);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const startPrice = previousPriceRef.current;
    const priceDiff = targetPrice - startPrice;

    // 가격 변동이 없으면 애니메이션 건너뛰기
    if (priceDiff === 0) return;

    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuad 이징 함수 (부드러운 감속)
      const easeProgress = 1 - Math.pow(1 - progress, 2);

      const currentPrice = Math.round(startPrice + (priceDiff * easeProgress));
      setDisplayPrice(currentPrice);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayPrice(targetPrice);
        previousPriceRef.current = targetPrice;
      }
    };

    // 기존 애니메이션 취소
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetPrice, duration]);

  return displayPrice;
};
