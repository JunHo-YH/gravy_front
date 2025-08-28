import { useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS, type VisibleNotification } from '../constants/notifications';

export const useNotificationAnimation = () => {
  const [visibleNotifications, setVisibleNotifications] = useState<VisibleNotification[]>(() => [
    { index: 0, id: 'n-0', isExiting: false, isEntering: false, isMovingUp: false },
    { index: 1, id: 'n-1', isExiting: false, isEntering: false, isMovingUp: false },
    { index: 2, id: 'n-2', isExiting: false, isEntering: false, isMovingUp: false }
  ]);
  const [nextIndex, setNextIndex] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. 맨 위 알림 나가기 + 나머지 알림들 위로 이동 시작
      setVisibleNotifications(prev => [
        { ...prev[0], isExiting: true },
        { ...prev[1], isMovingUp: true },
        { ...prev[2], isMovingUp: true }
      ]);
      
      // 375ms 후 새 알림 추가 (slideOutUp 중간 지점에 정확히 맞춰)
      setTimeout(() => {
        const newNotification: VisibleNotification = {
          index: nextIndex % MOCK_NOTIFICATIONS.length,
          id: `n-${nextIndex}`,
          isExiting: false,
          isEntering: true,
          isMovingUp: false
        };
        
        setVisibleNotifications(prev => [
          { ...prev[1], isMovingUp: false }, // 두 번째가 첫 번째로
          { ...prev[2], isMovingUp: false }, // 세 번째가 두 번째로
          newNotification                    // 새 알림이 세 번째로
        ]);
        
        setNextIndex(prev => prev + 1);
      }, 375);
      
      // 1450ms 후 들어오는 애니메이션 종료 (모든 애니메이션 완료 + 여유)
      setTimeout(() => {
        setVisibleNotifications(prev => 
          prev.map(item => ({ ...item, isEntering: false, isMovingUp: false }))
        );
      }, 1450);
    }, 2200);

    return () => clearInterval(interval);
  }, [nextIndex]);

  return {
    visibleNotifications,
    notifications: MOCK_NOTIFICATIONS
  };
};