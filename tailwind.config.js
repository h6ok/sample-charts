/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-green": "#4CAF50",
        "primary-blue": "#2196f3",
      },
    },
  },
  plugins: [],
};
