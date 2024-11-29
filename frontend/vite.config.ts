import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/MetWeatherApp/",
	server: {
		proxy: {
			"/met": {
				target: "https://api.met.no",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/met/, ""), // Strip `/api` prefix
			},
		},
	},
});
