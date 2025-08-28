# Gravy 프론트엔드 아키텍처

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── NotificationCard.tsx    # 개별 알림 카드
│   │   ├── NotificationSection.tsx # 대시보드용 알림 섹션
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── auth/           # 인증 관련 컴포넌트
│   │   ├── SignUpStep1.tsx
│   │   ├── SignUpStep2.tsx
│   │   └── SignUpStep3.tsx
│   ├── landing/        # 랜딩 페이지 전용 컴포넌트
│   │   └── LandingNotificationSection.tsx
│   └── index.ts        # 통합 export
├── constants/          # 상수 및 데이터
│   ├── notifications.ts # 알림 데이터 및 타입
│   └── index.ts
├── contexts/           # React Context 관리
│   └── AuthContext.tsx
├── hooks/              # 커스텀 React 훅
│   ├── useCountUp.ts   # 숫자 카운팅 애니메이션
│   ├── useNotificationAnimation.ts # 알림 슬라이딩 애니메이션
│   └── index.ts
├── pages/              # 페이지 컴포넌트
│   ├── Dashboard.tsx
│   ├── Landing.tsx
│   ├── Login.tsx
│   └── SignUp.tsx
├── services/           # API 통신
│   └── api.ts
├── types/              # TypeScript 타입 정의
│   └── auth.ts
├── App.tsx             # 메인 앱 컴포넌트
├── main.tsx           # 진입점
└── index.css          # 글로벌 CSS 및 애니메이션
```

## 🎨 주요 기능 및 디자인 패턴

### 1. 알림 시스템 (Notification System)
- **실크처럼 부드러운 슬라이딩 애니메이션**: CSS keyframes + React state 관리
- **색상별 분류**: 마감 임박(빨강), 낙찰 성공(초록), 새 경매(파랑)
- **재사용 가능한 구조**: 대시보드와 랜딩페이지에서 공통 로직 사용

### 2. 애니메이션 시스템
- **통계 카운팅**: `useCountUp` 훅으로 부드러운 숫자 증가 효과
- **페이지 로딩**: 순차적 등장 애니메이션 (통계 → 알림 섹션 → 개별 알림)
- **Shimmer 효과**: 프리미엄 느낌의 반짝이는 애니메이션

### 3. 컴포넌트 구조
- **Compound Component 패턴**: 알림 관련 컴포넌트들의 조합
- **Hook 기반 로직 분리**: UI와 비즈니스 로직의 명확한 분리
- **Props Interface**: TypeScript 타입 안전성 보장

## 🔧 핵심 애니메이션 타이밍

```typescript
// 알림 슬라이딩 애니메이션 타이밍
const ANIMATION_CONFIG = {
  slideOutUp: '0.75s',      // 위로 사라지기
  slideInUp: '0.7s',        // 아래에서 등장
  moveUp: '0.75s',          // 중간 알림들 위로 이동
  newNotificationDelay: 375, // 새 알림 등장 딜레이
  cleanupDelay: 1450,       // 애니메이션 정리
  interval: 2200            // 반복 주기
};
```

## 🎯 코드 품질

- **ESLint**: 코드 품질 및 일관성 검사
- **TypeScript**: 타입 안전성 보장
- **모듈화**: 기능별 파일 분리 및 재사용성
- **클린 코드**: 불필요한 코드 제거 및 최적화

## 🚀 배포 준비 상태

- ✅ 빌드 성공 (에러 없음)
- ✅ 타입 체크 통과
- ✅ 린트 검사 통과 (warning 1개만 존재)
- ✅ 프로덕션 빌드 최적화 완료
- ✅ 번들 사이즈: ~277KB (gzip: ~91KB)

## 💡 향후 개선 사항

1. **실제 API 연동**: Mock 데이터를 실제 서버 데이터로 교체
2. **상태 관리**: Redux/Zustand 도입 (필요시)
3. **테스트**: Jest + React Testing Library 추가
4. **PWA**: 서비스 워커 및 오프라인 지원
5. **성능 최적화**: Code Splitting 및 Lazy Loading