import React from 'react';
import { NotificationCard } from './NotificationCard';
import { useNotificationAnimation } from '../../hooks/useNotificationAnimation';

interface NotificationSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({
  title = '알림',
  description,
  className = ''
}) => {
  const { visibleNotifications, notifications } = useNotificationAnimation();

  return (
    <div className={className}>
      {title && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}
      
      <div className="overflow-hidden relative h-64">
        <div className="space-y-3">
          {visibleNotifications.map((item) => {
            const notification = notifications[item.index];
            return (
              <NotificationCard
                key={item.id}
                notification={notification}
                visibleItem={item}
                size="small"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};