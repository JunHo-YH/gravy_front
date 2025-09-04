import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { registerAuction } from '../../services/api';
import { AuctionRegisterRequest, AuctionRegisterResponse } from '../../types/auction';

interface AuctionRegisterProps {
  onSuccess?: (auction: AuctionRegisterResponse) => void;
  onCancel?: () => void;
}

export const AuctionRegister: React.FC<AuctionRegisterProps> = ({
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<AuctionRegisterRequest>({
    title: '',
    description: '',
    category: '',
    startingPrice: 0,
    buyNowPrice: 0,
    auctionStartAt: '',
    auctionEndAt: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    '전자제품',
    '의류/패션',
    '도서/문구',
    '가구/인테리어',
    '스포츠/레저',
    '생활용품',
    '자동차/오토바이',
    '기타'
  ];

  const handleInputChange = (field: keyof AuctionRegisterRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };


  const validateForm = (): string | null => {
    if (!formData.title.trim()) return '제목을 입력해주세요.';
    if (!formData.description.trim()) return '상품 설명을 입력해주세요.';
    if (!formData.category) return '카테고리를 선택해주세요.';
    if (formData.startingPrice <= 0) return '시작 가격을 올바르게 입력해주세요.';
    if (formData.buyNowPrice <= 0) return '즉시구매가를 올바르게 입력해주세요.';
    if (!formData.auctionStartAt) return '경매 시작 시간을 입력해주세요.';
    if (!formData.auctionEndAt) return '경매 종료 시간을 입력해주세요.';
    
    const startTime = new Date(formData.auctionStartAt);
    const endTime = new Date(formData.auctionEndAt);
    const now = new Date();
    
    if (startTime <= now) return '경매 시작 시간은 현재 시간보다 이후여야 합니다.';
    if (endTime <= startTime) return '경매 종료 시간은 시작 시간보다 이후여야 합니다.';
    
    if (formData.buyNowPrice <= formData.startingPrice) {
      return '즉시구매가는 시작 가격보다 높아야 합니다.';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await registerAuction(formData);
      handleAuctionRegisterSuccess(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '경매 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTimeLocal = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const getMinDateTime = (): string => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return formatDateTimeLocal(now);
  };

  const handleAuctionRegisterSuccess = (response: AuctionRegisterResponse) => {
    alert(`경매가 성공적으로 등록되었습니다!\n경매 ID: ${response.auctionPublicId}`);
    onSuccess?.(response);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">경매 등록</h1>
          <p className="text-gray-600">새로운 경매를 등록해보세요.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="제목 *"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="경매 제목을 입력하세요"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="시작 가격 (원) *"
                type="number"
                min="1000"
                step="1000"
                value={formData.startingPrice || ''}
                onChange={(e) => handleInputChange('startingPrice', parseInt(e.target.value) || 0)}
                placeholder="1000"
                required
              />
            </div>

            <div>
              <Input
                label="즉시구매가 (원) *"
                type="number"
                min="1000"
                step="1000"
                value={formData.buyNowPrice || ''}
                onChange={(e) => handleInputChange('buyNowPrice', parseInt(e.target.value) || 0)}
                placeholder="1000"
                required
              />
            </div>

            <div>
              <Input
                label="경매 시작 시간 *"
                type="datetime-local"
                min={getMinDateTime()}
                value={formData.auctionStartAt}
                onChange={(e) => handleInputChange('auctionStartAt', e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="경매 종료 시간 *"
                type="datetime-local"
                min={formData.auctionStartAt || getMinDateTime()}
                value={formData.auctionEndAt}
                onChange={(e) => handleInputChange('auctionEndAt', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품 설명 *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              placeholder="상품에 대한 자세한 설명을 입력하세요"
              maxLength={2000}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/2000자
            </p>
          </div>


          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? '등록 중...' : '경매 등록'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};