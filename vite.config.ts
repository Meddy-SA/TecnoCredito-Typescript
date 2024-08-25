import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => ['box-icon'].includes(tag) // Se agrego para sacar advertencia de box-icon
      }
    }
  }), svgLoader()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }
})
