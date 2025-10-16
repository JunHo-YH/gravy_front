import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-black rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-900/50 hover:shadow-2xl hover:shadow-red-900/70 focus:ring-red-500 border-2 border-red-800 hover:border-red-600 hover:scale-[1.02]',
    secondary: 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white shadow-xl shadow-black/50 hover:shadow-2xl focus:ring-gray-500 border-2 border-gray-700 hover:border-gray-600',
    outline: 'border-2 border-gray-700 hover:border-red-600 text-gray-300 hover:text-white hover:bg-red-600/20 bg-transparent focus:ring-red-500 hover:shadow-lg hover:shadow-red-900/30',
    ghost: 'text-gray-400 hover:text-red-500 hover:bg-gray-900 focus:ring-red-500'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-7 py-4 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${loading ? '' : ''} ${className}`}
      disabled={disabled || loading}
      style={loading ? { opacity: 1 } : undefined}
      {...props}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      )}
      <span className="relative z-10 flex items-center">
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {children}
      </span>
    </button>
  );
};