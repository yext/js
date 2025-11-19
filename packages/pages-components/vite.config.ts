import react from "@vitejs/plugin-react";
import { LibraryFormats, defineConfig } from "vite";
import path from "node:path";
import type { Plugin } from "vite";
import { exec } from "node:child_process";

export default defineConfig(() => ({
  plugins: [react(), dts(), fixReactJsxRuntime()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "pages-components",
      formats: ["es"] as LibraryFormats[], // typescript is unhappy without this forced type definition
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "mapbox-gl"],
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

/**
 * React 17 does not declare jsx-runtime in its "exports" because it predates
 * subpath exports. Under Node 20+'s stricter ESM rules, imports must include an
 * extension instead of guessing extensions for bare subpath imports. This plugin
 * rewrites the generated bundle to include the .js extension for react/jsx-runtime.
 */
const fixReactJsxRuntime = (): Plugin => ({
  name: "fix-react-jsx-runtime-specifier",
  apply: "build",
  enforce: "post",
  generateBundle(_options, bundle) {
    for (const [, chunk] of Object.entries(bundle)) {
      if (chunk.type !== "chunk" || typeof chunk.code !== "string") {
        continue;
      }

      if (chunk.code.includes("react/jsx-runtime")) {
        chunk.code = chunk.code.replace(
          /(["'])react\/jsx-runtime\1/g,
          `$1react/jsx-runtime.js$1`
        );
      }
    }
  },
});
