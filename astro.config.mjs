import { defineConfig } from "astro/config";
import react from "@astrojs/react"; // 👈 Importar el soporte para React

export default defineConfig({
  integrations: [react()], // 👈 Agregar React como integración
});