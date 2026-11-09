/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#5865F2',
          purple: '#8B5CF6',
          cyan: '#22D3EE',
          dark: '#101828',
          darker: '#0B0F19',
          light: '#F8FAFC',
          cardDark: '#1E293B',
          borderDark: '#334155',
        },
        electric: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#5865F2',
          600: '#4752C4',
          700: '#3C45A5',
          800: '#313886',
          900: '#252968',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 50% -20%, rgba(88, 101, 242, 0.25), rgba(139, 92, 246, 0.15), transparent 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03))',
        'glass-gradient-light': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(88, 101, 242, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.6)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.18)',
        'glass-glow': '0 8px 32px 0 rgba(88, 101, 242, 0.25)',
        'premium': '0 20px 40px -15px rgba(88, 101, 242, 0.15)',
      },
    },
  },
  plugins: [],
};

