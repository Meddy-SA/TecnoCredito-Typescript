import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalizedGeneric, type RouteRecordRaw } from 'vue-router'

import HomeRoute from './home.ts'

const routes: RouteRecordRaw[] = [
  { ...HomeRoute },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedGeneric, next: NavigationGuardNext): Promise<void> => {
  console.log(`${from} ${to}`)
  next()
})

export default router
