import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { AuthContextType, User } from '../types/auth';
import { logout as apiLogout, testAuthToken, ApiError } from '../services/api';

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
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    const checkAuthStatus = async () => {
      try {
        await testAuthToken();
        setUser({ nickname: '사용자', email: 'user@example.com' });
      } catch (error) {
        if (error instanceof ApiError && error.code === 'TOKEN_EXPIRED') {
          setUser(null);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);  

  const login = () => {
    // 서버에서 HttpOnly 쿠키로 토큰을 설정했으므로
    // 클라이언트는 단순히 사용자 상태만 업데이트
    setUser({ nickname: '사용자', email: 'user@example.com' });
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
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