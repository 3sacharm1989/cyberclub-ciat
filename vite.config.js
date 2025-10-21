import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Optional: helps if you deploy to subfolders (Vercel handles "/" fine)
  base: "/",

  // Local dev server configuration
  server: {
    port: 5173,
    open: true,

    // If you test against a local Express backend instead of Vercel API
    proxy: {
      "/api": {
        target: "http://localhost:4000", // comment this line out for Vercel/serverless mode
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Build settings (Vercel auto-detects these)
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
