import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  // 🔑 放行 3D 场景所需的二进制资源
  assetsInclude: ['**/*.wasm', '**/*.bin', '**/*.glb'],
  
  // 推荐：worker 使用 ES 模块格式
  worker: { format: 'es' },
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