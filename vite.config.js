// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v0/b/propertyapp-d6591.firebasestorage.app": {
        target: "https://firebasestorage.googleapis.com",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/v0\/b\/propertyapp-d6591\.firebasestorage\.app/,
            "/v0/b/propertyapp-d6591.firebasestorage.app"
          ),
      },
    },
  },
});
