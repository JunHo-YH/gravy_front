import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getAuctionDetail } from '../services/api';
import { AuctionDetailResponse, AuctionStatus, CATEGORY_DISPLAY_NAMES, Category } from '../types/auction';
import { Clock, Eye, Gavel, User, ArrowLeft, TrendingUp, Package } from 'lucide-react';
import { usePriceCountUp } from '../hooks/usePriceCountUp';

// Mock 데이터
const createMockAuction = (auctionId: string): AuctionDetailResponse => {
  const now = new Date();
  const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2시간 후

  return {
    auctionPublicId: auctionId,
    title: '삼성 갤럭시 S24 Ultra 256GB - 미개봉 새제품',
    description: `✨ 완전 새제품 미개봉 상태입니다!

📱 상품 정보:
- 제조사: 삼성전자
- 모델명: 갤럭시 S24 Ultra
- 용량: 256GB
- 색상: 티타늄 그레이
- 상태: 미개봉 새제품 (정품 필름 포함)

📦 구성품:
- 본체
- 정품 충전기
- USB 케이블
- S펜
- 이어폰 (미포함)
- 사용 설명서

🎁 특이사항:
- 2024년 4월 출시 최신 모델
- 공식 AS 가능 (1년 무상 보증)
- 개통 이력 없음
- IMEI 확인 가능

💎 상태: 10/10 완벽
🚚 배송: 무료 (택배 안전 포장)
💳 결제: 경매 낙찰 후 즉시 거래`,
    category: Category.DIGITAL_DEVICE,
    startingPrice: 850000,
    currentPrice: 1250000,
    buyNowPrice: 1500000,
    status: AuctionStatus.ACTIVE,
    auctionStartTime: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전 시작
    auctionEndTime: endTime.toISOString(),
    bidCount: 23,
    viewCount: 487,
    sellerNickname: '믿을만한셀러',
    sellerPublicId: 'seller-123',
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now.toISOString(),
    imageUrls: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1592286927505-c0d8c1b90417?w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'
    ]
  };
};

interface BidHistory {
  bidderNickname: string;
  bidAmount: number;
  bidTime: string;
  isNew?: boolean;
}

export const AuctionDetailPage: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<AuctionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  // 입찰 관련 상태
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidHistory, setBidHistory] = useState<BidHistory[]>([]);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [priceAnimation, setPriceAnimation] = useState(false);

  // 가격 카운트업 애니메이션
  const animatedPrice = usePriceCountUp(auction?.currentPrice || 0, 600);

  // 입찰 카드 애니메이션 상태
  const [cardsLoaded, setCardsLoaded] = useState(false);

  useEffect(() => {
    if (bidHistory.length > 0) {
      // 약간의 지연 후 애니메이션 시작
      const timer = setTimeout(() => {
        setCardsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [bidHistory.length]);

  // 경매 상세 정보 조회
  useEffect(() => {
    const fetchAuctionDetail = async () => {
      if (!auctionId) {
        setError('경매 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // API 호출 시도, 실패하면 Mock 데이터 사용
        try {
          const data = await getAuctionDetail(auctionId);
          setAuction(data);
          setError(null);
        } catch (apiError) {
          console.warn('API 호출 실패, Mock 데이터 사용:', apiError);
          // Mock 데이터 사용
          const mockData = createMockAuction(auctionId);
          setAuction(mockData);
          setError(null);
        }
      } catch (err) {
        setError('경매 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetail();
  }, [auctionId]);

  // 초기 입찰 내역 생성 (Mock) - 대폭 증가
  useEffect(() => {
    if (!auction) return;

    const mockBidHistory: BidHistory[] = [
      { bidderNickname: 'user***', bidAmount: auction.currentPrice, bidTime: new Date().toISOString() },
      { bidderNickname: 'buyer***', bidAmount: auction.currentPrice - 10000, bidTime: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
      { bidderNickname: 'auc***', bidAmount: auction.currentPrice - 20000, bidTime: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
      { bidderNickname: 'top***', bidAmount: auction.currentPrice - 30000, bidTime: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
      { bidderNickname: 'best***', bidAmount: auction.currentPrice - 40000, bidTime: new Date(Date.now() - 12 * 60 * 1000).toISOString() },
      { bidderNickname: 'pro***', bidAmount: auction.currentPrice - 50000, bidTime: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
      { bidderNickname: 'king***', bidAmount: auction.currentPrice - 60000, bidTime: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
      { bidderNickname: 'win***', bidAmount: auction.currentPrice - 70000, bidTime: new Date(Date.now() - 32 * 60 * 1000).toISOString() },
      { bidderNickname: 'bid***', bidAmount: auction.currentPrice - 80000, bidTime: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
      { bidderNickname: 'ace***', bidAmount: auction.currentPrice - 90000, bidTime: new Date(Date.now() - 48 * 60 * 1000).toISOString() },
      { bidderNickname: 'max***', bidAmount: auction.currentPrice - 100000, bidTime: new Date(Date.now() - 55 * 60 * 1000).toISOString() },
      { bidderNickname: 'star***', bidAmount: auction.currentPrice - 110000, bidTime: new Date(Date.now() - 62 * 60 * 1000).toISOString() },
      { bidderNickname: 'vip***', bidAmount: auction.currentPrice - 120000, bidTime: new Date(Date.now() - 70 * 60 * 1000).toISOString() },
      { bidderNickname: 'gold***', bidAmount: auction.currentPrice - 130000, bidTime: new Date(Date.now() - 78 * 60 * 1000).toISOString() },
      { bidderNickname: 'lucky***', bidAmount: auction.currentPrice - 140000, bidTime: new Date(Date.now() - 85 * 60 * 1000).toISOString() },
      { bidderNickname: 'smart***', bidAmount: auction.currentPrice - 150000, bidTime: new Date(Date.now() - 92 * 60 * 1000).toISOString() },
      { bidderNickname: 'super***', bidAmount: auction.currentPrice - 160000, bidTime: new Date(Date.now() - 100 * 60 * 1000).toISOString() },
      { bidderNickname: 'mega***', bidAmount: auction.currentPrice - 170000, bidTime: new Date(Date.now() - 108 * 60 * 1000).toISOString() },
      { bidderNickname: 'ultra***', bidAmount: auction.currentPrice - 180000, bidTime: new Date(Date.now() - 115 * 60 * 1000).toISOString() },
      { bidderNickname: 'power***', bidAmount: auction.currentPrice - 190000, bidTime: new Date(Date.now() - 122 * 60 * 1000).toISOString() },
    ];
    setBidHistory(mockBidHistory);
  }, [auction]);

  // 실시간 카운트다운
  useEffect(() => {
    if (!auction) return;

    const calculateCountdown = () => {
      const end = new Date(auction.auctionEndTime);
      const now = new Date();
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setCountdown({ hours, minutes, seconds, isExpired: false });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  // 입찰 함수
  const handleBid = (amount?: number) => {
    if (!auction) return;

    const finalAmount = amount || parseInt(bidAmount.replace(/,/g, ''));

    if (finalAmount <= auction.currentPrice) {
      alert('현재가보다 높은 금액을 입찰해주세요!');
      return;
    }

    setIsSubmittingBid(true);

    // Mock 입찰 처리
    setTimeout(() => {
      const newBid: BidHistory = {
        bidderNickname: '내입찰',
        bidAmount: finalAmount,
        bidTime: new Date().toISOString(),
        isNew: true
      };

      // 입찰 내역에 추가
      setBidHistory(prev => [newBid, ...prev.slice(0, 4)]);

      // 현재가 업데이트
      setAuction(prev => prev ? { ...prev, currentPrice: finalAmount, bidCount: prev.bidCount + 1 } : null);

      // 가격 변동 애니메이션
      setPriceAnimation(true);
      setTimeout(() => setPriceAnimation(false), 600);

      // 새 입찰 플래그 제거
      setTimeout(() => {
        setBidHistory(prev => prev.map(bid => ({ ...bid, isNew: false })));
      }, 2000);

      setIsSubmittingBid(false);
      setShowBidModal(false);
      setBidAmount('');
    }, 800);
  };

  // 빠른 입찰 금액 계산
  const getQuickBidAmount = (increment: number) => {
    return auction ? auction.currentPrice + increment : 0;
  };

  // 입찰 모달 열기
  const openBidModal = () => {
    if (!auction) return;
    setBidAmount((auction.currentPrice + 10000).toLocaleString());
    setShowBidModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">{error || '경매를 찾을 수 없습니다.'}</p>
            <button
              onClick={() => navigate('/auctions')}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
            >
              경매 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isActive = auction.status === AuctionStatus.ACTIVE || auction.status === AuctionStatus.ONGOING;
  const isCompleted = auction.status === AuctionStatus.COMPLETED || auction.status === AuctionStatus.ENDED;
  const isCritical = !countdown.isExpired && countdown.hours === 0 && countdown.minutes < 3;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const images = auction.imageUrls && auction.imageUrls.length > 0 ? auction.imageUrls : [auction.imageUrls?.[0] || ''];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">돌아가기</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 이미지 갤러리 */}
          <div className="flex flex-col gap-4">
            {/* 메인 이미지 */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border-4 border-gray-800 group">
              {images[selectedImageIndex] ? (
                <img
                  src={images[selectedImageIndex]}
                  alt={`${auction.title} - ${selectedImageIndex + 1}`}
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    isCompleted ? 'grayscale blur-[2px] opacity-40' : 'group-hover:scale-105'
                  }`}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                  <Package className="w-32 h-32 text-gray-700" />
                </div>
              )}

              {/* LIVE 표시 */}
              {isActive && !isCompleted && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-950 to-red-900 border border-red-700 rounded-full animate-pulse">
                  <div className="relative w-2 h-2">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-red-400 font-black uppercase tracking-wider">LIVE NOW</span>
                </div>
              )}

              {/* SOLD 도장 */}
              {isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="relative">
                    <div className="relative w-40 h-40 rounded-full border-[12px] border-red-700 bg-gradient-to-br from-red-950/90 via-red-900/70 to-red-950/90 backdrop-blur-sm shadow-2xl shadow-red-900/90">
                      <div className="absolute inset-2 rounded-full border-[8px] border-red-600/90 shadow-inner shadow-red-950"></div>
                      <div className="absolute inset-4 rounded-full border-[4px] border-red-500/70"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl font-black text-red-500 drop-shadow-2xl">SOLD</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 썸네일 이미지 목록 */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    onMouseEnter={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? 'border-red-600 shadow-lg shadow-red-900/50 scale-105'
                        : 'border-gray-700 hover:border-red-800 hover:shadow-md hover:shadow-red-900/30'
                    }`}
                  >
                    {image ? (
                      <img src={image} alt={`thumbnail-${index}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-700" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* 실시간 경쟁 현황 - 콤팩트 */}
            {isActive && (
              <div className="bg-gradient-to-br from-red-950/20 via-black to-gray-950 border-2 border-red-900/40 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {/* 참여자 수 */}
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="relative w-1.5 h-1.5">
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-500">참여자</span>
                    </div>
                    <div className="text-lg font-black text-red-400">
                      {Math.max(5, Math.floor(auction.viewCount / 10))}명
                    </div>
                  </div>

                  {/* 입찰 횟수 */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">입찰</div>
                    <div className="text-lg font-black text-white">
                      {auction.bidCount}회
                    </div>
                  </div>

                  {/* 최근 입찰 */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">최근</div>
                    <div className="text-xs font-bold text-red-400">
                      {bidHistory.length > 0 ? (() => {
                        const lastBidTime = new Date(bidHistory[0].bidTime);
                        const diffSeconds = Math.floor((Date.now() - lastBidTime.getTime()) / 1000);
                        if (diffSeconds < 10) return '방금 전';
                        if (diffSeconds < 60) return `${diffSeconds}초 전`;
                        return `${Math.floor(diffSeconds / 60)}분 전`;
                      })() : '-'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 경매 정보 */}
          <div className="flex flex-col gap-4">
            {/* 상단 정보 그룹 */}
            <div className="flex flex-col gap-4">
              {/* 카테고리 */}
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 rounded-lg self-start">
                <span className="text-sm text-gray-300 font-bold uppercase tracking-wide">
                  {CATEGORY_DISPLAY_NAMES[auction.category as Category] || auction.category}
                </span>
              </div>

              {/* 제목 */}
              <h1 className="text-4xl font-black text-white leading-tight">{auction.title}</h1>
            </div>

            {/* 현재가 박스 */}
            <div className="relative rounded-2xl border-4 border-red-800 bg-gradient-to-br from-gray-950 via-black to-red-950/30 p-8 shadow-2xl shadow-red-900/50">
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
              )}

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 tracking-widest">
                  {isActive && (
                    <div className="relative w-3 h-3">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                  <span className="font-bold">현재 입찰가</span>
                </div>
                <div className={`text-5xl font-black transition-all duration-300 ${
                  priceAnimation ? 'scale-110' : ''
                } ${
                  isCritical ? 'text-red-500 animate-pulse' : isActive ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {formatPrice(animatedPrice)}
                </div>
                <div className="text-sm text-gray-500">
                  시작가: {formatPrice(auction.startingPrice)}
                </div>
              </div>

              {/* 가격 상승 애니메이션 */}
              {priceAnimation && (
                <div className="absolute inset-0 rounded-2xl border-4 border-red-500 animate-ping pointer-events-none"></div>
              )}
            </div>

            {/* 카운트다운 */}
            <div className={`rounded-xl border-4 p-6 transition-all duration-300 ${
              isCompleted
                ? 'border-red-700 bg-red-950/30'
                : isCritical
                ? 'border-red-500 bg-red-950/50 shadow-lg shadow-red-900/50 animate-pulse'
                : isActive
                ? 'border-red-800 bg-red-950/30'
                : 'border-gray-700 bg-gray-950'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className={`w-6 h-6 ${isCritical ? 'text-red-500' : isActive ? 'text-red-400' : 'text-gray-400'}`} />
                  <span className={`font-bold ${isCritical ? 'text-red-500' : isActive ? 'text-red-400' : 'text-gray-400'}`}>
                    {isCompleted ? '경매 종료' : '종료까지'}
                  </span>
                </div>
                {!isCompleted && (
                  <div className={`font-mono text-2xl font-black ${isCritical ? 'text-red-500 animate-pulse' : 'text-red-400'}`}>
                    {countdown.hours}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>

            {/* 통계 정보 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-xl p-4 text-center">
                <Gavel className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{auction.bidCount}</div>
                <div className="text-xs text-gray-400 mt-1">입찰</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-xl p-4 text-center">
                <Eye className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{auction.viewCount}</div>
                <div className="text-xs text-gray-400 mt-1">조회</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-xl p-4 text-center">
                <TrendingUp className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{auction.bidCount > 0 ? Math.round((auction.currentPrice / auction.startingPrice - 1) * 100) : 0}%</div>
                <div className="text-xs text-gray-400 mt-1">상승률</div>
              </div>
            </div>

            {/* 빠른 입찰 버튼 */}
            {!isCompleted && (
              <div className="space-y-3 mt-auto">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleBid(getQuickBidAmount(10000))}
                    disabled={isSubmittingBid}
                    className="py-3 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 text-white rounded-lg font-bold hover:border-red-600 hover:from-red-950/50 hover:to-gray-900 transition-all duration-300"
                  >
                    +1만원
                  </button>
                  <button
                    onClick={() => handleBid(getQuickBidAmount(50000))}
                    disabled={isSubmittingBid}
                    className="py-3 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 text-white rounded-lg font-bold hover:border-red-600 hover:from-red-950/50 hover:to-gray-900 transition-all duration-300"
                  >
                    +5만원
                  </button>
                  <button
                    onClick={() => handleBid(getQuickBidAmount(100000))}
                    disabled={isSubmittingBid}
                    className="py-3 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 text-white rounded-lg font-bold hover:border-red-600 hover:from-red-950/50 hover:to-gray-900 transition-all duration-300"
                  >
                    +10만원
                  </button>
                </div>

                <button
                  onClick={openBidModal}
                  disabled={isSubmittingBid}
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 ${
                    isCritical
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-900/50 animate-pulse'
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-900/50'
                  }`}
                >
                  {isSubmittingBid ? '입찰 중...' : isCritical ? '🔥 지금 입찰하기!' : '💰 직접 입찰하기'}
                </button>
              </div>
            )}


            {/* 판매자 정보 */}
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-xl p-4">
              <div className="grid grid-cols-1 gap-3 text-center">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">판매자</span>
                  </div>
                  <div className="text-lg font-black text-white">{auction.sellerNickname}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 상품 설명 & 입찰 내역 - 나란히 동일 높이 */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 상품 설명 */}
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-2xl p-8 flex flex-col h-[600px]">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2 flex-shrink-0">
              <Package className="w-6 h-6 text-red-400" />
              상품 설명
            </h2>
            <div className="description-scroll text-gray-300 leading-relaxed whitespace-pre-wrap overflow-y-auto flex-1 pr-2">
              {auction.description}
            </div>
          </div>

          {/* 오른쪽: 입찰 내역 */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-2xl p-6 flex flex-col h-[600px] overflow-hidden">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Gavel className="w-5 h-5 text-red-400" />
                입찰 내역
              </h3>
              <div className="text-xs text-gray-400 bg-gray-900/50 px-3 py-1 rounded-full">
                최근 {bidHistory.length}건
              </div>
            </div>

            <div className="bid-history-scroll overflow-y-auto flex-1 pr-2">
              <div className="space-y-3">
                {bidHistory.length > 0 ? (
                  bidHistory.map((bid, index) => (
                    <div
                      key={index}
                      className={`${cardsLoaded ? 'bid-card-enter' : ''} relative flex justify-between items-center p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/50 hover:border-red-600 hover:z-10 cursor-pointer ${
                        bid.isNew
                          ? 'bg-gradient-to-r from-red-950/90 to-red-900/60 border-2 border-red-500 scale-[1.02] shadow-lg shadow-red-900/50'
                          : index === 0
                          ? 'bg-gradient-to-r from-red-950/40 to-gray-900/50 border-2 border-red-800/50'
                          : 'bg-gray-800/30 border border-gray-700/50'
                      }`}
                      style={{
                        animationDelay: cardsLoaded ? `${index * 0.15}s` : '0s',
                        opacity: cardsLoaded ? undefined : 0,
                        visibility: cardsLoaded ? undefined : 'hidden'
                      }}
                    >
                      {/* 새 입찰 효과 */}
                      {bid.isNew && (
                        <>
                          <div className="absolute inset-0 rounded-xl border-2 border-red-400 animate-ping pointer-events-none"></div>
                          <div className="absolute top-2 right-2">
                            <span className="text-xs font-black text-red-400 bg-red-950 px-2 py-1 rounded-full animate-pulse">
                              NEW!
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                            bid.isNew
                              ? 'bg-gradient-to-br from-red-600 to-red-700 text-white animate-pulse'
                              : index === 0
                              ? 'bg-gradient-to-br from-red-700 to-red-800 text-white'
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          {bid.isNew && (
                            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`font-bold block ${
                            bid.isNew ? 'text-red-300' : index === 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {bid.bidderNickname}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(bid.bidTime).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-black transition-all duration-300 ${
                          bid.isNew ? 'text-red-400 text-xl' : index === 0 ? 'text-white text-lg' : 'text-gray-300'
                        }`}>
                          {formatPrice(bid.bidAmount)}
                        </div>
                        {index === 0 && !bid.isNew && (
                          <div className="text-xs text-red-500 font-bold">최고가</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>아직 입찰 내역이 없습니다</p>
                    <p className="text-sm mt-1">첫 입찰자가 되어보세요!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 입찰 독려 메시지 */}
        {!isCompleted && isCritical && (
          <div className="mt-6 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-2 border-red-600 rounded-2xl p-6 animate-pulse">
            <div className="text-center">
              <div className="text-3xl mb-2">🔥</div>
              <h4 className="text-xl font-black text-red-400 mb-2">마감 임박!</h4>
              <p className="text-gray-300 text-sm">
                지금 입찰하지 않으면 놓칠 수 있습니다!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 입찰 모달 */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-red-800 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-red-900/50 animate-in fade-in zoom-in duration-300">
            {/* 헤더 */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-white mb-2">입찰하기</h3>
              <p className="text-gray-400">원하시는 금액을 입력해주세요</p>
            </div>

            {/* 현재가 표시 */}
            <div className="bg-gray-950/50 border-2 border-gray-700 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-400 mb-1">현재가</div>
              <div className="text-2xl font-black text-red-400">{formatPrice(auction.currentPrice)}</div>
            </div>

            {/* 입찰 금액 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-400 mb-2">입찰 금액</label>
              <div className="relative">
                <input
                  type="text"
                  value={bidAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setBidAmount(Number(value).toLocaleString());
                  }}
                  className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white text-xl font-bold focus:border-red-600 focus:outline-none transition-colors duration-300"
                  placeholder="금액 입력"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">원</span>
              </div>
              {parseInt(bidAmount.replace(/,/g, '')) <= auction.currentPrice && (
                <p className="text-red-400 text-sm mt-2">현재가보다 높은 금액을 입력해주세요</p>
              )}
            </div>

            {/* 빠른 금액 선택 */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[10000, 50000, 100000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBidAmount((auction.currentPrice + amount).toLocaleString())}
                  className="py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-bold hover:border-red-600 hover:bg-red-950/30 transition-all duration-300"
                >
                  +{(amount / 10000).toFixed(0)}만원
                </button>
              ))}
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBidModal(false)}
                className="flex-1 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl font-bold hover:border-gray-600 transition-all duration-300"
              >
                취소
              </button>
              <button
                onClick={() => handleBid()}
                disabled={isSubmittingBid || parseInt(bidAmount.replace(/,/g, '')) <= auction.currentPrice}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-red-900/50"
              >
                {isSubmittingBid ? '입찰 중...' : '입찰하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
