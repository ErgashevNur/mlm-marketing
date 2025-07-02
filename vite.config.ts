import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // SPA routing uchun muhim
  build: {
    outDir: "dist", // build papka nomi
    chunkSizeWarningLimit: 1000, // ogohlantirish chegarasi
  },
  server: {
    port: 3000,     // dev server porti
    open: true,     // avtomatik browser ochiladi
  },
});
