import react from "@vitejs/plugin-react";
import { LibraryFormats, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";
import { copyFileSync } from "node:fs";

export default defineConfig(() => ({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      afterBuild: () => {
        // To pass publint (`npm x publint@latest`) and ensure the
        // package is supported by all consumers, we must export types that are
        // read as CJS. To do this, there must be duplicate types with the
        // correct extension supplied in the package.json exports field.
        copyFileSync("dist/index.d.ts", "dist/index.d.cts");
      },
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "pages-components",
      formats: ["es", "cjs"] as LibraryFormats[], // typescript is unhappy without this forced type definition
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
}));
