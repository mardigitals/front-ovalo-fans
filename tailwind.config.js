/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // <--- ¡darkmode se activa con la clase "dark" en el elemento raíz!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Los colores de logo oficiales de la marca, que se pueden usar en cualquier parte del proyecto
        institucional: {
          celeste: "#42C6FF",
          gris: "#C3C3C3",
          oscuro: "#08060d", //bg
        },
      },
    },
  },
  plugins: [],
}