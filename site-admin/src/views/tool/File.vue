<template>
  <main
   
    class="px-4 pb-[60px] pt-0 md:pt-0 sm:pb-4"
  >
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto relative">
        <h1 class="text-xl font-semibold text-gray-900 flex items-center">
          File
          <BoltIcon
            @click="refetch()"
            class="cursor-pointer active:cursor-wait h-4 w-4 ml-2"
            aria-hidden="true"
          />
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the files in your account including their name, title,
          email and role.
        </p>
        <div
          class="absolute z-0 duration-1000 -inset-2 transitiona-all opacity-20 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200"
          style="background:linear-gradient(90deg, rgb(68, 255, 154) -0.55%, rgb(68, 176, 255) 22.86%, rgb(162 147 186) 48.36%, rgb(255, 102, 68) 73.33%, rgb(235, 255, 112) 99.34%);">
        </div>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link
          :to="`/tool/file/create/`"
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto disabled:opacity-25"
          >Add New</router-link
        >
        <router-link
          :to="`/tool/file/bulk/`"
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 ml-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto disabled:opacity-25"
          >Add Bulk</router-link
        >
      </div>
    </div>
    <div class="mx-auto mt-4 w-full">
      <div class="space-y-6 lg:col-span-3 lg:col-start-1">
        <!-- Tabs -->
        <div class="lg:block">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-4 overflow-x-auto">
              <div
                @click="toggleTab(tab.name)"
                v-for="tab in tabs"
                :key="tab.name"
                :class="[
                  selectedTab == tab.name
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer active:cursor-wait',
                ]"
              >
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
          <div
            class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
          >
            <div
              v-if="selectedFile.length > 0"
              class="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16"
            >
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
                    <input
                      type="checkbox"
                      class="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      :checked="
                        indeterminate ||
                        selectedFile.length === files.edges.length
                      "
                      :indeterminate="indeterminate"
                      @change="
                        selectedFile = $event.target.checked
                          ? files.edges.map((p) => p.node.id)
                          : []
                      "
                    />
                  </th>
                  <th
                    scope="col"
                    class="min-w-[6rem] w-full py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20"
                  >
                    Update
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6 w-20"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="file in files.edges"
                  :key="file.node.id"
                  :class="[selectedFile.includes(file.node.id) && 'bg-gray-50']"
                  class="cursor-pointer active:cursor-wait"
                >
                  <td class="relative w-5 px-5 sm:w-5 sm:px-5">
                    <div
                      v-if="selectedFile.includes(file.node.id)"
                      class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                    ></div>
                    <input
                      type="checkbox"
                      class="absolute left-3 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      :value="file.node.id"
                      v-model="selectedFile"
                    />
                  </td>
                  <td
                    @click="selectFile(file.node.id)"
                    class="whitespace-nowrap py-2 pl-3 sm:pl-0 pr-3 text-sm"
                  >
                    <div class="flex items-center">
                      <div class="">
                        <div class="font-medium text-gray-900">
                          {{ file.node.title }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    @click="selectFile(file.node.id)"
                    class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                  >
                    <span
                      class="bg-green-100 text-green-800 inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                      >{{ formatBytes(file.node.size) }}</span
                    >
                  </td>
                  <td
                    @click="selectFile(file.node.id)"
                    class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                  >
                    <div class="text-gray-900">
                      {{ dayjs(file.node.updatedAt).fromNow() }}
                    </div>
                    <div class="text-gray-500 text-xs">
                      {{ dayjs(file.node.updatedAt).format("h:mm A  MMM D") }}
                    </div>
                  </td>
                  <td
                    class="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right sm:pr-4"
                  >
                    <button
                      @click="copyUrl(file.node.url)"
                      type="button"
                      class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                    >
                      URL&nbsp;<LinkIcon class="w-4 h-4"/>
                    </button>
                    <button v-if="file.node.url.includes('.mp4')"
                      @click="copySecureUrl(file.node.url)"
                      type="button"
                      class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                    >
                      Secure&nbsp;<LinkIcon class="w-4 h-4"/>
                    </button>
                    <button
                      @click="selectFile(file.node.id)"
                      type="button"
                      class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                    >
                      <CogIcon
                        class="w-5 h-5 text-gray-700"
                      ></CogIcon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <nav
              v-if="files.edges.length == 0"
              class="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6"
              aria-label="Pagination"
            >
              <div class="hidden sm:block">
                <p class="text-sm text-gray-700">No record :-(</p>
              </div>
              <div class="flex flex-1 justify-between sm:justify-end">
                <div class="inline-flex rounded-md shadow-sm"></div>
              </div>
            </nav>
            <nav
              v-else-if="files.edges.length != 0 && !hasMore"
              class="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6"
              aria-label="Pagination"
            >
              <div class="hidden sm:block">
                <p class="text-sm text-gray-700">No more record :-(</p>
              </div>
              <div class="flex flex-1 justify-between sm:justify-end">
                <div class="inline-flex rounded-md shadow-sm"></div>
              </div>
            </nav>
            <nav v-else-if="files.edges.length >= first || hasMore"
              class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-4"
              aria-label="Pagination"
            >
              <div class="hidden sm:block">
                <p class="text-sm text-gray-700">
                  Showing
                  {{ " " }}
                  <span class="font-medium">1</span>
                  {{ " " }}
                  to
                  {{ " " }}
                  <span class="font-medium">{{
                    files.edges ? files.edges.length : 0
                  }}</span>
                </p>
              </div>
              <div class="flex flex-1 justify-between sm:justify-end">
                <div class="inline-flex rounded-md shadow-sm">
                  <button
                    @click="loadMore()"
                    type="button"
                    class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
                  >
                    Next
                  </button>
                  <Menu as="div" class="relative -ml-px block">
                    <MenuButton
                      class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none"
                    >
                      <span class="sr-only">Open options</span>{{ first }}
                      <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                    </MenuButton>
                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        class="absolute left-0 sm:left-auto sm:right-0 bottom-12 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div class="py-1">
                          <MenuItem
                            @click="first = item.value"
                            v-for="item in moreItems"
                            :key="item.name"
                            v-slot="{ active }"
                          >
                            <div
                              :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm',
                              ]"
                            >
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
import { copyText } from "vue3-clipboard";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon, BoltIcon, LinkIcon } from "@heroicons/vue/24/outline";
import { ClipboardIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { FILE_FILES } from "@/gql/file";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useNotificationsStore } from "@/stores/notifications";
import { useFileStore } from "@/stores/file";
import { useMeStore } from "@/stores/me";
import { useSearchStore } from "@/stores/search";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
const { addNotification } = useNotificationsStore();
dayjs.extend(relativeTime);
const { setFileId } = useFileStore();
const { search } = storeToRefs(useSearchStore());
// file parameter
const first = ref(15);
const after = ref(null);
const hasMore = ref(true);
// end parameter
const router = useRouter();
const { me } = storeToRefs(useMeStore());
const { site } = storeToRefs(useSiteStore());
const selectedFile = ref([]);
const checked = ref(false);
const indeterminate = computed(
  () =>
    selectedFile.value.length > 0 && selectedFile.value.length < files.length
);
// query
const { result, fetchMore, loading, error, refetch } = useQuery(FILE_FILES, {
  userId: me.value.id,
  first: first.value,
  after: after.value,
});
const files = computed(() => result.value?.fileFiles ?? { edges: [] });
const loadMore = () => {
  fetchMore({
    variables: {
      first: first.value,
      after: files.value.fileInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.fileFiles.edges;
      const newEdges = fetchMoreResult.fileFiles.edges;
      const fileInfo = fetchMoreResult.fileFiles.fileInfo;
      return newEdges.length
        ? {
            fileFiles: {
              __typename: previousResult.fileFiles.__typename,
              total: previousResult.fileFiles.total,
              edges: [...previousEdges, ...newEdges],
              fileInfo,
            },
          }
        : previousResult;
    },
  });
};
// end query
const selectFile = (fileId) => {
  setFileId(fileId);
  router.push(`/tool/file/update/`);
};
const copyUrl = (url) => {
  copyText(url);
    addNotification(
      {
        title: "File info",
        subTitle: "Successfully copied url.",
      },
      "success"
    );
};
const copySecureUrl = (url) => {
  let filePath = url.replace("video", "drm").replace(".mp4", ".m3u8");
    copyText(filePath);
    addNotification(
      {
        title: "File info",
        subTitle: "Successfully copied url.",
      },
      "success"
    );
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
const formatBytes = (bytes) => {
  if (bytes < 1024) {
    return bytes.toFixed(2) + " B";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
};
</script>
