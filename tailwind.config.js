/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        choco: {
          950: '#1A0F08',
          900: '#2A1810',
          800: '#3B2418',
          700: '#4E3322',
          600: '#6D4C41',
          500: '#8D6E63',
          400: '#A1887F',
          300: '#D7CCC8',
          200: '#EFEBE9',
          100: '#F5F0EC',
        },
        gold: {
          50: '#FBF6E9',
          100: '#F7E9C3',
          200: '#EFD69B',
          300: '#E4BE6A',
          400: '#D4AF37',
          500: '#C29F2E',
          600: '#A07F22',
          700: '#7C6119',
        },
        cream: {
          50: '#FFFCF8',
          100: '#FFF8F2',
          200: '#FDF0E4',
          300: '#F9E4D0',
        },
        berry: '#E8638A',
        mint: '#7BC9A8',
        citrus: '#F2A65A',
        pistachio: '#9CB86E',
        coffee: '#5C4033',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 40px -8px rgba(212,175,55,0.45)',
        'choco': '0 20px 60px -15px rgba(59,36,24,0.55)',
        'soft': '0 10px 40px -12px rgba(59,36,24,0.25)',
      },
      backgroundImage: {
        'choco-radial': 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.12), transparent 60%)',
      },
      keyframes: {
        'float-up': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-120vh) rotate(360deg)', opacity: '0' },
        },
        'drift': {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-gold': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.5)' },
          '50%': { boxShadow: '0 0 0 12px rgba(212,175,55,0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'wave': {
          '0%,100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-25%)' },
        },
      },
      animation: {
        'float-up': 'float-up 12s linear infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-gold': 'pulse-gold 2.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        'wave': 'wave 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
