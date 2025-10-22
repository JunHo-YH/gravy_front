import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { getAuctionList } from '../../services/api';
import { AuctionListResponse, AuctionSummary, AuctionStatus } from '../../types/auction';
import { AuctionCard } from './AuctionCard';
import { useServerTime } from '../../hooks/useServerTime';

interface AuctionListProps {
  onAuctionClick?: (auctionId: string | number) => void;
}

export const AuctionList: React.FC<AuctionListProps> = ({
  onAuctionClick
}) => {
  const [auctions, setAuctions] = useState<AuctionSummary[]>([]);
  const [serverTime, setServerTime] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 8;
  const { correctedNow } = useServerTime(serverTime);

  const fetchAuctions = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response: AuctionListResponse = await getAuctionList({
        page,
        size: pageSize
      });

      setAuctions(response.auctions);
      setServerTime(response.serverTime);
      setCurrentPage(response.page);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : '경매 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchAuctions(1);
  }, [fetchAuctions]);

  const handlePageChange = (page: number) => {
    fetchAuctions(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / pageSize);


  if (loading && auctions.length === 0) {
    return (
      <div className="space-y-8">
        {/* 로딩 상태의 상태 요약 스켈레톤 */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 rounded-xl border border-gray-800 animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-8 bg-gray-800 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-800 rounded-lg w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 로딩 카드들 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800" padding="none">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-4 bg-gray-800 rounded w-20"></div>
                  <div className="h-6 bg-gray-800 rounded-full w-16"></div>
                </div>
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="h-4 bg-gray-800 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-800 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-12 bg-gradient-to-br from-gray-900 to-black border-2 border-red-900/30">
        <p className="text-red-400 font-bold mb-4">{error}</p>
        <Button onClick={() => fetchAuctions(currentPage)} variant="outline">
          다시 시도
        </Button>
      </Card>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 rounded-2xl p-12 shadow-2xl">
          {/* 큰 경매 아이콘 */}
          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-900/50">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>

          {/* 메시지 */}
          <h3 className="text-xl font-black text-white mb-3">
            아직 등록된 경매가 없어요
          </h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            첫 번째 경매를 등록하고<br />
            실시간 경매의 즐거움을 경험해보세요!
          </p>

          {/* 액션 버튼 */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                window.location.href = '/auctions/register';
              }}
            >
              🔨 새 경매 등록하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
            >
              📋 다른 카테고리 보기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 간단한 상태 요약 */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
              <span className="text-gray-400 font-bold uppercase tracking-wider">진행중</span>
              <span className="font-black text-red-500">
                {auctions.filter(a =>
                  a.status === AuctionStatus.ACTIVE || a.status === AuctionStatus.ONGOING
                ).length}
              </span>
            </div>
            <div className="w-px h-6 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-gray-600 rounded-full"></div>
              <span className="text-gray-400 font-bold uppercase tracking-wider">전체</span>
              <span className="font-black text-gray-300">{totalCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 경매 카드들 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {auctions.map((auction) => (
          <AuctionCard
            key={auction.id}
            auction={auction}
            correctedNow={correctedNow}
            onClick={() => onAuctionClick?.(auction.auctionPublicId || auction.id)}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            이전
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={page === currentPage ? 'primary' : 'outline'}
                  size="sm"
                  className="w-10"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            variant="outline"
            size="sm"
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
};