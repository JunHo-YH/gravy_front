import { useState, useEffect } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  timeString: string;
  urgencyLevel: 'normal' | 'warning' | 'critical' | 'expired';
}

export const useRealTimeCountdown = (endTime: string): CountdownResult => {
  const [countdown, setCountdown] = useState<CountdownResult>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    timeString: '',
    urgencyLevel: 'normal'
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const end = new Date(endTime);
      const now = new Date();
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          timeString: '경매 종료',
          urgencyLevel: 'expired'
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let timeString = '';
      let urgencyLevel: 'normal' | 'warning' | 'critical' | 'expired' = 'normal';

      const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
      const totalSeconds = totalMinutes * 60 + seconds;
      
      if (totalSeconds <= 300) { // 5분 이하
        urgencyLevel = 'critical';
        timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      } else if (totalMinutes <= 30) { // 30분 이하
        urgencyLevel = 'warning';
        timeString = `${minutes}분 ${seconds}초`;
      } else if (totalMinutes <= 180) { // 3시간 이하
        urgencyLevel = 'warning';
        timeString = `${hours}시간 ${minutes}분`;
      } else if (hours < 24) {
        timeString = `${hours}시간 ${minutes}분`;
      } else {
        timeString = `${days}일 ${hours}시간`;
      }

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        timeString,
        urgencyLevel
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return countdown;
};