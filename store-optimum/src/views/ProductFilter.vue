<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto px-4 flex pb-5">
      <div class="flex gap-5 w-full relative">
        <LongSideBar @onCategory="toggleCategory" @onSubCategory="toggleSubCategory"
          @onSubSubCategory="toggleSubSubCategory"></LongSideBar>
        <div
          class="w-full md:overflow-hidden md:mt-4 bg-white md:p-4 sm:rounded-xl min-h-[calc(100vh-94px)] md:min-h-[calc(100vh-99px)] lg:min-h-[calc(100vh-136px)]">
          <!-- top info -->
          <div v-if="site.domain !== 'www.darun.com.bd'">
            <!-- for category details page -->
            <div v-if="category" class="mb-2 md:mb-5">
              <!-- //___________ category cover for rasiyatshop.com __________// -->
              <div v-if="category?.cover && category.cover !== 'https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/default.png'">
                <img class="w-full rounded-lg border h-32 md:h-60 mb-2 md:mb-4 object-cover" :src="category.cover"
                  alt="category cover" loading="lazy">
              </div>
              <h2 class="hidden sm:block text-base md:text-2xl font-bold">
                <span>Sub Categories of </span>
                <span class="text-[--primary]">{{ pageTitle }}</span>
              </h2>
              <div class="flex items-center flex-nowrap gap-5 whitespace-nowrap p-2 md:pb-3 md:pt-5 overflow-x-auto">
                <button @click="toggleSubCategory({ id: null }), router.go(-1)"
                  class="px-2 py-1 sm:px-3 sm:py-2 rounded-2xl shadow-[0px_1px_6px_rgba(0,0,0,0.2)] transition-all bg-white">
                  back
                </button>
                <button @click="toggleSubCategory({ id: null })"
                  class="px-2 py-1 sm:px-3 sm:py-2 rounded-2xl shadow-[0px_1px_6px_rgba(0,0,0,0.2)] transition-all"
                  :class="subCategoryId == null ? 'bg-green-100' : 'bg-white'">
                  All
                </button>
                <button :key="item.id" @click="
                  toggleSubCategory(item),
                  router.push(`/sub-category/${item.slug}/${item.hid}/`)
                  " v-for="item in subCategories.filter(
                    (v) => v.categoryId == categoryId
                  )" class="px-2 py-1 sm:px-3 sm:py-2 rounded-2xl shadow-[0px_1px_6px_rgba(0,0,0,0.2)] transition-all"
                  :class="subCategoryId == item.id ? 'bg-green-100' : 'bg-white'">
                  {{ item.title }}
                </button>
              </div>
            </div>
            <!-- for sub category details page -->
            <div v-if="subCategory">
              <!-- //___________ subCategory cover for rasiyatshop.com __________// -->
              <div v-if="subCategory?.cover && subCategory.cover !== 'https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/default.png'">
                <img class="w-full rounded-lg border h-32 md:h-60 mb-2 md:mb-4 object-cover" :src="subCategory.cover"
                  alt="subCategory cover" loading="lazy">
              </div>
              <h2 class="hidden sm:block text-base md:text-2xl font-bold">
                <span>Sub Child Categories of </span>
                <span class="text-[--primary]">{{ pageTitle }}</span>
              </h2>
              <div class="flex items-center flex-nowrap gap-5 whitespace-nowrap p-2 md:pb-3 md:pt-5 overflow-x-auto">
                <button @click="toggleSubSubCategory({ id: null }), router.go(-1)"
                  class="px-2 py-1 sm:px-3 sm:py-2 rounded-2xl shadow-[0px_1px_6px_rgba(0,0,0,0.2)] transition-all bg-white">
                  back
                </button>
                <button @click="toggleSubSubCategory({ id: null })"
                  class="px-2 py-1 sm:px-3 sm:py-2 rounded-2xl shadow-[0px_1px_6px_rgba(0,0,0,0.2)] transition-all"
                  :class="subSubCategoryId == null ? 'bg-green-100' : 'bg-white'">
                  All
                </button>
                <button :key="item.id" @click="
                  toggleSubSubCategory(item),
                  router.push(`/sub-sub-category/${item.slug}/${item.hid}/`)
                  " v-for="item in subSubCategories.filter(
                    (v) => v.subCategoryId == subCategoryId
                  )" class="px-2 py-1 sm:px-3 sm:py-2 rounded-2xl shadow-[0px_1px_6px_rgba(0,0,0,0.2)] transition-all"
                  :class="subSubCategoryId == item.id ? 'bg-green-100' : 'bg-white'
                    ">
                  {{ item.title }}
                </button>
              </div>
            </div>
          </div>
          <!-- top info end -->

          <!-- sorting -->
          <div class="flex items-center justify-between border border-gray-200 p-2 mt-2 rounded-md">
            <div class="text-base md:text-xl font-medium">{{ pageTitle }}</div>
            <div class="flex justify-end">
              <Menu as="div" class="relative -ml-px flex items-center gap-1 sm:gap-2">
                <div class="flex items-center gap-2">
                  <ArrowsUpDownIcon class="h-4 w-4 md:h-5 md:w-5" />
                  <p class="hidden sm:block">Sort by:</p>
                </div>
                <MenuButton
                  class="flex items-center rounded-md gap-2 bg-gray-100 hover:bg-gray-200 px-2 py-1.5 md:px-4 md:py-2 text-xs md:text-sm lg:text-base transition-all cursor-pointer">
                  {{ queryName ? queryName : "Default" }}
                  <ChevronDownIcon class="h-4 w-4 md:h-5 md:w-5" />
                </MenuButton>
                <transition enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95">
                  <MenuItems
                    class="absolute top-8 right-0 z-10 mt-2 -mr-1 p-2 md:p-3 origin-top-right min-w-[150px] text-sm lg:text-base rounded-md bg-white shadow-lg focus:outline-none">
                    <MenuItem v-for="item in sortItems" :key="item.name" v-slot="{ active }">
                    <p @click="
                      (queryType = item.href),
                      (queryName = item.name),
                      router.replace(
                        `${router.currentRoute.value.path}?queryType=${queryType}`
                      )
                      " :class="[
                          item.name == queryName
                            ? 'bg-gray-100 text-gray-900 rounded-md'
                            : '',
                          'px-3 py-1 w-full hover:bg-gray-100 text-gray-500 hover:text-gray-900',
                        ]">
                      {{ item.name }}
                    </p>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
          <!-- Products start -->
          <ProductList :categoryId="categoryId" :subCategoryId="subCategoryId" :subSubCategoryId="subSubCategoryId"
            :queryType="queryType" />
          <!-- Products end -->

          <div v-if="category" v-html="category?.description" class="pt-10 px-4"></div>
          <div v-else-if="subCategory" v-html="subCategory?.description" class="pt-10 px-4"></div>
          <div v-else v-html="subSubCategory?.description" class="pt-10 px-4"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "CategoryDetails",
};
</script>
<script setup>
import {
  ChevronDownIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
} from "@heroicons/vue/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { useMeStore } from "@/stores/me";
import { useBrandStore } from "@/stores/brand";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCategoryStore } from "@/stores/category";
import { useSubCategoryStore } from "@/stores/subCategory";
import { useSubSubCategoryStore } from "@/stores/subSubCategory";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const ProductList = defineAsyncComponent(() =>
  import("@/components/ProductList.vue")
);
const SideFilter = defineAsyncComponent(() =>
  import("@/components/SideFilter.vue")
);
const LongSideBar = defineAsyncComponent(() =>
  import("@/components/LongSideBar.vue")
);

const router = useRouter();
const { site, siteKey, isMobile } = storeToRefs(useSiteStore());
const { categories } = storeToRefs(useCategoryStore());
const { getCategories } = useCategoryStore();
const { subCategories } = storeToRefs(useSubCategoryStore());
const { getSubCategories } = useSubCategoryStore();
const { brands } = storeToRefs(useBrandStore());
const { getBrands } = useBrandStore();
const { subSubCategories } = storeToRefs(useSubSubCategoryStore());
const { getSubSubCategories } = useSubSubCategoryStore();
const { token } = storeToRefs(useMeStore());

// const emit = defineEmits(["onCategory", "onSubCategory"]);

if (brands.value.length == 0) {
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
}
if (categories.value.length == 0) {
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
}
if (subCategories.value.length == 0) {
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
}
if (subSubCategories.value.length == 0) {
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
}

const category = computed(() => {
  return categories.value
    ? categories.value.find((v) => v.hid == router.currentRoute.value.params.id)
    : null;
});
const categoryId = computed(() => (category.value ? category.value.id : null));

const subCategory = computed(() => {
  return subCategories.value
    ? subCategories.value.find(
      (v) => v.hid == router.currentRoute.value.params.id
    )
    : null;
});
const subCategoryId = computed(() =>
  subCategory.value ? subCategory.value.id : null
);

const subSubCategory = computed(() => {
  return subSubCategories.value
    ? subSubCategories.value.find(
      (v) => v.hid == router.currentRoute.value.params.id
    )
    : null;
});
const subSubCategoryId = computed(() =>
  subSubCategory.value ? subSubCategory.value.id : null
);

const pageTitle = computed(() => {
  let title;
  if (category.value) {
    title = category.value.title;
  } else if (subCategory.value) {
    title = subCategory.value.title;
  } else if (subSubCategory.value) {
    title = subSubCategory.value.title;
  } else if (router.currentRoute.value.query) {
    title = router.currentRoute.value.query.search;
  }
  return title;
});

const queryType = ref(
  router.currentRoute.value.query["queryType"]
    ? router.currentRoute.value.query["queryType"]
    : site.value.queryType
);
const queryName = ref(null);
const sortItems = [
  { name: "Newest Products", href: "latest", current: false },
  { name: "Most Popular", href: "highest_sold", current: false },
  { name: "Highest Rating", href: "highest_rating", current: false },
  { name: "Lowest Price", href: "lowest_price", current: false },
  { name: "Highest Price", href: "highest_price", current: false },
];
const showSideFilter = ref(false);
const appToken = ref(window.btoa(token.value));

watch(siteKey, () => {
  emit("onCategory", { title: "All", id: null, hid: null });
  router.push(`${"/"}`);
});

const toggleCategory = (data) => {
  if (data.id == null) {
  } else {
    router.push(`/category/${data.title}/${data.hid}`);
    subCategoryId.value = null;
  }
};
const toggleSubCategory = (data) => {
  if (data.id == null) {
    subCategoryId.value = null;
  } else {
    subCategoryId.value = data.id;
  }
};
const toggleSubSubCategory = (subSubCategory) => {
  router.push(
    `/sub-sub-category/${subSubCategory.title}/${subSubCategory.hid}/`
  );
};
</script>
