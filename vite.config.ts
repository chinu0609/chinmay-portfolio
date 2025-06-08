import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Replace with your repo name exactly as it appears on GitHub
const repoName = "chinmay-portfolio"; // e.g., "portfolio-site" or "chinmay-portfolio"

export default defineConfig(({ mode }) => ({
  base: `/${repoName}/`, // 👈 Required for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
