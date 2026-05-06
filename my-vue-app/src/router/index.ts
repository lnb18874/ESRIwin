import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'geoscene-demo',
    //   component: () => import('../views/GeoSceneDemo.vue'), 
    // },
    {
      path: '/',
      name: 'map-home',
      // @ts-ignore
      component: () => import('../views/MapView.vue'),
    },
  ],
})

export default router