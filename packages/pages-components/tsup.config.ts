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

  // A note for future maintainers:
  // We cannot use tsup until we drop support for React 17. Building with Vite
  // handles the React runtime automatically, adjusting imports to use the classic
  // runtime when necessary.

  // Swapping to tsup results in errors like:
  // Error [ERR_MODULE_NOT_FOUND]: Cannot find module '../node_modules/react/jsx-runtime'
  // imported from ../node_modules/@yext/pages-components/dist/index.js
  // Did you mean to import "react/jsx-runtime.js"?

  // We can get around this by setting "jsx":"react" in tsconfig.json (which builds with
  // the classic runtime), and requires adding `import React from "react";` to every necessary .tsx file.
  // With "jsx":"react-jsx", this import is not necessary. However, other dependencies
  // are not automatically adjusted to the classic runtime like Vite does, leading to
  // the same error but for other packages, such as lexical.

  // Ideally we can switch to tsup because the bundle size is vastly smaller:
  // ~710kB for Vite compared to ~85kB for tsup.

  // Production mode (strips dev internals)
  env: {
    NODE_ENV: "production",
  },
});
