import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { getAuctionList } from '../../services/api';
import { AuctionListResponse, AuctionSummary, AuctionStatus } from '../../types/auction';
import { AuctionCard } from './AuctionCard';

interface AuctionListProps {
  category?: string;
  status?: AuctionStatus;
  searchKeyword?: string;
  onAuctionClick?: (auctionId: string) => void;
}

export const AuctionList: React.FC<AuctionListProps> = ({
  category,
  status,
  searchKeyword,
  onAuctionClick
}) => {
  const [auctions, setAuctions] = useState<AuctionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const pageSize = 20;

  const fetchAuctions = async (page: number = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: AuctionListResponse = await getAuctionList({
        category,
        status,
        searchKeyword,
        page,
        size: pageSize
      });
      
      setAuctions(response.auctions);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : '경매 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions(0);
  }, [category, status, searchKeyword]);

  const handlePageChange = (page: number) => {
    fetchAuctions(page);
  };


  if (loading && auctions.length === 0) {
    return (
      <div className="space-y-8">
        {/* 로딩 상태의 상태 요약 스켈레톤 */}
        <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 p-6 rounded-xl border border-gray-200 animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-8 bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 로딩 카드들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse" padding="none">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
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
      <Card className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchAuctions(currentPage)} variant="outline">
          다시 시도
        </Button>
      </Card>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          {/* 큰 경매 아이콘 */}
          <div className="w-24 h-24 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>
          
          {/* 메시지 */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            아직 등록된 경매가 없어요
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            첫 번째 경매를 등록하고<br />
            실시간 경매의 즐거움을 경험해보세요!
          </p>
          
          {/* 액션 버튼 */}
          <div className="space-y-3">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold"
              onClick={() => {
                // Dashboard의 setCurrentView를 사용하려면 props로 전달받아야 함
                window.location.reload(); // 임시 해결책
              }}
            >
              🔨 새 경매 등록하기
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-2 hover:bg-gray-50"
            >
              📋 다른 카테고리 보기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAuctionClick = (auction: AuctionSummary) => {
    onAuctionClick?.(auction.publicId);
  };

  return (
    <div className="space-y-6">
      {/* 간단한 상태 요약 */}
      <div className="flex justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-600">진행중</span>
              <span className="font-semibold text-gray-900">
                {auctions.filter(a => a.status === AuctionStatus.ACTIVE).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">전체</span>
              <span className="font-semibold text-gray-900">{auctions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 경매 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <AuctionCard 
            key={auction.publicId} 
            auction={auction}
            onClick={() => handleAuctionClick(auction)}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            variant="outline"
            size="sm"
          >
            이전
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={page === currentPage ? 'primary' : 'outline'}
                  size="sm"
                  className="w-10"
                >
                  {page + 1}
                </Button>
              );
            })}
          </div>
          
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
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