import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { registerAuction } from '../../services/api';
import { AuctionRegisterRequest, Category, CATEGORY_DISPLAY_NAMES } from '../../types/auction';

interface AuctionRegisterProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  order: number;
}

export const AuctionRegister: React.FC<AuctionRegisterProps> = ({
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<AuctionRegisterRequest>({
    category: '' as Category,
    title: '',
    description: '',
    startingPrice: 0,
    minBidIncrement: 0,
    auctionStartTime: '',
    auctionEndTime: ''
  });

  const [images, setImages] = useState<ImageFile[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = Object.values(Category);

  // 컴포넌트 언마운트 시 미리보기 URL 정리
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const handleInputChange = (field: keyof AuctionRegisterRequest, value: string | number | Category) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    const remainingSlots = 3 - images.length;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];

      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        continue;
      }

      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('이미지 파일은 10MB 이하로 업로드해주세요.');
        continue;
      }

      newImages.push({
        id: `${Date.now()}-${i}`,
        file,
        preview: URL.createObjectURL(file),
        order: images.length + i
      });
    }

    setImages(prev => [...prev, ...newImages]);
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // 순서 재정렬
      return updated.map((img, i) => ({ ...img, order: i }));
    });
    URL.revokeObjectURL(images[index].preview);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // 순서 업데이트
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    setImages(reorderedImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return '제목을 입력해주세요.';
    if (!formData.description.trim()) return '상품 설명을 입력해주세요.';
    if (!formData.category) return '카테고리를 선택해주세요.';
    if (formData.startingPrice <= 0) return '시작 가격을 올바르게 입력해주세요.';
    if (formData.minBidIncrement <= 0) return '최소 입찰 단위를 올바르게 입력해주세요.';
    if (!formData.auctionStartTime) return '경매 시작 시간을 입력해주세요.';
    if (!formData.auctionEndTime) return '경매 종료 시간을 입력해주세요.';

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
      // 시간 형식에 초(:00) 추가
      const requestData: AuctionRegisterRequest = {
        ...formData,
        auctionStartTime: formData.auctionStartTime.includes(':00:')
          ? formData.auctionStartTime
          : `${formData.auctionStartTime}:00`,
        auctionEndTime: formData.auctionEndTime.includes(':00:')
          ? formData.auctionEndTime
          : `${formData.auctionEndTime}:00`
      };

      console.log('📤 전송할 경매 데이터:', requestData);
      console.log('📸 전송할 이미지:', images.length, '개');

      // 순서대로 정렬된 이미지 파일 배열
      const imageFiles = images
        .sort((a, b) => a.order - b.order)
        .map(img => img.file);

      await registerAuction(requestData, imageFiles);
      handleAuctionRegisterSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '경매 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuctionRegisterSuccess = () => {
    onSuccess?.();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 border-2 border-red-900/50 shadow-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
            경매 등록
          </h1>
          <p className="text-gray-300 font-medium">새로운 경매를 등록하고 거래를 시작해보세요</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border-2 border-red-700 rounded-xl shadow-md">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div>
            <Input
              label="📝 제목 *"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="매력적인 경매 제목을 입력하세요"
              maxLength={100}
              required
              className={formData.title ? 'border-red-600 bg-gray-800 ring-2 ring-red-900/50' : ''}
            />
            <p className="mt-1 text-sm text-gray-400 font-medium">
              ✨ {formData.title.length}/100자 - 명확하고 매력적인 제목이 더 많은 관심을 받습니다
            </p>
          </div>

          {/* 상품 설명 */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              📄 상품 설명 *
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 border-2 rounded-xl shadow-md transition-all duration-200 font-medium resize-none
                  ${formData.description
                    ? 'border-red-600 bg-gray-800 text-white ring-2 ring-red-900/50'
                    : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600'
                  }
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-900/50 placeholder-gray-600`}
                placeholder="상품의 상태, 특징, 구매 이유 등을 상세히 설명해주세요. 정확한 정보가 성공적인 거래로 이어집니다."
                maxLength={5000}
                required
              />
              {formData.description && (
                <div className="absolute top-3 right-3">
                  <span className="text-red-500">✓</span>
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-400 font-medium">
              📊 {formData.description.length}/5000자 - 상세한 설명이 구매자의 신뢰를 높입니다
            </p>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              📂 카테고리 *
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as Category)}
                className={`w-full px-4 py-3 border-2 rounded-xl shadow-md transition-all duration-200 font-medium
                  ${formData.category
                    ? 'border-red-600 bg-gray-800 text-white ring-2 ring-red-900/50'
                    : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600'
                  }
                  focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-900/50`}
                required
              >
                <option value="">✨ 카테고리를 선택해주세요</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {CATEGORY_DISPLAY_NAMES[category]}
                  </option>
                ))}
              </select>
              {formData.category && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-red-500">✓</span>
                </div>
              )}
            </div>
          </div>

          {/* 가격 정보 - 같은 행 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Input
                label="💰 시작 가격 (원) *"
                type="number"
                min="1"
                step="1"
                value={formData.startingPrice || ''}
                onChange={(e) => handleInputChange('startingPrice', parseInt(e.target.value) || 0)}
                placeholder="예: 10000"
                required
                className={formData.startingPrice ? 'border-red-600 bg-gray-800 ring-2 ring-red-900/50' : ''}
              />
            </div>

            <div>
              <Input
                label="⚡ 최소 입찰 단위 (원) *"
                type="number"
                min="1"
                step="1"
                value={formData.minBidIncrement || ''}
                onChange={(e) => handleInputChange('minBidIncrement', parseInt(e.target.value) || 0)}
                placeholder="예: 500"
                required
                className={formData.minBidIncrement ? 'border-red-600 bg-gray-800 ring-2 ring-red-900/50' : ''}
              />
            </div>
          </div>

          {/* 가격 정보 설명 */}
          <p className="text-sm text-gray-400 font-medium">
            💡 최소 입찰 단위는 경매에서 한 번에 올릴 수 있는 최소 입찰 금액입니다
          </p>

          {/* 시간 정보 - 같은 행 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Input
                label="🕐 경매 시작 시간 *"
                type="datetime-local"
                step="60"
                value={formData.auctionStartTime}
                onChange={(e) => handleInputChange('auctionStartTime', e.target.value)}
                required
                className={formData.auctionStartTime ? 'border-red-600 bg-gray-800 ring-2 ring-red-900/50' : ''}
              />
            </div>

            <div>
              <Input
                label="⏰ 경매 종료 시간 *"
                type="datetime-local"
                step="60"
                value={formData.auctionEndTime}
                onChange={(e) => handleInputChange('auctionEndTime', e.target.value)}
                required
                className={formData.auctionEndTime ? 'border-red-600 bg-gray-800 ring-2 ring-red-900/50' : ''}
              />
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              📸 상품 이미지 (최대 3개, 선택사항)
            </label>

            {/* 이미지 미리보기 */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group cursor-move border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                      draggedIndex === index ? 'opacity-50 scale-95' : 'hover:scale-105'
                    } ${
                      image.order === 0 ? 'border-red-600 ring-2 ring-red-900/50' : 'border-gray-700'
                    }`}
                  >
                    <img
                      src={image.preview}
                      alt={`미리보기 ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {image.order + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      ✕
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-white text-xs text-center font-medium">드래그하여 순서 변경</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 이미지 업로드 버튼 */}
            {images.length < 3 && (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-red-600 hover:bg-gray-800/50 transition-all duration-200">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-300 font-medium">
                    클릭하여 이미지 업로드
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {images.length}/3 · JPG, PNG, GIF (최대 10MB)
                  </p>
                </div>
              </label>
            )}

            <p className="mt-2 text-sm text-gray-400 font-medium">
              💡 첫 번째 이미지가 대표 이미지로 표시됩니다. 드래그하여 순서를 변경하세요.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-8 border-t-2 border-gray-800">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="px-8 py-3 border-2 border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-semibold transition-all duration-200"
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/70 transform hover:scale-105 transition-all duration-200"
            >
              {loading ? '🔄 등록 중...' : '🔨 경매 등록하기'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};