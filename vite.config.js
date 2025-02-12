import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default {
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~bootstrap/scss/bootstrap";`,
      },
    },
  },
  optimizeDeps: {
    include: ["react-datepicker"],
  },
};
