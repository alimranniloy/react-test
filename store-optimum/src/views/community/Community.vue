<template>
  <NavBar v-if="isMobile" />
  <main class="py-14 flex w-full justify-center gap-0 lg:gap-4 bg-white dark:bg-gray-950">
    <SideBar />
    <main class="hover-animation flex min-h-screen w-full max-w-xl flex-col pb-96">

      <Create @uploaded="uploadedFeed" />
      <div class="flex items-center mx-4 md:mx-0 pt-4 bg-white dark:bg-gray-800 overflow-x-auto">
        <button @click="queryType = 'latest'" :class="queryType == 'latest'
          ? 'bg-gray-950 text-white dark:border'
          : 'bg-white dark:border-gray-50'
          " class="px-4 py-1 text-md rounded-full shadow transition-all mr-4">
          Recent
        </button>
        <button @click="queryType = 'foryou'" :class="queryType == 'foryou'
          ? 'bg-gray-950 text-white dark:border '
          : 'bg-white dark:border-gray-50'
          " class="px-4 py-1 text-md rounded-full shadow transition-all mr-4 whitespace-nowrap ">
          For You
        </button>
        <button @click="queryType = 'engaged'" :class="queryType == 'engaged'
          ? 'bg-gray-950 text-white dark:border'
          : 'bg-white dark:border-gray-50'
          " class="px-4 py-1 text-md rounded-full shadow transition-all mr-4">
          Trending
        </button>
        <button @click="queryType = 'like'" :class="queryType == 'like'
          ? 'bg-gray-950 text-white dark:border'
          : 'bg-white dark:border-gray-50'
          " class="px-4 py-1 text-md rounded-full shadow transition-all mr-4">
          Top
        </button>
      </div>
      <FeedList :queryType="queryType" :key="key + queryType" v-if="community" />
    </main>
  </main>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCommunityStore } from "@/stores/community";
const FeedList = defineAsyncComponent(() =>
  import("@/components/community/FeedList.vue")
);
const Create = defineAsyncComponent(() => import("@/components/community/Create.vue"));
const NavBar = defineAsyncComponent(() => import("@/components/NavBar.vue"));
const SideBar = defineAsyncComponent(() => import("@/components/SideBar.vue"));
const { site, isMobile } = storeToRefs(useSiteStore());
const { community } = storeToRefs(useCommunityStore());
const { getCommunityByUser } = useCommunityStore();
if (!community.value) {
  getCommunityByUser(site.value.createdById, site.value.hostname);
}
const key = ref(1);
const uploadedFeed = () => {
  key.value += 1;
};

const queryType = ref("latest");
</script>
