import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { SignUpStep1 } from '../components/auth/SignUpStep1';
import { SignUpStep2 } from '../components/auth/SignUpStep2';
import { SignUpStep3 } from '../components/auth/SignUpStep3';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const SignUp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationPublicId, setVerificationPublicId] = useState('');
  const navigate = useNavigate();

  const handleStep1Complete = (email: string) => {
    setEmail(email);
    setCurrentStep(2);
  };

  const handleStep2Complete = (verificationPublicId: string) => {
    setVerificationPublicId(verificationPublicId);
    setCurrentStep(3);
  };

  const handleStep3Complete = () => {
    setCurrentStep(4); // 완료 화면
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300
              ${currentStep >= step ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50' : 'bg-gray-900 text-gray-600 border-2 border-gray-800'}
              ${currentStep === step ? 'ring-4 ring-red-900/30 scale-110' : ''}
            `}>
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {index < 2 && (
              <div className={`
                flex-1 h-1 mx-2 transition-all duration-300 rounded-full
                ${currentStep > step ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gray-800'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-bold tracking-wide">
        <span>이메일 인증</span>
        <span>인증번호 확인</span>
        <span>계정 생성</span>
      </div>
    </div>
  );

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

        <Card className="bg-gradient-to-br from-gray-950 via-black to-gray-950 border-2 border-gray-800 shadow-2xl shadow-red-900/20 hover:border-gray-700 hover:shadow-red-900/30 transition-all duration-500">
          {currentStep <= 3 && renderProgressBar()}

          {currentStep === 1 && (
            <SignUpStep1 
              onNext={handleStep1Complete}
              initialEmail={email}
            />
          )}

          {currentStep === 2 && (
            <SignUpStep2
              email={email}
              onNext={handleStep2Complete}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <SignUpStep3
              verificationPublicId={verificationPublicId}
              onComplete={handleStep3Complete}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-red-900/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-800/20 rounded-full blur-xl"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/60 border-4 border-red-900">
                  <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tight">가입 완료!</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  <span className="text-red-500 font-black">GRAVY</span>에 오신 것을 환영합니다!<br />
                  지금 바로 경매에 참여해보세요
                </p>
              </div>

              <Button
                onClick={handleLoginRedirect}
                className="w-full group"
              >
                로그인하러 가기
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};