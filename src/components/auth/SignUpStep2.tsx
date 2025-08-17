import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Shield, ArrowRight, RotateCcw } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { verifyEmailCode, sendVerificationCode, ApiError } from '../../services/api';

const schema = yup.object().shape({
  verificationCode: yup.string().matches(/^\d{6}$/, '6자리 숫자를 입력해주세요').required('인증번호를 입력해주세요')
});

interface SignUpStep2Props {
  email: string;
  onNext: (verificationPublicId: string) => void;
  onBack: () => void;
}

interface FormData {
  verificationCode: string;
}

export const SignUpStep2: React.FC<SignUpStep2Props> = ({ email, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  // 타이머 효과
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResendCode = async () => {
    setResending(true);
    setServerError('');

    try {
      await sendVerificationCode({ email });
      setTimeLeft(180); // 타이머 재시작
      setServerError(''); // 기존 에러 메시지 클리어
    } catch (error) {
      if (error instanceof ApiError) {
        // 서버에서 보내는 메시지를 그대로 사용
        setServerError(error.message || '인증번호 재발송에 실패했습니다.');
      } else {
        setServerError('네트워크 오류가 발생했습니다. 연결을 확인해주세요.');
      }
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError('');

    try {
      const response = await verifyEmailCode({
        email,
        verificationCode: data.verificationCode
      });
      
      console.log('인증번호 검증 응답:', response);
      console.log('verificationPublicId:', response.verificationPublicId);
      console.log('verificationPublicId 타입:', typeof response.verificationPublicId);
      
      onNext(response.verificationPublicId);
    } catch (error) {
      if (error instanceof ApiError) {
        // 서버에서 보내는 메시지를 그대로 사용
        setServerError(error.message || '인증번호 확인에 실패했습니다.');
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
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">인증번호 확인</h2>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold text-gray-900">{email}</span>로 발송된<br />
          6자리 인증번호를 입력해주세요
        </p>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-sm font-mono ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-500'}`}>
            {formatTime(timeLeft)}
          </span>
          {timeLeft <= 0 && (
            <span className="text-sm text-red-500">인증번호가 만료되었습니다</span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('verificationCode')}
          type="text"
          label="인증번호"
          placeholder="6자리 숫자 입력"
          error={errors.verificationCode?.message}
          maxLength={6}
          className="text-center text-lg tracking-widest font-mono"
          autoComplete="one-time-code"
          autoFocus
        />

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
            disabled={timeLeft <= 0}
            className="flex-1 group"
          >
            확인
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendCode}
            loading={resending}
            disabled={timeLeft > 120} // 1분이 지난 후에 재발송 가능
            className="text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            인증번호 재발송
          </Button>
        </div>
      </form>
    </div>
  );
};