<script setup>
import { RouterView, useRouter } from "vue-router";
import { keepAliveComponents } from "@/router";
import { onMounted, watch, ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useBrandStore } from "@/stores/brand";
import { useCartStore } from "@/stores/cart";
import { useCategoryStore } from "@/stores/category";
import { useCustomerStore } from "@/stores/customer";
import { useGatewayStore } from "@/stores/gateway";
import { useLogisticsStore } from "@/stores/logistics";
import { useMeStore } from "@/stores/me";
import { usePageStore } from "@/stores/page";
import { useSearchStore } from "@/stores/search";
import { useSiteStore } from "@/stores/site";
import { useSliderStore } from "@/stores/slider";
import { useSubCategoryStore } from "@/stores/subCategory";
import { useSubSubCategoryStore } from "@/stores/subSubCategory";
import "@egjs/flicking/dist/flicking.css";
import GlobalLoader from "@/components/GlobalLoader.vue";
import CursorGlow from "@/components/CursorGlow.vue";
import { loaderStore } from "@/stores/loaderStore";
const { customer } = storeToRefs(useCustomerStore());
const { gateways } = storeToRefs(useGatewayStore());
const { getBrands } = useBrandStore();
const { getCategories } = useCategoryStore();
const { getCustomerByUser } = useCustomerStore();
const { getMe, tryLogin } = useMeStore();
const { getPages } = usePageStore();
const { getSearchs } = useSearchStore();
const { getSite, setDeviceType, setMobile, setLoading, setReferCode } =
  useSiteStore();
const { getSliders } = useSliderStore();
const { getSubCategories } = useSubCategoryStore();
const { getSubSubCategories } = useSubSubCategoryStore();
const { logisticses, stoppages } = storeToRefs(useLogisticsStore());
const { me, auth } = storeToRefs(useMeStore());
const { searchs } = storeToRefs(useSearchStore());
const { setCartCustomer } = useCartStore();
const { site, loading, referCode } = storeToRefs(useSiteStore());
const router = useRouter();
const root = ref(null);
const navKey = ref(1);
const NavBar = defineAsyncComponent(() => import("@/components/NavBar.vue"));
const Footer = defineAsyncComponent(() => import("@/components/Footer.vue"));
const Notification = defineAsyncComponent(() =>
  import("@/components/Notification.vue")
);

const Chat = defineAsyncComponent(() => import("@/components/Chat.vue"));
const PopUp = defineAsyncComponent(() => import("@/components/PopUp.vue"));

const loader = loaderStore();
if (loading) {
  setLoading(false);
}
watch([auth, me, site], ([newAuth, newMe, newSite]) => {
  if (newAuth) {
    getMe();
  }
  if (newMe) {
    let isActive = site.value.isPublic;
    let isReseller =
      site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller";
    let isWholesale = false;
    getCustomerByUser(
      newMe.id,
      site.value.id,
      isActive,
      isReseller,
      isWholesale
    );
  }
  if (newSite) {
    try {
      for (let color of newSite.meta.color) {
        let name = "--" + color.name;
        if (root.value) {
          root.value.style.setProperty(name, color.value);
        }
      }
    } catch {}
    // get search
    if (searchs.value.length == 0) {
      getSearchs(
        [
          newSite.id,
          ...newSite.parent
            .filter((item) => item.isActive)
            .map((item) => item.id),
        ],
        newSite.parent.filter((item) => item.isActive).length > 0
          ? newSite.id
          : null
      );
      navKey.value += 1;
    }
  }
});

watch([customer], ([newCustomer]) => {
  if (newCustomer) {
    setCartCustomer(newCustomer);
  }
});

const getMeta = (metaName) => {
  const metas = document.getElementsByTagName("meta");
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") === metaName) {
      return metas[i].getAttribute("content")
        ? metas[i].getAttribute("content")
        : "";
    }
  }
  return "";
};

onMounted(() => {
  if (site.value && !localStorage.getItem("siteId")) {
    localStorage.setItem("siteId", site.value.id);
  }
  if (!site.value) {
    getSite(
      process.env.NODE_ENV === "production"
        ? window.location.host
        : "optimumsoft.dev"
    );
  }
  root.value = document.documentElement;
  // assign var
  if (site.value) {
    try {
      for (let color of site.value.meta.color) {
        let name = "--" + color.name;
        if (root.value) {
          root.value.style.setProperty(name, color.value);
        }
      }
    } catch {}
  }
  if (window.document.body.clientWidth <= 640) {
    setMobile(true);
  } else {
    setMobile(false);
  }

  if (window.document.body.clientWidth <= 640) {
    setDeviceType("xs");
  } else if (window.document.body.clientWidth <= 768) {
    setDeviceType("sm");
  } else if (window.document.body.clientWidth <= 1024) {
    setDeviceType("md");
  } else if (window.document.body.clientWidth <= 1280) {
    setDeviceType("lg");
  } else {
    setDeviceType("xl");
  }

  if (me.value && site.value) {
    let isActive = true;
    let isReseller =
      site.value.isPublic &&
      (site.value.siteInfo == "reseller" ||
        site.value.siteInfo == "multivendor_reseller");
    let isWholesale = false;
    let customerType = isReseller ? 2 : 1;
    getCustomerByUser(
      me.value.id,
      site.value.id,
      isActive,
      isReseller,
      isWholesale,
      customerType
    );
  }

  setTimeout(() => {
    if (router.currentRoute.value.query.refer) {
      setReferCode(router.currentRoute.value.query.refer);
    }
    let version = parseInt(getMeta("version"))
      ? parseInt(getMeta("version"))
      : 0;
    if (
      site.value &&
      site.value.version != version &&
      process.env.NODE_ENV == "production"
    ) {
      getSite(
        process.env.NODE_ENV === "production"
          ? window.location.host
          : "optimumsoft.dev"
      );
      getCategories(
        [
          site.value.id,
          ...site.value.parent
            .filter((item) => item.isActive)
            .map((item) => item.id),
        ],
        site.value.parent.filter((item) => item.isActive).length > 0
          ? site.value.id
          : null
      );
      getSubCategories(
        [
          site.value.id,
          ...site.value.parent
            .filter((item) => item.isActive)
            .map((item) => item.id),
        ],
        site.value.parent.filter((item) => item.isActive).length > 0
          ? site.value.id
          : null
      );
      getSubSubCategories(
        [
          site.value.id,
          ...site.value.parent
            .filter((item) => item.isActive)
            .map((item) => item.id),
        ],
        site.value.parent.filter((item) => item.isActive).length > 0
          ? site.value.id
          : null
      );
      getBrands(
        [
          site.value.id,
          ...site.value.parent
            .filter((item) => item.isActive)
            .map((item) => item.id),
        ],
        site.value.parent.filter((item) => item.isActive).length > 0
          ? site.value.id
          : null
      );
      getSliders(
        [
          site.value.id,
          ...site.value.parent
            .filter((item) => item.isActive)
            .map((item) => item.id),
        ],
        site.value.parent.filter((item) => item.isActive).length > 0
          ? site.value.id
          : null
      );
      getPages(
        [
          site.value.id,
          ...site.value.parent
            .filter((item) => item.isActive)
            .map((item) => item.id),
        ],
        site.value.parent.filter((item) => item.isActive).length > 0
          ? site.value.id
          : null
      );
      getSearchs(
        [
          site.value.id,
          ...site.value.parent
            .filter((item) => item.isActive)
            .map((item) => item.id),
        ],
        site.value.parent.filter((item) => item.isActive).length > 0
          ? site.value.id
          : null
      );
      logisticses.value = [];
      stoppages.value = [];
      gateways.value = [];
      navKey.value += 1;
    }
  }, 3000);
  setTimeout(() => {
    let query = router.currentRoute.value.query;
    // get set token
    if (query && query["token"]) {
      if (window.atob(query["token"]) != "null") {
        tryLogin(window.atob(query["token"]));
      }
    }
    // get set token
    if (query && query["refer"]) {
      referCode.value = query["refer"];
    }
  }, 1000);
});
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
<template>
  <!-- <GlobalLoader v-if="loader.isVisible" /> -->
  <div class="relative bg-transparent text-white">
    <CursorGlow />
    <NavBar :key="navKey" v-if="site" />
    <transition name="fade" mode="out-in">
      <router-view v-if="site" v-slot="{ Component }">
        <keep-alive :max="10" :include="keepAliveComponents">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </transition>
    <Notification v-if="site" />
    <PopUp v-if="site" />
    <Chat v-if="site" />
    <!-- footer -->
    <Footer v-if="site" />
    <div
      v-if="loading"
      class="absolute inset-0 z-[999] bg-opacity-90 flex items-center justify-center backdrop-blur-sm rounded-lg"
    >
      <div role="status">
        <svg
          aria-hidden="true"
          class="w-8 h-8 mr-2 text-gray-100 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>
