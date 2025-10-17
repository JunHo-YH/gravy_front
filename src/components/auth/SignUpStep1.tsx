import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Navigation } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { checkEmailDuplicate, sendVerificationCode, ApiError } from '../../services/api';

const schema = yup.object().shape({
  email: yup.string()
    .required('이메일을 입력해주세요')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      '이메일 형식이 아닙니다.'
    )
});

interface SignUpStep1Props {
  onNext: (email: string) => void;
  initialEmail?: string;
}

interface FormData {
  email: string;
}

export const SignUpStep1: React.FC<SignUpStep1Props> = ({ onNext, initialEmail = '' }) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: initialEmail }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError('');

    try {
      await checkEmailDuplicate({ email: data.email });
      await sendVerificationCode({ email: data.email });
      onNext(data.email);
    } catch (error) {
      console.error('회원가입 1단계 오류:', error);
      if (error instanceof ApiError) {
        setServerError(error.message || '오류가 발생했습니다.');
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
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-red-900/30 rounded-2xl blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-800/20 rounded-2xl blur-md"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-700 rounded-2xl flex items-center justify-center shadow-xl">
            <Mail className="w-9 h-9 text-red-500" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">이메일 인증</h2>
        <p className="text-gray-500 text-sm">
          가입할 이메일 주소를 입력하면 인증번호를 발송해드립니다
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('email')}
          type="email"
          label="이메일 주소"
          placeholder="예: gravy@example.com"
          error={errors.email?.message}
          autoComplete="email"
          autoFocus
          disabled={loading}
          blockKorean
        />

        {serverError && (
          <div className="p-3 bg-red-950/30 border-2 border-red-800/50 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-red-400 font-medium">{serverError}</p>
            <details className="mt-2">
              <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-500 transition-colors">기술적 세부사항</summary>
              <p className="text-xs text-gray-500 mt-1">
                문제가 지속되면 개발자 도구(F12)의 Console 탭을 확인해주세요.
              </p>
            </details>
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          className="w-full group relative overflow-hidden"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-4">
              <span className="relative w-40 h-8 flex items-center" style={{overflow: 'hidden'}}>
                <span className="animate-sendingArrow whitespace-nowrap text-3xl font-black text-white absolute left-0" style={{letterSpacing: '0.5em', top: '-6px'}}>
                  ▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸
                </span>
                <span className="animate-sendingArrow whitespace-nowrap text-3xl font-black text-white absolute left-0" style={{letterSpacing: '0.5em', animationDelay: '-4s', top: '-6px'}}>
                  ▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸
                </span>
              </span>
              <span className="font-black text-white text-lg tracking-wide">발송 중</span>
            </span>
          ) : (
            <span className="font-bold text-lg tracking-wide">인증번호 발송</span>
          )}
          {!loading && <Navigation className="w-5 h-5 ml-2 fill-white stroke-white stroke-2 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            로그인하기
          </a>
        </p>
      </div>
    </div>
  );
};