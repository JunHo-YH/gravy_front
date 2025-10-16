# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 설정 (Language Settings)

**항상 한국어로 답변할 것** - Always respond in Korean to this user.

## 개발 명령어

### 기본 명령어
```bash
npm run dev      # Vite 개발 서버 시작 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 린트 실행
npm run preview  # 프로덕션 빌드 미리보기
```

### 배포
```bash
npm install -g vercel
vercel --prod
```

### 개발 서버 재시작
Tailwind 설정 변경 후 또는 HMR 문제 발생 시:
```bash
pkill -f "vite"              # 기존 서버 종료
npm run dev > /tmp/vite.log 2>&1 &  # 백그라운드 실행
```

## 프로젝트 아키텍처

### 기술 스택
- **React 18** + **TypeScript** - UI 라이브러리와 타입 시스템
- **Vite** - 빌드 도구 (HMR 지원)
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **React Router DOM v7** - 클라이언트 사이드 라우팅
- **React Hook Form** + **Yup** - 폼 검증 및 관리

### 프로젝트 구조
```
src/
├── components/
│   ├── auth/         # 인증 관련 컴포넌트 (SignUpStep1-3)
│   ├── auction/      # 경매 시스템 (AuctionCard, AuctionList, AuctionDetail, AuctionRegister)
│   ├── common/       # 재사용 가능한 UI (Button, Card, Input, LoadingSpinner, Header)
│   └── landing/      # 랜딩 페이지 섹션 (LandingNotificationSection)
├── contexts/
│   └── AuthContext.tsx  # 전역 인증 상태 관리 (useAuth 훅 제공)
├── hooks/
│   ├── useCountUp.ts            # 숫자 카운트업 애니메이션
│   ├── useNotificationAnimation.ts  # 알림 애니메이션
│   ├── useRealTimeCountdown.ts      # 실시간 경매 카운트다운 (클라이언트 시간)
│   ├── useServerTime.ts             # 서버 시간 동기화
│   ├── useAuctionCountdown.ts       # 경매 카운트다운 (서버 시간 보정)
│   └── usePriceAnimation.ts         # 가격 변동 애니메이션
├── pages/
│   ├── Landing.tsx              # 랜딩 페이지
│   ├── Login.tsx                # 로그인
│   ├── SignUp.tsx               # 회원가입 (3단계)
│   ├── Dashboard.tsx            # 대시보드
│   ├── AuctionListPage.tsx      # 경매 목록 페이지
│   └── AuctionRegisterPage.tsx  # 경매 등록 페이지
├── services/
│   └── api.ts        # API 통신 레이어 (모든 백엔드 API 호출)
├── types/            # TypeScript 타입 정의 (auth.ts, auction.ts)
└── constants/        # 상수 및 모의 데이터
```

### 핵심 아키텍처 패턴

#### 1. 인증 시스템 (HttpOnly Cookie 기반)
- **AuthContext**: 전역 인증 상태 관리 (React Context)
- **토큰 관리**: 서버에서 HttpOnly 쿠키로 AccessToken/RefreshToken 자동 관리
- **자동 갱신**: `api.ts`에서 401 에러 발생 시 자동으로 `/api/v1/auth/tokens/reissue` 호출
- **라우트 보호**:
  - `ProtectedRoute`: 인증 필요 (예: Dashboard)
  - `PublicRoute`: 비인증 사용자만 접근 (예: Login, SignUp)

#### 2. API 통신 레이어 (`services/api.ts`)
- **기본 구조**: `apiCall()` → 401 감지 → `refreshAccessToken()` → 재시도
- **에러 처리**: `ApiError` 클래스로 서버 에러 응답 표준화
- **환경별 URL**:
  - 개발: `http://localhost:8080` (Vite 프록시: `/api` → 백엔드)
  - 프로덕션: `https://dev.gravy.kr`
- **주요 API**:
  - 인증: `login()`, `logout()`, `signUp()`, `testAuthToken()`
  - 경매: `registerAuction()`, `getAuctionList()`, `getAuctionDetail()`
  - 챗봇: `sendChatMessage()`

#### 3. 경매 시스템
- **AuctionCard**:
  - 경매 카드 UI (썸네일, 제목, 가격, 카운트다운)
  - 상태별 스타일링 (ACTIVE: 빨간 라인 + LIVE 배지, COMPLETED: 낙찰 도장)
  - 긴급도 표시 (critical: 5분 이하, warning: 30분-3시간)
  - `useRealTimeCountdown` 훅 사용
- **AuctionList**:
  - 페이지네이션, 서버 시간 동기화
  - 진행중/전체 경매 카운트 표시
- **AuctionDetail**:
  - 상세 정보 조회, 실시간 카운트다운
  - 입찰 기록, 판매자 정보
- **AuctionRegister**:
  - React Hook Form + Yup 검증
  - 이미지 업로드 (최대 3개, 드래그앤드롭으로 순서 변경)
  - 블랙+레드 테마
- **타입**: `types/auction.ts`
  - `AuctionStatus`: SCHEDULED, ACTIVE, COMPLETED, CANCELLED
  - `Category`: 19개 카테고리 enum
  - `AuctionSummary`: 목록용 (id, title, category, status, currentPrice, thumbnailUrl, auctionStartTime, auctionEndTime)
  - `AuctionDetailResponse`: 상세용 (추가로 description, bidCount, viewCount, imageUrls 등)

#### 4. 상태 관리
- **전역 상태**: AuthContext (사용자 인증)
- **로컬 상태**: useState (페이지별 UI 상태)
- **커스텀 훅**:
  - `useCountUp`: 숫자 카운트업 애니메이션 (통계 표시용)
  - `useRealTimeCountdown`: 경매 마감 시간 실시간 카운트다운 (클라이언트 시간 기반)
  - `useServerTime`: 서버 시간 동기화 (serverTime 문자열 → correctedNow Date 객체)
  - `useAuctionCountdown`: 경매 카운트다운 (서버 시간 보정, 사용 안 함)
  - `usePriceAnimation`: 가격 변동 애니메이션 (사용 안 함)
  - `useNotificationAnimation`: 알림 애니메이션 (랜딩 페이지)

#### 5. 라우팅 구조
- `/` - Landing (공개, 랜딩 페이지)
- `/login` - Login (PublicRoute)
- `/signup` - SignUp (PublicRoute, 3단계 폼)
- `/dashboard` - Dashboard (ProtectedRoute, 통계 + 경매 목록/상세)
- `/auctions` - AuctionListPage (ProtectedRoute, 경매 목록)
- `/auctions/register` - AuctionRegisterPage (ProtectedRoute, 경매 등록)

### Vite 프록시 설정
개발 환경에서 `/api` 요청을 `http://localhost:8080`로 프록시:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 디자인 시스템 (Design System)

#### 색상 테마: 블랙 + 레드
전체 프로젝트는 **고급스러운 블랙 + 레드 테마**로 통일:
- **배경**: `bg-black`, `bg-gradient-to-br from-gray-900 via-black to-gray-900`
- **카드**: `bg-gradient-to-br from-gray-900 to-black`, `border-gray-800`, `border-red-900/50`
- **텍스트**: `text-white`, `text-gray-300`, `text-gray-400`
- **액센트 (빨강)**: `text-red-500`, `bg-red-600`, `border-red-700`
- **버튼 Primary**: `bg-gradient-to-r from-red-600 to-red-700`
- **버튼 Outline**: `border-gray-700 text-gray-300 hover:border-red-600`
- **Input 포커스**: `focus:border-red-500 focus:ring-red-900/50`

#### 경매 상태별 시각화
- **ACTIVE (진행중)**:
  - 카드 상단 빨간 라인 (`bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse`)
  - LIVE 배지 (빨간 점 + "LIVE" 텍스트, `bg-red-950/50 rounded-full`)
  - 가격 박스 상단 라인 (`h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent`)
  - 긴급도별 색상:
    - `critical` (5분 이하): 빨강 + 펄스 + 바운스, `text-red-500 animate-pulse`
    - `warning` (30분-3시간): 주황빛 빨강, `text-red-400`
    - `normal`: 기본 빨강, `text-red-400`
- **COMPLETED (종료)**:
  - 이미지 희미하게: `grayscale blur-[2px] opacity-40`
  - 어두운 오버레이: `bg-black/60 backdrop-blur-[1px]`
  - 고급 낙찰 도장:
    - 크기: `w-32 h-32`
    - 다중 원형 테두리 (10px, 6px, 3px, 2px)
    - 회전: `rotate-[-12deg]`
    - 텍스트: "AUCTION / SOLD / OUT"
    - 애니메이션: `animate-[stamp_0.6s_ease-out]` (tailwind.config.js에 정의)
    - 글로우: `blur-2xl bg-red-600/40`

#### 애니메이션
- **카운트업**: `useCountUp` (통계 숫자)
- **펄스**: `animate-pulse` (LIVE 표시, 긴급 상태)
- **바운스**: `animate-bounce` (마감직전 배지)
- **핑**: `animate-ping` (점 애니메이션)
- **도장**: `animate-[stamp_0.6s_ease-out]` (낙찰 도장 등장)
- **스케일**: `hover:scale-[1.02]`, `scale-110` (카드 hover, 긴급 가격)

#### Tailwind 커스텀 설정 (`tailwind.config.js`)
```javascript
keyframes: {
  stamp: {
    '0%': { transform: 'rotate(-15deg) scale(0)', opacity: '0' },
    '50%': { transform: 'rotate(-12deg) scale(1.1)', opacity: '1' },
    '100%': { transform: 'rotate(-12deg) scale(1)', opacity: '1' },
  },
},
animation: {
  stamp: 'stamp 0.6s ease-out',
},
```

#### 컴포넌트 스타일링 규칙
- **Button**: `bg-gradient-to-r from-red-600 to-red-700` (primary), `border-gray-700` (outline)
- **Input**: `bg-gray-900 text-white placeholder-gray-600 focus:ring-red-500 border-gray-700`
- **Card**: `bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800`
- **Header**: 공통 헤더 (GRAVY 로고, 네비게이션, 사용자 정보), 활성 페이지는 `border-2 border-red-600`

### 중요 규칙
- **절대 새 파일 생성 금지**: 기존 파일 수정 우선
- **문서 파일 생성 금지**: `*.md`, README 파일은 요청 시에만 생성
- **API 호출**: 반드시 `services/api.ts`의 함수 사용 (직접 fetch 금지)
- **인증 확인**: `useAuth()` 훅으로 `isAuthenticated`, `user` 접근
- **경매 타입**:
  - AuctionCard에서는 `AuctionSummary` 타입 사용 (thumbnailUrl, auctionEndTime 필드)
  - `auctionEndAt` (X), `auctionEndTime` (O)
  - `buyNowPrice`, `sellerNickname` 필드는 AuctionSummary에 없음 (AuctionDetailResponse에만 존재)
- **카운트다운 훅**: AuctionCard에서는 `useRealTimeCountdown(auction.auctionEndTime)` 사용
- **HMR 문제**: Tailwind 설정 변경 후 반드시 개발 서버 재시작 (`pkill -f "vite" && npm run dev`)