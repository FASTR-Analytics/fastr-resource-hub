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
      // Design-system type scale (Inter, web surface)
      fontSize: {
        display:   ['30px', { lineHeight: '1.2',  fontWeight: '700' }],
        h1:        ['24px', { lineHeight: '1.3',  fontWeight: '700' }],
        h2:        ['20px', { lineHeight: '1.35', fontWeight: '600' }],
        h3:        ['17px', { lineHeight: '1.4',  fontWeight: '600' }],
        body:      ['15px', { lineHeight: '1.5',  fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5',  fontWeight: '400' }],
        caption:   ['12px', { lineHeight: '1.4',  fontWeight: '500' }],
      },
      // Additive radii; Tailwind defaults preserved
      borderRadius: {
        xs: '4px',
        pill: '9999px',
      },
      // Additive shadows; defaults preserved
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.05), 0 0 0 1px rgba(0,0,0,.05)',
        'card-hover': '0 4px 12px rgba(15,23,42,.08), 0 0 0 1px rgba(0,0,0,.05)',
        elevated: '0 12px 32px rgba(15,23,42,.12)',
      },
      ringColor: {
        focus: '#00A9CE',
      },
    },
  },
  plugins: [],
}
