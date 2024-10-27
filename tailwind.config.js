/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          light: '#fdf5e6',
          lightDark: '#ffedda',
          dark: '#6b705c',
          primary: '#cb997e',
          accent: '#ffb4a2',
          gold: '#FFD966',
          silver: '#D9D9D9',
          bronze: '#E8A87C',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
