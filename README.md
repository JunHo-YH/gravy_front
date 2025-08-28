# 🏆 Gravy - 실시간 경매 플랫폼

> **현대적인 웹 기술로 구현한 실시간 경매 서비스**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📖 프로젝트 소개

**Gravy**는 사용자 친화적인 실시간 경매 플랫폼입니다. 직관적인 UI/UX와 부드러운 애니메이션을 통해 경매 참여의 재미와 편의성을 극대화했습니다.

### 🎯 주요 목적
- **실시간 경매 정보 제공**: 마감 임박, 낙찰 성공, 신규 등록 알림
- **사용자 경험 최적화**: 직관적인 인터페이스와 반응형 디자인
- **현대적 웹 기술 활용**: React 18, TypeScript, Tailwind CSS 기반

---

## ✨ 주요 기능

### 🔔 실시간 알림 시스템
- 경매 마감 임박 알림 (⏰ 빨간색)
- 낙찰 성공 알림 (🎉 초록색) 
- 새 경매 등록 알림 (📱 파란색)

### 📊 대시보드
- 실시간 경매 현황 통계
- 애니메이션이 적용된 카운터
- 직관적인 데이터 시각화

### 👤 사용자 인증
- 회원가입 / 로그인 시스템
- JWT 토큰 기반 인증
- 보안성 강화된 비밀번호 검증

---

## 🚀 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/JunHo-YH/gravy_front.git
cd gravy_front

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build
```

---

## 🛠️ 기술 스택

| 기술 | 용도 |
|------|------|
| **React 18** | UI 라이브러리 |
| **TypeScript** | 타입 안전성 |
| **Vite** | 빌드 도구 |
| **Tailwind CSS** | 스타일링 |
| **React Router** | 라우팅 |

---

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
├── hooks/              # 커스텀 React 훅
├── pages/              # 페이지 컴포넌트
├── constants/          # 상수 및 목업 데이터
├── contexts/           # React Context
├── services/           # API 통신 레이어
└── types/              # TypeScript 타입 정의
```

---

## 🌐 배포

### Vercel 배포
```bash
npm install -g vercel
vercel --prod
```

---

## 👨‍💻 개발자

**JunHo-YH**
- GitHub: [@JunHo-YH](https://github.com/JunHo-YH)

---

*Made with ❤️ by JunHo-YH*