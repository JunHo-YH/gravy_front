import { useState, useEffect } from 'react';

/**
 * 서버 시간과 클라이언트 시간의 차이를 계산하고 보정된 현재 시간을 제공하는 훅
 */
export const useServerTime = (serverTime?: string) => {
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [correctedNow, setCorrectedNow] = useState<Date>(new Date());

  // 서버 시간 기반 offset 계산
  useEffect(() => {
    if (serverTime) {
      const server = new Date(serverTime);
      const client = new Date();
      const offset = server.getTime() - client.getTime();
      setTimeOffset(offset);
      // offset 계산 즉시 현재 시간 업데이트
      setCorrectedNow(new Date(Date.now() + offset));
      console.log('⏰ 시간 offset 계산:', { serverTime, clientTime: client.toISOString(), offset: `${offset}ms` });
    }
  }, [serverTime]);

  // 1초마다 보정된 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCorrectedNow(new Date(Date.now() + timeOffset));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeOffset]);

  return { timeOffset, correctedNow };
};
