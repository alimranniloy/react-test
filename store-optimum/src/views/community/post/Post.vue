<template>
    <main v-if="feed" class="hover-animation flex min-h-screen w-full max-w-xl flex-col pb-96 !pb-[1280px]">
        <header v-if="!isIframe"
            class="hover-animation even z-40 bg-white md:bg-inherit px-4 py-2 backdrop-blur-md sticky top-0 flex items-center gap-6">
            <a class="custom-button main-tab dark-bg-tab group relative p-2 hover:bg-accent-red/10 active:bg-accent-red/20"
                @click="$router.back()">
                <ArrowLeftIcon class="h-5 w-5"></ArrowLeftIcon>
                <div
                    class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3">
                    <span>Back</span>
                </div>
            </a>
            <div class="flex gap-8">
                <h2 class="text-xl font-bold">Feed</h2>
            </div>
        </header>
        <section
            class="cursor-pointer bg-white my-3 md:my-5 border-y md:border md:rounded-md flex flex-col justify-between">
            <FeedItem :item="feed" />
        </section>
        <ImageView v-if="images.length > 0" :images="images" @close="images = []"></ImageView>
    </main>
    <div v-else class="flex animate-pulse min-h-screen w-full max-w-xl flex-col pb-96 px-4 py-4">
        <div class="rounded-xl shadow-sm p-4 space-y-4 bg-slate-200/60 animate-pulse border1 dark:bg-dark2">
            <div class="flex gap-3">
                <div class="w-9 h-9 rounded-full bg-slate-300/60"></div>
                <div class="flex-1 space-y-3">
                    <div class="w-40 h-5 rounded-md bg-slate-300/60"></div>
                    <div class="w-24 h-4 rounded-md bg-slate-300/60"></div>
                </div>
                <div class="w-6 h-6 rounded-full bg-slate-300/60"></div>
            </div>
            <div class="w-full h-52 rounded-lg bg-slate-300/10 my-3"></div>
            <div class="flex gap-3">
                <div class="w-16 h-5 rounded-md bg-slate-300/60"></div>
                <div class="w-14 h-5 rounded-md bg-slate-300/60"></div>
                <div class="w-6 h-6 rounded-full bg-slate-300/60 ml-auto"></div>
                <div class="w-6 h-6 rounded-full bg-slate-300/60"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import {
    ArrowLeftIcon,
    EllipsisHorizontalIcon,
    UserPlusIcon,
    StarIcon,
    TrashIcon,
} from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import {
    computed,
    getCurrentInstance,
    ref,
    watch,
    defineAsyncComponent,
} from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCommunityStore } from "@/stores/community";
import { useMeStore } from "@/stores/me";
import { FEED_FEED_DETAILS } from "@/gql/feed";
import { useQuery, useMutation } from "@vue/apollo-composable";
const Create = defineAsyncComponent(() => import("@/components/community/Create.vue"));
const ImageView = defineAsyncComponent(() =>
    import("@/components/community/ImageView.vue")
);
const FeedList = defineAsyncComponent(() =>
    import("@/components/community/FeedList.vue")
);
const FeedItem = defineAsyncComponent(() =>
    import("@/components/community/FeedItem.vue")
);
dayjs.extend(relativeTime);
const { site, isMobile } = storeToRefs(useSiteStore());
const { community } = storeToRefs(useCommunityStore());
const { me } = storeToRefs(useMeStore());
const feed = ref(null);
const router = useRouter();
const instance = getCurrentInstance();
const decodedId = instance?.appContext.config.globalProperties.decodeId;
const id = computed(() => router.currentRoute.value.params.id);
if (
    router.currentRoute.value.params.id &&
    router.currentRoute.value.name == "CommunityPost"
) {
    const { onResult, loading, error, refetch } = useQuery(FEED_FEED_DETAILS, {
        id: decodedId(id.value),
    });
    onResult((queryResult) => {
        feed.value = queryResult.data.feedFeed;
    });
}
const images = ref([]);
const isIframe = computed(() => {
    return (window.location !== window.parent.location) && isMobile.value
})
</script>
