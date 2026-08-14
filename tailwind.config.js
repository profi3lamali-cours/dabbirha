/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'Tajawal', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#eef4f2', 100: '#d7e5e0', 200: '#b0cbc2', 300: '#82ac9f',
          400: '#5a8d7d', 500: '#3d6f60', 600: '#2c554a', 700: '#234439',
          800: '#1c352e', 900: '#152722', 950: '#0d1815',
        },
        sand: {
          50: '#fbf8f3', 100: '#f5ecdd', 200: '#e9d7b4', 300: '#dcbe84',
          400: '#d1a75c', 500: '#c1913f', 600: '#a4772f', 700: '#815d27',
          800: '#664b24', 900: '#553f21',
        },
        clay: {
          400: '#e08a6b', 500: '#d16a45', 600: '#b8543a',
        },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(21, 39, 34, 0.08), 0 1px 2px rgba(21,39,34,0.04)',
        card: '0 4px 20px -4px rgba(21, 39, 34, 0.10)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
