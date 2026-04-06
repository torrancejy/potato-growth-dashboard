import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BUILD_TIME = Date.now()

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
