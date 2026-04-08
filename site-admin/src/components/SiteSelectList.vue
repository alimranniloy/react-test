<template>
  <TransitionRoot as="template" :show="true">
    <Dialog as="div" class="relative z-[9999]" @close="toggleClose()">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
              <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-offset-2"
                  @click="toggleClose()">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto relative">
                  <h1 class="text-xl font-semibold text-gray-900 flex items-center">
                    Site
                    <BoltIcon @click="refetch()" class="cursor-pointer active:cursor-wait h-4 w-4 ml-2"
                      aria-hidden="true" />
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

                      <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                          <tr>
                            <th scope="col" class="relative w-6 px-4 sm:w-6 sm:px-4">
                              SL
                            </th>
                            <th scope="col"
                              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Title
                            </th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Domain
                            </th>
                            <th scope="col" class="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                          <tr v-for="(item, index) in sites.edges" :key="item.node.id"
                            class="cursor-pointer active:cursor-wait">
                            <td class="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">
                              {{ index + 1 }}
                            </td>
                            <td @click="selectSite(item.node.id)" class="whitespace-nowrap w-full py-2 px-4 text-sm">
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
                            <td @click="selectSite(item.node.id)"
                              class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              <div class="text-gray-900">{{ item.node.hostname }}</div>
                              <div class="text-gray-500">
                                {{ item.node.domain }}
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
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
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
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot, Menu, MenuButton, MenuItem, MenuItems
} from "@headlessui/vue";
import { SITES } from "@/gql/site";
import { useQuery } from "@vue/apollo-composable";
import { ChevronDownIcon, BoltIcon, CogIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import { useSearchStore } from "@/stores/search";
import { ref, inject, computed, defineAsyncComponent, watch } from "vue";
const { me } = storeToRefs(useMeStore());
const { search } = storeToRefs(useSearchStore());
const emit = defineEmits(["onClose", "onSelect"]);
// site parameter
const from = ref("");
const to = ref("");
const first = ref(15);
const after = ref(null);
const hasMore = ref(true);
// end parameter
const toggleClose = () => {
  emit("onClose", true);
}
// query
const { result, fetchMore, loading, error, refetch } = useQuery(SITES, {
  createdById: me.value.id,
  siteType: 'store',
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
  emit("onSelect", id);
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
