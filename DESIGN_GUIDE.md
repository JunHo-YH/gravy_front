# Gravy 디자인 가이드

## 브랜드 컬러 & 그라데이션

### 메인 브랜드 컬러
- **Yellow to Amber**: `from-yellow-500 to-amber-600` / `from-yellow-400 via-amber-500 to-orange-600`
- **Gray 계열**: `from-gray-600 via-gray-700 to-gray-800` (서브 텍스트용)

### 배경 & 레이아웃
- **메인 배경**: `bg-gradient-to-br from-blue-50 via-white to-yellow-50`
- **카드/섹션**: `bg-white rounded-2xl shadow-lg`
- **개발 진행 섹션**: `bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200`

## 타이포그래피 스타일

### 메인 히어로 타이틀
```tsx
<h1 className="text-6xl font-bold mb-8">
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800">
    실시간 경매의 
  </span>
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600">
    새로운 경험
  </span>
  <span className="inline-block ml-4 text-4xl">✨</span>
</h1>
```

### 섹션 타이틀 (브랜드명 강조)
```tsx
<h2 className="text-3xl font-bold mb-4">
  <span className="text-gray-900">한눈에 보는 </span>
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">
    Gravy
  </span>
</h2>
```

### 브랜드 로고 (헤더)
```tsx
<h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
  Gravy
</h1>
```

## 컴포넌트 스타일링 원칙

### 1. 그라데이션 사용
- **브랜드 요소**: yellow-amber 계열 그라데이션
- **서브 텍스트**: gray 계열 그라데이션으로 계층 구조 표현
- **배경**: 부드러운 blue-white-yellow 그라데이션

### 2. 간결함과 임팩트
- 불필요한 설명 텍스트 최소화
- 핵심 메시지에 집중
- 시각적 요소 (✨, 아이콘) 적절히 활용

### 3. 상태 표시
- **완료**: `bg-green-500` (녹색 원)
- **진행중**: `bg-yellow-500 animate-pulse` (노란색 원 + 애니메이션)
- **예정**: `bg-gray-300` (회색 원)

### 4. 카드 디자인
- 기본: `bg-white rounded-2xl shadow-lg p-8`
- 특별 섹션: gradient 배경 + border 조합

## 개발 진행 상황 표시 스타일

```tsx
<div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-12">
  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
    <span className="text-2xl">🚧</span>
  </div>
  <h2 className="text-3xl font-bold text-gray-900 mb-4">개발 진행 중</h2>
  <!-- 진행 상황 표시 -->
</div>
```

## 헤더 인증 상태별 버튼

### 미로그인
```tsx
<Link to="/login">
  <Button variant="outline" size="sm">
    <LogIn className="w-4 h-4 mr-2" />
    로그인
  </Button>
</Link>
<Link to="/signup">
  <Button size="sm">
    <UserPlus className="w-4 h-4 mr-2" />
    회원가입
  </Button>
</Link>
```

### 로그인됨
```tsx
<Link to="/dashboard">
  <Button size="sm">대시보드</Button>
</Link>
```

## 주요 디자인 철학

1. **브랜드 일관성**: Gravy 브랜드명은 항상 yellow-amber 그라데이션
2. **계층적 시각화**: 중요도에 따른 색상 및 크기 차별화
3. **미니멀 & 임팩트**: 간결하면서도 강렬한 인상
4. **개발 친화적**: 현재 개발 단계를 명확히 표시
5. **상태 기반 UI**: 로그인 상태에 따른 적절한 UI 변화

## 현재 적용된 페이지 구조

- **Landing (/)**: 공개 랜딩 페이지
- **Dashboard (/dashboard)**: 보호된 대시보드
- **Login (/login)**, **SignUp (/signup)**: 인증 페이지

모든 디자인은 이 가이드를 기반으로 일관성을 유지합니다.