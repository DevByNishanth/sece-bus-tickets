import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 7173,
      strictPort: true,
      host: true,
      allowedHosts: [".trycloudflare.com"],
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
          headers: {
            origin: env.TUNNEL_PUBLIC_URL || "http://localhost:7173",
          },
        },
      },
    },
  };
});
