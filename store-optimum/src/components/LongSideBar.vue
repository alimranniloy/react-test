<template>
  <div
    class="hidden md:block min-w-[200px] md:min-w-[250px] max-w-[200px] md:max-w-[250px] bg-white sticky top-[126px] lg:top-[126px] rounded-xl h-[calc(100vh-99px)] lg:h-[calc(100vh-136px)] scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300 z-40 mt-4"
  >
    <div
      @mouseleave="(selectedCategoryId = null), (selectedSubCategoryId = null)"
      class="relative p-4 min-w-[200px] md:min-w-[250px] max-w-[200px] md:max-w-[250px]"
    >
      <div
        v-if="
          subCategories.filter((a) => a.categoryId == selectedCategoryId)
            .length > 0
        "
        class="absolute z-40 left-[100%] top-0 w-full min-h-[calc(100vh-280px)] max-h-[calc(100vh-320px)] lg:max-h-[calc(100vh-356px)] shadow-xl rounded-xl p-2 bg-white overflow-hidden hover:overflow-y-auto scrollbar-thin"
      >
        <ul>
          <li
            @click="
              toggleSubCategory(subCategory),
                router.push(
                  `/sub-category/${subCategory.slug}/${subCategory.hid}/`
                )
            "
            @mouseover="selectedSubCategoryId = subCategory.id"
            v-for="subCategory in subCategories.filter(
              (a) => a.categoryId == selectedCategoryId
            )"
            :key="subCategory.id"
            class="w-full cursor-pointer items-center transition-all group flex justify-between hover:bg-green-50 rounded-xl"
          >
            <div class="flex items-center my-0 p-2 w-full">
              <img class="w-6 h-6 rounded-full" v-lazy="subCategory.image" />
              <span
                class="ml-4 text-gray-700 font-medium text-sm line-clamp-1 leading-4 hover:text-gray-900 text-left"
              >
                {{ locale === 'en' ? subCategory.title : subCategory.translation }}
              </span>
            </div>
            <ChevronRightIcon
              v-if="
                subSubCategories.filter(
                  (a) => a.subCategoryId == subCategory.id
                ).length > 0
              "
              class="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          </li>
        </ul>
      </div>
      <div
        v-if="
          subSubCategories.filter(
            (a) => a.subCategoryId == selectedSubCategoryId
          ).length > 0
        "
        class="absolute z-40 left-[200%] top-0 w-full min-h-[calc(100vh-280px)] max-h-[calc(100vh-320px)] lg:max-h-[calc(100vh-356px)] shadow-xl rounded-xl p-2 bg-white overflow-hidden hover:overflow-y-auto scrollbar-thin"
      >
        <ul>
          <li
            @click="
              toggleSubSubCategory(subSubCategory),
                router.push(
                  `/sub-sub-category/${subSubCategory.slug}/${subSubCategory.hid}/`
                )
            "
            v-for="subSubCategory in subSubCategories.filter(
              (a) => a.subCategoryId == selectedSubCategoryId
            )"
            :key="subSubCategory.id"
            class="w-full cursor-pointer items-center transition-all group"
          >
            <div
              class="flex items-center hover:bg-green-50 p-2 my-0 rounded-xl w-full"
            >
              <img class="w-6 h-6 rounded-full" v-lazy="subSubCategory.image" />
              <span
                class="ml-4 text-gray-700 font-medium text-sm line-clamp-1 leading-4 hover:text-gray-900 text-left"
                >{{ locale === 'en' ? subSubCategory.title : subSubCategory.translation }}</span
              >
            </div>
          </li>
        </ul>
      </div>
      <ul
        class="max-h-[calc(100vh-320px)] lg:max-h-[calc(100vh-356px)] bg-white rounded-md overflow-hidden hover:overflow-y-auto scrollbar-thin"
      >
        <li
          @click="
            toggleCategory(category),
              router.push(`/category/${category.slug}/${category.hid}/`)
          "
          @mouseover="selectedCategoryId = category.id"
          v-for="category in categories"
          :key="category.id"
          class="w-full cursor-pointer items-center transition-all group flex justify-between hover:bg-green-50 rounded-xl"
        >
          <div class="flex items-center my-0 p-2 w-full">
            <img class="w-5 h-5 rounded-full" v-lazy="category.image" />
            <span
              class="ml-3 text-gray-700 font-medium text-sm line-clamp-1 leading-4 hover:text-gray-900 text-left"
              >{{ locale === 'en' ? category.title : category.translation }}</span
            >
          </div>

          <ChevronRightIcon
            v-if="
              subCategories.filter((a) => a.categoryId == category.id).length >
              0
            "
            class="h-5 w-5 text-red-400"
            aria-hidden="true"
          />
        </li>
      </ul>
      <h3 class="font-semibold text-sm px-3 py-3 text-gray-700">Feature</h3>
      <ul class="mt-0">
        <li
          @click="toRoute(`/`)"
          class="w-full cursor-pointer items-center transition-all group"
        >
          <div
            class="flex items-center hover:bg-green-50 py-2 my-0 px-2 rounded-xl w-full"
          >
            <HomeIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
            <span
              class="ml-4 text-gray-700 font-medium text-sm line-clamp-1 leading-4 hover:text-gray-900 text-left"
              >{{ $t("nav.home")}}</span
            >
          </div>
        </li>
        <li
          @click="toRoute(`/brands/`)"
          class="w-full cursor-pointer items-center transition-all group"
        >
          <div
            class="flex items-center hover:bg-green-50 py-2 my-0 px-2 rounded-xl w-full"
          >
            <FlagIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
            <span
              class="ml-4 text-gray-700 font-medium text-sm line-clamp-1 leading-4 hover:text-gray-900 text-left"
              >{{ $t('nav.brand')}}</span
            >
          </div>
        </li>
        <li
          @click="toRoute(`/product/flash/`)"
          class="w-full cursor-pointer items-center transition-all group"
        >
          <div
            class="flex items-center hover:bg-green-50 py-2 my-0 px-2 rounded-xl w-full"
          >
            <BoltIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
            <span
              class="ml-4 text-gray-700 font-medium text-sm line-clamp-1 leading-4 hover:text-gray-900 text-left"
              >{{$t("nav.flashSale")}}</span
            >
          </div>
        </li>
        <a
          :href="`https://${site.domain}/community/?token=${appToken}`"
          target="_blank"
          class="w-full cursor-pointer items-center transition-all group"
        >
          <div
            class="flex items-center hover:bg-green-50 py-2 my-0 px-2 rounded-xl w-full"
          >
            <HeartIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
            <span
              class="ml-4 text-gray-700 font-medium text-sm line-clamp-1 leading-4 hover:text-gray-900 text-left"
              >{{ $t("nav.community") }} </span
            >
          </div>
        </a>
        <li
          v-for="category in categories.filter((v) => v.isParent)"
          :key="category.id"
          @click="toggleCategory(category)"
          class="w-full cursor-pointer items-center transition-all group"
        >
          <div
            class="flex items-center hover:bg-green-50 py-2 my-0 px-2 rounded-xl w-full"
          >
            <BoltIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
            <span
              class="ml-4 text-gray-700 font-medium text-sm line-clamp-1 leading-4 hover:text-gray-900 text-left"
              >{{ locale === 'en' ? category.title : category.translation }}</span
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import {
  HeartIcon,
  BoltIcon,
  FlagIcon,
  ChevronRightIcon,
  HomeIcon,
} from "@heroicons/vue/24/outline";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useBrandStore } from "@/stores/brand";
import { useCategoryStore } from "@/stores/category";
import { useSubCategoryStore } from "@/stores/subCategory";
import { useSubSubCategoryStore } from "@/stores/subSubCategory";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const emit = defineEmits(["onCategory", "onSubCategory"]);
const { locale } = useI18n();
const { site, siteKey } = storeToRefs(useSiteStore());
const { brands } = storeToRefs(useBrandStore());
const { categories } = storeToRefs(useCategoryStore());
const { getBrands } = useBrandStore();
const { getCategories } = useCategoryStore();
const { subCategories } = storeToRefs(useSubCategoryStore());
const { getSubCategories } = useSubCategoryStore();
const { subSubCategories } = storeToRefs(useSubSubCategoryStore());
const { getSubSubCategories } = useSubSubCategoryStore();
const { token } = storeToRefs(useMeStore());
const router = useRouter();
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
const categoryId = ref(null);
const subCategoryId = ref(null);
const subSubCategoryId = ref(null);
const toggleCategory = (category) => {
  if (category.isExternal) {
    window.open("https://" + category.external, "_blank");
  } else {
    categoryId.value = category.id;
    subCategoryId.value = null;
    emit("onCategory", category);
  }
};
const toggleSubCategory = (subCategory) => {
  subCategoryId.value = subCategory.id;
  emit("onSubCategory", subCategory);
};
const toggleSubSubCategory = (subSubCategory) => {
  subSubCategoryId.value = subSubCategory.id;
  emit("onSubSubCategory", subSubCategory);
};
const toRoute = (path) => {
  emit("onCategory", { title: "All", id: null, hid: null });
  router.push(`${path}`);
};
watch(siteKey, () => {
  emit("onCategory", { title: "All", id: null, hid: null });
  router.push(`${"/"}`);
});
const selectedCategoryId = ref(null);
const selectedSubCategoryId = ref(null);
const appToken = ref(window.btoa(token.value));
</script>
