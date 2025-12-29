import react from "@vitejs/plugin-react";
import { LibraryFormats, defineConfig } from "vite";
import path from "node:path";
import type { Plugin } from "vite";
import { exec } from "node:child_process";

export default defineConfig(() => ({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "pages-components",
      fileName: "index",
      formats: ["es"] as LibraryFormats[], // typescript is unhappy without this forced type definition
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "mapbox-gl",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "index.css";
          }
          // Keep default naming for other assets (fonts, images, etc.)
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
}));

/** A custom plugin to generate TS types using tsup */
const dts = (): Plugin => ({
  name: "dts",
  buildEnd: (error) => {
    if (error) {
      return;
    }

    exec("tsup src/index.ts --format esm --dts-only", (err) => {
      if (err) {
        throw new Error("Failed to generate declaration files");
      }
    });
  },
});
