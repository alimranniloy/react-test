<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5">
      <div class="flex gap-5 w-full relative">
        <SideBar
          @onCategory="toggleCategory"
          @onSubCategory="toggleSubCategory"
          @onSubSubCategory="toggleSubSubCategory"
        ></SideBar>
        <div
          class="w-full md:overflow-hidden md:mt-4"
          :class="
            [1].includes(site.industry)
              ? 'md:w-9/12 md:max-w-[1120px]'
              : 'md:w-full'
          "
        >
          <!--  hero start -->
          <div
            class="px-4 md:px-0 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 gap-5 md:gap-4"
          >
            <ShopList :categoryId="categoryId" :subCategoryId="subCategoryId" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const SideBar = defineAsyncComponent(() => import("@/components/SideBar.vue"));
const ShopList = defineAsyncComponent(() =>
  import("@/components/ShopList.vue")
);
const emit = defineEmits(["onCategory", "onSubCategory"]);
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
const toggleCategory = (category) => {
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
