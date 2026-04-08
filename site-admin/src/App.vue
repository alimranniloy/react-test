<script setup>
import { keepAliveComponents } from "@/router";
import { computed, watch, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useRouter, RouterView } from "vue-router";
import SideBar from "@/components/SideBar.vue";
import Notification from "@/components/Notification.vue";
const { site, locale, isMobile } = storeToRefs(useSiteStore());
const { getSite, setLocale, setMobile } = useSiteStore();
const { me, auth } = storeToRefs(useMeStore());
const { getMe } = useMeStore();
const router = useRouter();
const root = ref(null);


watch(auth, (newAuth) => {
  if (newAuth) {
    getMe();
  }
});
computed(() => {
  if (me.value && site.value == null) {
    router.push("/create/");
  }
});
onMounted(() => {
  if (!site.value) {
    getSite(
      process.env.NODE_ENV === "production"
        ? "site.bponi.com"
        : "site.bponi.com"
    );
  }
  if (window.document.body.clientWidth <= 760) {
    setMobile(true);
  } else {
    setMobile(false);
  }
  if (me.value && site.value == null) {
    router.push("/create/");
  }
  setLocale(locale.value);
});
</script>
<template>
  <div class="h-full">
    <SideBar v-if="me && auth && site" />
    <div :class="me && auth && site ? 'md:pl-64' : ''">
      <div :class="auth ? 'mx-auto flex max-w-7xl flex-col md:px-8 xl:px-0' : ''">
        <router-view v-slot="{ Component, route }">
          <transition>
            <keep-alive :max="5" :include="keepAliveComponents">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
    <Notification />
    <div v-if="isMobile"
      class="h-screen w-full z-40 bg-white flex items-center justify-center fixed top-0 left-0 right-0">Try in desktop
    </div>
  </div>
</template>

<style scoped></style>
