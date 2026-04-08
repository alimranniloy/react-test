import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Templates from "@/views/Templates.vue";
import StoreTemplates from "@/views/StoreTemplates.vue";
import Page from "@/views/Page.vue";
import { storeToRefs } from "pinia";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/templates",
    name: "Templates",
    component: Templates,
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/store/templates",
    name: "StoreTemplates",
    component: StoreTemplates,
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "Page",
    component: Page,
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
];
const router = createRouter({
  history: createWebHistory("/"),
  linkActiveClass: "active-link",
  linkExactActiveClass: "bg-gray-100 text-gray-900",
  routes: routes,
});

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !auth.value) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  } else if (to.name == "Logout") {
    logOut();
    window.location.reload();
    return {
      path: "/login",
      query: { redirect: "/" },
    };
  }
});

export default router;
export const keepAliveComponents = routes
  .filter((el) => (el.meta ? el.meta.keepalive : false))
  .map((route) => route.name);
