import React from 'react';
import { NotificationCard } from '../common/NotificationCard';
import { useNotificationAnimation } from '../../hooks/useNotificationAnimation';

interface LandingNotificationSectionProps {
  isVisible: boolean;
  isLoaded: boolean;
}

export const LandingNotificationSection: React.FC<LandingNotificationSectionProps> = ({
  isVisible,
  isLoaded
}) => {
  const { visibleNotifications, notifications } = useNotificationAnimation();

  return (
    <div className={`transform transition-all duration-1000 ${
      isVisible
        ? 'translate-y-0 opacity-100 scale-100 notification-section-appear'
        : 'translate-y-8 opacity-0 scale-95'
    }`}>
      <div className={`text-center mb-6 sm:mb-8 transform transition-all duration-800 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0'
      }`} style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
        <h2 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4">
          <span className="text-gray-300">실시간 </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">경매 알림</span>
        </h2>
        <p className="text-base sm:text-xl text-gray-400">지금 진행 중인 경매 상황을 확인해보세요</p>
      </div>

      <div className={`max-w-2xl mx-auto overflow-hidden relative h-80 transform transition-all duration-800 ${
        isLoaded
          ? 'translate-y-0 opacity-100'
          : 'translate-y-6 opacity-0'
      }`} style={{ transitionDelay: isLoaded ? '300ms' : '0ms' }}>
        <div className="space-y-4">
          {visibleNotifications.map((item) => {
            const notification = notifications[item.index];
            return (
              <NotificationCard
                key={item.id}
                notification={notification}
                visibleItem={item}
                // 랜딩 페이지에서는 더 큰 스타일 유지
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};