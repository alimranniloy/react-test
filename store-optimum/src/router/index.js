import analytics from "@/analytics";
import { useMeStore } from "@/stores/me";
import Home from "@/views/Home.vue";
import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

const userRoute = [
  {
    path: "/user/",
    name: "User",
    component: () => import("@/views/user/User.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },

  {
    path: "/user/order/",
    name: "UserOrder",
    component: () => import("@/views/user/Order.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/order/invoice",
    name: "UserOrderInvoice",
    component: () => import("@/views/user/OrderInvoice.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/payment/",
    name: "UserPayment",
    component: () => import("@/views/user/Payment.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/payment/invoice/",
    name: "UserPaymentInvoice",
    component: () => import("@/views/user/PaymentInvoice.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/reseller/",
    name: "UserResell",
    component: () => import("@/views/user/Reseller.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/affiliate/",
    name: "UserAffiliate",
    component: () => import("@/views/user/Affiliate.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/wholesale/",
    name: "UserWholesale",
    component: () => import("@/views/user/Wholesale.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/wishlist/",
    name: "UserWishlist",
    component: () => import("@/views/user/Wishlist.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/store/",
    name: "UserStore",
    component: () => import("@/views/user/Store.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/setting/",
    name: "UserSetting",
    component: () => import("@/views/user/Setting.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/user/password/",
    name: "UserPassword",
    component: () => import("@/views/user/Password.vue"),
    meta: {
      keepalive: false,
      requiresAuth: true,
    },
  },
  {
    path: "/order/invoice/",
    name: "OrderInvoice",
    component: () => import("@/views/user/OrderInvoice.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
];

const checkoutRoute = [
  {
    path: "/checkout/",
    name: "Checkout",
    component: () => import("@/views/checkout/Checkout.vue"),
    meta: {
      keepalive: false,
      requiresAuth: false,
    },
  },
  {
    path: "/checkout/success",
    name: "CheckoutSuccess",
    component: () => import("@/views/checkout/Success.vue"),
    meta: {
      keepalive: false,
      requiresAuth: false,
    },
  },
];
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
    path: "/themes",
    name: "Themes",
    component: () => import("@/views/ThemeView.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/pricing",
    name: "Pricing",
    component: () => import("@/views/PriceBody.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/google-play-console",
    name: "GooglePlayConsole",
    component: () => import("@/views/GooglePlayConsole.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/career",
    name: "Career",
    component: () => import("@/views/Career.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/blog",
    name: "Blog",
    component: () => import("@/views/Blog.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/blog/:slug",
    name: "BlogDetails",
    component: () => import("@/views/BlogDetails.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/offer-pricing",
    name: "OfferPricing",
    component: () => import("@/views/OfferPricing.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("@/views/contact/ContactUs.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/feature-details",
    name: "FeatureDetails",
    component: () => import("@/views/contact/ContactUs2.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },

  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    component: () => import("@/views/PrivacyPolicy.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/terms-conditions",
    name: "TermsCondition",
    component: () => import("@/views/TermsCondition.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },

  {
    path: "/products/",
    name: "Products",
    component: () => import("@/views/product/Products.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },

  {
    path: "/product/new/",
    name: "ProductNew",
    component: () => import("@/views/product/New.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/product/:slug/:id/",
    name: "ProductDetails",
    component: () => import("@/views/product/ProductDetails.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/page/:slug/",
    name: "PageDetails",
    component: () => import("@/views/page/PageDetails.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/about/",
    name: "About",
    component: () => import("@/views/page/PageDetails.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  // default
  {
    path: "/login/",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: {
      keepalive: true,
      requiresAuth: false,
    },
  },
  {
    path: "/logout/",
    name: "Logout",
    meta: {
      keepalive: false,
      requiresAuth: false,
    },
  },
  ...checkoutRoute,
  ...userRoute,
  {
    path: "/:catchAll(.*)",
    name: "Error",
    component: () => import("@/views/Error.vue"),
    meta: {
      keepalive: false,
    },
  },
];
const router = createRouter({
  history: createWebHistory("/"),
  linkActiveClass: "active-link",
  linkExactActiveClass: "",
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from) => {
  const { auth } = storeToRefs(useMeStore());
  const { logOut } = useMeStore();
  if (to.meta.requiresAuth && !auth.value) {
    return (
      // {
      //   path: "/login",
      //   name: "login",
      //   component: () => import("@/views/LoginView.vue"),
      // },
      // {
      //   path: "/about",
      //   name: "about",
      //   // route level code-splitting
      //   // this generates a separate chunk (About.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import("@/views/AboutView.vue"),
      // },
      // {
      //   path: "/privacy",
      //   name: "privacy",
      //   // route level code-splitting
      //   // this generates a separate chunk (About.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import("@/views/PrivacyView.vue"),
      // },
      // {
      //   path: "/price",
      //   name: "price",
      //   // route level code-splitting
      //   // this generates a separate chunk (About.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import("@/views/PriceView.vue"),
      // },
      // {
      //   path: "/dashboard",
      //   name: "dashboard",
      //   // route level code-splitting
      //   // this generates a separate chunk (About.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import("@/views/DashboardView.vue"),
      // },
      {
        path: "/themes",
        name: "themes",
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("@/views/ThemeView.vue"),
      }
    );
  }
});

export default router;
export const keepAliveComponents = routes
  .filter((el) => (el.meta ? el.meta.keepalive : false))
  .map((route) => route.name);
