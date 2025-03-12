import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel"; 
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind"; // ✅ Importamos Tailwind

export default defineConfig({
  adapter: vercel(),
  integrations: [react(), tailwind()], // ✅ Agregamos Tailwind como integración
  vite: {
    define: {
      "process.env.VITE_ENCODING": JSON.stringify("utf-8"),
    },
    css: {
      devSourcemap: true, // ✅ Evita que Vercel elimine CSS no usado
    },
  },
});
