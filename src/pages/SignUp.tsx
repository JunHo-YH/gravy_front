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
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
              ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
              ${currentStep === step ? 'ring-4 ring-blue-100' : ''}
            `}>
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {index < 2 && (
              <div className={`
                flex-1 h-1 mx-2 transition-all duration-200
                ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>이메일 인증</span>
        <span>인증번호 확인</span>
        <span>계정 생성</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2 hover:opacity-80 transition-opacity cursor-pointer">
              Gravy
            </h1>
          </Link>
          <p className="text-gray-600">실시간 경매 거래 플랫폼</p>
        </div>

        <Card>
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
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">가입 완료!</h2>
                <p className="text-gray-600">
                  Gravy에 오신 것을 환영합니다!<br />
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