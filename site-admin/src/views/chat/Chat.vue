<template>
  <div class="bg-muted-100 bg-muted-900 flex min-h-screen">
    <div
      class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-5/12 border bg-white transition-all duration-300 rounded-md p-4"
    >
      <div class="mb-8 flex items-center justify-between">
        <h3
          class="font-heading text-base font-semibold leading-tight text-muted-800 dark:text-white"
        >
          <span>My Team</span>
        </h3>
        <a
          aria-current="page"
          href="/dashboards/personal-2#"
          class="router-link-active router-link-exact-active bg-muted-100 hover:bg-muted-200 dark:bg-muted-700 dark:hover:bg-muted-900 text-primary-500 rounded-lg px-4 py-2 font-sans text-sm font-medium underline-offset-4 transition-colors duration-300 hover:underline"
        >
          View All
        </a>
      </div>
      <div class="mb-2 space-y-5">
        <div
          @click="selectThread(item.node)"
          v-for="item in threads.edges"
          :key="item.node.id"
          class="cursor-pointer flex items-center gap-3"
        >
          <div
            class="relative inline-flex items-center justify-center outline-none h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
          >
            <div
              class="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full"
            >
              <img
                onerror="this.src='https://tairo.cssninja.io/img/avatars/2.svg'"
                v-lazy="
                  item.node.receiver.id == me.id
                    ? item.node.sender.avatar
                    : item.node.receiver.avatar
                "
                class="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-10 w-10"
              />
            </div>
          </div>
          <div>
            <h4
              class="font-heading text-sm font-light leading-tight text-muted-800 dark:text-white"
            >
              <span>{{
                item.node.receiver.id == me.id
                  ? item.node.sender.name
                  : item.node.receiver.name
              }}</span>
            </h4>
            <p class="font-alt text-xs font-normal leading-normal">
              <span class="text-muted-400">{{ item.node.lastMessage }}</span>
            </p>
          </div>
          <div class="ms-auto flex items-center">
            <button
              type="button"
              class="disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-none false false text-muted-700 bg-white border border-muted-300 dark:text-white dark:bg-muted-700 dark:hover:bg-muted-600 dark:border-muted-600 hover:bg-muted-50 rounded-xl h-10 w-10 p-2 nui-focus relative inline-flex items-center justify-center space-x-1 font-sans text-sm font-normal leading-5 no-underline outline-none transition-all duration-300 scale-75"
              muted=""
            >
              <ChevronDownIcon class="w-5 h-5" /></button
            ><button
              type="button"
              class="disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-none false false text-muted-700 bg-white border border-muted-300 dark:text-white dark:bg-muted-700 dark:hover:bg-muted-600 dark:border-muted-600 hover:bg-muted-50 rounded-xl h-10 w-10 p-2 nui-focus relative inline-flex items-center justify-center space-x-1 font-sans text-sm font-normal leading-5 no-underline outline-none transition-all duration-300 scale-75"
              muted=""
            >
              <ChevronDownIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <chatBody v-if="thread" :thread="thread" :key="thread.id" />
  </div>
</template>
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { CHAT_THREADS, CHAT_THREAD_CREATE, CHAT_MESSAGES } from "@/gql/chat";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useChatStore } from "@/stores/chat";
import { useSearchStore } from "@/stores/search";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import chatBody from "@/components/chatBody.vue";
dayjs.extend(relativeTime);
const { setChatId } = useChatStore();
const { search } = storeToRefs(useSearchStore());
// chat parameter
const first = ref(15);
const after = ref(null);
const hasMore = ref(true);
// end parameter
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const selectedChat = ref([]);
const checked = ref(false);
const thread = ref(null);
const indeterminate = computed(
  () =>
    selectedChat.value.length > 0 && selectedChat.value.length < threads.length
);
// query
const { result, fetchMore, loading, error, refetch } = useQuery(CHAT_THREADS, {
  userId: me.value.id,
  first: first.value,
  after: after.value,
});
const threads = computed(() => result.value?.chatThreads ?? { edges: [] });
const loadMore = () => {
  fetchMore({
    variables: {
      first: first.value,
      after: threads.value.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.chatThreads.edges;
      const newEdges = fetchMoreResult.chatThreads.edges;
      const pageInfo = fetchMoreResult.chatThreads.pageInfo;
      return newEdges.length
        ? {
            chatThreads: {
              __typename: previousResult.chatThreads.__typename,
              edges: [...previousEdges, ...newEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
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
const selectThread = (item) => {
  thread.value = item;
};
</script>
