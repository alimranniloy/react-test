<template>
  <aside class="border-light-300 lg:w-52 lg:flex-shrink-0 lg:bg-light ltr:lg:border-r rtl:lg:border-l border-r w-full">
    <nav class="hidden flex-col text-13px text-dark-900 lg:flex">
      <router-link :to="`${item.href}`" v-for="item in navigation" :key="item.id"
        class="flex items-center gap-3 px-4 py-3.5 hover:text-dark focus:text-dark dark:hover:text-light dark:focus:text-light"
        :class="{ 'text-[--primary]': router.currentRoute.value.path == item.href }"><span class="flex w-5 items-start">
          <component :is="item.icon" class="mr-5 h-6 w-6 flex-shrink-0"
            :class="router.currentRoute.value.path == item.href ? 'text-[--primary]' : 'text-gray-400 group-hover:text-gray-500'"
            aria-hidden="true" />
        </span>

        <span class="text-dark-100 dark:text-light-400">{{
          item.title
          }}</span></router-link>
    </nav>
  </aside>
  <div class="lg:hidden space-y-6 lg:col-span-2 lg:col-start-1 sticky top-12 z-20 bg-white pb-4 px-4">
    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex gap-3 overflow-x-auto">
        <router-link v-for="item in navigation" :key="item.id" :class="[
          item.href == router.currentRoute.value.path
            ? 'border-purple-500 text-purple-600'
            : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700',
          'whitespace-nowrap py-2 mb-3 px-1 border-b-2 font-medium text-sm cursor-pointer active:cursor-wait',
        ]" :to="item.href">
          {{ item.title }}
        </router-link>
      </nav>
    </div>
  </div>
</template>
<script setup>
import {
  CogIcon,
  ReceiptPercentIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  HeartIcon,
  MegaphoneIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  CircleStackIcon,
} from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const navigation = ref([
  {
    id: 1,
    title: "Home",
    href: "/user/",
    icon: HomeIcon,
  },
  {
    id: 2,
    title: "Order",
    icon: ReceiptPercentIcon,
    href: "/user/order/",
  },
  {
    id: 3,
    title: "Reseller",
    href: "/user/reseller",
    icon: CurrencyDollarIcon,
  },
  // {
  //   id: 3,
  //   title: "Wholesale",
  //   href: "/user/wholesale",
  //   icon: CircleStackIcon,
  // },
  {
    id: 4,
    title: "Affiliate",
    href: "/user/affiliate",
    icon: MegaphoneIcon,
  },
  {
    id: 6,
    title: "Wishlist",
    icon: HeartIcon,
    href: "/user/wishlist",
  },
  {
    id: 7,
    title: "Setting",
    icon: CogIcon,
    href: "/user/setting/",
  },
  {
    id: 7,
    title: "Password",
    icon: LockClosedIcon,
    href: "/user/password/",
  },
  {
    id: 9,
    title: "Log Out",
    icon: ArrowLeftOnRectangleIcon,
    href: "/logout",
  },
]);
</script>
