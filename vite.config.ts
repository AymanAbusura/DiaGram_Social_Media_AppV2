import path from "path"
import react from "@vitejs/plugin-react"
import { createFilter, defineConfig } from "vite"
import svgr from 'vite-plugin-svgr'


function removeUseClient() {
  const filter = createFilter(/.*\.(js|ts|jsx|tsx)$/);

  return {
    name: 'remove-use-client',

    transform(code: string, id: string) {
      if (!filter(id)) {
        return null;
      }

      const newCode = code.replace(/['"]use client['"];\s*/g, '');

      return  { code: newCode, map: null };
    },
  };
}

export default defineConfig({
  plugins: [react(), svgr(), removeUseClient()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ui": path.resolve(__dirname, '../../packages/ui/src')
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
