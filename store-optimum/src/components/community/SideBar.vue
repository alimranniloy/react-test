<template>
  <header id="sidebar"
    class="flex w-0 shrink-0 transition-opacity duration-200 sm:w-20 md:w-24 lg:max-w-none xl:-mr-4 xl:w-full xl:max-w-xs xl:justify-end">
    <div
      class="fixed bottom-0 sm:bottom-auto z-10 flex flex-col justify-between bg-white py-0 dark:border-dark-border xs:top-0 xs:h-full w-full sm:w-auto xs:border-0 xs:bg-transparent xs:px-2 xs:py-3 xs:pt-2 md:px-4 xl:w-72">
      <section class="flex flex-col justify-center gap-2 xs:items-center xl:items-stretch">
        <h1 class="hidden xs:flex">
          <router-link
            class="custom-button main-tab text-accent-red transition hover:bg-accent-red/10 focus-visible:bg-accent-red/10 focus-visible:!ring-accent-red/80 dark:text-twitter-icon dark:hover:bg-dark-primary/10"
            :to="`/`">
          </router-link>
        </h1>
        <nav v-if="!isIframe" class="flex items-center justify-around sm:flex-col sm:justify-center xl:block">
          <router-link class="group outline-none flex" :to="`/`">
            <div
              class="custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition duration-200 group-hover:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] dark:group-hover:bg-dark-primary/10 dark:group-focus-visible:ring-white xs:p-3 xl:pr-5 font-semibold dark:text-[18px]">
              <HomeIcon class="w-7 h-7 text-gray-700 dark:text-gray-100 dark:w-6" />
              <p class="hidden xl:block dark:text-gray-100">Home</p>
            </div>
          </router-link>
          <router-link class="group outline-none flex cursor" :to="`/explore`">
            <div
              class="custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition duration-200 group-hover:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] dark:group-hover:bg-dark-primary/10 dark:group-focus-visible:ring-white xs:p-3 xl:pr-5 dark:text-[18px]">
              <HashtagIcon class="w-7 h-7 text-gray-700 dark:text-gray-100 dark:w-6" />
              <p class="hidden xl:block dark:text-gray-100">Explore</p>
            </div>
          </router-link>
          <!-- <router-link class="group py-1 outline-none hidden xs:flex cursor" :to="`/notifications`">
            <div
              class="custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition duration-200 group-hover:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] dark:group-hover:bg-dark-primary/10 dark:group-focus-visible:ring-white xs:p-3 xl:pr-5">
              <BellAlertIcon class="w-7 h-7 text-gray-700" />
              <p class="hidden xl:block">Notifications</p>
            </div>
          </router-link> -->
          <router-link class="group outline-none flex cursor" :to="`/messages`">
            <div
              class="custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition duration-200 group-hover:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] dark:group-hover:bg-dark-primary/10 dark:group-focus-visible:ring-white xs:p-3 xl:pr-5 dark:text-[18px]">
              <EnvelopeIcon class="w-7 h-7 text-gray-700 dark:text-gray-100 dark:w-6" />
              <p class="hidden xl:block dark:text-gray-100">Messages</p>
            </div>
          </router-link>
          <router-link class="group outline-none hidden xs:flex" :to="`/bookmarks`">
            <div
              class="custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition duration-200 group-hover:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] dark:group-hover:bg-dark-primary/10 dark:group-focus-visible:ring-white xs:p-3 xl:pr-5 dark:text-[18px]">
              <BookmarkIcon class="w-7 h-7 text-gray-700 dark:text-gray-100 dark:w-6" />
              <p class="hidden xl:block dark:text-gray-100">Bookmarks</p>
            </div>
          </router-link>
          <router-link class="group outline-none hidden xs:flex cursor" :to="`/lists`">
            <div
              class="custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition duration-200 group-hover:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] dark:group-hover:bg-dark-primary/10 dark:group-focus-visible:ring-white xs:p-3 xl:pr-5 dark:text-[18px]">
              <ListBulletIcon class="w-7 h-7 text-gray-700 dark:text-gray-100 dark:w-6" />
              <p class="hidden xl:block dark:text-gray-100">Lists</p>
            </div>
          </router-link>
          <router-link class="group outline-none flex" :to="`/${me ? me.username : 'guest'}`">
            <div
              class="custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition duration-200 group-hover:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] dark:group-hover:bg-dark-primary/10 dark:group-focus-visible:ring-white xs:p-3 xl:pr-5 dark:text-[18px]">
              <UserIcon class="w-7 h-7 text-gray-700 dark:text-gray-100 dark:w-6" />
              <p class="hidden xl:block dark:text-gray-100">Profile</p>
            </div>
          </router-link>
          <div class="relative">
            <Menu as="div" class="relgroup relative flex w-full outline-noneative inline-block text-left">
              <MenuButton
                class="custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition duration-200 group-hover:bg-accent-red/10 group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] dark:group-hover:bg-dark-primary/10 dark:group-focus-visible:ring-white xs:p-3 xl:pr-5 font-semibold dark:text-[18px]">
                <EllipsisHorizontalIcon class="w-7 h-7 text-gray-700 dark:text-gray-100 dark:w-6" />
                <p class="hidden xl:block dark:text-gray-100">More</p>
              </MenuButton>

              <transition enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <MenuItems
                  class="menu-container absolute -top-44 right-0 w-60 font-medium xl:w-11/12 bg-white shadow-md rounded-md py-2">
                  <MenuItem v-slot="{ active }" as="div">
                  <router-link class="flex w-full cursor gap-3 rounded-t-md px-4 py-3 duration-200" :to="`/settings`">
                    <Cog6ToothIcon class="w-7 h-7 text-gray-700" />Settings
                    and privacy
                  </router-link></MenuItem>
                  <MenuItem v-slot="{ active }" as="div">
                  <router-link class="flex w-full cursor gap-3 rounded-t-md px-4 py-3 duration-200"
                    :to="`/help-center`">
                    <LifebuoyIcon class="w-7 h-7 text-gray-700" /> Help center
                  </router-link></MenuItem>
                  <MenuItem @click="showCustomView = true" v-slot="{ active }" as="button"
                    class="flex w-full cursor gap-3 rounded-t-md px-4 py-3 duration-200">
                  <SwatchIcon class="w-7 h-7 text-gray-700" />Display</MenuItem>
                  <MenuItem v-if="me" @click="toRoute('/logout/')" v-slot="{ active }" as="button"
                    class="flex w-full cursor gap-3 rounded-t-md px-4 py-3 duration-200">
                  <ArrowLeftOnRectangleIcon class="w-7 h-7 text-gray-700" />Log Out</MenuItem>
                  <MenuItem v-else @click="toRoute('/login/')" v-slot="{ active }" as="button"
                    class="flex w-full cursor gap-3 rounded-t-md px-4 py-3 duration-200">
                  <ArrowRightOnRectangleIcon class="w-7 h-7 text-gray-700" />Log In</MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </nav>
      </section>
    </div>
  </header>
  <CustomView v-if="showCustomView" @close="showCustomView = false"></CustomView>
</template>
<script setup>
import {
  HashtagIcon,
  BellAlertIcon,
  HomeIcon,
  EnvelopeIcon,
  BookmarkIcon,
  ListBulletIcon,
  UserIcon,
  EllipsisHorizontalIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/vue";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useFeedStore } from "@/stores/feed";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Cog6ToothIcon,
  LifebuoyIcon,
  SwatchIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
} from "@heroicons/vue/24/outline";
const CustomView = defineAsyncComponent(() =>
  import("@/components/community/CustomView.vue")
);
const Create = defineAsyncComponent(() => import("@/components/community/Create.vue"));
dayjs.extend(relativeTime);
const { feed } = storeToRefs(useFeedStore());
const { site, isMobile } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const router = useRouter();
const showCustomView = ref(false);
const toRoute = (path) => {
  router.push(path);
};
const isIframe = computed(() => {
  return window.location !== window.parent.location && isMobile.value;
});
</script>
