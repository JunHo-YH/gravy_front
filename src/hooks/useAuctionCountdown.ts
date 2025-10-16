import { useState, useEffect } from 'react';

interface CountdownResult {
  display: string;
  isStarted: boolean;
  isEnded: boolean;
}

/**
 * 경매 시작/종료 시간까지 카운트다운을 표시하는 훅
 * @param auctionStartTime 경매 시작 시간
 * @param auctionEndTime 경매 종료 시간
 * @param correctedNow 서버 시간으로 보정된 현재 시간
 */
export const useAuctionCountdown = (
  auctionStartTime: string,
  auctionEndTime: string,
  correctedNow: Date
): CountdownResult => {
  const [display, setDisplay] = useState<string>('');

  useEffect(() => {
    const now = correctedNow.getTime();
    const startTime = new Date(auctionStartTime).getTime();
    const endTime = new Date(auctionEndTime).getTime();

    if (now < startTime) {
      // 경매 시작 전
      const remaining = startTime - now;
      setDisplay(`시작까지 ${formatTime(remaining)}`);
    } else if (now < endTime) {
      // 경매 진행 중
      const remaining = endTime - now;
      setDisplay(`종료까지 ${formatTime(remaining)}`);
    } else {
      // 경매 종료
      setDisplay('경매 종료');
    }
  }, [auctionStartTime, auctionEndTime, correctedNow]);

  const now = correctedNow.getTime();
  const startTime = new Date(auctionStartTime).getTime();
  const endTime = new Date(auctionEndTime).getTime();

  return {
    display,
    isStarted: now >= startTime,
    isEnded: now >= endTime
  };
};

/**
 * 밀리초를 "X시간 Y분 Z초" 형식으로 변환
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  } else if (minutes > 0) {
    return `${minutes}분 ${seconds}초`;
  } else {
    return `${seconds}초`;
  }
}
