/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
    "./components/**/*.{astro,js,jsx,ts,tsx}",
    "./layouts/**/*.{astro,js,jsx,ts,tsx}",
    "./pages/**/*.{astro,js,jsx,ts,tsx}", // ✅ Asegurar que analiza todas las páginas y componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
