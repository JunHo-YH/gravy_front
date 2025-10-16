import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, TrendingUp, Users, Clock, Plus, Search } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { NotificationSection } from '../components/common/NotificationSection';
import { ChatBotButton } from '../components/common/ChatBotButton';
import { ChatBotModal } from '../components/common/ChatBotModal';
import { Header } from '../components/common/Header';
import { useCountUp } from '../hooks/useCountUp';
import { testAuthToken, sendChatMessage } from '../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

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

  const renderMainDashboard = () => (
    <>
      {/* 대시보드 섹션 */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">대시보드</h2>
        <p className="text-sm sm:text-base text-gray-400">실시간 경매 현황을 확인하고 거래에 참여해보세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card className="text-center bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-red-900/30 hover:border-red-900/50 transition-all duration-300 shadow-2xl p-4 sm:p-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg shadow-red-900/50">
            <Gavel className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-400 mb-1 sm:mb-2 uppercase tracking-wider">진행중인 경매</h3>
          <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">{activeAuctions}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-2xl p-4 sm:p-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-400 mb-1 sm:mb-2 uppercase tracking-wider">내 입찰</h3>
          <p className="text-2xl sm:text-3xl font-black text-gray-300">{myBids}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-2xl p-4 sm:p-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-400 mb-1 sm:mb-2 uppercase tracking-wider">참여자</h3>
          <p className="text-2xl sm:text-3xl font-black text-gray-300">{onlineUsers}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-2xl p-4 sm:p-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-400 mb-1 sm:mb-2 uppercase tracking-wider">마감 임박</h3>
          <p className="text-2xl sm:text-3xl font-black text-gray-300">{deadlineSoon}</p>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 shadow-2xl">
          <h3 className="text-lg sm:text-xl font-black text-white mb-3 sm:mb-4">빠른 시작</h3>
          <div className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate('/auctions/register')}
            >
              <Plus className="w-5 h-5 mr-3" />
              새 경매 등록하기
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate('/auctions')}
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

        <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 shadow-2xl">
          <NotificationSection />
        </Card>
      </div>

      {/* 개발 진행 상황 */}
      <Card className="text-center bg-gradient-to-br from-red-950/30 via-black to-red-950/30 border-2 border-red-900/40 shadow-2xl">
        <div className="py-6 sm:py-8">
          <h3 className="text-lg sm:text-xl font-black text-white mb-2">🎉 경매 시스템 구현 완료!</h3>
          <p className="text-sm sm:text-base text-gray-400 mb-4 px-4">
            경매 등록, 목록 조회, 상세 조회 기능이 준비되었습니다.<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>위의 버튼을 클릭하여 경매 기능을 사용해보세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm px-4">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/50"></div>
              <span className="text-gray-300 font-bold">인증 시스템 완료</span>
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/50"></div>
              <span className="text-gray-300 font-bold">경매 시스템 완료</span>
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-gray-700 rounded-full mr-2"></div>
              <span className="text-gray-600">채팅 시스템 개발중</span>
            </span>
          </div>
        </div>
      </Card>
    </>
  );


  return (
    <div className="min-h-screen bg-black">
      {/* 헤더 */}
      <Header
        showTestButton={true}
        onTestClick={handleTestClick}
        isTestLoading={isTestLoading}
      />

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderMainDashboard()}
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