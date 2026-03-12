/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        fastr: {
          primary: '#1B365D',       // Dark blue
          'primary-dark': '#122544', // Deeper navy
          'primary-light': '#2A4A7A', // Lighter navy
          secondary: '#00A9CE',     // Teal
          'secondary-light': '#33BFDB', // Light teal
          accent: '#F7941D',        // Orange
          'accent-light': '#FAAB4A', // Light orange
          light: '#E8F4F8',         // Light blue
          'light-warm': '#F0F7FA',  // Warm light bg
        },
      },
    },
  },
  plugins: [],
}
