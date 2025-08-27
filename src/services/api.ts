import { 
  EmailDuplicateRequest, 
  VerificationCodeSendRequest, 
  VerificationCodeVerifyRequest,
  VerificationCodeVerifyResponse,
  SignUpRequest,
  LoginRequest,
  LoginResponse,
  ErrorResponse
} from '../types/auth';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:8080' : 'https://dev.gravy.kr';

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
      credentials: 'include', // 쿠키 포함 및 CORS 쿠키 설정 허용
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

// HttpOnly 쿠키는 서버에서 완전히 관리됨
// 브라우저가 자동으로 Set-Cookie 헤더를 처리하여 HttpOnly 쿠키를 설정/삭제



// API 함수들
export const checkEmailDuplicate = async (request: EmailDuplicateRequest): Promise<void> => {
  console.log('API 호출: 이메일 중복 확인', request);
  const response = await apiCall(`/api/v1/users/email/${encodeURIComponent(request.email)}/availability`, {
    method: 'GET'
  });
  console.log('이메일 중복 확인 응답:', response.status, response.statusText);
  
  return handleResponse(response);
};

export const sendVerificationCode = async (request: VerificationCodeSendRequest): Promise<void> => {
  console.log('API 호출: 인증번호 발송', request);
  const response = await apiCall('/api/v1/email-verifications', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  console.log('인증번호 발송 응답:', response.status, response.statusText);
  
  return handleResponse(response);
};

export const verifyEmailCode = async (request: VerificationCodeVerifyRequest): Promise<VerificationCodeVerifyResponse> => {
  console.log('인증번호 검증 요청:', request);
  const response = await apiCall('/api/v1/email-verifications/status', {
    method: 'PUT',
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
  const response = await apiCall('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  
  return handleResponse(response);
};

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  console.log('🔐 로그인 시도:', request);
  const response = await apiCall('/api/v1/auth/tokens', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  
  console.log('🎯 로그인 응답 상태:', response.status, response.statusText);
  
  // handleResponse를 통해 에러 응답이 처리됨
  // 여기까지 도달했다면 로그인 성공
  await handleResponse(response);
  
  // 브라우저가 자동으로 Set-Cookie 헤더를 처리하여 HttpOnly 쿠키를 설정
  console.log('✅ 로그인 성공 - 브라우저가 HttpOnly 쿠키 자동 설정');
  
  return {
    accessToken: 'stored_in_httponly_cookie',
    refreshToken: 'stored_in_httponly_cookie'
  };
};


export const logout = async (): Promise<void> => {
  console.log('🚪 로그아웃 시작...');
  
  // 서버에서 HttpOnly 쿠키 삭제 및 로그아웃 처리
  const response = await apiCall('/api/v1/auth/tokens', {
    method: 'DELETE'
  });
  
  console.log('🚪 로그아웃 응답:', response.status, response.statusText);
  
  if (!response.ok) {
    throw new Error(`로그아웃 실패: ${response.status} ${response.statusText}`);
  }
  
  console.log('✅ 로그아웃 성공 - 서버에서 HttpOnly 쿠키 삭제 완료');
};


export const testAuthToken = async (): Promise<void> => {
  console.log('🧪 토큰 전달 테스트 시작...');
  const response = await apiCall('/api/v1/auth/test', {
    method: 'POST'
  });
  
  console.log('🧪 테스트 응답:', response.status, response.statusText);
  
  if (!response.ok) {
    throw new Error(`테스트 실패: ${response.status} ${response.statusText}`);
  }
  
  console.log('✅ 토큰 전달 테스트 성공');
};

