import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['@vitejs/plugin-react'],
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        prettier: false,
        svgo: false,
        exportType: 'named',
        svgoConfig: {
          plugins: [{ removeViewBox: false, throwIfNamespace: false }],
        },
        titleProp: true,
        ref: true,
      },
      include: "**/*.svg",
    }),
    tsconfigPaths(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
})
