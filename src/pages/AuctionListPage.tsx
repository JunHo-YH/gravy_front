import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel } from 'lucide-react';
import { AuctionList } from '../components/auction/AuctionList';
import { Header } from '../components/common/Header';

export const AuctionListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAuctionClick = (auctionId: string | number) => {
    navigate(`/auctions/${auctionId}`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* 공통 헤더 */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 페이지 타이틀 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gavel className="w-9 h-9 text-red-500" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              경매 목록
            </h1>
          </div>
          <p className="text-gray-400">실시간으로 진행되는 경매를 확인하세요</p>
        </div>

        {/* 경매 목록 */}
        <AuctionList onAuctionClick={handleAuctionClick} />
      </div>
    </div>
  );
};
