<template>
  <main class="px-4 pb-[60px] pt-0 flex flex-col w-full max-h-screen-header overflow-y-auto">
    <div class="mb-4 flex justify-between">
      <div class="text-left w-full lg:max-w-2xl lg:mx-0 lg:w-2/3">
        <div class="relative">
          <h1 class="text-2xl font-semibold text-gray-900 sm:text-3xl relative z-10 mt-6">
            The Best Landing Page Design Inspiration, Templates and More.
          </h1>
          <div
            class="absolute z-0 duration-1000 -inset-2 transitiona-all opacity-20 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200"
            style="background: linear-gradient(90deg, rgb(68, 255, 154) -0.55%, rgb(68, 176, 255) 22.86%, rgb(162 147 186) 48.36%, rgb(255, 102, 68) 73.33%, rgb(235, 255, 112) 99.34%);">
          </div>
        </div>
        <h2 class="mt-4 text-base font-normal leading-7 text-gray-600">
          Looking for landing page inspiration? We've got you covered. Bponi Site features the best landing page
          designs, templates, component and more on the web. Get inspired by real landing page examples curated by us
          to ensure the highest quality.
        </h2>
      </div>
      <div class="relative group md:w-1/3 hidden lg:flex">
        <div
          class="absolute transitiona-all duration-1000 opacity-20 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg filter group-hover:opacity-50 group-hover:-inset-1 group-hover:duration-200">
        </div>
        <div class="rounded-xl p-6 border bg-white border-gray-200 flex flex-col justify-between relative">
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">
              Say goodbye to building sites from scratch
            </h4>
            <p class="text-sm text-gray-700">
              With access to over 805 components you can build beautiful websites and save thousands of hours using
              the world's largest component library.
            </p>
          </div>
          <div class="mt-4"><router-link :to="`/component`" class=""><button aria-label="Primary Button" type="button"
                class="flex content-center items-center justify-center text-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-200 flex-shrink-0">
                Try out now
              </button></router-link></div>
        </div>
      </div>
    </div>
    <div class="w-full block min-w-full">
      <div
        class="w-full flex flex-col lg:flex-row justify-start mb-4 lg:mb-16 space-y-2 lg:space-y-0 lg:space-x-4 max-w-7xl">
        <div class="relative">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2" class="w-5 h-5 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                </path>
              </svg> </div> <input id="" type="search" name="" placeholder="Search here"
              class="block w-full py-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm">
          </div>
        </div>
        <div class="relative inline-block text-left lg:hidden">
          <div><button id="simple-menu-button" type="button" aria-expanded="true" aria-haspopup="true"
              class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"><label
                for="email" class="block text-sm font-semibold leading-5 text-gray-900 mr-1.5">Industry:</label> <span
                class="flex-shrink-0">All industries</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor" aria-hidden="true" class="-mr-1 ml-2 h-5 w-5">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg></button></div>
        </div>
      </div>
      <div class="flex space-x-2 items-center justify-start max-w-full overflow-x-auto mb-6">
        <button v-for="item in categories" :key="item.id" @click="industry = item.id"
          class="transform transition hover:bg-green-100 px-4 py-2 shadow-sm bg-white rounded-lg border border-gray-100 text-gray-700 whitespace-nowrap"
          :class="industry == item.id ? 'font-bold' : ''">
          <div class="flex justify-between space-x-2"><span class="text-sm">{{ item.title }}</span></div>
        </button>
      </div>
      <div class="h-full">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:gap-6 gap-12 w-full">
          <div @click="selectSite(item.node)" v-for="item in sites.edges" :key="item.node.id"
            class="relative group text-center cursor-pointer">
            <div class="relative">
              <div class="overflow-hidden rounded-xl border border-gray-200">
                <div class="block"><img v-lazy="item.node.desktopLogo"
                    class="object-cover w-full group-hover:scale-105 transition-transform v-lazy-image v-lazy-image-loaded h-[350px]"
                    alt=""></div>
              </div>
              <div class="absolute top-2 right-2">
                <div class="hidden group-hover:flex"><button aria-label="White button" type="button"
                    class="flex content-center items-center justify-center text-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 fav-button"><svg
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                      class="w-4 h-4 text-red-500 fav-2">
                      <path fill-rule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clip-rule="evenodd"></path>
                    </svg></button></div>
              </div>
              <div class="absolute inset-x-0 bottom-6">
                <div
                  class="bg-white rounded-full border border-gray-200 px-4 text-sm font-bold text-gray-900 py-1.5 inline-flex items-center justify-center">
                  <button class="text-xs mr-2 hover:underline hidden group-hover:flex">

                  </button>
                  <div class="flex">
                    <div
                      class="w-3 h-3 rounded-full -ml-1 group-hover:ml-0.5 border border-white transition hover:scale-150 transform cursor-pointer"
                      style="background: rgb(32, 106, 233); transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) 0s;">
                    </div>
                    <div
                      class="w-3 h-3 rounded-full -ml-1 group-hover:ml-0.5 border border-white transition hover:scale-150 transform cursor-pointer"
                      style="background: rgb(12, 20, 34); transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) 0s;">
                    </div>
                    <div
                      class="w-3 h-3 rounded-full -ml-1 group-hover:ml-0.5 border border-white transition hover:scale-150 transform cursor-pointer"
                      style="background: rgb(80, 189, 247); transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) 0s;">
                    </div>
                    <div
                      class="w-3 h-3 rounded-full -ml-1 group-hover:ml-0.5 border border-white transition hover:scale-150 transform cursor-pointer"
                      style="background: rgb(142, 155, 170); transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) 0s;">
                    </div>
                    <div
                      class="w-3 h-3 rounded-full -ml-1 group-hover:ml-0.5 border border-white transition hover:scale-150 transform cursor-pointer"
                      style="background: rgb(45, 51, 69); transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) 0s;">
                    </div>
                    <div
                      class="w-3 h-3 rounded-full -ml-1 group-hover:ml-0.5 border border-white transition hover:scale-150 transform cursor-pointer"
                      style="background: rgb(210, 155, 156); transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) 0s;">
                    </div>
                  </div>
                  <div class="ml-1.5 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                      fill="currentColor" class="w-3 h-3 mr-1 text-gray-500">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd"></path>
                    </svg> <span class="text-[10px] font-semibold text-gray-500">30194</span></div>
                  <a :href="`https://${item.node.domain}`" target="_blank"><svg xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20" fill="currentColor"
                      class="hidden group-hover:flex ml-1.5 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-900">
                      <path
                        d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z">
                      </path>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z">
                      </path>
                    </svg></a>
                </div>
              </div>
            </div>
            <div class="block" title="Perspective Funnels inspiration">
              <h3 class="mt-4 text-base font-bold text-gray-900">
                {{ item.node.title }}
              </h3>
              <p class="mt-1.5 text-xs font-medium text-gray-500">
                {{ dayjs(item.node.createdAt).format('MMM DD YYYY')}}
              </p>
            </div>
          </div>
        </div>

        <button v-if="sites.edges && sites.edges.length > 0 && hasMore" @click="loadMore()"
          class="w-[200px] mx-auto bg-red-400 text-white py-2 px-4 rounded-md flex items-center justify-center mt-5 mb-5">
          View more
        </button>
      </div>
    </div>
  </main>
</template>
<script setup>
import { useRouter } from "vue-router";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { SITES } from "@/gql/site";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useMeStore } from "@/stores/me";
import { useSearchStore } from "@/stores/search";
import { useThemeStore } from "@/stores/theme";
const router = useRouter();
const { me } = storeToRefs(useMeStore());
const { search } = storeToRefs(useSearchStore());
const { theme } = storeToRefs(useThemeStore());
// site parameter
const first = ref(15);
const after = ref(null);
const hasMore = ref(true);
const industry = ref(null);
// end parameter
// query
const { result, fetchMore } = useQuery(SITES, {
  siteType: "site",
  queryType: "latest",
  isVerified: true,
  industry: industry.value,
  first: first.value,
  after: after.value,
});
const sites = computed(() => result.value?.sites ?? { edges: [] });
const loadMore = () => {
  fetchMore({
    variables: {
      createdById: me.value.id,
      after: sites.value.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.sites.edges;
      const newEdges = fetchMoreResult.sites.edges;
      const pageInfo = fetchMoreResult.sites.pageInfo;
      return newEdges.length
        ? {
          sites: {
            __typename: previousResult.sites.__typename,
            edges: [...previousEdges, ...newEdges],
            pageInfo,
          },
        }
        : previousResult;
    },
  });
};
// end query
const selectSite = (item) => {
  theme.value = item;
  router.replace(`/theme/update/`);
};
const categories = ref([
  {
    title: "SaaS",
    id: 1,
    total: 0
  },
  {
    title: "Product",
    id: 2,
    total: 0
  },
  {
    title: "Business",
    id: 3,
    total: 0
  },
  {
    title: "Marketing",
    id: 4,
    total: 0
  },
  {
    title: "Design Tools",
    id: 5,
    total: 0
  },
  {
    title: "Software",
    id: 6,
    total: 0
  },
  {
    title: "Technology",
    id: 7,
    total: 0
  },
  {
    title: "Mobile App",
    id: 8,
    total: 0
  },
  {
    title: "Freelance",
    id: 9,
    total: 0
  },
  {
    title: "Artificial Intelligence",
    id: 10,
    total: 0
  },
  {
    title: "Users",
    id: 11,
    total: 0
  },
  {
    title: "Crypto",
    id: 12,
    total: 0
  }
])
</script>
