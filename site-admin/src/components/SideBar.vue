<template>
  <div>
    <!-- Static sidebar for desktop -->
    <div class="md:fixed md:inset-y-0 md:flex md:w-48 xl:w-64 md:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex flex-grow flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300 border-r border-gray-200 bg-white pt-5">
        <div class="flex flex-shrink-0 items-center px-4">
          <img class="h-8 w-8 rounded-full" v-lazy="site.favicon" :alt="site.title" />
          <h1
            class="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 group w-full block pl-2 py-2 text-md font-medium rounded-md">
            Site Admin<br /><span class="block text-xs">{{ site.title }}</span>
          </h1>
        </div>
        <div class="mt-5 flex flex-grow flex-col">
          <nav class="flex-1 space-y-1 bg-white px-2" aria-label="Sidebar">
            <template v-for="(item, index) in navigation" :key="item.name">
              <div v-if="!item.children">
                <a v-if="item.isExternal" :href="`${item.href}`" target="_blank" :class="[
                  'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md, relative',
                ]">
                  <component :is="item.icon" :class="[
                    'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6',
                  ]" aria-hidden="true" />
                  {{ item.name
                  }}<span v-if="item.name == 'Live Order' && liveOrders.length > 0"
                    class="ml-2 relative flex h-3 w-3 items-center justify-center">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                </a>
                <router-link v-else :to="`/${item.href}`" :class="[
                  'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md, relative',
                ]">
                  <component :is="item.icon" :class="[
                    'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6',
                  ]" aria-hidden="true" />
                  {{ item.name
                  }}<span v-if="item.name == 'Live Order' && liveOrders.length > 0"
                    class="ml-2 relative flex h-3 w-3 items-center justify-center">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                </router-link>
              </div>
            </template>
          </nav>
          <div class="mt-auto space-y-1 pt-10">
            <a v-for="item in secondaryNavigation.filter((v) => v.isExternal)" :key="item.name" :href="item.href"
              target="_blank"
              class="group flex items-center border-l-4 border-transparent py-2 px-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <component :is="item.icon" class="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true" />
              {{ item.name }}
            </a>
            <router-link v-for="item in secondaryNavigation.filter((v) => !v.isExternal)" :key="item.name"
              :to="`/${item.href}`"
              class="group flex items-center border-l-4 border-transparent py-2 px-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <component :is="item.icon" class="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true" />
              {{ item.name }}
            </router-link>
            <a @click="logout"
              class="group flex items-center border-l-4 border-transparent py-2 px-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <ArrowLeftOnRectangleIcon class="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true" />
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>

    <div @mouseleave="searchResultsHide = true" class="md:relative z-30 w-full md:pl-64 mb-4">
      <div :class="router.currentRoute.value.name == 'OrderPos'
        ? 'mx-auto flex max-w-full flex-col md:px-8 xl:px-4'
        : 'mx-auto flex max-w-7xl flex-col md:px-8 xl:px-0'
        ">
        <div class="sticky top-0 z-10 flex h-14 flex-shrink-0 border-b border-gray-200 bg-white">
          <button type="button"
            class="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            @click="sidebarOpen = true">
            <span class="sr-only">Open sidebar</span>
            <Bars3BottomLeftIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <div class="flex flex-1 justify-between px-4">
            <div @mouseover="searchResultsHide = false" class="flex flex-1">
              <div class="flex w-full md:ml-0">
                <label for="search-field" class="sr-only">Search</label>
                <div class="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
                  </div>
                 <input id="search-field" @keyup.enter="toggleSearch" v-model.trim.lazy="search"
                    class="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                    placeholder="Search" type="search" name="search" autocomplete="off" />
                </div>
                
              </div>
            </div>
            <div class="ml-4 flex items-center md:ml-6">
              <button type="button"
                class="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-offset-2">
                <span class="sr-only">View notifications</span>
                <BellIcon class="h-6 w-6" aria-hidden="true" />
              </button>
              <Bponi class="ml-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SELF_LOGOUT } from "@/gql/me";
import Bponi from "@/components/Bponi.vue";
import { storeToRefs } from "pinia";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useMeStore } from "../stores/me";
import { ref, watch } from "vue";
import {
  PlusIcon,
  Bars3BottomLeftIcon,
  BellIcon,
  LightBulbIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  ReceiptPercentIcon,
  CubeIcon,
  UsersIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  CogIcon,
  GlobeAltIcon,
  FireIcon,
  RectangleGroupIcon,
  PencilSquareIcon,
  RectangleStackIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  RocketLaunchIcon, SparklesIcon
} from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { computed } from "@vue/reactivity";
import { useSearchStore } from "@/stores/search";
import { useSiteStore } from "@/stores/site";
const searchResultsHide = ref(true);
const { setSearch, getSearchs } = useSearchStore();
const sidebarOpen = ref(false);
const selectedNavigation = ref(null);
const toggleNavigation = (navigation) => {
  selectedNavigation.value = navigation;
};
const { me, token } = storeToRefs(useMeStore());
const { site } = storeToRefs(useSiteStore());
const { search, searchs } = storeToRefs(useSearchStore());
const currentPath = computed(() =>
  router.currentRoute.value ? router.currentRoute.value : ""
);
const router = useRouter();
const navigation = [
  { name: "Dashboard", icon: HomeIcon, current: false, href: "" },
  { name: "Site", icon: RocketLaunchIcon, current: false, href: "site" },
  { name: "Product", icon: CubeIcon, current: false, href: "product" },
  { name: "Lead", icon: CubeIcon, current: false, href: "lead" },
  { name: "Page", icon: CubeIcon, current: false, href: "page" },
  { name: "Theme", icon: RectangleStackIcon, current: false, href: "theme" },
  {
    name: "Component",
    icon: RectangleGroupIcon,
    current: false,
    href: "component",
  },
  {
    name: "Tool",
    icon: CogIcon,
    current: false,
    children: [
      {
        name: "File",
        href: "tool/file",
        exceptIndustry: [18],
        code: "tool_file",
      },
    ],
  },
];
const userNavigation = [
  { name: "Your Profile", href: "account" },
  { name: "Settings", href: "setting" },
  { name: "Sign out", href: "logout" },
];

const secondaryNavigation = [
  {
    name: "New Update",
    href:
      "https://www.bponi.com/group/bponi-store/eC/?token=" +
      window.btoa(token.value),
    icon: RocketLaunchIcon,
    isExternal: true,
  },
  {
    name: "Promote & Earn",
    href:
      "https://www.bponi.com/group/bponi-affiliate/y/?token=" +
      window.btoa(token.value),
    icon: BanknotesIcon,
    isExternal: true,
  },
  {
    name: "Buy from Us",
    href: "bponi-shop",
    icon: ShoppingCartIcon,
    isExternal: false,
  },
  {
    name: "App",
    href: "app",
    icon: FireIcon,
    isExternal: false,
  },
  {
    name: "Help",
    href: "help",
    icon: QuestionMarkCircleIcon,
    isExternal: false,
  },
];
const toRoute = (route) => {
  router.push(`${route}`);
};
const logout = async () => {
  const { mutate, loading, error } = useMutation(SELF_LOGOUT, {
    variables: {
      userId: me.value.id,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfLogout) {
    }
  } catch (error) { }
  router.push(`/logout/`);
};
</script>
