import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalizedGeneric,
  type RouteRecordRaw,
} from "vue-router";

import HomeRoute from "./home.ts";
import ProductRoute from "./product.ts";
import UserRoute from "./user.ts";

const routes: RouteRecordRaw[] = [
  { ...HomeRoute },
  { ...ProductRoute },
  { ...UserRoute },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "router-link-active",
  routes,
});

router.beforeEach(
  async (
    to: RouteLocationNormalizedGeneric,
    from: RouteLocationNormalizedGeneric,
    next: NavigationGuardNext
  ): Promise<void> => {
    console.log(`${from}`);
    if (to.matched.some((r) => r.meta.auth)) {
      const token = localStorage.getItem("token");
      if (!token) {
        next({ path: "/users/login", query: { redirect: to.path } });
      } else {
        next();
      }
    } else {
      next();
    }
  }
);

export default router;
