/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rain: {
          dark: '#080E21',
          navy: '#0B132B',
          panel: '#151F3D',
          border: '#23335F',
          surface: '#1A264F',
          blue: '#38BDF8',
          electric: '#0EA5E9',
          cyan: '#22D3EE',
        },
        alert: {
          green: '#10B981',
          yellow: '#F59E0B',
          orange: '#F97316',
          red: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rain-drop': 'rainDrop 1.2s linear infinite',
        'alert-flash': 'alertFlash 1s ease-in-out infinite alternate',
      },
      keyframes: {
        rainDrop: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(25px)', opacity: '0' },
        },
        alertFlash: {
          '0%': { boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.9)' },
        },
      },
    },
  },
  plugins: [],
};
