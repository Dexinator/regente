import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel"; // ✅ Importación correcta
import react from "@astrojs/react";

export default defineConfig({
  adapter: vercel(), // ✅ Adaptador correcto para Vercel
  integrations: [react()], // ✅ Si usas React
  vite: {
    define: {
      "process.env.VITE_ENCODING": JSON.stringify("utf-8"),
    },
  },
});