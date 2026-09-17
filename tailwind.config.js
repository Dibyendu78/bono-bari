/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        landing: {
          surface: "rgba(255,255,255,0.10)",
          "surface-hover": "rgba(255,255,255,0.16)",
          border: "rgba(255,255,255,0.10)",
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        kanit: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
