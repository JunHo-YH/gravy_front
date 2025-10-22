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

import {
  AuctionRegisterRequest,
  AuctionListRequest,
  AuctionListResponse,
  AuctionDetailResponse
} from '../types/auction';

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

// 토큰 갱신 함수 (직접 fetch 사용하여 무한 루프 방지)
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/tokens/reissue`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

// 기본 API 호출 함수
const apiCall = async (url: string, options: RequestInit = {}, isRetry: boolean = false): Promise<Response> => {
  const fullUrl = `${BASE_URL}${url}`;

  try {
    // FormData인 경우 Content-Type을 자동으로 설정하도록 함
    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = isFormData
      ? { ...options.headers } // FormData는 Content-Type 자동 설정
      : {
          'Content-Type': 'application/json',
          ...options.headers
        };

    const response = await fetch(fullUrl, {
      ...options,
      credentials: 'include', // 쿠키 포함 및 CORS 쿠키 설정 허용
      headers
    });

    // 401 또는 403 에러이고 첫 번째 시도인 경우, 토큰 갱신 후 재시도
    if ((response.status === 401 || response.status === 403) && !isRetry) {
      // refresh 요청이 아닌 경우에만 토큰 갱신 시도
      if (!url.includes('/tokens/reissue')) {
        const refreshSuccess = await refreshAccessToken();

        if (refreshSuccess) {
          return apiCall(url, options, true); // 재시도 플래그를 true로 설정
        }
      }

      // 갱신 실패하거나 refresh 요청이 401/403인 경우 로그아웃 처리
      const errorResponse: ErrorResponse = {
        code: 'TOKEN_EXPIRED',
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        timestamp: new Date().toISOString()
      };
      throw new ApiError(errorResponse);
    }

    return response;
  } catch (error) {
    // ApiError는 그대로 다시 throw (토큰 만료 등)
    if (error instanceof ApiError) {
      throw error;
    }

    // 실제 네트워크 오류만 처리
    throw new Error(`네트워크 연결에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 네트워크 오류'}`);
  }
};

// 에러 처리를 위한 응답 체크 함수
const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  const responseText = await response.text();

  if (!response.ok) {
    try {
      // 에러 응답 JSON 파싱 시도
      if (responseText.trim() && contentType?.includes('application/json')) {
        const rawError = JSON.parse(responseText);

        // 서버 에러 응답 형식 변환 (Spring Boot 기본 형식 → ErrorResponse)
        const errorData: ErrorResponse = rawError.message
          ? rawError // 이미 올바른 형식 (code, message, timestamp)
          : {
              code: rawError.error || `HTTP_${response.status}`,
              message: rawError.message || rawError.error || `서버 오류가 발생했습니다. (${response.status})`,
              timestamp: rawError.timestamp || new Date().toISOString()
            };

        throw new ApiError(errorData);
      }
    } catch (jsonError) {
      if (jsonError instanceof ApiError) {
        throw jsonError;
      }
    }

    // JSON 파싱 실패 시 기본 에러 생성
    const defaultError: ErrorResponse = {
      code: `HTTP_${response.status}`,
      message: `서버 오류가 발생했습니다. (${response.status} ${response.statusText})`,
      timestamp: new Date().toISOString()
    };
    throw new ApiError(defaultError);
  }

  // 성공 응답 처리
  if (responseText.trim() && contentType?.includes('application/json')) {
    try {
      return JSON.parse(responseText);
    } catch {
      // JSON 파싱 실패 시 빈 객체 반환
    }
  }

  return {} as T;
};

// HttpOnly 쿠키는 서버에서 완전히 관리됨
// 브라우저가 자동으로 Set-Cookie 헤더를 처리하여 HttpOnly 쿠키를 설정/삭제



// API 함수들
export const checkEmailDuplicate = async (request: EmailDuplicateRequest): Promise<void> => {
  const response = await apiCall(`/api/v1/users/email/${encodeURIComponent(request.email)}/availability`, {
    method: 'GET'
  });
  return handleResponse(response);
};

export const sendVerificationCode = async (request: VerificationCodeSendRequest): Promise<void> => {
  const response = await apiCall('/api/v1/email-verifications', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  return handleResponse(response);
};

export const verifyEmailCode = async (request: VerificationCodeVerifyRequest): Promise<VerificationCodeVerifyResponse> => {
  const response = await apiCall('/api/v1/email-verifications/status', {
    method: 'PUT',
    body: JSON.stringify(request)
  });
  return handleResponse<VerificationCodeVerifyResponse>(response);
};

export const signUp = async (request: SignUpRequest): Promise<void> => {
  const response = await apiCall('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  
  return handleResponse(response);
};

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await apiCall('/api/v1/auth/tokens', {
    method: 'POST',
    body: JSON.stringify(request)
  });

  await handleResponse(response);

  return {
    accessToken: 'stored_in_httponly_cookie',
    refreshToken: 'stored_in_httponly_cookie'
  };
};

export const logout = async (): Promise<void> => {
  const response = await apiCall('/api/v1/auth/tokens', {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`로그아웃 실패: ${response.status} ${response.statusText}`);
  }
};

export const testAuthToken = async (): Promise<void> => {
  const response = await apiCall('/api/v1/auth/test', {
    method: 'POST'
  });
  await handleResponse<void>(response);
};

export const sendChatMessage = async (message: string): Promise<string> => {
  const response = await apiCall('/api/v1/chatbot', {
    method: 'POST',
    body: JSON.stringify({ question: message })
  });

  const result = await handleResponse<{ data: unknown }>(response);

  // 서버에서 JsonNode data로 반환하므로 data 필드에서 응답을 추출
  if (result.data && typeof result.data === 'object') {
    const data = result.data as Record<string, unknown>;
    return (data.answer as string) || (data.response as string) || (data.text as string) || JSON.stringify(result.data);
  }

  return '죄송합니다. 응답을 처리하는 중 문제가 발생했습니다.';
};

export const registerAuction = async (request: AuctionRegisterRequest, images?: File[]): Promise<void> => {
  const formData = new FormData();

  formData.append('title', request.title);
  formData.append('description', request.description);
  formData.append('category', request.category);
  formData.append('startingPrice', request.startingPrice.toString());
  formData.append('minBidIncrement', request.minBidIncrement.toString());
  formData.append('auctionStartTime', request.auctionStartTime);
  formData.append('auctionEndTime', request.auctionEndTime);

  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append('image', file);
    });
  }

  const response = await apiCall('/api/v1/auctions', {
    method: 'POST',
    body: formData,
    headers: {}
  });

  if (response.status === 201) {
    return;
  }

  return handleResponse<void>(response);
};

export const getAuctionList = async (request: AuctionListRequest): Promise<AuctionListResponse> => {
  const params = new URLSearchParams();
  params.append('page', request.page.toString());
  params.append('size', request.size.toString());

  const response = await apiCall(`/api/v1/auctions?${params.toString()}`, {
    method: 'GET'
  });

  return handleResponse<AuctionListResponse>(response);
};

export const getAuctionDetail = async (auctionPublicId: string): Promise<AuctionDetailResponse> => {
  const response = await apiCall(`/api/v1/auctions/${auctionPublicId}`, {
    method: 'GET'
  });

  return handleResponse<AuctionDetailResponse>(response);
};

