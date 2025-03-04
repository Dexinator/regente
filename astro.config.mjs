import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/server"; // ✅ Importar el adaptador de Vercel
import react from "@astrojs/react"; // ✅ Si usas React en Astro

export default defineConfig({
  adapter: vercel(), // ✅ Usar el adaptador de Vercel
  integrations: [react()], // ✅ Integración con React
});
