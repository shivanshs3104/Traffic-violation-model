/** @type {import('tailwindcss').Config} */
import { violet, indigo, pink } from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep indigo/violet palette
        'primary-dark': '#0d0b1a',
        'primary-medium': '#14122b',
        'primary-light': '#2b2750',
        // Neon accents
        'accent-violet': violet[400], // #a78bfa
        'accent-pink': pink[400], // #f472b6
        'accent-cyan': '#22d3ee',
      },
      fontFamily: {
        // Inter for body, Poppins for headings
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      // Glassmorphism helper
      backdropFilter: {
        blur: 'backdrop-blur(12px)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-hard': '0 8px 32px 0 rgba(167, 139, 250, 0.37)',
      },
      backgroundImage: {
        'login-bg':
          "url('https://images.unsplash.com/photo-1589828155685-83225f7d91f3?fm=jpg&q=60&w=3000')",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.glass-card': {
          'background': 'rgba(20, 18, 43, 0.65)', // primary-medium with alpha
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(167, 139, 250, 0.2)', // accent-violet with alpha
          'border-radius': '1rem', // 16px
          'box-shadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
      });
    },
  ],
};