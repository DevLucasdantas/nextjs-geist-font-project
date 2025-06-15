/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        primary: "#BB86FC",
        secondary: "#03DAC6",
        surface: "#1E1E1E",
        error: "#CF6679",
        textPrimary: "#FFFFFF",
        textSecondary: "#B3B3B3",
      },
      fontFamily: {
        sans: ['"Roboto"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
