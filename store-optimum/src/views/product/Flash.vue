<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5">
      <div class="flex gap-5 w-full relative">
          <LongSideBar @onCategory="toggleCategory" @onSubCategory="toggleSubCategory" @onSubSubCategory="toggleSubSubCategory"></LongSideBar>
        <div
          class="w-full md:overflow-hidden md:mt-4 bg-white p-4 sm:rounded-xl min-h-[calc(100vh-94px)]"
        >
        <!-- top info -->
        <div class="px-4 md:px-0">
          <nav class="flex pb-5" aria-label="Breadcrumb">
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
          <h2 class="text-2xl font-bold">Flash</h2>
          <div
            class="grid grid-flow-col gap-5 text-center auto-cols-max items-center justify-center"
          >
            <div class="flex flex-col">
              <span class="countdown font-mono text-5xl">
               <span :style="'--value:' + dayjs(timeDiff).day()"></span>
              </span>
              days
            </div>
            <div class="flex flex-col">
              <span class="countdown font-mono text-5xl">
                <span :style="'--value:' + dayjs(timeDiff).hour()"></span>
              </span>
              hours
            </div>
            <div class="flex flex-col">
              <span class="countdown font-mono text-5xl">
                <span :style="'--value:' + dayjs(timeDiff).minute()"></span>
              </span>
              min
            </div>
            <div class="flex flex-col">
              <span class="countdown font-mono text-5xl">
                <span :style="'--value:' + dayjs(timeDiff).second()"></span>
              </span>
              sec
            </div>
          </div>
        </div>
        <!-- Products start -->
        <ProductList   :isFlash="true" />
        <!-- Products end -->
      </div>
    </div>
    </div>
    
  </main>
</template>

<script>
export default {
  name: "ProductFlash",
};
</script>
<script setup>
import { useRouter } from "vue-router";
import { computed, ref, onMounted, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

const LongSideBar = defineAsyncComponent(() =>
  import("@/components/LongSideBar.vue")
);
const ProductList = defineAsyncComponent(() =>
  import("@/components/ProductList.vue")
);
const pages = [{ name: "Feature", href: "#", current: false }];
dayjs.extend(duration);
const showFilter = ref(false);
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
// countdwon
const now = ref(new Date());
const lastEvent = ref(new Date(site.value.lastEvent));
const timeDiff = computed(() => {
  if (lastEvent.value > now.value) {
    return dayjs
      .duration(dayjs(lastEvent.value).diff(now.value))
      .format("YYYY-MM-DD HH:mm:ss");
  } else {
    let today = dayjs().endOf("day");
    return dayjs
      .duration(dayjs(today).diff(dayjs(now.value)))
      .format("YYYY-MM-DD HH:mm:ss");
  }
});
const getNow = () => {
  now.value = dayjs().toISOString();
};
onMounted(() => {
  setInterval(getNow, 1000);
});
// countdwon
const toggleCategory = (data) => {
  if (data.id == null) {
  } else {
    router.push(`/category/${data.title}/${data.hid}`);
    toggleSubCategory({ id: null });
  }
};
const toggleSubCategory = (subCategory) => {
  router.push(`/sub-category/${subCategory.title}/${subCategory.hid}/`);
};
const toggleSubSubCategory = (subSubCategory) => {
  router.push(
    `/sub-sub-category/${subSubCategory.title}/${subSubCategory.hid}/`
  );
};

// const myClass = computed(() => {
//   if ([1].includes(site.value.industry)) {
//     return "grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-y-4 gap-x-2 md:gap-x-4 md:gap-y-6";
//   }
//   return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-4 gap-x-2 md:gap-2-2";
// });
</script>