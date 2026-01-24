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
          primary: '#1B365D',    // Dark blue
          secondary: '#00A9CE',  // Teal
          accent: '#F7941D',     // Orange
          light: '#E8F4F8',      // Light blue
        },
      },
    },
  },
  plugins: [],
}
