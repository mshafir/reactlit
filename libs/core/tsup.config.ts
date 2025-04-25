import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	tsconfig: "tsconfig.build.json",
	treeshake: true,
	sourcemap: "inline",
	minify: true,
	clean: false,
	splitting: false,
	format: ["cjs", "esm"],
	external: ["react"],
});
