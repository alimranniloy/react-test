<template>
  <div class="relative w-full transition-all duration-300">
    <div class="flex w-full flex-col">
      <div class="flex h-16 w-full items-center justify-between px-4 sm:px-8">
        <div class="flex items-center gap-2">
          <div class="relative">
            <div class="group/nui-input relative">
              <input
                id="ninja-input-47"
                type="text"
                class="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 border-muted-700 bg-muted-900/75 text-muted-200 placeholder:text-muted-500 focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded-xl"
                placeholder="Search"
                value=""
              />
              <div
                class="h-10 w-10 text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75"
              >
                <ChevronDownIcon class="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex items-center relative -end-4 z-20 h-16 w-full scale-90 justify-end gap-2 sm:end-0 sm:scale-100"
        >
          <div class="group inline-flex items-center justify-center text-right">
            <div data-headlessui-state="" class="relative h-9 w-9 text-left">
              <div
                id="headlessui-menu-button-130"
                aria-haspopup="menu"
                aria-expanded="false"
                data-headlessui-state=""
              >
                <button
                  type="button"
                  class="group-hover:ring-muted-200 group-hover:ring-muted-700 ring-offset-muted-900 inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4"
                >
                  <span
                    class="border-muted-200 border-muted-700 bg-muted-800 flex h-9 w-9 items-center justify-center rounded-full border bg-white"
                    ><ChevronDownIcon class="w-5 h-5"
                  /></span>
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="border-muted-200 hover:ring-muted-200 hover:ring-muted-700 border-muted-700 bg-muted-800 ring-offset-muted-900 flex h-9 w-9 items-center justify-center rounded-full border bg-white ring-1 ring-transparent transition-all duration-300 hover:ring-offset-4"
          >
            <ChevronDownIcon class="w-5 h-5" />
          </button>
          <div class="group inline-flex items-center justify-center text-right">
            <div data-headlessui-state="" class="relative h-9 w-9 text-left">
              <button
                class="group-hover:ring-primary-500 ring-offset-muted-900 inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4"
                id="headlessui-menu-button-132"
                aria-haspopup="menu"
                aria-expanded="false"
                type="button"
              >
                <div
                  class="relative inline-flex h-9 w-9 items-center justify-center rounded-full"
                >
                  <img
                    v-lazy="me.avatar"
                    class="max-w-full rounded-full object-cover shadow-sm border-transparent"
                    :alt="me.name"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="relative h-[calc(100vh_-_228px)] w-full p-4 sm:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300 slimscroll"
      >
        <div
          class="bg-muted-100 bg-muted-900 absolute inset-0 z-10 h-full w-full p-8 transition-opacity duration-300 opacity-0 pointer-events-none"
        >
          <div class="mt-12 space-y-12">
            <div class="flex w-full max-w-md gap-4">
              <div
                class="nui-placeload animate-nui-placeload h-8 w-8 shrink-0 rounded-full"
                width="32"
                height="32"
              ></div>
              <div class="grow space-y-2">
                <div
                  class="nui-placeload animate-nui-placeload h-3 w-full max-w-[14rem] rounded"
                ></div>
                <div
                  class="nui-placeload animate-nui-placeload h-3 w-full max-w-[8rem] rounded"
                ></div>
              </div>
            </div>
            <div class="flex w-full max-w-md gap-4">
              <div
                class="nui-placeload animate-nui-placeload h-8 w-8 shrink-0 rounded-full"
                width="32"
                height="32"
              ></div>
              <div class="grow space-y-2">
                <div
                  class="nui-placeload animate-nui-placeload h-3 w-full max-w-[16rem] rounded"
                ></div>
                <div
                  class="nui-placeload animate-nui-placeload h-3 w-full max-w-[12rem] rounded"
                ></div>
              </div>
            </div>
            <div
              class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4"
            >
              <div
                class="nui-placeload animate-nui-placeload h-8 w-8 shrink-0 rounded-full"
                width="32"
                height="32"
              ></div>
              <div class="grow space-y-2">
                <div
                  class="nui-placeload animate-nui-placeload ms-auto h-3 w-full max-w-[16rem] rounded"
                ></div>
                <div
                  class="nui-placeload animate-nui-placeload ms-auto h-3 w-full max-w-[12rem] rounded"
                ></div>
              </div>
            </div>
            <div
              class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4"
            >
              <div
                class="nui-placeload animate-nui-placeload h-8 w-8 shrink-0 rounded-full"
                width="32"
                height="32"
              ></div>
              <div class="grow space-y-2">
                <div
                  class="nui-placeload animate-nui-placeload ms-auto h-3 w-full max-w-[14rem] rounded"
                ></div>
                <div
                  class="nui-placeload animate-nui-placeload ms-auto h-3 w-full max-w-[8rem] rounded"
                ></div>
              </div>
            </div>
            <div class="flex w-full max-w-md gap-4">
              <div
                class="nui-placeload animate-nui-placeload h-8 w-8 shrink-0 rounded-full"
                width="32"
                height="32"
              ></div>
              <div class="grow space-y-2">
                <div
                  class="nui-placeload animate-nui-placeload h-3 w-full max-w-[14rem] rounded"
                ></div>
                <div
                  class="nui-placeload animate-nui-placeload h-3 w-full max-w-[8rem] rounded"
                ></div>
              </div>
            </div>
            <div class="flex w-full max-w-md gap-4">
              <div
                class="nui-placeload animate-nui-placeload h-8 w-8 shrink-0 rounded-full"
                width="32"
                height="32"
              ></div>
              <div class="grow space-y-2">
                <div
                  class="nui-placeload animate-nui-placeload h-3 w-full max-w-[16rem] rounded"
                ></div>
                <div
                  class="nui-placeload animate-nui-placeload h-3 w-full max-w-[12rem] rounded"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-6">
          <div
            v-for="message in reversedMessages"
            :key="message.node.id"
            class="relative flex w-full gap-4"
            :class="
              message.node.user.id == me.id ? 'flex-row-reverse' : 'flex-row'
            "
          >
            <div class="shrink-0">
              <div
                class="relative inline-flex shrink-0 items-center justify-center outline-none h-8 w-8 rounded-full"
              >
                <div
                  class="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full"
                >
                  <img
                    v-lazy="
                      message.node.user.id == me.id
                        ? me.avatar
                        : thread.receiver.id == me.id
                        ? thread.sender.avatar
                        : thread.receiver.avatar
                    "
                    class="max-h-full max-w-full object-cover shadow-sm border-transparent h-8 w-8"
                  />
                </div>
              </div>
            </div>
            <div class="flex max-w-md flex-col">
              <div
                class="bg-blue-200 rounded-xl p-3"
                :class="
                  message.node.user.id == me.id
                    ? 'rounded-se-none'
                    : 'rounded-ss-none '
                "
              >
                <p class="font-sans text-sm">{{ message.node.message }}</p>
              </div>
              <div
                class="text-muted-400 mt-1 font-sans text-xs"
                :class="message.node.user.id == me.id ? '' : 'text-right'"
              >
                {{ dayjs(message.node.createdAt).format("h:mm A") }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-muted-100 bg-muted-900 h-16 w-full px-4 sm:px-8">
        <div v-if="isTyping" class="relative flex">
          <span class="relative flex h-3 w-3 mr-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"
            ></span> </span
          ><span class="relative flex h-3 w-3 mr-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"
            ></span> </span
          ><span class="relative flex h-3 w-3 mr-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"
            ></span>
          </span>
        </div>
        <div class="relative w-full flex items-center">
          <div class="relative">
            <div class="group/nui-input relative">
              <input
                @change="onType"
                v-model.lazy.trim="message"
                id="ninja-input-48"
                type="text"
                class="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 border-muted-700 bg-muted-900/75 text-muted-200 placeholder:text-muted-500 focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 py-2 text-sm leading-5 px-3 rounded-full h-12 ps-6 pe-24"
                placeholder="Write a message..."
              />
            </div>
          </div>
          <div class="absolute end-2 top-0 flex h-12 items-center gap-1">
            <button
              type="button"
              class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
            >
              <PaperClipIcon class="w-5 h-5" /></button
            ><button
              @click="create"
              type="button"
              class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="hidden ltablet:w-[310px] bg-muted-800 end-0 top-0 z-20 h-full w-[390px] bg-white transition-transform duration-300 translate-x-0"
  >
    <div class="flex h-16 w-full items-center justify-between px-8">
      <p
        class="font-heading text-lg font-semibold leading-normal text-muted-800 text-white"
        tag="h3"
      >
        <!--[--><span>User details</span
        ><!--]-->
      </p>
      <button
        type="button"
        class="disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-none false false text-muted-700 bg-white border border-muted-300 text-white bg-muted-700 hover:bg-muted-600 border-muted-600 hover:bg-muted-50 rounded-md h-10 w-10 p-2 nui-focus relative inline-flex items-center justify-center space-x-1 font-sans text-sm font-normal leading-5 no-underline outline-none transition-all duration-300"
        small=""
      >
        <ChevronDownIcon class="w-5 h-5" />
      </button>
    </div>
    <div class="relative flex w-full flex-col px-8">
      <div class="mt-8">
        <div class="flex items-center justify-center">
          <div
            class="relative inline-flex shrink-0 items-center justify-center outline-none h-24 w-24 rounded-full"
          >
            <div
              class="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full"
            >
              <img
                src="https://tairo.cssninja.io/img/avatars/5.svg"
                class="max-h-full max-w-full object-cover shadow-sm border-transparent h-24 w-24"
              />
            </div>
          </div>
        </div>
        <div class="text-center">
          <p
            class="font-heading text-lg font-semibold leading-normal mt-4"
            tag="h3"
          >
            <span>Clarissa Miller</span>
          </p>
          <p class="font-alt text-sm font-normal leading-normal text-muted-400">
            <span>Product Manager</span>
          </p>
          <div class="my-4">
            <p
              class="font-alt text-sm font-normal leading-normal text-muted-500 text-muted-400"
            >
              <span
                >Clarissa is a Product Manager based in Seattle. She has 10+
                years of experience in the field.</span
              >
            </p>
          </div>
          <div
            class="divide-muted-200 divide-muted-700 flex items-center justify-center divide-x"
          >
            <div class="flex items-center justify-center gap-2 px-4">
              <ChevronDownIcon class="w-5 h-5" /><span
                class="text-muted-400 font-sans text-xs"
              >
                Age: 31</span
              >
            </div>
            <div class="flex items-center justify-center gap-2 px-4">
              <ChevronDownIcon class="w-5 h-5" /><span
                class="text-muted-400 font-sans text-xs"
                >Seattle</span
              >
            </div>
          </div>
          <div class="mt-6">
            <button
              type="button"
              class="is-button rounded-xl is-button-default w-full"
            >
              <span> View Clarissa Miller's profile </span></button
            ><button
              type="button"
              class="text-primary-500 mt-3 font-sans text-sm underline-offset-4 hover:underline"
            >
              Send a friend request
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/vue/24/outline";
import {
  CHAT_MESSAGES,
  CHAT_MESSAGE_CREATE,
  CHAT_MESSAGE_SUBSCRIPTION,
  CHAT_TYPING_SUBSCRIPTION,
  CHAT_TYPING,
} from "@/gql/chat";
import { useQuery, useMutation, useSubscription } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useChatStore } from "@/stores/chat";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cloneDeep } from "lodash";
dayjs.extend(relativeTime);
const { setChatId } = useChatStore();
// chat parameter
const first = ref(15);
const after = ref(null);
const hasMore = ref(true);
// end parameter
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const props = defineProps({
  thread: {
    type: Object,
    required: true,
  },
});
const isTyping = ref(false);
const image = ref(null);
const message = ref("");
// query
const { result, fetchMore, loading, error, refetch, subscribeToMore } =
  useQuery(CHAT_MESSAGES, {
    threadId: props.thread.id,
    first: first.value,
    after: after.value,
  });
const messages = computed(() =>
  cloneDeep(result.value?.chatMessages ?? { edges: [] })
);
const loadMore = () => {
  fetchMore({
    variables: {
      first: first.value,
      after: messages.value.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const previousEdges = previousResult.chatMessages.edges;
      const newEdges = fetchMoreResult.chatMessages.edges;
      const pageInfo = fetchMoreResult.chatMessages.pageInfo;
      return newEdges.length
        ? {
            chatMessages: {
              __typename: previousResult.chatMessages.__typename,
              total: previousResult.chatMessages.total,
              edges: [...newEdges, ...previousEdges],
              pageInfo,
            },
          }
        : previousResult;
    },
  });
};
subscribeToMore(() => ({
  document: CHAT_MESSAGE_SUBSCRIPTION,
  variables: {
    channel:window.btoa(1),
  },
  updateQuery: (previousResult, { subscriptionData }) => {
    const previousEdges = previousResult.chatMessages.edges;
    const newEdges = [{ node: subscriptionData.data.chatMessage }];
    const pageInfo = previousResult.chatMessages.pageInfo;
    return newEdges.length
      ? {
          chatMessages: {
            __typename: previousResult.chatMessages.__typename,
            edges: [...previousEdges, ...newEdges],
            pageInfo,
          },
        }
      : previousResult;
  },
}));
// end query
const create = async () => {
  const { mutate, loading, error } = useMutation(CHAT_MESSAGE_CREATE, {
    variables: {
      userId: me.value.id,
      channel:window.btoa(1),
      image: image.value,
      message: message.value,
      threadId: props.thread.id,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfChatMessageCreate) {
      message.value = "";
    }
  } catch (error) {
    addNotification({ title: "Brand info", subTitle: error.message }, "error");
  }
};
const reversedMessages = computed(() =>
  messages.value
    ? messages.value.edges.sort((a, b) => a.node.createdAt > b.node.createdAt)
    : []
);

// query
const { onResult } = useSubscription(CHAT_TYPING_SUBSCRIPTION, {
  channel:window.btoa("1_typing"),
});
onResult((queryResult) => {
  let data = queryResult.data.chatTyping;
  if (data.userId != me.value.id) {
    isTyping.value = true;
  }
  setTimeout(() => {
    isTyping.value = false;
  }, 3000);
});
// end query
const onType = async () => {
  const { mutate, loading, error } = useMutation(CHAT_TYPING, {
    variables: {
      channel:window.btoa("1_typing"),
      userId: me.value.id,
    },
  });
  try {
    const response = await mutate();
    let userId = response.data.chatTypingCreate;
  } catch (error) {}
};
</script>
