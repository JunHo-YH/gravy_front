import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { AuthContextType, User, LoginResponse } from '../types/auth';
import { logout as apiLogout } from '../services/api';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:8080' : 'https://dev.gravy.kr';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 이미 초기화되었으면 중복 실행 방지
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;
    console.log('🔍 AuthContext: 인증 상태 확인 시작 (1회만)');

    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/auth/test`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          setUser({ nickname: '사용자', email: 'user@example.com' });
          console.log('✅ AuthContext: 인증 성공');
        } else {
          setUser(null);
          console.log('❌ AuthContext: 인증 실패');
        }
      } catch (error) {
        console.log('❌ AuthContext: 인증 확인 실패:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);  

  const login = (tokens: LoginResponse) => {
    // 서버에서 HttpOnly 쿠키로 토큰을 설정했으므로
    // 클라이언트는 단순히 사용자 상태만 업데이트
    setUser({ nickname: '사용자', email: 'user@example.com' });
  };

  const logout = async () => {
    try {
      // 서버 로그아웃 API 호출 및 쿠키 삭제
      await apiLogout();
      setUser(null);
      console.log('✅ 로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      // 에러가 발생해도 로컬 상태는 삭제
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};