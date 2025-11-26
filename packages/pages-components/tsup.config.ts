import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  treeshake: true,
  minify: true,
  splitting: true,

  external: ["react", "react-dom", "mapbox-gl"],

  loader: {
    ".ts": "ts",
    ".tsx": "tsx",
  },

  // Production mode (strips dev internals)
  env: {
    NODE_ENV: "production",
  },
});
