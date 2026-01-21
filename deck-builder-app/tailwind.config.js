/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fastr: {
          primary: '#0F4C5C',
          secondary: '#5F9EA0',
          accent: '#E36414',
          light: '#CAE6E9',
          dark: '#1a1a2e',
        }
      }
    },
  },
  plugins: [],
}
