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
      await login(data);
      authLogin();
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('로그인 실패:', error);
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-red-950/10 via-black to-black"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-800/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-red-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -inset-2 bg-red-500/10 blur-xl rounded-full"></div>

              <h1 className="relative text-4xl font-black bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 hover:from-red-600 hover:via-red-400 hover:to-red-600 bg-clip-text text-transparent mb-2 transition-all duration-700 cursor-pointer tracking-[0.2em] group">
                GRAVY
              </h1>
            </div>
          </Link>
          <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase">Real-Time Auction Platform</p>
        </div>

        <Card className="bg-gradient-to-br from-gray-950 via-black to-gray-950 border-2 border-gray-800 shadow-2xl shadow-red-900/20 transition-all duration-700" onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 60px 8px rgba(220, 38, 38, 0.4), 0 0 30px 4px rgba(220, 38, 38, 0.3), 0 0 15px 2px rgba(220, 38, 38, 0.2), 0 25px 50px -12px rgba(220, 38, 38, 0.5)';
          e.currentTarget.style.borderColor = 'rgb(220, 38, 38)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '';
          e.currentTarget.style.borderColor = '';
        }}>
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-red-900/30 rounded-2xl blur-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-800/20 rounded-2xl blur-md"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-700 rounded-2xl flex items-center justify-center shadow-xl">
                <LogIn className="w-9 h-9 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">로그인</h2>
            <p className="text-gray-500 text-sm">
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
                blockKorean
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
                blockKorean
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
              <div className="p-3 bg-red-950/30 border-2 border-red-800/50 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-red-400 font-medium">{serverError}</p>
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
              <span className="px-4 text-sm text-gray-600 font-medium">또는</span>
              <div className="flex-1 border-t border-gray-800"></div>
            </div>

            <div className="space-y-2">
              <a href="/forgot-password" className="block text-sm text-red-500 hover:text-red-400 font-bold transition-all duration-300 hover:tracking-wide">
                비밀번호를 잊으셨나요?
              </a>
              <p className="text-sm text-gray-500">
                계정이 없으신가요?{' '}
                <a href="/signup" className="text-red-500 hover:text-red-400 font-black transition-all duration-300 hover:tracking-wide">
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