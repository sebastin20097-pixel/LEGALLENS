/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2.2s infinite',
        'fade-up': 'fade-up 0.8s ease-out both',
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(37, 99, 235, 0.35)',
        'glow-lg': '0 25px 80px -20px rgba(37, 99, 235, 0.45)',
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.08)',
        'card-hover':
          '0 2px 4px rgba(15, 23, 42, 0.05), 0 16px 40px -12px rgba(37, 99, 235, 0.18)',
      },
      backgroundImage: {
        'grid-slate':
          'linear-gradient(to right, rgba(15, 23, 42, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.045) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
