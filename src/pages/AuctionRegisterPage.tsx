import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuctionRegister } from '../components/auction/AuctionRegister';
import { Header } from '../components/common/Header';

export const AuctionRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    alert('경매가 성공적으로 등록되었습니다!');
    navigate('/auctions');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* 공통 헤더 */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AuctionRegister onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};
