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
    },
  },
  plugins: [],
}