import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import { useMeStore } from "@/stores/me";
import { useSearchStore } from "@/stores/search";
import { storeToRefs } from "pinia";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/site/",
    name: "Site",
    component: () => import("@/views/site/Site.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/site/update/",
    name: "SiteUpdate",
    component: () => import("@/views/site/SiteAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/page/",
    name: "Page",
    component: () => import("@/views/page/Page.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/page/update/",
    name: "PageUpdate",
    component: () => import("@/views/page/PageAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/product/",
    name: "Product",
    component: () => import("@/views/product/Product.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/product/update/",
    name: "ProductUpdate",
    component: () => import("@/views/product/ProductAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/theme/",
    name: "Theme",
    component: () => import("@/views/theme/Theme.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/theme/update/",
    name: "ThemeUpdate",
    component: () => import("@/views/theme/ThemeAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/component/",
    name: "Component",
    component: () => import("@/views/component/Component.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/component/create/",
    name: "ComponentCreate",
    component: () => import("@/views/component/ComponentAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/component/update/",
    name: "ComponentUpdate",
    component: () => import("@/views/component/ComponentAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/tool/page/",
    name: "ToolPage",
    component: () => import("@/views/tool/Page.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/tool/page/create/",
    name: "ToolPageCreate",
    component: () => import("@/views/tool/PageAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/tool/page/update/",
    name: "ToolPageUpdate",
    component: () => import("@/views/tool/PageAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/tool/file/",
    name: "ToolPage",
    component: () => import("@/views/tool/File.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/tool/page/create/",
    name: "ToolPageCreate",
    component: () => import("@/views/tool/PageAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/tool/page/update/",
    name: "ToolPageUpdate",
    component: () => import("@/views/tool/PageAction.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/editor/",
    name: "Editor",
    component: () => import("@/views/editor/Editor.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/app/",
    name: "App",
    component: () => import("@/views/extra/App.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/login/",
    name: "Login",
    component: Login,
    meta: {
      keepalive: false,
      requiresAuth: false,
    },
  },
  {
    path: "/setting/",
    name: "Setting",
    component: () => import("@/views/Setting.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/test/",
    name: "Test",
    component: () => import("@/views/Test.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/help/",
    name: "Test",
    component: () => import("@/views/Test.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/create/",
    name: "Create",
    component: () => import("@/views/Create.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/inactive/",
    name: "Inactive",
    component: () => import("@/views/Inactive.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/login/",
    name: "Login",
    component: Login,
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/chat/",
    name: "Chat",
    component: () => import("@/views/chat/Chat.vue"),
    meta: {
      keepalive: true,
      requiresAuth: true,
    },
  },
  {
    path: "/logout/",
    name: "Logout",
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "Error",
    component: () => import("@/views/Error.vue"),
    meta: {
      keepalive: false,
    },
  },
];

let base = "/admin/";
const url = new URL(window.location.href);
const firstParam = url.pathname.split("/")[1];
if (firstParam) {
  base = firstParam;
}
const router = createRouter({
  history: createWebHistory(base),
  linkActiveClass: "active-link",
  linkExactActiveClass: "bg-gray-100 text-gray-900",
  routes: routes,
});

router.beforeEach((to, from) => {
  const { auth } = storeToRefs(useMeStore());
  const { logOut } = useMeStore();
  const { setSearch } = useSearchStore();
  setSearch(null);
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
