import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()],
    build: {
      sourcemap: true
    }
  }

  // In development mode don't include a hash in the filename
  if (mode === 'development') {
    config.build['rollupOptions'] = {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js'
      }
    }
  }

  return config
})
