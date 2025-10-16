import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, TestTube, Home, Gavel } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  showTestButton?: boolean;
  onTestClick?: () => void;
  isTestLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showTestButton = false,
  onTestClick,
  isTestLoading = false
}) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로가 활성화 상태인지 확인
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path === '/auctions') {
      return location.pathname.startsWith('/auctions');
    }
    return false;
  };

  return (
    <header className="bg-gradient-to-b from-gray-900 to-black shadow-2xl border-b border-red-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 & 네비게이션 */}
          <div className="flex items-center space-x-6">
            <Link to="/">
              <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent hover:from-red-400 hover:to-red-500 transition-all duration-300 cursor-pointer">
                GRAVY
              </h1>
            </Link>
            <span className="text-gray-700">|</span>

            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className={`flex items-center gap-2 ${
                    isActive('/dashboard')
                      ? 'text-red-500 border-2 border-red-600'
                      : ''
                  }`}
                >
                  <Home className="w-4 h-4" />
                  대시보드
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/auctions')}
                  className={`flex items-center gap-2 ${
                    isActive('/auctions')
                      ? 'text-red-500 border-2 border-red-600'
                      : ''
                  }`}
                >
                  <Gavel className="w-4 h-4" />
                  경매 목록
                </Button>
              </nav>
            )}
          </div>

          {/* 사용자 정보 & 액션 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300 font-medium hidden lg:block">
                  환영합니다, <span className="text-red-500 font-bold">{user?.nickname}</span>님!
                </span>
                {showTestButton && (
                  <Button
                    variant="outline"
                    onClick={onTestClick}
                    size="sm"
                    loading={isTestLoading}
                    className="whitespace-nowrap"
                  >
                    <TestTube className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">API 테스트</span>
                  </Button>
                )}
                <Button variant="outline" onClick={() => logout()} size="sm" className="whitespace-nowrap">
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">로그아웃</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  로그인
                </Button>
                <Button size="sm" onClick={() => navigate('/signup')}>
                  회원가입
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
