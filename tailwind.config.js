/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'sans-serif'],
      },
      colors: {
        background: '#050505',
        card: '#111111',
      }
    },
  },
  plugins: [],
}
