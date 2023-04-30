/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        urdu:['Noto Nastaliq Urdu', 'serif']
      }
    },
  },
  plugins: [],
}

