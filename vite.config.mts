import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/vitest.setup.ts',
      include: ['src/tests/*.test.{ts,tsx}'],
      environmentOptions: {
        jsdom: {
          url: 'http://localhost/',
        },
      },
    },
    
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 700
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
        chunkFileNames: "assets/[name].js",
        entryFileNames: 'assets/[name].js'
      }
    }
  } else if (mode == 'authoring') {
    config.build['rollupOptions'] = {
      output: {
        assetFileNames: 'assets/[name].authoring.[hash][extname]',
        chunkFileNames: "assets/[name].authoring.[hash].js",
        entryFileNames: 'assets/[name].authoring.[hash].js'
      }
    }
  } else {
    config.build['rollupOptions'] = {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }

  config.build['rollupOptions'].output.manualChunks = {
    mathlive: ['mathlive'],
  }

  return config
})