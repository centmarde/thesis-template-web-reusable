
import { setupLayouts } from 'virtual:generated-layouts';
import { useToast } from 'vue-toastification';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthUserStore } from '@/stores/authUser';

import Hero from '@/pages/index.vue';
import Auth from '@/pages/Auth.vue';
import NotFound from '@/pages/NotFound.vue';

const toast = useToast();

const routes = setupLayouts([
  { path: '/', component: Hero },
  {
    path: '/auth',
    component: Auth,
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  },
]);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthUserStore();
  const isLoggedIn = localStorage.getItem("access_token") !== null || authStore.userData !== null;
  const publicPages = ["/"];
  const protectedPages = ["/home", "/admin", "/profiles"];

  // Check if user is already authenticated and trying to access auth page
  if (to.path === "/auth" && isLoggedIn) {
    toast.info("You are already logged in.");
    return next("/");
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    toast.error("Authentication is required to access this page.");
    return next("/auth");
  }

  if (publicPages.includes(to.path) && isLoggedIn) {
    return next("/home");
  }

  next();
});

router.onError((err: any, to: RouteLocationNormalized) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
