import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()],
    build: {
      sourcemap: true
    },
    server: {
      port: 3000
    }
  }

  if (mode === 'development') {
    // In development mode don't include a hash in the filename
    config.build['rollupOptions'] = {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js'
      }
    }
  } else if (mode == 'authoring') {
    config.build['rollupOptions'] = {
      output: {
        assetFileNames: 'assets/[name].authoring.[hash][extname]',
        entryFileNames: 'assets/[name].authoring.[hash].js'
      }
    }
  } else {
    config.build['rollupOptions'] = {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }

  return config
})
