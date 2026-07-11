// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     strictPort: true,
//   },
//   preview: {
//     host: '0.0.0.0',
//     port: 4173,
//     strictPort: true,
//   },
//   test: {
//     environment: 'jsdom',
//     setupFiles: ['./src/test/setup.js'],
//     globals: true,
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      jpeg: { quality: 80 },
      jpg:  { quality: 80 },
      png:  { quality: 80 },
      webp: { quality: 82 },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})