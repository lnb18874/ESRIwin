import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import cesium from 'vite-plugin-cesium'
import path from 'path' // 1. 引入 path 模块，用于处理路径

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cesium(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 2. 添加 css 预处理器配置
  css: {
    preprocessorOptions: {
      less: {
        // 3. 配置 additionalData，自动在每个 less 文件顶部注入变量
        // 注意：这里指向的是你刚才创建的 index.less
        additionalData: `@import "${path.resolve(__dirname, 'src/assets/less/index.less')}";`
      }
    }
  },
})