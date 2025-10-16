import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LogIn, Mail, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { login, ApiError } from '../services/api';

const schema = yup.object().shape({
  email: yup.string().email('올바른 이메일 형식이 아닙니다').required('이메일을 입력해주세요'),
  password: yup.string().required('비밀번호를 입력해주세요')
});

interface FormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const { login: authLogin } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError('');

    try {
      console.log('🔐 로그인 시도:', data);
      const response = await login(data);
      console.log('✅ 로그인 성공:', response);
      authLogin();
      // navigate 대신 window.location을 사용하여 완전히 새로고침
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('❌ 로그인 실패:', error);
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError('로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2 hover:from-red-400 hover:to-red-500 transition-all duration-300 cursor-pointer">
              GRAVY
            </h1>
          </Link>
          <p className="text-gray-400 text-sm font-medium tracking-wide">REAL-TIME AUCTION PLATFORM</p>
        </div>

        <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-red-900/30 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/50">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">로그인</h2>
            <p className="text-gray-400">
              계정에 로그인하여 경매에 참여해보세요
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                {...register('email')}
                type="email"
                label="이메일"
                placeholder="이메일을 입력해주세요"
                error={errors.email?.message}
                autoComplete="email"
                autoFocus
              />
              <Mail className="w-5 h-5 text-gray-400 absolute right-3 top-9" />
            </div>

            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요"
                error={errors.password?.message}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{serverError}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              로그인
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-800"></div>
              <span className="px-4 text-sm text-gray-600">또는</span>
              <div className="flex-1 border-t border-gray-800"></div>
            </div>

            <div className="space-y-2">
              <a href="/forgot-password" className="block text-sm text-red-500 hover:text-red-400 font-medium transition-colors">
                비밀번호를 잊으셨나요?
              </a>
              <p className="text-sm text-gray-500">
                계정이 없으신가요?{' '}
                <a href="/signup" className="text-red-500 hover:text-red-400 font-bold transition-colors">
                  회원가입하기
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};