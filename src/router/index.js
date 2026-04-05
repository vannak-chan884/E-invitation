import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Content from '../views/Content.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      component: Home
    },
    { 
      path: '/invitation',
      name: 'content',
      component: Content
    },
  ]
})

export default router
