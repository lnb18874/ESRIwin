import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'map-home',
      // @ts-ignore
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/tourism',
      name: 'water-tourism',
      // @ts-ignore
      component: () => import('../views/WaterTourismView.vue'),
    },
  ],
})

export default router