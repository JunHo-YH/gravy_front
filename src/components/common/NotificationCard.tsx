import React from 'react';
import type { Notification, VisibleNotification } from '../../constants/notifications';

interface NotificationCardProps {
  notification: Notification;
  visibleItem: VisibleNotification;
  className?: string;
  size?: 'default' | 'small';
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  visibleItem,
  className = '',
  size = 'default'
}) => {
  let animationClass = 'notification-item';
  
  if (visibleItem.isExiting) {
    animationClass += ' notification-exit';
  } else if (visibleItem.isEntering) {
    animationClass += ' notification-enter';
  } else if (visibleItem.isMovingUp) {
    animationClass += ' notification-move-up';
  }

  const isSmall = size === 'small';
  const paddingClass = isSmall ? 'p-3' : 'p-5';
  const spacingClass = isSmall ? 'space-x-3' : 'space-x-4';
  const iconClass = isSmall ? 'text-lg mt-0.5' : 'text-xl mt-1';
  const textClass = isSmall ? 'text-sm' : 'text-base';
  const boldTextClass = isSmall ? 'text-base' : 'text-lg';

  return (
    <div 
      key={visibleItem.id}
      className={`${paddingClass} border rounded-lg shadow-sm ${animationClass} ${
        notification.bgColor
      } ${
        notification.borderColor
      } hover:scale-105 hover:shadow-md ${className}`}
    >
      <div className={`flex items-start ${spacingClass}`}>
        <span className={`${iconClass} flex-shrink-0`}>{notification.icon}</span>
        <p className={`${textClass} font-medium ${notification.textColor} leading-relaxed`}>
          {notification.message.includes('"') ? (
            <>
              {notification.message.split('"')[0]}
              <strong className={`font-bold ${boldTextClass}`}>"{
                notification.message.split('"')[1]
              }"</strong>
              {notification.message.split('"').slice(2).join('"')}
            </>
          ) : (
            notification.message
          )}
        </p>
      </div>
    </div>
  );
};