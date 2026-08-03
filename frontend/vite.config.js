import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "https://blogplatformbackend-x6kjndrv.b4a.run",
      "/uploads": "https://blogplatformbackend-x6kjndrv.b4a.run",
    },
  },
});
