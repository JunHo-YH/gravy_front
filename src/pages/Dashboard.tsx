import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Gavel, TrendingUp, Users, Clock, TestTube, ArrowLeft, Plus, Search } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { NotificationSection } from '../components/common/NotificationSection';
import { ChatBotButton } from '../components/common/ChatBotButton';
import { ChatBotModal } from '../components/common/ChatBotModal';
import { AuctionList } from '../components/auction/AuctionList';
import { AuctionRegister } from '../components/auction/AuctionRegister';
import { AuctionDetail } from '../components/auction/AuctionDetail';
import { useCountUp } from '../hooks/useCountUp';
import { testAuthToken, sendChatMessage } from '../services/api';
import { AuctionRegisterResponse } from '../types/auction';

type DashboardView = 'main' | 'auctions' | 'register' | 'detail';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<DashboardView>('main');
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);

  // 대시보드 통계 애니메이션
  const activeAuctions = useCountUp(24, { duration: 1800 });
  const myBids = useCountUp(7, { duration: 2200 });
  const onlineUsers = useCountUp(1247, { duration: 2500 });
  const deadlineSoon = useCountUp(3, { duration: 1500 });
  
  const handleTestClick = async () => {
    setIsTestLoading(true);
    try {
      await testAuthToken();
      alert('✅ 토큰 전달 테스트 성공!');
    } catch (error) {
      console.error('테스트 에러:', error);
      alert('❌ 토큰 전달 테스트 실패: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleChatSendMessage = async (message: string): Promise<string> => {
    try {
      return await sendChatMessage(message);
    } catch (error) {
      console.error('챗봇 메시지 전송 에러:', error);
      throw error;
    }
  };

  const handleAuctionRegisterSuccess = (auction: AuctionRegisterResponse) => {
    alert(`경매가 성공적으로 등록되었습니다!\n경매 ID: ${auction.auctionPublicId}`);
    setCurrentView('auctions');
  };

  const handleAuctionClick = (auctionId: string) => {
    setSelectedAuctionId(auctionId);
    setCurrentView('detail');
  };

  const renderHeader = () => {
    const getHeaderTitle = () => {
      switch (currentView) {
        case 'auctions': return '경매 목록';
        case 'register': return '경매 등록';
        case 'detail': return '경매 상세';
        default: return '대시보드';
      }
    };

    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer">
                  Gravy
                </h1>
              </Link>
              <span className="text-gray-400">|</span>
              {currentView !== 'main' ? (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView('main')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    대시보드
                  </Button>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-700">{getHeaderTitle()}</span>
                </div>
              ) : (
                <span className="text-gray-600">실시간 경매 거래</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">환영합니다, {user?.nickname}님!</span>
              <Button 
                variant="outline" 
                onClick={handleTestClick} 
                size="sm"
                loading={isTestLoading}
              >
                <TestTube className="w-4 h-4 mr-2" />
                API 테스트
              </Button>
              <Button variant="outline" onClick={() => logout()} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderMainDashboard = () => (
    <>
      {/* 대시보드 섹션 */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h2>
        <p className="text-gray-600">실시간 경매 현황을 확인하고 거래에 참여해보세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">진행중인 경매</h3>
          <p className="text-3xl font-bold text-yellow-600">{activeAuctions}</p>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">내 입찰</h3>
          <p className="text-3xl font-bold text-green-600">{myBids}</p>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">참여자</h3>
          <p className="text-3xl font-bold text-blue-600">{onlineUsers}</p>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">마감 임박</h3>
          <p className="text-3xl font-bold text-purple-600">{deadlineSoon}</p>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">빠른 시작</h3>
          <div className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setCurrentView('register')}
            >
              <Plus className="w-5 h-5 mr-3" />
              새 경매 등록하기
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setCurrentView('auctions')}
            >
              <Search className="w-5 h-5 mr-3" />
              경매 목록 보기
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="w-5 h-5 mr-3" />
              내 거래 내역 보기
            </Button>
          </div>
        </Card>

        <Card>
          <NotificationSection />
        </Card>
      </div>

      {/* 개발 진행 상황 */}
      <Card className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="py-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">🎉 경매 시스템 구현 완료!</h3>
          <p className="text-gray-600 mb-4">
            경매 등록, 목록 조회, 상세 조회 기능이 준비되었습니다.<br />
            위의 버튼을 클릭하여 경매 기능을 사용해보세요.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              인증 시스템 완료
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              경매 시스템 완료
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              채팅 시스템 개발중
            </span>
          </div>
        </div>
      </Card>
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'auctions':
        return (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">경매 목록</h2>
                <p className="text-gray-600">진행 중인 경매를 확인하고 참여해보세요</p>
              </div>
              <Button onClick={() => setCurrentView('register')}>
                <Plus className="w-4 h-4 mr-2" />
                새 경매 등록
              </Button>
            </div>
            <AuctionList onAuctionClick={handleAuctionClick} />
          </div>
        );
      
      case 'detail':
        return selectedAuctionId ? (
          <AuctionDetail auctionPublicId={selectedAuctionId} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">경매를 찾을 수 없습니다.</p>
          </div>
        );
      
      case 'register':
        return (
          <AuctionRegister 
            onSuccess={handleAuctionRegisterSuccess}
            onCancel={() => setCurrentView('main')}
          />
        );
      
      default:
        return renderMainDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* 헤더 */}
      {renderHeader()}

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* 챗봇 버튼 */}
      <ChatBotButton onClick={() => setIsChatModalOpen(true)} />

      {/* 챗봇 모달 */}
      <ChatBotModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onSendMessage={handleChatSendMessage}
      />
    </div>
  );
};