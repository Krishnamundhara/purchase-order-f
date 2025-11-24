/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f5fd',
          100: '#f1eafb',
          200: '#e6d5f7',
          300: '#d4b2ef',
          400: '#ba82e4',
          500: '#9d56d4',
          600: '#8B00FF',
          700: '#6A0DAD',
          800: '#4B0082',
          900: '#2E0854',
        },
        secondary: {
          50: '#f0fffe',
          100: '#ccf7f5',
          200: '#99f0f0',
          300: '#66e8eb',
          400: '#33e0e6',
          500: '#00CED1',
          600: '#00a8a8',
          700: '#008B8B',
          800: '#006994',
          900: '#003366',
        },
        accent: {
          50: '#ffe5ec',
          100: '#ffccdd',
          200: '#ffb6c1',
          300: '#ff9db3',
          400: '#ff849b',
          500: '#ff6a82',
          600: '#C71585',
          700: '#800080',
          800: '#4B0082',
          900: '#2E0854',
        },
        neutral: {
          50: '#f7f9fa',
          100: '#e8eef3',
          200: '#d0dce6',
          300: '#b8cbd9',
          400: '#a0bacc',
          500: '#88a9bf',
          600: '#708090',
          700: '#586a7d',
          800: '#2F4F4F',
          900: '#1C1C1C',
        },
      },
    },
  },
  plugins: [forms],
}
