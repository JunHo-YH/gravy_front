import React from 'react';
import { Card } from '../common/Card';
import { AuctionSummary, AuctionStatus } from '../../types/auction';
import { useRealTimeCountdown } from '../../hooks/useRealTimeCountdown';
import { usePriceAnimation } from '../../hooks/usePriceAnimation';
import { Clock } from 'lucide-react';

interface AuctionCardProps {
  auction: AuctionSummary;
  onClick?: () => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onClick }) => {
  const countdown = useRealTimeCountdown(auction.auctionEndAt);
  const isActive = auction.status === AuctionStatus.ACTIVE;
  const { displayPrice, priceDirection, isChanging } = usePriceAnimation(auction.currentPrice, isActive, auction.publicId);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const isUrgent = countdown.urgencyLevel === 'critical';

  const getTimerDisplay = () => {
    if (countdown.isExpired) {
      return <span className="text-gray-400 font-medium">종료</span>;
    }
    
    const baseClasses = "font-mono font-bold";
    
    if (countdown.urgencyLevel === 'critical') {
      // 5분 이하 - 매우 긴급
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          <span className={`${baseClasses} text-red-500 text-xl animate-pulse`}>
            {countdown.timeString}
          </span>
        </div>
      );
    }
    
    if (countdown.urgencyLevel === 'warning') {
      // 30분~3시간 - 경고
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <span className={`${baseClasses} text-orange-600 text-lg`}>
            {countdown.timeString}
          </span>
        </div>
      );
    }
    
    return <span className={`${baseClasses} text-gray-600 text-base`}>{countdown.timeString}</span>;
  };

  const getCardClasses = () => {
    let baseClasses = `
      group cursor-pointer border transition-all duration-200 
      hover:border-gray-300 hover:shadow-lg
    `;
    
    if (countdown.urgencyLevel === 'critical') {
      return `${baseClasses} border-red-300 bg-red-50/30 hover:shadow-red-200/50 hover:shadow-xl animate-pulse`;
    }
    
    if (countdown.urgencyLevel === 'warning') {
      return `${baseClasses} border-orange-200 bg-orange-50/20 hover:shadow-orange-200/50 hover:shadow-xl`;
    }
    
    if (isActive) {
      return `${baseClasses} border-green-200 bg-green-50/10 hover:shadow-green-200/50 hover:shadow-xl`;
    }
    
    return `${baseClasses} border-gray-200 hover:shadow-xl`;
  };

  const getPriceClasses = () => {
    let baseClasses = "text-2xl font-bold transition-all duration-500";
    
    // 가격 변동 중일 때 애니메이션
    if (isChanging) {
      baseClasses += " animate-pulse";
    }
    
    // 가격 방향에 따른 색상 (빨강=오름, 초록=내림)
    const getPriceColor = () => {
      if (priceDirection === 'up') return 'text-red-600';   // 오를 때 빨강
      if (priceDirection === 'down') return 'text-green-600'; // 내릴 때 초록
      
      // 기본 색상 (긴급도별)
      if (countdown.urgencyLevel === 'critical') return 'text-red-700';
      if (countdown.urgencyLevel === 'warning') return 'text-orange-700';
      return 'text-gray-900';
    };
    
    const scaleClass = countdown.urgencyLevel === 'critical' ? 'group-hover:scale-110' :
                      countdown.urgencyLevel === 'warning' ? 'group-hover:scale-107' :
                      isActive ? 'group-hover:scale-105' : '';
    
    return `${baseClasses} ${scaleClass} ${getPriceColor()}`;
  };

  return (
    <Card className={getCardClasses()} onClick={onClick} padding="lg">
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-sm text-gray-500 font-medium">{auction.category}</span>
            {isActive && (
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">LIVE</span>
              </div>
            )}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors">
            {auction.title}
          </h3>
        </div>

        {/* 현재 가격 - 메인 표시 */}
        <div className={`relative text-center py-4 rounded-lg transition-all duration-300 ${
          countdown.urgencyLevel === 'critical' ? 'bg-red-100 group-hover:bg-red-150' :
          countdown.urgencyLevel === 'warning' ? 'bg-orange-100 group-hover:bg-orange-150' :
          'bg-gray-50 group-hover:bg-gray-100'
        }`}>
          <div className="text-sm text-gray-500 mb-1 flex items-center justify-center gap-2">
            <span>현재가</span>
            {isActive && (
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  countdown.urgencyLevel === 'critical' ? 'bg-red-400' :
                  countdown.urgencyLevel === 'warning' ? 'bg-orange-400' : 
                  'bg-green-400'
                }`}></div>
                <span className={`text-xs font-semibold ${
                  countdown.urgencyLevel === 'critical' ? 'text-red-600' :
                  countdown.urgencyLevel === 'warning' ? 'text-orange-600' : 
                  'text-green-600'
                }`}>LIVE</span>
              </div>
            )}
          </div>
          
          <div className={getPriceClasses()}>
            <span className={`inline-block ${isChanging ? 'animate-bounce' : ''}`}>
              {formatPrice(displayPrice)}
            </span>
            {priceDirection === 'up' && (
              <span className="ml-2 text-red-500 text-lg animate-bounce">↗</span>
            )}
            {priceDirection === 'down' && (
              <span className="ml-2 text-green-500 text-lg animate-bounce">↘</span>
            )}
          </div>
          
          {/* 가격 변동 표시 */}
          {isActive && priceDirection !== 'none' && (
            <div className="absolute top-1 right-1">
              <div className={`text-xs px-2 py-1 rounded-full font-bold animate-pulse ${
                priceDirection === 'up' ? 'bg-red-500/20 text-red-700' : 'bg-green-500/20 text-green-700'
              }`}>
                {priceDirection === 'up' ? '+' : '-'}
              </div>
            </div>
          )}
          
          {/* 경매가 매우 긴급할 때 가격 주변 글로우 효과 */}
          {countdown.urgencyLevel === 'critical' && (
            <div className="absolute inset-0 rounded-lg bg-red-400/10 animate-pulse pointer-events-none"></div>
          )}
        </div>

        {/* 시간과 즉시구매가 */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            {getTimerDisplay()}
          </div>
          <div className="text-right">
            <div className="text-gray-500">즉시구매</div>
            <div className="font-semibold text-gray-700">
              {formatPrice(auction.buyNowPrice)}
            </div>
          </div>
        </div>

        {/* 판매자 */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-600">{auction.sellerNickname}</span>
        </div>
      </div>

      {/* 긴급도별 표시 */}
      {countdown.urgencyLevel === 'critical' && !countdown.isExpired && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-lg">
            🔥 마감직전
          </div>
        </div>
      )}
      
      {countdown.urgencyLevel === 'warning' && !countdown.isExpired && (
        <div className="absolute -top-1 -right-1">
          <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            ⚡ 서둘러요
          </div>
        </div>
      )}
      
      {/* 하트비트 애니메이션 - 매우 긴급한 경우 */}
      {countdown.urgencyLevel === 'critical' && !countdown.isExpired && (
        <div className="absolute inset-0 rounded-lg pointer-events-none">
          <div className="absolute inset-0 rounded-lg animate-ping bg-red-400/20"></div>
        </div>
      )}
    </Card>
  );
};