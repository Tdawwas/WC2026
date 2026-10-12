/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Mono"', 'monospace'],
        serif: ['"Space Mono"', 'monospace'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        cream: {
          DEFAULT: '#FAF6F0',
          100: '#F0E8DC',
          200: '#E4DACB',
          300: '#D9CCBE',
          400: '#C4B49E',
        },
        bronze: {
          DEFAULT: '#B5956A',
          dark: '#8A745F',
          light: '#C4B49E',
        },
        maroon: '#8B0000',
        brown: {
          900: '#4A3728',
          700: '#6B4F3A',
          500: '#8A745F',
          300: '#9D8A76',
        },
      },
    },
  },
  plugins: [],
}
