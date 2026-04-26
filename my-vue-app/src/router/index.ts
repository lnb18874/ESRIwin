import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'map-home', // 改个名字，叫地图主页
      // 注意：这里暂时不引入组件，因为我们还没写地图组件
      // 等下一步创建了 TianDiTuMap.vue 后，我们会在这里引入
      component: () => import('../views/MapView.vue'), 
    },
    // 以后其他的页面（如登录页、分析页）都会加在这里
  ],
})

export default router