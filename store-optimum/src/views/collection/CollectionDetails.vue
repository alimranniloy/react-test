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
        >
          <!-- Product grid -->
          <div>
            <!--  hero start -->
            <div class="rounded-md overflow-hidden mb-8">
              <img
                class="w-full h-full max-h-[150px] md:max-h-[300px]"
                v-lazy="collection?.image"
                alt=""
              />
            </div>
            <div class="grid md:grid-cols-4 grid-cols-2 gap-4 mt-6 mb-6">
              <router-link
                class="bg-gary-50 px-3 py-4 text-center  rounded-md hover:bg-red-50 transition-all border flex items-center justify-center"
                :to="`/sub-category/${item.slug}/${item.hid}/`"
                v-for="item in subCategories.filter((a) => true).slice(0, 7)"
                :key="'subCategory_' + item.id"
              >
                {{ item.title }} </router-link
              ><router-link
                class="bg-gary-50 px-3 py-4 text-center  rounded-md hover:bg-red-50 transition-all border flex items-center justify-center"
                :to="`/categories`"
              >
                {{ "আরও দেখুন" }}
              </router-link>
            </div>

            <div class="flex justify-end mt-5 border-b border-gray-200 pb-3">
              <Menu as="div" class="relative -ml-px block">
                <MenuButton
                  class="flex items-center rounded-md gap-2 bg-gray-100 hover:bg-gray-200 transition-all px-5 py-3 text-base cursor-pointer"
                >
                  <ArrowsUpDownIcon class="h-5 w-5" />
                  {{ queryName ? queryName : "Sort by" }}
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
                    class="absolute -left-[76px] z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg focus:outline-none"
                  >
                    <div class="py-3 px-3">
                      <MenuItem
                        v-for="item in dropdownItems"
                        :key="item.name"
                        v-slot="{ active }"
                      >
                        <button
                          @click="
                            (queryType = item.href),
                              (queryName = item.name),
                              router.replace(
                                `${router.currentRoute.value.path}?queryType=${queryType}`
                              )
                          "
                          :href="item.href"
                          :class="[
                            active
                              ? 'bg-gray-100 text-gray-900 rounded-md'
                              : 'text-gray-700',
                            'block px-3 py-2 text-base',
                          ]"
                        >
                          {{ item.name }}
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>

            <ProductList
              :categoryId="categoryId"
              :subCategoryId="subCategoryId"
              :collectionId="collectionId"
              :supplierId="publisherId"
              :queryType="queryType"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "CollectionDetails",
};
</script>
<script setup>
import {
  ChevronDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { computed, ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useCollectionStore } from "@/stores/storeCollection";
import { useSubCategoryStore } from "@/stores/subCategory";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useSiteStore } from "@/stores/site";
const { site } = storeToRefs(useSiteStore());
const LongSideBar = defineAsyncComponent(() =>
  import("@/components/LongSideBar.vue")
);
const ProductList = defineAsyncComponent(() =>
  import("@/components/ProductList.vue")
);
const router = useRouter();

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
dayjs.extend(relativeTime);
const { collections } = storeToRefs(useCollectionStore());
const { subCategories } = storeToRefs(useSubCategoryStore());
const collection = computed(() => {
  return collections.value
    ? collections.value.find(
        (v) => v.hid == router.currentRoute.value.params.id
      )
    : null;
});

const collectionId = computed(() =>
  collection.value ? collection.value.id : null
);
const categoryId = ref(null);
const toggleCategory = (category) => {
  categoryId.value = category.id;
  router.push(`/category/${category.title}/${category.hid}/`);
};
const toggleSubCategory = (subCategory) => {
  router.push(`/sub-category/${subCategory.title}/${subCategory.hid}/`);
};
const toggleSubSubCategory = (subSubCategory) => {
  router.push(
    `/sub-sub-category/${subSubCategory.title}/${subSubCategory.hid}/`
  );
};
</script>
