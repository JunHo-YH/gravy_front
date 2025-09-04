export enum AuctionStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface AuctionRegisterRequest {
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  buyNowPrice: number;
  auctionStartAt: string;
  auctionEndAt: string;
}

export interface AuctionRegisterResponse {
  auctionPublicId: string;
}

export interface AuctionListRequest {
  category?: string;
  status?: AuctionStatus;
  searchKeyword?: string;
  page: number;
  size: number;
}

export interface AuctionSummary {
  publicId: string;
  title: string;
  category: string;
  currentPrice: number;
  buyNowPrice: number;
  status: AuctionStatus;
  auctionEndAt: string;
  sellerNickname: string;
}

export interface AuctionListResponse {
  auctions: AuctionSummary[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
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
}

export interface Bid {
  bidPublicId: string;
  bidAmount: number;
  bidTime: string;
  bidderNickname: string;
  isWinning: boolean;
}