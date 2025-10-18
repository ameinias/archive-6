import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
      '@components': path.resolve(__dirname, '../shared/components'),
      '@utils': path.resolve(__dirname, '../shared/utils'),
      '@hooks': path.resolve(__dirname, '../shared/hooks'),
    }
  },
  base: "https://blekkenhorst.ca/bleed/app/",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  publicDir: path.resolve(__dirname, '../../assets'),
})