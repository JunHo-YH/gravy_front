import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginResponse } from '../types/auth';
import { setTokenCookie, removeTokenCookie, getTokenFromCookie } from '../services/api';

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

  useEffect(() => {
    // 초기화 시 토큰 확인
    const accessToken = getTokenFromCookie('access_token');
    const refreshToken = getTokenFromCookie('refresh_token');
    
    if (accessToken && refreshToken) {
      // 토큰이 있으면 인증된 상태로 설정
      // 실제로는 토큰 검증 API를 호출해야 하지만, 현재는 단순화
      setUser({ nickname: '사용자', email: 'user@example.com' });
    }
    
    setLoading(false);
  }, []);

  const login = (tokens: LoginResponse) => {
    setTokenCookie('access_token', tokens.accessToken, 1800); // 30분
    setTokenCookie('refresh_token', tokens.refreshToken, 604800); // 7일
    
    // 실제로는 토큰에서 사용자 정보를 디코딩해야 함
    setUser({ nickname: '사용자', email: 'user@example.com' });
  };

  const logout = () => {
    removeTokenCookie('access_token');
    removeTokenCookie('refresh_token');
    setUser(null);
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