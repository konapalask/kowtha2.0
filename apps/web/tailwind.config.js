/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7fb',
          100: '#d2e2f1',
          200: '#a1bddb',
          300: '#6c8fbb',
          400: '#3f6a9a',
          500: '#1f4f84',
          600: '#00396e',
          700: '#002b55',
          800: '#001d3a',
          900: '#001326',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};