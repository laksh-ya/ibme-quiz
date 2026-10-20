import { defineConfig } from "vite";
import pkg from "./package.json";

// One build id for the bundle and for version.txt, which the running app polls to
// show "New version ready".
const BUILD = `${pkg.version}-${new Date().toISOString().slice(11, 19).replace(/:/g, "")}`;

export default defineConfig({
  define: { __BUILD__: JSON.stringify(BUILD) },
  build: { outDir: "dist", target: "es2021", assetsInlineLimit: 0 },
  plugins: [
    {
      name: "emit-version",
      generateBundle() {
        this.emitFile({ type: "asset", fileName: "version.txt", source: BUILD + "\n" });
      },
    },
  ],
});
