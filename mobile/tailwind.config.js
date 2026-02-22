/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#050505', // Ultra Dark
        surface: '#0a0a0a',    // Slightly lighter dark
        primary: '#00dc82',    // Sharp Green
        secondary: '#0070f3',  // Sharp Blue
        border: '#27272a',     // Zinc Border
      }
    },
  },
  plugins: [],
}

