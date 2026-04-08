<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex md:pb-5">
      <div class="flex gap-5 w-full relative">
        <SideBar
          @onCategory="toggleCategory"
          @onSubCategory="toggleSubCategory"
          @onSubSubCategory="toggleSubSubCategory"
        ></SideBar>
        <div
          class="w-full md:overflow-hidden md:mt-4 bg-white p-4 sm:rounded-xl"
          :class="[1].includes(site.industry) ? 'md:w-9/12' : 'md:w-full'"
        >
          <div class="px-4 md:px-0">
            <h2 class="text-2xl font-bold">Categories</h2>
            <div class="flex flex-wrap gap-2 md:mt-5">
              <button
                v-for="item in categories"
                class="px-3 py-2 rounded-2xl shadow hover:bg-gray-100 transition-all"
                :class="categoryId == item.id ? 'bg-green-100' : 'bg-white'"
              >
                {{ item.title }}
              </button>
            </div>
          </div>
          <div
            class="px-4 mt-4 md:px-0 md:mb-14 grid relative"
            :class="[myClass]"
          >
            <div
              v-for="brand in categories"
              :key="brand.id"
              class="cursor-pointer bg-white rounded-2xl md:rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div class="bg-[#f8f7f5]">
                <router-link
                  :to="`/category/${brand.slug}/${brand.hid}/`"
                  class="overflow-hidden"
                >
                  <div class="p-2 relative">
                    <img
                      v-lazy="brand.image"
                      alt="Product Image"
                      class="object-cover w-full h-[180px] rounded-xl"
                    />
                  </div>
                  <div class="px-3 pb-3 flex items-center justify-center">
                    <h2 class="text-center text-sm font-regular text-[#21201f]">
                      {{ locale == "en" ? brand.title : brand.translation }}
                    </h2>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { computed, ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCategoryStore } from "@/stores/category";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const SideBar = defineAsyncComponent(() => import("@/components/SideBar.vue"));
const emit = defineEmits(["onCategory", "onCategory"]);
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
const { categories } = storeToRefs(useCategoryStore());
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
const myClass = computed(() => {
  return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-4 gap-x-2 md:gap-2-2";
});
</script>
