<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5" id="app">
      <div class="w-full px-5 bg-white md:mt-4 md:rounded-xl">
        <h3 class="font-bold text-xl text-gray-800 mt-4">Category</h3>
        <ul class="mt-4">
          <li
            @click="toggleCategory({ title: 'All', id: null, hid: null }, true)"
            class="flex w-full justify-between cursor-pointer items-center p-3 rounded-xl transition-all group hover:bg-white"
          >
            <div class="flex items-center">
              <img class="w-8 h-8 rounded-full" v-lazy="site.favicon" />
              <span
                class="ml-3 text-gray-900 font-regular line-clamp-2 leading-4"
                >All products</span
              >
            </div>
          </li>

          <li
            v-for="category in categories"
            :key="category.id"
            class="flex w-full justify-between cursor-pointer items-center p-3 rounded-xl transition-all group hover:bg-white"
            :class="categoryId == category.id ? 'bg-white' : ''"
          >
            <div
              v-if="
                subCategories.filter((v) => v.categoryId == category.id)
                  .length == 0
              "
              class="flex items-center"
              @click="toggleCategory(category, true)"
            >
              <img class="w-8 h-8 rounded-full" v-lazy="category.image" />
              <span
                class="ml-3 text-gray-900 font-regular line-clamp-2 leading-4"
                >{{ category.title }}</span
              >
            </div>
            <Disclosure v-else as="div" v-slot="{ open }">
              <DisclosureButton
                class="flex items-center"
                @click="toggleCategory(category, !open)"
                ><img class="w-8 h-8 rounded-full" v-lazy="category.image" />
                <span
                  class="ml-3 text-gray-900 font-regular line-clamp-2 leading-4"
                  >{{ category.title }}</span
                >
              </DisclosureButton>
              <DisclosurePanel
                v-show="open && categoryId == category.id"
                :static="true"
                class="space-y-1"
              >
                <li
                  v-for="subCategory in subCategories.filter(
                    (v) => v.categoryId == category.id
                  )"
                  :class="subCategoryId == subCategory.id ? 'bg-green-100' : ''"
                  @click="toggleSubCategory(subCategory)"
                  :key="subCategory.id"
                  class="mt-4 ml-3 flex w-full justify-between cursor-pointer items-center p-3 rounded-xl transition-all group"
                >
                  <div class="flex items-center">
                    <img
                      class="w-8 h-8 rounded-full"
                      v-lazy="subCategory.image"
                    />
                    <span
                      class="ml-3 text-gray-900 font-regular line-clamp-2 leading-4"
                      >{{ subCategory.title }}</span
                    >
                  </div>
                </li>
              </DisclosurePanel>
            </Disclosure>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>
<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCategoryStore } from "@/stores/category";
import { useSubCategoryStore } from "@/stores/subCategory";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const emit = defineEmits(["onCategory", "onSubCategory"]);
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
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
const categoryId = ref(null);
const subCategoryId = ref(null);
const toggleCategory = (category, open) => {
  categoryId.value = category.id;
  subCategoryId.value = null;
  if (!open) {
    // emit("onCategory", category);
    router.push(`/category/${category.title}/${category.hid}/`);
  }
};
const toggleSubCategory = (subCategory) => {
  subCategoryId.value = subCategory.id;
  // emit("onSubCategory", subCategory);

  router.push(`/sub-category/${subCategory.title}/${subCategory.hid}/`);
};
</script>
