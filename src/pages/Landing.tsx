import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Gavel, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { LandingNotificationSection } from '../components/landing/LandingNotificationSection';
import { useAuth } from '../contexts/AuthContext';
import { useCountUp } from '../hooks/useCountUp';

export const Landing: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [notificationSectionVisible, setNotificationSectionVisible] = useState(false);
  const [initialNotificationsLoaded, setInitialNotificationsLoaded] = useState(false);

  // 통계 애니메이션
  const activeUsers = useCountUp(1247, { duration: 2500, suffix: '+' });
  const completedAuctions = useCountUp(5832, { duration: 3000 });
  const totalValue = useCountUp(2.1, { duration: 3500, suffix: 'B', prefix: '₩' });
  const satisfaction = useCountUp(99.8, { duration: 4000, suffix: '%' });

  useEffect(() => {
    // 페이지 로드 후 순차적으로 애니메이션 시작
    const timer1 = setTimeout(() => setIsVisible(true), 500);
    const timer2 = setTimeout(() => setNotificationSectionVisible(true), 1400); // 통계 진행 중에
    const timer3 = setTimeout(() => setInitialNotificationsLoaded(true), 1900); // 섹션 나타난 후
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* 헤더 */}
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
              <span className="text-gray-600">실시간 경매 거래</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button size="sm">
                      대시보드
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      <LogIn className="w-4 h-4 mr-2" />
                      로그인
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      회원가입
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 히어로 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800">실시간 경매의 </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600">
              새로운 경험
            </span>
            <span className="inline-block ml-4 text-4xl">✨</span>
          </h1>
        </div>

        {/* 특징 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Gavel className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">실시간 경매</h3>
            <p className="text-gray-600">
              실시간으로 진행되는 경매에 참여하여 원하는 상품을 최적의 가격에 구매하세요.
            </p>
          </Card>

          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">투명한 거래</h3>
            <p className="text-gray-600">
              모든 입찰 과정이 투명하게 공개되어 공정한 거래 환경을 제공합니다.
            </p>
          </Card>

          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">안전한 결제</h3>
            <p className="text-gray-600">
              검증된 결제 시스템으로 안전하고 신속한 거래를 보장합니다.
            </p>
          </Card>
        </div>

        {/* 통계 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gray-900">한눈에 보는 </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Gravy</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0ms' }}>
              <div className="text-3xl font-bold text-yellow-600 mb-2">{activeUsers}</div>
              <div className="text-gray-600">활성 사용자</div>
            </div>
            <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <div className="text-3xl font-bold text-green-600 mb-2">{completedAuctions}</div>
              <div className="text-gray-600">완료된 경매</div>
            </div>
            <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalValue}</div>
              <div className="text-gray-600">총 거래액</div>
            </div>
            <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
              <div className="text-3xl font-bold text-purple-600 mb-2">{satisfaction}</div>
              <div className="text-gray-600">만족도</div>
            </div>
          </div>
        </div>

        {/* 실시간 알림 섹션 */}
        <LandingNotificationSection 
          isVisible={notificationSectionVisible}
          isLoaded={initialNotificationsLoaded}
        />

        {/* 개발 진행 상황 */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-12">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚧</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">개발 진행 중</h2>
            <p className="text-xl text-gray-600 mb-8">
              현재 1단계 인증 시스템이 완료되었습니다.<br />
              곧 더 많은 기능들을 만나보실 수 있습니다!
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700 font-medium">인증 시스템 완료</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-gray-700 font-medium">경매 시스템 개발중</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded-full mr-3"></div>
              <span className="text-gray-500">채팅 시스템 예정</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};