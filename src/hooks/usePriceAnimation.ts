import { useState, useEffect, useRef } from 'react';

type PriceDirection = 'up' | 'down' | 'none';

export const usePriceAnimation = (currentPrice: number, isActive: boolean, auctionId: string) => {
  const [visualDirection, setVisualDirection] = useState<PriceDirection>('none');
  const previousPrice = useRef(currentPrice);

  // 실제 서버 가격이 변경될 때만 실제 방향 표시 (우선순위 높음)
  useEffect(() => {
    if (currentPrice !== previousPrice.current) {
      const realDirection = currentPrice > previousPrice.current ? 'up' : 'down';
      setVisualDirection(realDirection);
      previousPrice.current = currentPrice;
      
      // 실제 가격 변동은 3초 동안 표시
      const timer = setTimeout(() => setVisualDirection('none'), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPrice]);

  // 시각적 효과만을 위한 랜덤 방향 표시 (가격은 절대 변경하지 않음)
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // 실제 가격 변동 중일 때는 시각 효과 중단
      if (currentPrice !== previousPrice.current) return;
      
      // 완전한 랜덤 생성 (각 상품이 독립적으로 25% 확률로 변경)
      const shouldShow = Math.random() < 0.25; // 25% 확률
      
      if (shouldShow) {
        const direction = Math.random() < 0.5 ? 'up' : 'down'; // 50:50 확률
        setVisualDirection(direction);
        
        // 2초 후 방향 효과 제거
        setTimeout(() => {
          // 실제 가격 변동이 없을 때만 제거
          if (currentPrice === previousPrice.current) {
            setVisualDirection('none');
          }
        }, 2000);
      }
    }, 4000); // 모든 상품이 4초마다 동시에 체크

    return () => clearInterval(interval);
  }, [isActive, auctionId, currentPrice]);

  return {
    displayPrice: currentPrice, // ⚠️ 절대 변경되지 않는 서버 원본 가격
    priceDirection: visualDirection,
    isChanging: visualDirection !== 'none'
  };
};