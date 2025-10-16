import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { AuctionSummary, AuctionStatus, CATEGORY_DISPLAY_NAMES } from '../../types/auction';
import { Clock } from 'lucide-react';

interface AuctionCardProps {
  auction: AuctionSummary;
  onClick?: () => void;
  correctedNow: Date;  // 서버 시간 보정된 현재 시간
}

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  urgencyLevel: 'normal' | 'warning' | 'critical' | 'expired';
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onClick, correctedNow }) => {
  const [countdown, setCountdown] = useState<CountdownState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    urgencyLevel: 'normal'
  });

  const [stampKey, setStampKey] = useState(0);

  // 실시간 상태 체크
  const now = correctedNow;
  const startTime = new Date(auction.auctionStartTime);
  const endTime = new Date(auction.auctionEndTime);

  const isBeforeStart = now < startTime;
  const isCompleted = now >= endTime || auction.status === AuctionStatus.COMPLETED || auction.status === AuctionStatus.ENDED;
  const isActive = !isCompleted && ((now >= startTime && now < endTime) || auction.status === AuctionStatus.ACTIVE || auction.status === AuctionStatus.ONGOING);

  // 1초마다 카운트다운 계산
  useEffect(() => {
    const calculateCountdown = () => {
      const end = new Date(auction.auctionEndTime);
      const diff = end.getTime() - correctedNow.getTime();

      if (diff <= 0) {
        setCountdown((prev) => {
          // 경매가 막 종료된 순간 (이전에는 종료되지 않았었음)
          if (!prev.isExpired) {
            setStampKey(prev => prev + 1); // 도장 애니메이션 트리거
          }
          return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true,
            urgencyLevel: 'expired'
          };
        });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // 긴급도 계산
      let urgencyLevel: 'normal' | 'warning' | 'critical' | 'expired' = 'normal';
      if (totalSeconds <= 180) { // 3분 이하만 critical
        urgencyLevel = 'critical';
      }

      setCountdown({
        hours,
        minutes,
        seconds,
        isExpired: false,
        urgencyLevel
      });
    };

    calculateCountdown();
  }, [auction.auctionEndTime, correctedNow]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const categoryDisplayName = CATEGORY_DISPLAY_NAMES[auction.category];

  const getTimeRemaining = () => {
    if (countdown.isExpired || isCompleted) {
      return { label: '경매 종료', value: '', color: 'text-gray-500', bgColor: 'bg-gray-800', isBeforeStart: false, isCompleted: true };
    }

    const start = new Date(auction.auctionStartTime);

    // 시 분 초 형식으로 표시
    const { hours, minutes, seconds } = countdown;
    const timeString = `${hours}시 ${minutes}분 ${seconds}초`;

    if (correctedNow < start) {
      // 시작 전
      return { label: '시작까지', value: timeString, color: 'text-gray-400', bgColor: 'bg-gray-900/40', isBeforeStart: true, isCompleted: false };
    } else {
      // 진행 중 - 빨간색 배경
      const color = countdown.urgencyLevel === 'critical' ? 'text-red-500' :
                   countdown.urgencyLevel === 'warning' ? 'text-red-400' : 'text-red-400';
      const bgColor = countdown.urgencyLevel === 'critical' ? 'bg-red-950/70' :
                     countdown.urgencyLevel === 'warning' ? 'bg-red-950/50' : 'bg-red-950/40';
      return { label: '종료까지', value: timeString, color, bgColor, isBeforeStart: false, isCompleted: false };
    }
  };

  const timeRemaining = getTimeRemaining();

  const getCardClasses = () => {
    let baseClasses = `
      group cursor-pointer border-2 transition-all duration-300
      bg-gradient-to-br from-gray-900 via-gray-900 to-black
      hover:scale-[1.03] hover:-translate-y-1
    `;

    if (isCompleted) {
      return `${baseClasses} border-gray-700 hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-900/80`;
    }

    if (countdown.urgencyLevel === 'critical' && !isBeforeStart) {
      return `${baseClasses} border-red-600 hover:border-red-500 shadow-lg shadow-red-900/50 hover:shadow-2xl hover:shadow-red-900/90`;
    }

    if (countdown.urgencyLevel === 'warning' && !isBeforeStart) {
      return `${baseClasses} border-red-700 hover:border-red-600 shadow-lg shadow-red-900/30 hover:shadow-2xl hover:shadow-red-900/70`;
    }

    if (isActive) {
      return `${baseClasses} border-red-800 hover:border-red-700 shadow-lg shadow-red-900/20 hover:shadow-2xl hover:shadow-red-900/60`;
    }

    return `${baseClasses} border-gray-700 hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-900/40`;
  };

  return (
    <Card
      className={getCardClasses()}
      onClick={onClick}
      padding="none"
      onMouseEnter={() => isCompleted && setStampKey(prev => prev + 1)}
    >
      {/* 썸네일 이미지 */}
      <div className="relative h-48 overflow-hidden bg-black z-0">
        {auction.thumbnailUrl ? (
          <img
            src={auction.thumbnailUrl}
            alt={auction.title}
            className={`w-full h-full object-contain transition-all duration-500 relative z-0 ${
              isCompleted
                ? 'grayscale blur-[2px] opacity-40'
                : 'group-hover:scale-105 group-hover:brightness-110'
            }`}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 ${
            isCompleted ? 'opacity-40 grayscale' : 'group-hover:from-red-950/40 group-hover:via-black group-hover:to-red-950/40'
          }`}>
            {/* 고급스러운 배경 패턴 */}
            <div className="absolute inset-0">
              {/* 방사형 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50"></div>

              {/* 다이아몬드 패턴 - 더 선명하게 */}
              <div className="absolute inset-0 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-700" style={{
                backgroundImage: `
                  linear-gradient(45deg, #374151 25%, transparent 25%),
                  linear-gradient(-45deg, #374151 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #374151 75%),
                  linear-gradient(-45deg, transparent 75%, #374151 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}></div>
            </div>


            {/* 메인 컨텐츠 */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* 고급스러운 가로형 다이아몬드 아이콘 */}
              <div className="relative mb-0 mt-2 transition-all duration-700 group-hover:scale-[1.15] group-hover:rotate-2">
                {/* 다이아몬드 뒤 글로우 - 여러 레이어 */}
                <div className="absolute inset-0 blur-[60px] bg-red-900/0 group-hover:bg-red-600/60 transition-all duration-700"></div>
                <div className="absolute inset-0 blur-3xl bg-gray-500/30 group-hover:bg-red-500/50 transition-all duration-700"></div>
                <div className="absolute inset-0 blur-2xl bg-white/5 group-hover:bg-red-400/30 transition-all duration-700"></div>

                <svg className="w-44 h-36 relative drop-shadow-2xl" viewBox="0 0 140 100" fill="none">
                  {/* 그라데이션 정의 - 최고급 */}
                  <defs>
                    <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#4B5563' }} />
                      <stop offset="20%" style={{ stopColor: '#9CA3AF' }} />
                      <stop offset="40%" style={{ stopColor: '#D1D5DB' }} />
                      <stop offset="60%" style={{ stopColor: '#E5E7EB' }} />
                      <stop offset="80%" style={{ stopColor: '#9CA3AF' }} />
                      <stop offset="100%" style={{ stopColor: '#4B5563' }} />
                    </linearGradient>
                    <linearGradient id="diamondGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#991B1B' }} />
                      <stop offset="20%" style={{ stopColor: '#DC2626' }} />
                      <stop offset="40%" style={{ stopColor: '#EF4444' }} />
                      <stop offset="60%" style={{ stopColor: '#FCA5A5' }} />
                      <stop offset="80%" style={{ stopColor: '#EF4444' }} />
                      <stop offset="100%" style={{ stopColor: '#991B1B' }} />
                    </linearGradient>
                    <radialGradient id="diamondRadial">
                      <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                      <stop offset="25%" style={{ stopColor: '#F3F4F6', stopOpacity: 0.98 }} />
                      <stop offset="50%" style={{ stopColor: '#D1D5DB', stopOpacity: 0.95 }} />
                      <stop offset="100%" style={{ stopColor: '#6B7280', stopOpacity: 0.85 }} />
                    </radialGradient>
                    <radialGradient id="diamondRadialHover">
                      <stop offset="0%" style={{ stopColor: '#FEE2E2', stopOpacity: 1 }} />
                      <stop offset="25%" style={{ stopColor: '#FCA5A5', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#F87171', stopOpacity: 0.98 }} />
                      <stop offset="100%" style={{ stopColor: '#DC2626', stopOpacity: 0.9 }} />
                    </radialGradient>

                    {/* 고급 필터 효과 */}
                    <filter id="diamondGlow">
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <filter id="shine">
                      <feGaussianBlur stdDeviation="0.5" result="softGlow"/>
                      <feMerge>
                        <feMergeNode in="softGlow"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* 다이아몬드 메인 형태 - 가로로 넓게 */}
                  <g className="transition-all duration-700">
                    {/* 상단 테이블 (Table Facet) */}
                    <polygon points="70,10 45,30 70,25 95,30" fill="url(#diamondRadial)" className="group-hover:fill-[url(#diamondRadialHover)] transition-all duration-700" opacity="0.95"/>

                    {/* 상단 좌측 크라운 */}
                    <polygon points="20,30 45,30 70,10" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.75"/>
                    <polygon points="10,35 20,30 45,30" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.7"/>

                    {/* 상단 우측 크라운 */}
                    <polygon points="95,30 120,30 70,10" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.8"/>
                    <polygon points="120,30 130,35 95,30" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.75"/>

                    {/* 중앙 거들 (Girdle) - 가장 넓은 부분 */}
                    <polygon points="10,35 20,30 25,45 15,50" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.85"/>
                    <polygon points="20,30 45,30 50,45 25,45" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.9"/>
                    <polygon points="45,30 70,25 70,45 50,45" fill="url(#diamondRadial)" className="group-hover:fill-[url(#diamondRadialHover)] transition-all duration-700" opacity="1"/>
                    <polygon points="70,25 95,30 90,45 70,45" fill="url(#diamondRadial)" className="group-hover:fill-[url(#diamondRadialHover)] transition-all duration-700" opacity="0.95"/>
                    <polygon points="95,30 120,30 115,45 90,45" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.88"/>
                    <polygon points="120,30 130,35 125,50 115,45" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.82"/>

                    {/* 하단 파빌리온 (Pavilion) - 좌측 */}
                    <polygon points="15,50 25,45 70,90" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.65"/>
                    <polygon points="25,45 50,45 70,90" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.72"/>
                    <polygon points="50,45 70,45 70,90" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.8"/>

                    {/* 하단 파빌리온 - 우측 */}
                    <polygon points="70,45 90,45 70,90" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.78"/>
                    <polygon points="90,45 115,45 70,90" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.7"/>
                    <polygon points="115,45 125,50 70,90" fill="url(#diamondGradient)" className="group-hover:fill-[url(#diamondGradientHover)] transition-all duration-700" opacity="0.63"/>
                  </g>

                  {/* 하이라이트 반짝임 - 더욱 고급스럽게 */}
                  <g className="opacity-80 group-hover:opacity-100 transition-opacity duration-700" filter="url(#shine)">
                    {/* 좌측 하이라이트 */}
                    <polygon points="50,45 70,45 70,35" fill="white" opacity="0.35"/>
                    <polygon points="35,40 50,45 45,30" fill="white" opacity="0.25"/>

                    {/* 우측 하이라이트 */}
                    <polygon points="70,45 90,45 70,35" fill="white" opacity="0.3"/>
                    <polygon points="90,45 105,40 95,30" fill="white" opacity="0.22"/>
                  </g>

                  {/* 외곽선 및 패싯 라인 - 더 섬세하게 */}
                  <g stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gray-500 group-hover:text-red-400 transition-colors duration-700" opacity="0.7">
                    {/* 외곽 윤곽선 - 두껍게 */}
                    <polygon points="70,10 130,35 125,50 70,90 15,50 10,35" strokeWidth="0.8"/>

                    {/* 주요 내부 패싯 라인 */}
                    <line x1="70" y1="10" x2="70" y2="90" strokeWidth="0.6"/>
                    <line x1="10" y1="35" x2="130" y2="35" strokeWidth="0.6"/>
                    <line x1="15" y1="50" x2="125" y2="50" strokeWidth="0.6"/>

                    {/* 세부 패싯 라인 */}
                    <line x1="70" y1="10" x2="20" y2="30"/>
                    <line x1="70" y1="10" x2="45" y2="30"/>
                    <line x1="70" y1="10" x2="95" y2="30"/>
                    <line x1="70" y1="10" x2="120" y2="30"/>

                    <line x1="20" y1="30" x2="25" y2="45"/>
                    <line x1="45" y1="30" x2="50" y2="45"/>
                    <line x1="95" y1="30" x2="90" y2="45"/>
                    <line x1="120" y1="30" x2="115" y2="45"/>

                    <line x1="15" y1="50" x2="70" y2="90"/>
                    <line x1="25" y1="45" x2="70" y2="90"/>
                    <line x1="50" y1="45" x2="70" y2="90"/>
                    <line x1="90" y1="45" x2="70" y2="90"/>
                    <line x1="115" y1="45" x2="70" y2="90"/>
                    <line x1="125" y1="50" x2="70" y2="90"/>
                  </g>

                </svg>

                {/* 반짝임 효과 - 깔끔한 아치형 */}
                {/* 중앙 */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-85 transition-opacity duration-700 blur-sm animate-pulse" style={{ animationDelay: '0.3s' }}></div>

                {/* 중앙 근처 좌우 */}
                <div className="absolute top-3 left-[40%] w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-75 transition-opacity duration-700 blur-sm animate-pulse" style={{ animationDelay: '0.25s' }}></div>
                <div className="absolute top-3 right-[40%] w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-75 transition-opacity duration-700 blur-sm animate-pulse" style={{ animationDelay: '0.35s' }}></div>

                {/* 중간 레이어 */}
                <div className="absolute top-5 left-[30%] w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-700 blur-sm animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute top-5 right-[30%] w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-700 blur-sm animate-pulse" style={{ animationDelay: '0.4s' }}></div>

                {/* 외곽 레이어 */}
                <div className="absolute top-7 left-[20%] w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-65 transition-opacity duration-700 blur-sm animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                <div className="absolute top-7 right-[20%] w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-65 transition-opacity duration-700 blur-sm animate-pulse" style={{ animationDelay: '0.45s' }}></div>

                {/* 가장 바깥쪽 */}
                <div className="absolute top-9 left-[12%] w-0.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-55 transition-opacity duration-700 blur-sm animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="absolute top-9 right-[12%] w-0.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-55 transition-opacity duration-700 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>

              {/* 브랜드 텍스트 - GRAVY (간격 좁게) */}
              <div className="text-center -mt-2">
                <div className="text-3xl font-black tracking-[0.25em]">
                  <span className="bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 group-hover:from-red-700 group-hover:via-red-400 group-hover:to-red-700 bg-clip-text text-transparent transition-all duration-700 drop-shadow-2xl">
                    GRAVY
                  </span>
                </div>
              </div>
            </div>

            {/* 중앙 빛 효과 */}
            <div className="absolute inset-0 bg-gradient-radial from-red-950/0 via-transparent to-transparent group-hover:from-red-950/20 transition-all duration-700"></div>
          </div>
        )}

        {/* 경매 종료 오버레이 */}
        {isCompleted && (
          <>
            {/* 회색 오버레이 - 이미지 희미하게 */}
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-[1px] z-10"></div>

            {/* ENDED 도장 - 우측 사선에서 강하게 쾅! 찍기 */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div key={stampKey} className="relative animate-stamp">
                {/* 외곽 장식 링 */}
                <div className="absolute -inset-4 rounded-full border-[3px] border-red-700/40 animate-pulse"></div>
                <div className="absolute -inset-3 rounded-full border-2 border-red-600/30"></div>

                {/* 메인 도장 - 빨간색 */}
                <div className="relative w-32 h-32 rounded-full border-[10px] border-red-700 bg-gradient-to-br from-red-950/90 via-red-900/70 to-red-950/90 backdrop-blur-sm shadow-2xl shadow-red-900/90">
                  {/* 다중 원형 테두리 */}
                  <div className="absolute inset-2 rounded-full border-[6px] border-red-600/90 shadow-inner shadow-red-950"></div>
                  <div className="absolute inset-4 rounded-full border-[3px] border-red-500/70"></div>
                  <div className="absolute inset-6 rounded-full border-[2px] border-red-400/50"></div>

                  {/* 중앙 텍스트 */}
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="text-5xl font-black text-red-500 drop-shadow-2xl leading-none">SOLD</div>
                  </div>

                  {/* 도장 글로우 효과 */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/30 via-transparent to-red-700/30 animate-pulse"></div>
                </div>

                {/* 외부 글로우 */}
                <div className="absolute inset-0 rounded-full blur-2xl bg-red-600/40"></div>
              </div>
            </div>
          </>
        )}

        {/* 실시간 표시선 - ACTIVE일 때만 */}
        {isActive && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
        )}

        {/* 긴급 배지 - 경매 시작 후에만 표시 */}
        {countdown.urgencyLevel === 'critical' && !isCompleted && correctedNow >= new Date(auction.auctionStartTime) && (
          <div className="absolute top-3 right-3 z-30">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-bounce shadow-lg shadow-red-900/50 border-2 border-red-500">
              🔥 마감직전
            </div>
          </div>
        )}

      </div>

      {/* 카드 내용 */}
      <div className="p-6 space-y-4">
        {/* 헤더 - 카테고리 + LIVE NOW 배지 */}
        <div className="flex justify-between items-start">
          <div>
            <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-gray-900 to-black border-[3px] border-gray-700 rounded-lg transition-all duration-300 group-hover:border-red-800 group-hover:from-red-950/30 group-hover:to-black">
              <span className="text-xs text-gray-300 font-black uppercase tracking-wide group-hover:text-red-400 transition-colors duration-300">{categoryDisplayName}</span>
            </div>
          </div>
          {isActive && !isCompleted && countdown.urgencyLevel !== 'critical' && countdown.urgencyLevel !== 'warning' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-950 to-red-900 border border-red-700 rounded-lg animate-pulse group-hover:border-red-500 group-hover:from-red-900 group-hover:to-red-800 transition-all duration-300">
              <div className="relative w-1.5 h-1.5">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-xs text-red-400 font-black uppercase tracking-wider group-hover:text-red-300 transition-colors duration-300">LIVE NOW</span>
            </div>
          )}
        </div>

        {/* 제목 */}
        <div>
          <h3 className="font-bold text-xl text-white line-clamp-2 leading-tight group-hover:text-red-400 transition-colors duration-300">
            {auction.title}
          </h3>
        </div>

        {/* 현재 가격 - 고급스러운 테두리 박스 */}
        <div className="relative rounded-xl">
          {/* 흐르는 테두리와 후광 효과 - ACTIVE 또는 시작 전 */}
          {(isActive || isBeforeStart) && (
            <>
              {/* 최외곽 후광 - 양옆으로 매우 넓게 */}
              <div className="absolute rounded-xl blur-3xl opacity-80 pointer-events-none" style={{
                left: '-100px',
                right: '-100px',
                top: '-30px',
                bottom: '-30px',
                background: isBeforeStart
                  ? 'linear-gradient(90deg, transparent 0%, transparent 25%, rgba(107, 114, 128, 0.6) 42%, rgba(156, 163, 175, 0.9) 50%, rgba(107, 114, 128, 0.6) 58%, transparent 75%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, transparent 25%, rgba(220, 38, 38, 0.6) 42%, rgba(248, 113, 113, 0.9) 50%, rgba(220, 38, 38, 0.6) 58%, transparent 75%, transparent 100%)',
                backgroundSize: '400% 100%',
                animation: 'borderFlow 3s linear infinite'
              }}></div>

              {/* 중간 후광 - 양옆으로 넓게 */}
              <div className="absolute rounded-xl blur-2xl opacity-90 pointer-events-none" style={{
                left: '-50px',
                right: '-50px',
                top: '-15px',
                bottom: '-15px',
                background: isBeforeStart
                  ? 'linear-gradient(90deg, transparent 0%, transparent 30%, rgba(156, 163, 175, 0.8) 45%, rgba(209, 213, 219, 1) 50%, rgba(156, 163, 175, 0.8) 55%, transparent 70%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, transparent 30%, rgba(239, 68, 68, 0.8) 45%, rgba(252, 165, 165, 1) 50%, rgba(239, 68, 68, 0.8) 55%, transparent 70%, transparent 100%)',
                backgroundSize: '400% 100%',
                animation: 'borderFlow 3s linear infinite'
              }}></div>

              {/* 메인 테두리 - 4px */}
              <div className="absolute inset-0 rounded-xl p-[4px]" style={{
                background: isBeforeStart
                  ? 'linear-gradient(90deg, #1a1a1a 0%, #374151 20%, #4b5563 35%, #6b7280 45%, #9ca3af 48%, #d1d5db 50%, #9ca3af 52%, #6b7280 55%, #4b5563 65%, #374151 80%, #1a1a1a 100%)'
                  : 'linear-gradient(90deg, #1a1a1a 0%, #7f1d1d 20%, #b91c1c 35%, #dc2626 45%, #ef4444 48%, #fca5a5 50%, #ef4444 52%, #dc2626 55%, #b91c1c 65%, #7f1d1d 80%, #1a1a1a 100%)',
                backgroundSize: '400% 100%',
                animation: 'borderFlow 3s linear infinite'
              }}></div>

              {/* 다이아몬드 반짝임 */}
              <div className="absolute inset-[3px] rounded-lg pointer-events-none overflow-hidden">
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.15) 47%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.15) 53%, transparent 60%, transparent 100%)',
                  backgroundSize: '400% 100%',
                  animation: 'borderFlow 3s linear infinite'
                }}></div>
              </div>
            </>
          )}

          {/* 테두리 후광 효과 - 고급스럽고 온화한 빛 */}
          <div className={`absolute -inset-[2px] rounded-lg blur-lg pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${
            isBeforeStart
              ? 'bg-gradient-to-r from-gray-500/30 via-gray-400/45 to-gray-500/30 opacity-100 group-hover:opacity-0'
              : 'bg-gradient-to-r from-red-600/30 via-red-500/45 to-red-600/30 opacity-100 group-hover:opacity-0'
          }`}></div>
          <div className={`absolute -inset-[2px] rounded-lg blur-lg pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${
            isBeforeStart
              ? 'bg-gradient-to-r from-gray-400/45 via-gray-300/60 to-gray-400/45 opacity-0 group-hover:opacity-100'
              : 'bg-gradient-to-r from-red-500/45 via-red-400/60 to-red-500/45 opacity-0 group-hover:opacity-100'
          }`}></div>
          <div className={`absolute -inset-[1px] rounded-lg blur-md pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${
            isBeforeStart
              ? 'bg-gradient-to-r from-gray-500/40 via-gray-400/55 to-gray-500/40 opacity-100 group-hover:opacity-0'
              : 'bg-gradient-to-r from-red-600/40 via-red-500/55 to-red-600/40 opacity-100 group-hover:opacity-0'
          }`}></div>
          <div className={`absolute -inset-[1px] rounded-lg blur-md pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${
            isBeforeStart
              ? 'bg-gradient-to-r from-gray-400/55 via-gray-300/70 to-gray-400/55 opacity-0 group-hover:opacity-100'
              : 'bg-gradient-to-r from-red-500/55 via-red-400/70 to-red-500/55 opacity-0 group-hover:opacity-100'
          }`}></div>

          <div className={`relative text-center py-6 rounded-lg transition-all duration-500 overflow-hidden backdrop-blur-sm border-2 ${
            countdown.urgencyLevel === 'critical' && !isBeforeStart
              ? 'bg-gradient-to-br from-red-950/50 via-black to-red-950/50 shadow-2xl shadow-red-900/70 border-red-800 group-hover:from-red-950/60 group-hover:via-black group-hover:to-red-950/60 group-hover:shadow-red-900/80 group-hover:border-red-700' :
            countdown.urgencyLevel === 'warning' && !isBeforeStart
              ? 'bg-gradient-to-br from-red-950/40 via-black to-red-950/40 shadow-xl shadow-red-900/50 border-red-900 group-hover:from-red-950/50 group-hover:via-black group-hover:to-red-950/50 group-hover:shadow-red-900/60 group-hover:border-red-800' :
            isActive
              ? 'bg-gradient-to-br from-gray-950 via-black to-gray-950 shadow-xl shadow-red-900/30 border-red-950 group-hover:from-red-950/30 group-hover:via-black group-hover:to-red-950/30 group-hover:shadow-red-900/50 group-hover:border-red-900' :
            isBeforeStart
              ? 'bg-gradient-to-br from-gray-950 via-black to-gray-950 shadow-xl shadow-gray-500/20 border-gray-700 group-hover:from-gray-900 group-hover:via-black group-hover:to-gray-900 group-hover:shadow-gray-500/30 group-hover:border-gray-600' :
              'bg-gradient-to-br from-gray-950 via-black to-gray-950 shadow-xl border-gray-800 group-hover:border-gray-700 group-hover:from-gray-900 group-hover:via-black group-hover:to-gray-900 group-hover:shadow-gray-900/50'
          }`}>
          {/* 상단 실시간 라인 - ACTIVE일 때만 */}
          {isActive && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
          )}

          {/* 상단 레이블 - 경매 시작 가격 */}
          <div className="mb-4 flex items-center justify-center gap-2.5">
            {isActive && !isCompleted && countdown.urgencyLevel !== 'critical' && countdown.urgencyLevel !== 'warning' && (
              <div className="relative w-3 h-3">
                {/* 5단계 부드러운 파동 효과 */}
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50"></div>
                <div className="absolute -inset-1 rounded-full bg-red-500/40 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -inset-2 rounded-full bg-red-500/30 animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute -inset-4 rounded-full bg-red-500/10 animate-ping" style={{ animationDelay: '2s' }}></div>

                {/* 중앙 코어 - 밝게 빛나는 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-lg shadow-red-500/80 animate-pulse"></div>

                {/* 중심 하이라이트 */}
                <div className="absolute inset-[30%] rounded-full bg-white/75 blur-[0.5px]"></div>
              </div>
            )}
            <div className="text-sm font-bold text-gray-400 tracking-[0.15em]">
              경매 시작 가격
            </div>
          </div>

          {/* 가격 - 더 크고 강렬하게 */}
          <div className={`text-4xl font-black transition-all duration-500 tracking-tight mb-2 ${
            countdown.urgencyLevel === 'critical' && !isBeforeStart ? 'text-red-500 animate-pulse scale-110 group-hover:text-red-400 group-hover:scale-115' :
            countdown.urgencyLevel === 'warning' && !isBeforeStart ? 'text-red-400 scale-105 group-hover:text-red-300 group-hover:scale-110' :
            isActive ? 'text-red-400 group-hover:text-red-300 group-hover:scale-110' :
            isBeforeStart ? 'text-gray-300 group-hover:text-gray-200 group-hover:scale-110' :
            'text-gray-300 group-hover:text-red-400 group-hover:scale-110'
          }`}>
            {formatPrice(auction.currentPrice)}
          </div>

          {/* 긴급 글로우 */}
          {countdown.urgencyLevel === 'critical' && (
            <>
              <div className="absolute inset-0 rounded-xl bg-red-500/10 animate-pulse pointer-events-none"></div>
              <div className="absolute inset-0 rounded-xl border-2 border-red-500/40 animate-ping pointer-events-none"></div>
            </>
          )}
          </div>
        </div>

        {/* 시간 표시 - 시작까지/종료까지 */}
        <div className={`relative z-10 text-sm rounded-lg border-[3px] transition-all duration-300 overflow-hidden ${
          !timeRemaining.isCompleted ? 'group-hover:animate-blink2' : ''
        } ${timeRemaining.bgColor} ${
          timeRemaining.isBeforeStart
            ? 'border-gray-500 group-hover:border-gray-400'
            : timeRemaining.isCompleted
            ? 'border-red-700 shadow-xl shadow-red-900/60'
            : countdown.urgencyLevel === 'critical' ? 'border-red-500 shadow-lg shadow-red-900/50 group-hover:border-red-400' :
              countdown.urgencyLevel === 'warning' ? 'border-red-600 group-hover:border-red-500' :
              'border-red-700 group-hover:border-red-600'
        }`}>
          {/* 경매 종료 시 폴리스 라인 애니메이션 - 전체 채우기 */}
          {timeRemaining.isCompleted ? (
            <div className="relative h-full py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="flex items-center animate-policeLine">
                  {[...Array(30)].map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="flex-shrink-0 bg-black text-red-400 font-black text-sm px-6 py-3 border-y-2 border-red-500 whitespace-nowrap tracking-wider shadow-lg">
                        ⚠ 경매 마감 ⚠
                      </div>
                      <div className="flex-shrink-0 bg-red-600 text-white font-black text-sm px-6 py-3 border-y-2 border-red-800 whitespace-nowrap tracking-wider shadow-lg">
                        ⚠ 경매 마감 ⚠
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${
                  timeRemaining.isBeforeStart ? 'text-gray-400' :
                  countdown.urgencyLevel === 'critical' ? 'text-red-500' :
                  countdown.urgencyLevel === 'warning' ? 'text-red-400' :
                  'text-red-500'
                }`} />
                <span className={`font-bold ${timeRemaining.color}`}>{timeRemaining.label}</span>
              </div>
              <div className={`font-mono font-bold text-base ${timeRemaining.color} ${
                countdown.urgencyLevel === 'critical' ? 'animate-pulse' : ''
              }`}>
                {timeRemaining.value || timeRemaining.label}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};