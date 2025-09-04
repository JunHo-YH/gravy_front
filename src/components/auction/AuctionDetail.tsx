import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { getAuctionDetail } from '../../services/api';
import { AuctionDetailResponse, AuctionStatus } from '../../types/auction';

interface AuctionDetailProps {
  auctionPublicId: string;
}

export const AuctionDetail: React.FC<AuctionDetailProps> = ({ auctionPublicId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 임시로 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [auctionPublicId]);


  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          다시 시도
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 경매 상세 정보 - 임시 화면 */}
      <Card>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">경매 상세</h1>
          <p className="text-gray-600 mb-4">경매 ID: {auctionPublicId}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">🚧 개발 중</p>
            <p className="text-yellow-700 text-sm mt-1">
              경매 상세 페이지는 현재 개발 중입니다.<br />
              서버 API 연동 후 완성될 예정입니다.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};