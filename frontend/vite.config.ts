import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig, type Plugin } from "vite"

import { llmsFullTxt, llmsTxt, robotsTxt, sitemapXml } from "./src/lib/crawler-files"
import { headManifest } from "./src/lib/head-manifest"

/**
 * robots.txt, sitemap.xml, llms.txt and llms-full.txt, generated at build time.
 *
 * They are not in public/ because they all repeat the same facts — the origin, the
 * list of routes, what each page is for — and four hand-kept copies of that drift the
 * first time a route is added, silently: nothing breaks when a sitemap lists a URL
 * that no longer exists. Generated, a new page reaches all four by being added to
 * `indexable` in src/lib/routes.ts, and moving to a real domain is one line in
 * src/lib/site.ts.
 *
 * `apply: "build"` because the dev server does not need them, and `emitFile` rather
 * than writing to disk so they land in whatever outDir the build is using.
 */
function crawlerFiles(): Plugin {
  return {
    name: "ptd-crawler-files",
    apply: "build",
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const files: Array<[string, string]> = [
        ["robots.txt", robotsTxt()],
        ["sitemap.xml", sitemapXml(today)],
        ["llms.txt", llmsTxt()],
        ["llms-full.txt", llmsFullTxt()],
        // Not for crawlers directly — for the Python server, which reads it to put
        // a real head on the HTML it sends. See src/lib/head-manifest.ts: without
        // it every route ships index.html's defaults to anything that does not run
        // JavaScript, which is every AI crawler.
        ["head-manifest.json", JSON.stringify(headManifest(), null, 1)],
      ]
      for (const [fileName, source] of files) {
        this.emitFile({ type: "asset", fileName, source })
      }
    },
  }
}

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
  plugins: [react(), tailwindcss(), crawlerFiles()],
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
