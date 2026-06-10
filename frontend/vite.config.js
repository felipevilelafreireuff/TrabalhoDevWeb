import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendOrigin = env.VITE_BACKEND_ORIGIN || "http://localhost:8080";
  const backendContext = env.VITE_BACKEND_CONTEXT || "/devshop";

  return {
    base: mode === "production" ? env.VITE_BASE_PATH || "/TrabalhoDevWeb/" : "/",
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: backendOrigin,
          changeOrigin: true,
          cookiePathRewrite: {
            [backendContext]: "/"
          },
          rewrite: (path) => path.replace(/^\/api/, backendContext)
        }
      }
    }
  };
});
