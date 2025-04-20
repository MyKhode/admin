import { isAuthenticated } from '@/auth'
import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirect to login if not authenticated
    next('/login')
  } else {
    next()
  }
})

export default function (app: App) {
  app.use(router)
}

export { router }
