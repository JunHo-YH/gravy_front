/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        stamp: {
          '0%': { transform: 'translate(200px, -600px) rotate(-12deg) scale(2)', opacity: '0' },
          '45%': { transform: 'translate(0, -20px) rotate(-12deg) scale(1)', opacity: '1' },
          '50%': { transform: 'translate(0, 0) rotate(-12deg) scale(1)', opacity: '1' },
          '55%': { transform: 'translate(0, 15px) rotate(-12deg) scale(1.25)', opacity: '1' },
          '65%': { transform: 'translate(0, -5px) rotate(-12deg) scale(0.92)', opacity: '1' },
          '75%': { transform: 'translate(0, 5px) rotate(-12deg) scale(1.08)', opacity: '1' },
          '85%': { transform: 'translate(0, -2px) rotate(-12deg) scale(0.98)', opacity: '1' },
          '100%': { transform: 'translate(0, 0) rotate(-12deg) scale(1)', opacity: '1' },
        },
        blink2: {
          '0%, 100%': { opacity: '1' },
          '25%': { opacity: '0.3' },
          '50%': { opacity: '1' },
          '75%': { opacity: '0.3' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        policeLine: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        sendingArrow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        flyEmail: {
          '0%': { transform: 'translateX(-100%) translateY(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '50%': { transform: 'translateX(50%) translateY(-10px) rotate(5deg)' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateX(200%) translateY(-20px) rotate(10deg)', opacity: '0' },
        },
      },
      animation: {
        stamp: 'stamp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        blink2: 'blink2 1s ease-in-out',
        borderFlow: 'borderFlow 3s linear infinite',
        policeLine: 'policeLine 20s linear infinite',
        sendingArrow: 'sendingArrow 2s linear infinite',
        flyEmail: 'flyEmail 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
