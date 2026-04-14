/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Los colores de tu PDF
        institucional: {
          celeste: "#42C6FF",
          gris: "#C3C3C3",
          oscuro: "#08060d", // El fondo que ya veníamos usando
        },
      },
    },
  },
  plugins: [],
}