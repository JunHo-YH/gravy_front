import { 
  EmailDuplicateRequest, 
  VerificationCodeSendRequest, 
  VerificationCodeVerifyRequest,
  VerificationCodeVerifyResponse,
  SignUpRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  ErrorResponse
} from '../types/auth';

const BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'https://gravy.kr';

export class ApiError extends Error {
  public code: string;
  public timestamp: string;

  constructor(errorResponse: ErrorResponse) {
    super(errorResponse.message);
    this.code = errorResponse.code;
    this.timestamp = errorResponse.timestamp;
    this.name = 'ApiError';
  }
}

// 기본 API 호출 함수
const apiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const fullUrl = `${BASE_URL}${url}`;
  console.log(`API 요청: ${options.method || 'GET'} ${fullUrl}`);
  if (options.body) {
    console.log('요청 데이터:', options.body);
  }
  
  try {
    const response = await fetch(fullUrl, {
      ...options,
      credentials: 'include', // 쿠키 포함 필수
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    console.log(`API 응답: ${response.status} ${response.statusText}`);
    console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
    
    return response;
  } catch (networkError) {
    console.error('네트워크 오류:', networkError);
    throw new Error(`네트워크 연결에 실패했습니다: ${networkError instanceof Error ? networkError.message : '알 수 없는 네트워크 오류'}`);
  }
};

// 에러 처리를 위한 응답 체크 함수
const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  
  // 응답 본문을 텍스트로 한 번만 읽음
  const responseText = await response.text();
  console.log(`응답 본문 (${response.status}):`, responseText);
  console.log('Content-Type:', contentType);
  
  if (!response.ok) {
    console.log('에러 응답 처리 시작...');
    
    try {
      // 에러 응답 JSON 파싱 시도
      if (responseText.trim() && contentType?.includes('application/json')) {
        const errorData: ErrorResponse = JSON.parse(responseText);
        console.log('✅ 파싱된 에러 응답:', errorData);
        console.log('🎯 ApiError 생성:', errorData.message);
        throw new ApiError(errorData);
      } else {
        console.log('❌ JSON이 아니거나 빈 응답');
      }
    } catch (jsonError) {
      if (jsonError instanceof ApiError) {
        // ApiError는 다시 던지기
        throw jsonError;
      }
      console.warn('❌ 에러 응답 JSON 파싱 실패:', jsonError);
      console.log('원본 에러 응답 텍스트:', responseText);
    }
    
    // JSON 파싱 실패 시 기본 에러 생성
    console.log('⚠️ 기본 에러 메시지 사용');
    const defaultError: ErrorResponse = {
      code: `HTTP_${response.status}`,
      message: `서버 오류가 발생했습니다. (${response.status} ${response.statusText})`,
      timestamp: new Date().toISOString()
    };
    throw new ApiError(defaultError);
  }

  // 성공 응답 처리
  console.log('✅ 성공 응답 처리');
  if (responseText.trim() && contentType?.includes('application/json')) {
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.warn('성공 응답 JSON 파싱 실패:', error);
    }
  }
  
  return {} as T;
};

// 인증된 API 호출 (자동 토큰 갱신 포함)
const authenticatedApiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let response = await apiCall(url, options);
  
  // 401 Unauthorized 시 토큰 재발급 후 재시도
  if (response.status === 401) {
    try {
      await refreshAccessToken();
      response = await apiCall(url, options); // 재시도
    } catch (error) {
      // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
      window.location.href = '/login';
      throw error;
    }
  }
  
  return response;
};

// 토큰 관리 함수들
export const getTokenFromCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setTokenCookie = (name: string, token: string, maxAge: number): void => {
  const isSecure = window.location.protocol === 'https:';
  document.cookie = `${name}=${token}; path=/; ${isSecure ? 'secure;' : ''} samesite=strict; max-age=${maxAge}`;
};

export const removeTokenCookie = (name: string): void => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// API 함수들
export const checkEmailDuplicate = async (request: EmailDuplicateRequest): Promise<void> => {
  console.log('API 호출: 이메일 중복 확인', request);
  const response = await apiCall('/email/duplicate', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  console.log('이메일 중복 확인 응답:', response.status, response.statusText);
  
  return handleResponse(response);
};

export const sendVerificationCode = async (request: VerificationCodeSendRequest): Promise<void> => {
  console.log('API 호출: 인증번호 발송', request);
  const response = await apiCall('/email/verification-code/send', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  console.log('인증번호 발송 응답:', response.status, response.statusText);
  
  return handleResponse(response);
};

export const verifyEmailCode = async (request: VerificationCodeVerifyRequest): Promise<VerificationCodeVerifyResponse> => {
  console.log('인증번호 검증 요청:', request);
  const response = await apiCall('/email/verification-code/verify', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  
  // 응답 헤더와 텍스트 확인
  console.log('응답 헤더들:', Object.fromEntries(response.headers.entries()));
  const responseText = await response.clone().text();
  console.log('응답 본문 텍스트:', responseText);
  
  const result = await handleResponse<VerificationCodeVerifyResponse>(response);
  console.log('인증번호 검증 서버 응답:', result);
  return result;
};

export const signUp = async (request: SignUpRequest): Promise<void> => {
  const response = await apiCall('/user/signup', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  
  return handleResponse(response);
};

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await apiCall('/user/login', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  
  return handleResponse(response);
};

export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
  const response = await apiCall('/user/reissue/access-token', {
    method: 'POST'
  });
  
  const data = await handleResponse<RefreshTokenResponse>(response);
  
  // 새 토큰으로 쿠키 업데이트
  setTokenCookie('access_token', data.accessToken, 1800); // 30분
  setTokenCookie('refresh_token', data.refreshToken, 604800); // 7일
  
  return data;
};

export const healthCheck = async (): Promise<string> => {
  const response = await apiCall('/ping');
  return response.text();
};