import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Gavel, TrendingUp, Users, Clock, TestTube } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { testAuthToken } from '../services/api';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [currentNotifications, setCurrentNotifications] = useState<number[]>([0, 1, 2]);

  // 알림 데이터
  const notifications = [
    { type: 'warning', message: '"빈티지 카메라" 경매가 5분 후 마감됩니다.', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800' },
    { type: 'success', message: '"스마트폰 케이스" 경매에서 낙찰되었습니다!', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' },
    { type: 'info', message: '새로운 "전자기기" 카테고리 경매가 시작되었습니다.', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' },
    { type: 'warning', message: '"한정판 운동화" 경매가 2분 후 마감됩니다.', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800' },
    { type: 'success', message: '"무선 이어폰" 경매에서 입찰에 성공했습니다!', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' },
    { type: 'info', message: '"의류" 카테고리에 새 경매 3건이 등록되었습니다.', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' },
    { type: 'warning', message: '"클래식 시계" 경매가 30초 후 마감됩니다!', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800' },
    { type: 'success', message: '"게임 콘솔" 경매가 성공적으로 종료되었습니다.', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' },
    { type: 'info', message: '"가전제품" 카테고리 특가 경매가 오픈되었습니다.', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' },
    { type: 'warning', message: '"프리미엄 가방" 경매가 1분 후 마감됩니다.', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800' }
  ];

  // 3초마다 알림 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotifications(prev => {
        const nextIndices = prev.map(index => (index + 1) % notifications.length);
        return nextIndices;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [notifications.length]);
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                Gravy
              </h1>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">실시간 경매 거래</span>
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

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-1">진행중인 경매</h3>
            <p className="text-2xl font-bold text-yellow-600">24</p>
            <p className="text-sm text-gray-500">개의 상품</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">내 입찰</h3>
            <p className="text-2xl font-bold text-green-600">7</p>
            <p className="text-sm text-gray-500">개 참여중</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">참여자</h3>
            <p className="text-2xl font-bold text-blue-600">1,247</p>
            <p className="text-sm text-gray-500">명 온라인</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">마감 임박</h3>
            <p className="text-2xl font-bold text-purple-600">3</p>
            <p className="text-sm text-gray-500">개 상품</p>
          </Card>
        </div>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">빠른 시작</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Gavel className="w-5 h-5 mr-3" />
                새 경매 등록하기
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-5 h-5 mr-3" />
                인기 경매 둘러보기
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-5 h-5 mr-3" />
                내 거래 내역 보기
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">알림</h3>
            <div className="space-y-3 overflow-hidden">
              {currentNotifications.map((notificationIndex, displayIndex) => {
                const notification = notifications[notificationIndex];
                return (
                  <div 
                    key={`${notificationIndex}-${displayIndex}`}
                    className={`p-3 border rounded-lg transition-all duration-700 ease-out transform animate-in slide-in-from-bottom-2 fade-in ${notification.bgColor} ${notification.borderColor}`}
                    style={{
                      animationDelay: `${displayIndex * 100}ms`,
                      animationDuration: '700ms',
                      animationFillMode: 'both'
                    }}
                  >
                    <p className={`text-sm ${notification.textColor} transition-opacity duration-700`}>
                      {notification.message.includes('"') ? (
                        <>
                          {notification.message.split('"')[0]}
                          <strong>"{notification.message.split('"')[1]}"</strong>
                          {notification.message.split('"').slice(2).join('"')}
                        </>
                      ) : (
                        notification.message
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* 개발 중 안내 */}
        <Card className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="py-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🚧 개발 진행 중</h3>
            <p className="text-gray-600 mb-4">
              현재 1단계 인증 시스템이 완료되었습니다.<br />
              다음 단계에서는 상품 등록 및 경매 기능을 구현할 예정입니다.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                인증 시스템 완료
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                경매 시스템 개발중
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                채팅 시스템 예정
              </span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};