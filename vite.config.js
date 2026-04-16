import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ mode }) => ({
  base: mode === "repo" ? "/allen-and-sons-website/" : "/",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about/index.html"),
        coaches: resolve(__dirname, "coaches/index.html"),
        lessons: resolve(__dirname, "lessons/index.html"),
        gallery: resolve(__dirname, "gallery/index.html"),
        contact: resolve(__dirname, "contact/index.html"),
      },
    },
  },
}));