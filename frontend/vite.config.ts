import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// Le backend FastAPI (PythonDCA/main.py) ne sert plus qu'un seul prefixe : la
// conversion tourne dans le navigateur, il ne reste que les comptes et la
// galerie. Les anciennes routes (/upload, /add_color, ...) n'existent plus.
const API_ROUTES = ["/api"]

const BACKEND = process.env.VITE_BACKEND_URL ?? "http://localhost:10000"

// https://vite.dev/config/
export default defineConfig({
  // Absolute, not "./": the app is client-side routed now, so /gallery must
  // resolve /assets/... from the site root rather than from the current path.
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  worker: {
    // A module worker, not the default IIFE. The conversion worker now imports the
    // segmentation runtime on demand, and a dynamic import is code splitting,
    // which an IIFE bundle cannot express. Module workers are everywhere that
    // matters (Chrome 80, Safari 15, Firefox 114).
    format: "es",
  },
  build: {
    // Le backend sert ce dossier : `npm run build` met a jour ce que voit la prod.
    outDir: path.resolve(__dirname, "../PythonDCA/dist"),
    emptyOutDir: true,
  },
  server: {
    // En dev, les appels API partent sur la meme origine (5173) et sont relayes au backend.
    proxy: Object.fromEntries(
      API_ROUTES.map((route) => [route, { target: BACKEND, changeOrigin: true }]),
    ),
  },
})
