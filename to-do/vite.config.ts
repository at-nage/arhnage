import path from "node:path";
import { defineConfig } from "vite";

import deno from "@deno/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@arhnage/std": path.resolve("../std/src/index.ts"),
			"@arhnage/optics": path.resolve("../optics/src/index.ts"),
			"@arhnage/eventable": path.resolve("../eventable/src/index.ts"),
			"@arhnage/syren": path.resolve("../syren/src/index.ts"),
			"@arhnage/shaper": path.resolve("../shaper/src/index.ts"),
		},
	},
	esbuild: {
		jsxFactory: "h",
		jsxFragment: "f",
	},
	server: {
		port: 3000,
	},
	plugins: [deno()],
});
