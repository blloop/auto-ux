import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    process: {
      cwd: () => '.',
      env: {}
    },
  },
  resolve: {
    alias: {
      process: "process/browser"
    },
  },
})
