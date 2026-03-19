/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/context/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Premium dark theme */
        dark: {
          DEFAULT: '#0a0a0a',
          bg: '#0a0a0a',
          elevated: '#111',
          card: '#141414',
          border: 'rgba(255,255,255,0.08)',
        },
        gold: {
          DEFAULT: '#d4a373',
          light: '#e8c9a8',
          dark: '#c58b2b',
          glow: 'rgba(212, 163, 115, 0.4)',
          gradient: 'linear-gradient(135deg, #d4a373 0%, #c58b2b 100%)',
        },
        ink: '#1a1523',
        plum: '#4c1d4a',
        purple: {
          DEFAULT: '#7B61FF',
          light: '#9b85ff',
          dark: '#5c47cc',
          glow: 'rgba(123, 97, 255, 0.4)',
        },
        cream: '#eaeaea',
        'cream-muted': '#9ca3af',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4a373 0%, #c58b2b 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #e8c9a8 0%, #d4a373 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
        'gold-glow': '0 0 20px rgba(212, 163, 115, 0.25), 0 0 40px rgba(197, 139, 43, 0.15)',
        'gold-glow-sm': '0 0 12px rgba(212, 163, 115, 0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.35s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
