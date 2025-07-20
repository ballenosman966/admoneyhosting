import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'google-fonts-cache',
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
    //           },
    //         }
    //       }
    //     ]
    //   },
    //   manifest: {
    //     name: "USDT Rewards Platform",
    //     short_name: "USDT Rewards",
    //     description: "Watch ads and earn USDT rewards",
    //     theme_color: "#3b82f6",
    //     background_color: "#1a1a1a",
    //     display: "standalone",
    //     orientation: "portrait-primary",
    //     scope: "/",
    //     start_url: "/",
    //     icons: [
    //       {
    //         src: "/icon-192x192.svg",
    //         sizes: "192x192",
    //         type: "image/svg+xml",
    //         purpose: "maskable any"
    //       },
    //       {
    //         src: "/icon-512x512.svg",
    //         sizes: "512x512",
    //         type: "image/svg+xml",
    //         purpose: "maskable any"
    //       }
    //     ]
    //   }
    // })
  ],
  server: {
    port: 3000,
    host: true,
    open: false, // Don't automatically open browser
    hmr: {
      overlay: false,
      port: 3002 // Use separate port for HMR to avoid conflicts with backend
    },
    // Optimize for development
    watch: {
      usePolling: false,
      interval: 100,
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    },
    // Add performance optimizations
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    // Remove force: true to prevent unnecessary re-bundling
    force: false
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    // Ensure assets are served correctly on Netlify
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  esbuild: {
    target: 'esnext',
    // Optimize for development
    jsx: 'automatic'
  },
  // Reduce development overhead
  define: {
    __DEV__: true
  },
  // Add performance optimizations
  css: {
    devSourcemap: false
  }
});
