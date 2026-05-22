// ============================================
// Configuration Tailwind CSS
// Palette de couleurs ESIGN : bleu nuit, bleu électrique
// ============================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx}',
  ],
  // Mode sombre activé par classe CSS
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        esign: {
          dark: '#000010',
          darker: '#000008',
          blue: '#0a0a2e',
          card: 'rgba(10, 15, 40, 0.7)',
          electric: '#4488ff',
          lightblue: '#6699ff',
          accent: '#ffb347',
          success: '#00cc88',
          error: '#ff4455',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(68, 136, 255, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(68, 136, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};