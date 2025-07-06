/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: 'rgb(75, 56, 48)',        // بني غامق
          olive: 'rgb(118, 125, 97)',     // زيتي
          brown: 'rgb(110, 49, 12)',     // بني محمر
          beige: 'rgb(208, 191, 168)',   // بيج فاتح
        },
      },
    },
  },
  plugins: [],
}

