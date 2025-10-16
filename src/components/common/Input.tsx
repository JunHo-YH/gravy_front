import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  blockKorean?: boolean;
}

const KOREAN_TO_ENGLISH_MAP: { [key: string]: string } = {
  // 자음
  'ㅂ': 'q', 'ㅃ': 'Q',
  'ㅈ': 'w', 'ㅉ': 'W',
  'ㄷ': 'e', 'ㄸ': 'E',
  'ㄱ': 'r', 'ㄲ': 'R',
  'ㅅ': 't', 'ㅆ': 'T',
  'ㅛ': 'y', 'ㅕ': 'u', 'ㅑ': 'i',
  'ㅐ': 'o', 'ㅒ': 'O',
  'ㅔ': 'p', 'ㅖ': 'P',
  'ㅁ': 'a',
  'ㄴ': 's',
  'ㅇ': 'd',
  'ㄹ': 'f',
  'ㅎ': 'g',
  'ㅗ': 'h', 'ㅘ': 'hk', 'ㅙ': 'ho', 'ㅚ': 'hl',
  'ㅓ': 'j', 'ㅝ': 'nj', 'ㅞ': 'np', 'ㅟ': 'nl',
  'ㅏ': 'k',
  'ㅣ': 'l',
  'ㅋ': 'z',
  'ㅌ': 'x',
  'ㅊ': 'c',
  'ㅍ': 'v',
  'ㅠ': 'b',
  'ㅜ': 'n',
  'ㅡ': 'm',
};

const convertKoreanToEnglish = (text: string): string => {
  return text.split('').map(char => KOREAN_TO_ENGLISH_MAP[char] || char).join('');
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className = '', blockKorean = false, onKeyDown, onChange, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (blockKorean) {
        if (e.nativeEvent.isComposing || e.keyCode === 229) {
          e.preventDefault();
          return;
        }
      }
      onKeyDown?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (blockKorean) {
        const originalValue = e.target.value;
        const convertedValue = convertKoreanToEnglish(originalValue);

        if (originalValue !== convertedValue) {
          e.target.value = convertedValue;
        }
      }
      onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-black text-gray-300 mb-2 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/0 via-red-500/0 to-red-600/0 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
          <input
            ref={ref}
            className={`
              relative w-full px-4 py-3 border-2 rounded-lg transition-all duration-300
              bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white placeholder-gray-600 font-medium
              shadow-lg shadow-black/50
              focus:outline-none focus:shadow-2xl focus:shadow-red-900/30
              ${error
                ? 'border-red-600 focus:border-red-500'
                : 'border-gray-700 hover:border-gray-600 focus:border-red-600'}
              ${className}
            `}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onCompositionStart={blockKorean ? (e) => e.preventDefault() : undefined}
            onCompositionUpdate={blockKorean ? (e) => e.preventDefault() : undefined}
            onCompositionEnd={blockKorean ? (e) => e.preventDefault() : undefined}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 font-bold">{error}</p>
        )}
        {helpText && !error && (
          <p className="mt-2 text-sm text-gray-500 font-medium">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';