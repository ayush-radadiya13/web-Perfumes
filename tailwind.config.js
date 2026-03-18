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
        ink: '#1a1523',
        plum: '#4c1d4a',
        gold: '#c9a227',
        cream: '#faf7f2',
        brown: {
          DEFAULT: '#5c4033',
          light: '#8b6914',
          dark: '#3d2a1f',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        sans: ['system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
