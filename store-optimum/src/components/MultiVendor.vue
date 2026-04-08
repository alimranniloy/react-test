<template>
  <main
    class="container bg-white mx-auto px-4 sm:px-0 pb-[60px] pt-[70px] sm:pt-0"
  >
    <!-- hero start -->
    <div class="md:hidden">
      <a href="search.html">
        <div class="flex justify-between bg-gray-100 px-4 py-3 rounded-xl">
          <p class="font-normal">Search here</p>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>
        </div>
      </a>
    </div>
    <div class="mt-4 md:hidden">
      <div class="rounded-xl overflow-hidden">
        <img
          src="https://avatars.mds.yandex.net/get-feeds-media/3752156/cde73d13e832dc107518e1b6d6f835d1a2f6cbaa/media-984-312"
          alt=""
        />
      </div>
    </div>
    <div class="mt-4">
      <ShopList />
    </div>
    <div class="mt-4">
      <ResturantList />
    </div>
  </main>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import { STORE_SHOPS } from "@/gql/shop";
import { useQuery } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import ShopList from "@/components/ShopList.vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const ResturantList = defineAsyncComponent(() =>
  import("@/components/ResturantList.vue")
);
const { site } = storeToRefs(useSiteStore());

const first = ref([1].includes(site.value.industry) ? 10 : 12);
const after = ref(null);
// query
const { result, fetchMore, loading, error, refetch } = useQuery(STORE_SHOPS, {
  siteId: site.value.id,
  first: first.value,
  after: after.value,
});
// end query
</script>
