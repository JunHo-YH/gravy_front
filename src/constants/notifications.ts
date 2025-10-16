export interface Notification {
  type: 'deadline' | 'success' | 'new';
  message: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
}

export interface VisibleNotification {
  index: number;
  id: string;
  isExiting: boolean;
  isEntering: boolean;
  isMovingUp: boolean;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  { type: 'deadline', message: '"빈티지 카메라" 경매가 5분 후 마감됩니다.', bgColor: 'bg-red-950/50', borderColor: 'border-red-600/50', textColor: 'text-red-400', icon: '⏰' },
  { type: 'success', message: '"스마트폰 케이스" 경매에서 낙찰되었습니다!', bgColor: 'bg-gray-900/50', borderColor: 'border-gray-600', textColor: 'text-gray-300', icon: '🎉' },
  { type: 'new', message: '새로운 "전자기기" 카테고리 경매가 등록되었습니다.', bgColor: 'bg-gray-900/50', borderColor: 'border-gray-600', textColor: 'text-gray-300', icon: '📱' },
  { type: 'deadline', message: '"한정판 운동화" 경매가 2분 후 마감됩니다!', bgColor: 'bg-red-950/50', borderColor: 'border-red-600/50', textColor: 'text-red-400', icon: '⚠️' },
  { type: 'success', message: '"무선 이어폰" 경매에서 낙찰되었습니다!', bgColor: 'bg-gray-900/50', borderColor: 'border-gray-600', textColor: 'text-gray-300', icon: '✨' },
  { type: 'new', message: '"의류" 카테고리에 새 경매 건이 등록되었습니다.', bgColor: 'bg-gray-900/50', borderColor: 'border-gray-600', textColor: 'text-gray-300', icon: '👕' },
  { type: 'deadline', message: '"클래식 시계" 경매가 30초 후 마감됩니다!', bgColor: 'bg-red-950/50', borderColor: 'border-red-600/50', textColor: 'text-red-400', icon: '🔥' },
  { type: 'success', message: '"게임 콘솔" 경매가 성공적으로 완료되었습니다.', bgColor: 'bg-gray-900/50', borderColor: 'border-gray-600', textColor: 'text-gray-300', icon: '🏆' },
  { type: 'new', message: '"가전제품" 카테고리 특가 경매가 오픈되었습니다!', bgColor: 'bg-gray-900/50', borderColor: 'border-gray-600', textColor: 'text-gray-300', icon: '🔥' },
  { type: 'deadline', message: '"프리미엄 가방" 경매가 1분 후 마감됩니다.', bgColor: 'bg-red-950/50', borderColor: 'border-red-600/50', textColor: 'text-red-400', icon: '⏰' }
];