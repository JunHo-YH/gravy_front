import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UserPlus, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { signUp, ApiError } from '../../services/api';

const schema = yup.object().shape({
  nickname: yup.string()
    .min(2, '닉네임은 2자 이상이어야 합니다')
    .max(20, '닉네임은 20자 이하여야 합니다')
    .matches(/^[a-zA-Z0-9가-힣_]+$/, '닉네임은 한글, 영문, 숫자, 언더바(_)만 사용 가능합니다')
    .required('닉네임을 입력해주세요'),
  password: yup.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/, 
      '대문자, 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다')
    .required('비밀번호를 입력해주세요'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다')
    .required('비밀번호 확인을 입력해주세요')
});

interface SignUpStep3Props {
  verificationPublicId: string;
  onComplete: () => void;
  onBack: () => void;
}

interface FormData {
  nickname: string;
  password: string;
  confirmPassword: string;
}

export const SignUpStep3: React.FC<SignUpStep3Props> = ({ 
  verificationPublicId, 
  onComplete, 
  onBack 
}) => {
  console.log('SignUpStep3 받은 verificationPublicId:', verificationPublicId);
  console.log('verificationPublicId 타입:', typeof verificationPublicId);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const password = watch('password');

  // 비밀번호 강도 체크
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: '', color: '' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd)) score++;

    const levels = [
      { score: 0, text: '', color: '' },
      { score: 1, text: '매우 약함', color: 'text-red-500' },
      { score: 2, text: '약함', color: 'text-red-500' },
      { score: 3, text: '보통', color: 'text-yellow-500' },
      { score: 4, text: '강함', color: 'text-green-500' },
      { score: 5, text: '매우 강함', color: 'text-green-600' }
    ];

    return levels[Math.min(score, 5)];
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError('');

    try {
      const signUpData = {
        nickname: data.nickname,
        password: data.password,
        verificationPublicId
      };
      
      console.log('회원가입 요청 데이터:', signUpData);
      await signUp(signUpData);
      
      onComplete();
    } catch (error) {
      if (error instanceof ApiError) {
        // 서버에서 보내는 메시지를 그대로 사용
        setServerError(error.message || '회원가입에 실패했습니다.');
      } else {
        setServerError('네트워크 오류가 발생했습니다. 연결을 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">계정 생성</h2>
        <p className="text-gray-600">
          마지막 단계입니다! 닉네임과 비밀번호를 설정해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('nickname')}
          type="text"
          label="닉네임"
          placeholder="2-20자 내외로 입력해주세요"
          error={errors.nickname?.message}
          helpText="한글, 영문, 숫자, 언더바(_)만 사용 가능합니다"
          autoComplete="username"
        />

        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="비밀번호"
            placeholder="8자 이상, 대소문자+숫자+특수문자"
            error={errors.password?.message}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {password && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.score >= 4 ? 'bg-green-500' : 
                    passwordStrength.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${passwordStrength.color}`}>
                {passwordStrength.text}
              </span>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            이전
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1 group"
          >
            <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            가입 완료
          </Button>
        </div>
      </form>

      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>회원가입 시 Gravy의 이용약관과 개인정보 처리방침에 동의하게 됩니다</p>
      </div>
    </div>
  );
};