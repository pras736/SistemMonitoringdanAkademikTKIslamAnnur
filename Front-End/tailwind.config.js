/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tk-primary': '#4A5D3F',
        'tk-primary-light': '#6A8259',
        'tk-secondary': '#A3B18A',
        'tk-secondary-light': '#C4D0AF',
        'tk-bg': '#F4F5F0',
        'tk-card': '#FFFFFF',
        'tk-text': '#2C3524',
        'tk-muted': '#6B7262',
        'tk-border': '#E2E8DF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
