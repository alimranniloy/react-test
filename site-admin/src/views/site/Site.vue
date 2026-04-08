<template>
  <main class="px-4 pb-[60px] pt-0">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto relative">
        <h1 class="text-xl font-semibold text-gray-900 flex items-center">
          Site
          <BoltIcon @click="refetch()" class="cursor-pointer active:cursor-wait h-4 w-4 ml-2" aria-hidden="true" />
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the sites in your account including their name, title,
          email and role.
        </p>
        <div
          class="absolute z-0 duration-1000 -inset-2 transitiona-all opacity-20 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200"
          style="background:linear-gradient(90deg, rgb(68, 255, 154) -0.55%, rgb(68, 176, 255) 22.86%, rgb(162 147 186) 48.36%, rgb(255, 102, 68) 73.33%, rgb(235, 255, 112) 99.34%);">
        </div>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link :to="`/create/`"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto disabled:opacity-25">New
          Site</router-link>
      </div>
    </div>
    <div class="mx-auto mt-4 w-full">
      <div class="space-y-6 lg:col-span-3 lg:col-start-1">
        <!-- Tabs -->
        <div class="lg:block">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-4 overflow-x-auto">
              <div @click="toggleTab(tab.name)" v-for="tab in tabs" :key="tab.name" :class="[
                  selectedTab == tab.name
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer active:cursor-wait',
                ]">
                {{ tab.name }}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <div v-if="selectedSite.length > 0"
              class="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
              <!-- <button
                type="button"
                class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Bulk edit
              </button>
              <button
                type="button"
                class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Delete all
              </button> -->
            </div>
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="relative w-6 px-4 sm:w-6 sm:px-4">
                    SL
                  </th>
                  <th scope="col" class="relative w-5 px-5 sm:w-5 sm:px-5">
                    <input type="checkbox"
                      class="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      :checked="
                        indeterminate ||
                        selectedSite.length === sites.edges.length
                      " :indeterminate="indeterminate" @change="
                        selectedSite = $event.target.checked
                          ? sites.edges.map((p) => p.node.id)
                          : []
                      " />
                  </th>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Title
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Domain
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Update
                  </th>
                  <th scope="col" class="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="(item, index) in sites.edges" :key="item.node.id"
                  :class="[selectedSite.includes(item.node.id) && 'bg-gray-50']"
                  class="cursor-pointer active:cursor-wait">
                  <td 
                    class="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">
                    {{ index + 1 }}
                  </td>
                  <td @click="selectSite(item.node.id)" class="relative w-5 px-5 sm:w-5 sm:px-5">
                    <div v-if="selectedSite.includes(item.node.id)"
                      class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"></div>
                    <input type="checkbox"
                      class="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      :value="item.node.id" v-model="selectedSite" />
                  </td>
                  <td @click="selectSite(item.node.id)" class="whitespace-nowrap w-full py-2 pl-3 sm:pl-0 pr-3 text-sm">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img class="h-10 w-10 rounded-full" v-lazy="item.node.favicon" alt="" />
                      </div>
                      <div class="truncate max-w-[170px] ml-4">
                        <div class="font-medium text-gray-900">
                          {{ item.node.title }}
                        </div>
                        <div class="text-gray-500 text-xs">
                          {{ item.node.street }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td @click="selectSite(item.node.id)" class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <div class="text-gray-900">{{ item.node.hostname }}</div>
                    <div class="text-gray-500">
                      {{ item.node.domain }}
                    </div>
                  </td>
                  <td @click="selectSite(item.node.id)" class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <div class="text-gray-900">
                      {{ dayjs(item.node.updatedAt).fromNow() }}
                    </div>
                    <div class="text-gray-500 text-xs">
                      {{ dayjs(item.node.createdAt).format("h:mm A MMM D") }}
                    </div>
                  </td>
                  <td @click="selectSite(item.node.id)"
                    class="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right">
                    <button type="button"
                      class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none">
                      <CogIcon class="w-5 h-5 text-gray-700"></CogIcon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <nav class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-4"
              aria-label="Pagination">
              <div class="hidden sm:block">
                <p class="text-sm text-gray-700">
                  Showing
                  {{ " " }}
                  <span class="font-medium">1</span>
                  {{ " " }}
                  to
                  {{ " " }}
                  <span class="font-medium">{{
                    sites.edges ? sites.edges.length : 0
                    }}</span>
                </p>
              </div>
              <div class="flex flex-1 justify-between sm:justify-end">
                <div class="inline-flex rounded-md shadow-sm">
                  <button @click="loadMore()" type="button"
                    class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none">
                    Next
                  </button>
                  <Menu as="div" class="relative -ml-px block">
                    <MenuButton
                      class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none">
                      <span class="sr-only">Open options</span>{{ first }}
                      <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                    </MenuButton>
                    <transition enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                      <MenuItems
                        class="absolute left-0 sm:left-auto sm:right-0 bottom-12 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div class="py-1">
                          <MenuItem @click="first = item.value" v-for="item in moreItems" :key="item.name"
                            v-slot="{ active }">
                          <div :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm',
                              ]">
                            {{ item.name }}
                          </div>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon, BoltIcon, CogIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { SITES } from "@/gql/site";
import { useQuery } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import { useNotificationsStore } from "@/stores/notifications";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useSearchStore } from "@/stores/search";
const { addNotification } = useNotificationsStore();
const router = useRouter();
const { me } = storeToRefs(useMeStore());
const { site } = storeToRefs(useSiteStore());
const { setLoading, setSiteId } = useSiteStore();
const { search } = storeToRefs(useSearchStore());
// site parameter
const from = ref("");
const to = ref("");
const first = ref(15);
const after = ref(null);
const hasMore = ref(true);
// end parameter
const selectedSite = ref([]);
const checked = ref(false);
const indeterminate = computed(
  () =>
    selectedSite.value.length > 0 && selectedSite.value.length < sites.length
);
// query
const { result, fetchMore, loading, error, refetch } = useQuery(SITES, {
  createdById: me.value.isStaff ? null : me.value.id,
  siteType: "site",
  queryType: "latest",
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
const selectSite = (id) => {
  setSiteId(id);
  router.replace(`/site/update/`);
};

const selectedTab = ref("All");
const tabs = [
  { id: null, name: "All" },
  { id: 0, name: "Active" },
  { id: 1, name: "Inactive" },
];
const toggleTab = (name) => {
  selectedTab.value = name;
};
watch(selectedTab, () => {
  refetch({
    isActive:
      selectedTab.value == "All"
        ? null
        : selectedTab.value === "Active"
        ? true
        : false,
  });
});
watch(search, () => {
  if (search.value) {
    refetch({ search: search.value ? search.value : null });
  } else {
    refetch({ search: null });
  }
});
const moreItems = [
  { name: "15", value: 15 },
  { name: "30", value: 30 },
  { name: "100", value: 100 },
  { name: "200", value: 200 },
];
</script>
