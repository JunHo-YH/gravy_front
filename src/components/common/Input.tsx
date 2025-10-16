import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className = '', ...props }, ref) => {
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