import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcsspxtorem from "postcss-pxtorem";
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa' // 1. 引入 PWA 插件

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    basicSsl(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
    // 2. 配置 PWA 插件
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PosVox Scan Order',
        short_name: 'PosVox',
        description: 'Scan Order',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // 核心：实现沉浸式 App 体验
        start_url: '.',
        icons: [
          {
            src: 'pwa-192x192.png', // 确保 public 目录下有此文件
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // 确保 public 目录下有此文件
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true // 允许在开发模式下调试 PWA
      }
    })
  ],
  base: './',
  server: {
    https: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://pos.uhimao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // Vite 官方推荐的写法
      },
    },
  },
})