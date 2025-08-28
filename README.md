# 🏆 Gravy - 실시간 경매 플랫폼

> **세상에서 가장 부드러운 애니메이션을 가진 프리미엄 경매 플랫폼**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✨ 주요 특징

### 🎭 **실크처럼 부드러운 애니메이션**
- **완벽한 타이밍**: 375ms 동기화로 물흐르듯 자연스러운 알림 슬라이딩
- **프리미엄 이징**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` 실크 같은 부드러움
- **하드웨어 가속**: GPU 가속으로 60FPS 매끄러운 성능

### 📊 **생동감 넘치는 통계**
- **카운트업 애니메이션**: 숫자들이 살아 움직이는 듯한 증가 효과
- **순차적 완성**: 각기 다른 속도로 자연스러운 시각적 리듬
- **동적 포맷팅**: 천 단위 구분, 접두사/접미사 지원

### 🎨 **프리미엄 디자인**
- **색상 코딩**: 마감 임박(🔴), 낙찰 성공(🟢), 신규 경매(🔵)
- **Shimmer 효과**: 고급스러운 반짝임으로 프리미엄 느낌 연출
- **완벽한 반응형**: 모든 기기에서 아름다운 경험

---

## 🚀 빠른 시작

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/JunHo-YH/gravy_front.git
cd gravy_front

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 미리보기
npm run preview

# 코드 검사
npm run lint

# 타입 검사
npx tsc --noEmit
```

---

## 🏗️ 아키텍처

### 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── common/         # 공통 컴포넌트 (Button, Card, Notification 등)
│   ├── auth/           # 인증 관련 컴포넌트
│   └── landing/        # 랜딩 페이지 전용 컴포넌트
├── hooks/              # 커스텀 React 훅
│   ├── useCountUp.ts   # 숫자 카운팅 애니메이션
│   └── useNotificationAnimation.ts # 알림 슬라이딩 애니메이션
├── constants/          # 상수 및 목업 데이터
├── contexts/           # React Context (인증 등)
├── services/           # API 통신 레이어
├── types/              # TypeScript 타입 정의
└── pages/              # 페이지 컴포넌트
```

### 🎯 핵심 기술 스택

| 기술 | 용도 | 버전 |
|------|------|------|
| **React 18** | UI 라이브러리 | `^18.2.0` |
| **TypeScript** | 타입 안전성 | `^5.0.0` |
| **Vite** | 빌드 도구 | `^5.4.8` |
| **Tailwind CSS** | 스타일링 | `^3.4.1` |
| **React Router** | 라우팅 | `^6.22.3` |
| **Lucide React** | 아이콘 | `^0.368.0` |

---

## 🎭 애니메이션 시스템

### ⏱️ 완벽한 타이밍 동기화

```typescript
const ANIMATION_CONFIG = {
  slideOutUp: '0.75s',      // 위로 사라지기
  slideInUp: '0.7s',        // 아래에서 등장  
  moveUp: '0.75s',          // 중간 알림들 위로 이동
  newNotificationDelay: 375, // 새 알림 등장 딜레이
  cleanupDelay: 1450,       // 애니메이션 정리
  interval: 2200            // 반복 주기
};
```

### 🎨 프리미엄 이징 함수

```css
/* 실크처럼 부드러운 움직임 */
.notification-exit {
  animation: slideOutUp 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* 자연스러운 등장 */
.notification-enter {
  animation: slideInUp 0.7s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
}
```

---

## 📱 반응형 디자인

### 🖥️ 지원 해상도
- **Mobile**: 360px ~ 767px (완벽한 터치 최적화)
- **Tablet**: 768px ~ 1023px (터치 + 마우스 혼합)
- **Desktop**: 1024px+ (풀 마우스 인터랙션)

### 🎯 성능 지표
- **번들 크기**: 277KB → 91KB (gzip 압축)
- **First Paint**: < 1.2초
- **Interactive**: < 2.5초
- **CLS**: < 0.1 (레이아웃 변경 최소화)

---

## 🧪 개발 및 테스트

### 📋 품질 보증

```bash
# ESLint 검사 (코드 품질)
npm run lint

# TypeScript 검사 (타입 안전성)  
npx tsc --noEmit

# 빌드 테스트 (프로덕션 준비성)
npm run build
```

### 🔧 개발 도구
- **Hot Reload**: Vite의 초고속 HMR
- **TypeScript**: 엄격한 타입 검사
- **ESLint**: 코드 품질 보장
- **Prettier**: 일관된 코드 포맷팅

---

## 🚀 배포

### 🌐 지원되는 플랫폼

| 플랫폼 | 설정 난이도 | 추천도 |
|--------|-------------|--------|
| **Vercel** | ⭐ 쉬움 | 🏆 최고 |
| **Netlify** | ⭐ 쉬움 | 🥇 우수 |
| **GitHub Pages** | ⭐⭐ 보통 | 🥈 좋음 |
| **AWS S3** | ⭐⭐⭐ 어려움 | 🥉 가능 |

### ⚡ 원클릭 배포 (Vercel)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포 실행
vercel --prod
```

자세한 배포 가이드는 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참고하세요.

---

## 🎨 디자인 시스템

### 🎭 컬러 팔레트

| 용도 | 색상 | 설명 |
|------|------|------|
| **Primary** | `#FACC15` → `#F59E0B` | 브랜드 그라데이션 |
| **Success** | `#10B981` | 낙찰, 성공 |
| **Warning** | `#EF4444` | 마감 임박, 긴급 |
| **Info** | `#3B82F6` | 새 경매, 일반 정보 |
| **Neutral** | `#64748B` | 텍스트, 보조 정보 |

### 📐 타이포그래피

- **제목**: `text-4xl` ~ `text-6xl` (36px ~ 60px)
- **부제목**: `text-2xl` ~ `text-3xl` (24px ~ 30px)  
- **본문**: `text-base` (16px)
- **캡션**: `text-sm` (14px)

---

## 🤝 기여하기

### 🔄 개발 워크플로

1. **Fork** 저장소
2. **Feature 브랜치** 생성: `git checkout -b feature/amazing-feature`
3. **커밋**: `git commit -m 'Add amazing feature'`
4. **푸시**: `git push origin feature/amazing-feature`
5. **Pull Request** 생성

### 📝 커밋 컨벤션

```
🎨 feat: 새로운 기능 추가
🐛 fix: 버그 수정  
📚 docs: 문서 수정
💎 style: 코드 스타일 변경
♻️  refactor: 코드 리팩토링
⚡ perf: 성능 개선
✅ test: 테스트 추가/수정
🔧 chore: 기타 변경사항
```

---

## 📄 라이선스

이 프로젝트는 MIT License 하에 배포됩니다.

---

## 👨‍💻 개발자

**JunHo-YH**
- GitHub: [@JunHo-YH](https://github.com/JunHo-YH)

---

## 🙏 감사의 말

이 프로젝트는 **Claude Code**와 함께 개발되었습니다.

- **React Team**: 훌륭한 라이브러리 제공
- **Tailwind Labs**: 아름다운 유틸리티 CSS
- **Vite Team**: 초고속 빌드 도구
- **TypeScript Team**: 타입 안전성 보장

---

<div align="center">

### 🌟 **실크처럼 부드러운 경험을 제공하는 Gravy**

**[📖 문서](./ARCHITECTURE.md)** • **[🔧 배포 가이드](./DEPLOYMENT_GUIDE.md)**

---

*Made with ❤️ and lots of ☕ by JunHo-YH*

</div>
