<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5">
      <div class="flex gap-5 w-full relative">
        <LongSideBar
          @onCategory="toggleCategory"
          @onSubCategory="toggleSubCategory"
          @onSubSubCategory="toggleSubSubCategory"
        ></LongSideBar>
        <div
          class="w-full md:overflow-hidden md:mt-4 bg-white p-4 sm:rounded-xl min-h-[calc(100vh-94px)] md:min-h-[calc(100vh-99px)] lg:min-h-[calc(100vh-136px)]"
          v-if="category"
        >
          <!-- top info -->
          <div>
            <h2 class="text-2xl font-bold">
              <span>Sub Categories of</span> <span class="text-[--primary]">{{ category.title }}</span> 
            </h2>
            <div
              class="flex items-center flex-nowrap gap-5 whitespace-nowrap pb-3 mt-5 overflow-x-auto"
            >
              <button
                @click="toggleSubCategory({ id: null }), router.go(-1)"
                class="px-3 py-2 rounded-2xl shadow transition-all mb-1"
                :class="subCategoryId == null ? 'bg-green-100' : 'bg-white'"
              >
                back
              </button>
              <button
                @click="toggleSubCategory({ id: null })"
                class="px-3 py-2 rounded-2xl shadow transition-all mb-1"
                :class="subCategoryId == null ? 'bg-green-100' : 'bg-white'"
              >
                All
              </button>
              <button
                :key="item.id"
                @click="
                  toggleSubCategory(item),
                    router.push(`/sub-category/${item.slug}/${item.hid}/`)
                "
                v-for="item in subCategories.filter(
                  (v) => v.categoryId == category.id
                )"
                class="px-3 py-2 rounded-2xl shadow transition-all mb-1"
                :class="subCategoryId == item.id ? 'bg-green-100' : 'bg-white'"
              >
                {{ item.title }}
              </button>
            </div>
          </div>
          <!-- top info -->
          <div
            class="flex items-center justify-between border border-gray-200 p-2 rounded-md mt-5"
          >
            <div class="text-xl font-medium">{{ category.title }}</div>
            <div class="flex justify-end">
              <Menu as="div" class="relative -ml-px flex items-center gap-2">
                <div class="flex items-center gap-2">
                  <ArrowsUpDownIcon class="h-5 w-5" />
                  <p>Sort by:</p>
                </div>
                <MenuButton
                  class="flex items-center rounded-md gap-2 bg-gray-100 hover:bg-gray-200 px-5 py-3 transition-all text-base cursor-pointer"
                >
                  {{ queryName ? queryName : "Default" }}
                  <ChevronDownIcon class="h-5 w-5" />
                </MenuButton>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute top-8 right-0 z-10 mt-2 -mr-1 p-3 origin-top-right rounded-md bg-white shadow-lg focus:outline-none"
                  >
                    <MenuItem
                      v-for="item in dropdownItems"
                      :key="item.name"
                      v-slot="{ active }"
                    >
                      <p
                        @click="
                          (queryType = item.href),
                            (queryName = item.name),
                            router.replace(
                              `${router.currentRoute.value.path}?queryType=${queryType}`
                            )
                        "
                        :class="[
                          item.name == queryName
                            ? 'bg-gray-100 text-gray-900 rounded-md'
                            : '',
                          'px-3 py-1 w-full hover:bg-gray-100 text-gray-500 hover:text-gray-900',
                        ]"
                      >
                        {{ item.name }}
                      </p>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
          <!-- Products start -->
          <ProductList
            :categoryId="categoryId"
            :subCategoryId="subCategoryId"
            :queryType="queryType"
          />
          <!-- Products end -->

          <div v-html="category.description" class="pt-10 px-4"></div>
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
import { ChevronDownIcon, ArrowsUpDownIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { computed, ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCategoryStore } from "@/stores/category";
import { useSubCategoryStore } from "@/stores/subCategory";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const LongSideBar = defineAsyncComponent(() =>
  import("@/components/LongSideBar.vue")
);
const ProductList = defineAsyncComponent(() =>
  import("@/components/ProductList.vue")
);
const router = useRouter();
const { site } = storeToRefs(useSiteStore());

const queryType = ref(
  router.currentRoute.value.query["queryType"]
    ? router.currentRoute.value.query["queryType"]
    : site.value.queryType
);
const queryName = ref(null);
const dropdownItems = [
  { name: "Most Popular", href: "highest_sold", current: false },
  { name: "Best Rating", href: "highest_rating", current: false },
  { name: "Newest Products", href: "latest", current: true },
  { name: "Lowest Price", href: "lowest_price", current: false },
  { name: "Most Expensive", href: "highest_price", current: false },
];
const pages = [{ name: "Category", href: "#", current: false }];
dayjs.extend(relativeTime);
const { categories } = storeToRefs(useCategoryStore());
const { subCategories } = storeToRefs(useSubCategoryStore());
const category = computed(() => {
  subCategoryId.value = null;
  return categories.value
    ? categories.value.find((v) => v.hid == router.currentRoute.value.params.id)
    : null;
});
const showFilter = ref(false);
const { getCategories } = useCategoryStore();
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
const categoryId = computed(() => (category.value ? category.value.id : null));
const subCategoryId = ref(null);
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
