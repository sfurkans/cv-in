import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite 8 rolldown tipleri ile Vitest'in bundled Vite tipleri arasında plugin
// hook uyuşmazlığı var (hotUpdate'in rollup/rolldown PluginContextMeta farkı).
// Runtime'da sorun yok; plugin dizisini geniş tipe cast ederek geçiyoruz.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins = [react(), tailwindcss()] as any

// https://vite.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
