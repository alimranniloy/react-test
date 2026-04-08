<template>
  <main class="sm:px-0 pb-[60px] pt-[48px] sm:pt-[64px] md:pt-0">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5">
      <div class="flex gap-5 w-full relative">
        <LongSideBar
          @onCategory="toggleCategory"
          @onSubCategory="toggleSubCategory"
          @onSubSubCategory="toggleSubSubCategory"
        ></LongSideBar>
        <div
          class="w-full md:overflow-hidden md:mt-4 bg-white p-4 sm:rounded-xl"
        >
          <!-- top info -->
          <nav class="flex" aria-label="Breadcrumb">
            <ol role="list" class="flex items-center space-x-4">
              <li v-for="page in pages" :key="page.name">
                <div class="flex items-center">
                  <a
                    :href="page.href"
                    class="text-base font-medium text-black hover:text-gray-700"
                    :aria-current="page.current ? 'page' : undefined"
                    >{{ page.name }}</a
                  >
                  <svg
                    class="h-5 w-5 flex-shrink-0 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                </div>
              </li>
            </ol>
          </nav>
          <h2 class="text-2xl font-bold">
            {{ router.currentRoute.value.query.search }}
          </h2>
          <!-- Products start -->
          <ProductList
            :key="router.currentRoute.value.fullPath"
            :plainSearch="router.currentRoute.value.query.search"
          />
          <!-- Products end -->
          <SideFilter v-if="showFilter" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "Products",
};
</script>
<script setup>
import { useRouter } from "vue-router";
import { ref, defineAsyncComponent } from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
const SideFilter = defineAsyncComponent(() =>
  import("@/components/SideFilter.vue")
);
const LongSideBar = defineAsyncComponent(() =>
  import("@/components/LongSideBar.vue")
);
const ProductList = defineAsyncComponent(() =>
  import("@/components/ProductList.vue")
);
const pages = [{ name: "Search", href: "#", current: false }];
dayjs.extend(duration);
const showFilter = ref(false);
const router = useRouter();
const toggleCategory = (data) => {
  router.push(`/category/${data.title}/${data.hid}`);
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
