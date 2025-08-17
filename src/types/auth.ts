// 인증 관련 타입 정의
export interface EmailDuplicateRequest {
  email: string;
}

export interface VerificationCodeSendRequest {
  email: string;
}

export interface VerificationCodeVerifyRequest {
  email: string;
  verificationCode: string;
}

export interface VerificationCodeVerifyResponse {
  verificationPublicId: string;
}

export interface SignUpRequest {
  nickname: string;
  password: string;
  verificationPublicId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}

export interface User {
  nickname: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (tokens: LoginResponse) => void;
  logout: () => void;
  loading: boolean;
}