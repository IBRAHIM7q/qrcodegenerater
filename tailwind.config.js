/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        cyber: {
          background: '#0f0f1c',
          card: '#1b1b2f',
          accent: '#22d3ee', // cyan-400
          'accent-hover': '#06b6d4', // cyan-500
        },
        'cyan-glow': 'rgba(34, 211, 238, 0.8)',
      },
      animation: { 
        'fade-in-scale': 'fadeInScale 0.5s ease-in-out', 
        'slide-in-right': 'slideInRight 0.5s ease-out forwards', 
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate' 
      }, 
      keyframes: { 
        fadeInScale: { 
          '0%': { opacity: '0', transform: 'scale(0.95)' }, 
          '100%': { opacity: '1', transform: 'scale(1)' }, 
        }, 
        slideInRight: { 
          '0%': { transform: 'translateX(50px)', opacity: '0' }, 
          '100%': { transform: 'translateX(0)', opacity: '1' }, 
        }, 
        glowPulse: { 
          '0%': { 'box-shadow': '0 0 8px #22d3ee, 0 0 12px #22d3ee, 0 0 16px #22d3ee' }, 
          '100%': { 'box-shadow': '0 0 12px #22d3ee, 0 0 24px #22d3ee, 0 0 32px #22d3ee' }, 
        } 
      }, 
      boxShadow: { 
        'glass': '0 4px 30px rgba(0, 0, 0, 0.2)', 
        'neon': '0 0 5px theme(colors.cyber.accent), 0 0 20px theme(colors.cyber.accent)', 
      },
    },
  },
  plugins: [],
}