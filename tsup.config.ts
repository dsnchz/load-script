import { defineConfig } from "tsup";

export default defineConfig({
  name: "load-script",
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "esnext",
  dts: true,
  clean: true,
});
