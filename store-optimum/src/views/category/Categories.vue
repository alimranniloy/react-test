<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto sm:px-4 pb-5">
      <div class="w-full">
        <div
          class="w-full min-h-[80vh] md:overflow-hidden md:mt-4 bg-white rounded-2xl px-2 md:px-4 pb-10"
        >
          <div class="px-4">
            <h2 class="text-lg md:text-2xl font-bold mb-4 mt-4">All Categories</h2>
          </div>
          <div class="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] gap-1">
            <div class="h-full justify-self-center">
              <div
                class="flex flex-col gap-5 h-full min-h-[calc(100vh-115px)] max-h-[calc(100vh-115px)] lg:max-h-[calc(100vh-260px)] overflow-y-auto sticky top-14 pr-2 md:pr-4 scrollbar-thin"
              >
                <div
                  v-for="category in categories"
                  :key="category.id"
                  class="flex flex-col items-center gap-0.5 w-[80px] md:w-full"
                  @click="selectedCategory = category"
                >
                  <div
                    class="bg-[#f8f7f5]  border border-gray-100 duration-150 rounded-md shadow-sm p-2 w-full"
                    :class="selectedCategory.id == category.id ? 'bg-red-100 hover:bg-red-100' : 'hover:bg-amber-50'"
                  >
                    <img
                      v-lazy="category.image"
                      alt="Product Image"
                      class="object-cover max-h-28 w-full rounded-md"
                    />
                    <h2
                      class="text-center text-xs md:text-sm line-clamp-1 text-gray-900 pt-2"
                    >
                      {{ locale == "en" ? category.title : category.translation }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-full border-l-2 border-gray-100 pl-2">
              <div
                class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 h-fit"
              >
                <router-link
                  :to="`/category/${selectedCategory.slug}/${selectedCategory.hid}/`"
                  class="flex flex-col items-center gap-0.5"
                >
                  <div
                    class="bg-[#f8f7f5] p-1.5 rounded-full hover:bg-green-100 duration-300"
                  >
                    <img
                      v-lazy="selectedCategory.image"
                      alt="Product Image"
                      class="object-cover w-12 h-12 md:w-20 md:h-20 rounded-full"
                    />
                  </div>
                  <h2
                    class="font-medium md:font-semibold text-center text-xs md:text-sm line-clamp-1 leading-5 text-[#21201f]"
                  >
                    See All
                  </h2>
                </router-link>
  
                <div
                  v-for="subCategory in subCategories.filter(
                    (el) => el.categoryId == selectedCategory.id
                  )"
                  :key="subCategory.id"
                  class="flex flex-col items-center gap-0.5"
                >
                  <router-link
                    :to="`/sub-category/${subCategory.slug}/${subCategory.hid}/`"
                    class="bg-[#f8f7f5] p-2 rounded-full hover:bg-green-100 duration-300"
                  >
                    <img
                      v-lazy="subCategory.image"
                      alt="Product Image"
                      class="object-cover w-12 h-12 md:w-20 md:h-20 rounded-full"
                    />
                  </router-link>
                  <h2
                    class="font-medium md:font-semibold text-center text-xs md:text-sm line-clamp-1 leading-5 text-[#21201f]"
                  >
                    {{
                      locale == "en" ? subCategory.title : subCategory.translation
                    }}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCategoryStore } from "@/stores/category";
import { useSubCategoryStore } from "@/stores/subCategory";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const emit = defineEmits(["onCategory", "onCategory"]);
const { site, locale } = storeToRefs(useSiteStore());
const { categories } = storeToRefs(useCategoryStore());
const { getCategories } = useCategoryStore();
const { subCategories } = storeToRefs(useSubCategoryStore());
const { getSubCategories } = useSubCategoryStore();
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
const selectedCategory = ref(categories.value[0]);
// const toggleCategory = (category) => {
//   router.push(`/category/${category.title}/${category.hid}/`);
// };
// const toggleSubCategory = (subCategory) => {
//   router.push(`/sub-category/${subCategory.title}/${subCategory.hid}/`);
// };
// const toggleSubSubCategory = (subSubCategory) => {
//   router.push(
//     `/sub-sub-category/${subSubCategory.title}/${subSubCategory.hid}/`
//   );
// };
</script>
