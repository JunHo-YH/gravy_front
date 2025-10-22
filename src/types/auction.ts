export enum AuctionStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ONGOING = 'ONGOING',  // 서버에서 사용하는 진행중 상태
  COMPLETED = 'COMPLETED',
  ENDED = 'ENDED',  // 서버에서 사용하는 종료 상태
  CANCELLED = 'CANCELLED'
}

export enum Category {
  DIGITAL_DEVICE = 'DIGITAL_DEVICE',
  HOME_APPLIANCES = 'HOME_APPLIANCES',
  FURNITURE_INTERIOR = 'FURNITURE_INTERIOR',
  LIVING_KITCHEN = 'LIVING_KITCHEN',
  INFANT_CHILD = 'INFANT_CHILD',
  INFANT_BOOKS = 'INFANT_BOOKS',
  WOMEN_CLOTHING = 'WOMEN_CLOTHING',
  WOMEN_ACCESSORIES = 'WOMEN_ACCESSORIES',
  MEN_FASHION_ACCESSORIES = 'MEN_FASHION_ACCESSORIES',
  BEAUTY_CARE = 'BEAUTY_CARE',
  SPORTS_LEISURE = 'SPORTS_LEISURE',
  HOBBY_GAME_MUSIC = 'HOBBY_GAME_MUSIC',
  BOOKS = 'BOOKS',
  TICKETS_VOUCHERS = 'TICKETS_VOUCHERS',
  PROCESSED_FOOD = 'PROCESSED_FOOD',
  HEALTH_SUPPLEMENTS = 'HEALTH_SUPPLEMENTS',
  PET_SUPPLIES = 'PET_SUPPLIES',
  PLANTS = 'PLANTS',
  OTHER_USED_GOODS = 'OTHER_USED_GOODS'
}

export const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
  [Category.DIGITAL_DEVICE]: '디지털기기',
  [Category.HOME_APPLIANCES]: '생활가전',
  [Category.FURNITURE_INTERIOR]: '가구/인테리어',
  [Category.LIVING_KITCHEN]: '생활/주방',
  [Category.INFANT_CHILD]: '유아동',
  [Category.INFANT_BOOKS]: '유아도서',
  [Category.WOMEN_CLOTHING]: '여성의류',
  [Category.WOMEN_ACCESSORIES]: '여성잡화',
  [Category.MEN_FASHION_ACCESSORIES]: '남성패션/잡화',
  [Category.BEAUTY_CARE]: '뷰티/미용',
  [Category.SPORTS_LEISURE]: '스포츠/레저',
  [Category.HOBBY_GAME_MUSIC]: '취미/게임/음반',
  [Category.BOOKS]: '도서',
  [Category.TICKETS_VOUCHERS]: '티켓/교환권',
  [Category.PROCESSED_FOOD]: '가공식품',
  [Category.HEALTH_SUPPLEMENTS]: '건강기능식품',
  [Category.PET_SUPPLIES]: '반려동물용품',
  [Category.PLANTS]: '식물',
  [Category.OTHER_USED_GOODS]: '기타 중고물품'
};

export interface AuctionRegisterRequest {
  category: Category;
  title: string;
  description: string;
  startingPrice: number;
  minBidIncrement: number;
  auctionStartTime: string;
  auctionEndTime: string;
}

export interface AuctionRegisterResponse {
  id: number;
  title: string;
  description: string;
  category: Category;
  startingPrice: number;
  minBidIncrement: number;
  auctionStartTime: string;
  auctionEndTime: string;
  createdAt: string;
  imageUrls: string[];
}

export interface AuctionListRequest {
  page: number;
  size: number;
}

export interface AuctionSummary {
  id: number;
  auctionPublicId?: string;
  title: string;
  category: Category;
  status: AuctionStatus;
  currentPrice: number;
  auctionStartTime: string;
  auctionEndTime: string;
  thumbnailUrl?: string;
}

export interface AuctionListResponse {
  serverTime: string;
  auctions: AuctionSummary[];
  totalCount: number;
  page: number;
  size: number;
}

export interface AuctionDetailResponse {
  auctionPublicId: string;
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  status: AuctionStatus;
  auctionStartTime: string;
  auctionEndTime: string;
  bidCount: number;
  viewCount: number;
  sellerNickname: string;
  sellerPublicId: string;
  createdAt: string;
  updatedAt: string;
  imageUrls?: string[];
}

export interface Bid {
  bidPublicId: string;
  bidAmount: number;
  bidTime: string;
  bidderNickname: string;
  isWinning: boolean;
}