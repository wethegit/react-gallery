import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      // eslint-disable-next-line no-undef
      entry: resolve(__dirname, "src/lib/index.js"),
      name: "ReactModal",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
        },
      },
    },
  },
})
