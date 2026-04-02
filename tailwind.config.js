/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        bg: '#0A0A0F',
        accent: {
          purple: '#7B61FF',
          pink: '#FF3CAC',
        },
        success: '#00D4AA',
        warning: '#FFD93D',
        danger: '#FF6B35',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'pulse-orb': 'pulseOrb 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseOrb: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
