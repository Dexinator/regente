import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";

export default defineConfig({
  output: "server", // 🔵 Asegura que la app no sea tratada como estática en Vercel
  adapter: vercel(),
  integrations: [react()],
  vite: {
    define: {
      "process.env.VITE_ENCODING": JSON.stringify("utf-8"),
    },
  },
});
