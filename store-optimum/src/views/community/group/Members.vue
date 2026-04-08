<template>
    <main class="hover-animation flex min-h-screen w-full max-w-xl flex-col pb-96">
        <header v-if="!isIframe"
            class="hover-animation even z-40 bg-inherit px-4 py-2 backdrop-blur-md sticky top-0 flex items-center gap-6 mb-3">
            <a @click="$router.back()"
                class="custom-button main-tab dark-bg-tab group relative p-2 hover:bg-accent-red/10 active:bg-accent-red/20">
                <ArrowLeftIcon class="h-5 w-5 dark:text-gray-100"></ArrowLeftIcon>
                <div
                    class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3">
                    <span class="dark:text-gray-200">Back</span>
                </div>
            </a>
            <div class="-mb-1 truncate" data-projection-id="191" style="opacity: 1" data-motion-pop-id=":r149:">
                <router-link class="flex items-center gap-1 truncate font-bold pointer-events-none -mt-1 text-xl"
                    tabindex="-1" :to="`/group/${community ? community.slug : 'guest'}/${community ? community.hid : '6'
                        }`">
                    <h2 class="truncate dark:text-gray-200">
                        {{ community ? community.title : "guest" }}
                    </h2>
                    <i>
                        <CheckBadgeIcon class="fill-blue-400 w-6 h-6 stroke-transparent"></CheckBadgeIcon>
                    </i>
                </router-link>
                <!-- <p class="text-xs text-light-secondary">
          {{ community ? community.totalMembers : 0 }} Memebers
        </p> -->
            </div>
        </header>
        <section data-projection-id="190" style="opacity: 1" class="dark:bg-gray-900 rounded-t-lg">
            <div class="mt-0.5 h-36 xs:h-48 sm:h-52">
                <button
                    class="custom-button main-tab accent-tab relative h-full w-full rounded-none p-0 transition hover:brightness-75"
                    type="button">
                    <img :alt="community ? community.title : 'guest'" v-lazy="community ? community.cover : 'guest'"
                        class="object-cover rounded-md h-[200px] w-full bg-light-line-reply dark:bg-gray-200" />
                </button>
            </div>
            <div class="relative flex flex-col gap-3 px-4 py-3">
                <div class="flex justify-between">
                    <div class="mb-8 xs:mb-8 sm:mb-8">
                        <button
                            class="custom-button main-tab accent-tab absolute -mt-0 aspect-square w-24 -translate-y-1/2 overflow-hidden p-0 disabled:cursor-auto disabled:opacity-100 xs:w-32 sm:w-36 [&amp;:hover>figure>span]:brightness-75"
                            type="button">
                            <img :alt="community ? community.title : 'guest'"
                                v-lazy="community ? community.avatar : 'guest'"
                                class="rounded-full object-cover border-2 border-blue-400" />
                        </button>
                    </div>
                    <div class="flex gap-2 self-start">
                        <div class="relative" data-headlessui-state="">
                            <button
                                class="custom-button main-tab dark-bg-tab group relative border border-light-line-reply p-2 hover:bg-accent-red/10 active:bg-accent-red/20 dark:bg-gray-950 dark:border-gray-500"
                                id="headlessui-popover-button-:r15r:" aria-expanded="false" data-headlessui-state=""
                                type="button">
                                <EllipsisHorizontalIcon class="h-5 w-5 dark:text-gray-100"></EllipsisHorizontalIcon>

                                <div
                                    class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3">
                                    <span>More</span>
                                </div>
                            </button>
                        </div>
                        <button v-if="me && community && me.id == community.userId" @click="isShowEdit = true"
                            class="custom-button main-tab self-start border bg-accent-red px-4 py-1.5 font-bold text-white hover:bg-accent-red/90 focus-visible:bg-accent-red/90 active:bg-light-border/75"
                            type="button">
                            Edit Profile
                        </button>
                        <button v-else @click="follow(community.id)"
                            class="custom-button main-tab self-start border bg-accent-red px-4 py-1.5 font-bold text-white hover:bg-accent-red/90 focus-visible:bg-accent-red/90 active:bg-light-border/75 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-300"
                            type="button">
                            {{
                                me && me.topFollowing
                                    ? me.topFollowing.includes(community ? community.id : 1)
                                        ? "Joined"
                                        : "Join"
                            : "Join"
                            }}
                        </button>
                    </div>
                </div>
                <div class="dark:pt-4">
                    <router-link class="flex items-center gap-1 truncate font-bold pointer-events-none -mb-1 text-xl"
                        tabindex="-1" :to="`/group/${community ? community.slug : 'guest'}/${community ? community.hid : '6'
                            }`">
                        <p class="truncate dark:text-gray-300">
                            {{ community ? community.title : "guest" }}
                        </p>
                        <i>
                            <CheckBadgeIcon class="fill-blue-400 w-6 h-6 stroke-transparent"></CheckBadgeIcon>
                        </i>
                    </router-link>
                    <div class="flex items-center gap-1 text-light-secondary dark:text-gray-400">
                        <p>
                            @{{ community ? community.slug : "guest" }}/{{
                                community ? community.hid : "6"
                            }}
                        </p>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="whitespace-pre-line break-words">
                        {{ community ? community.bio : "guest" }}
                    </p>
                    <div class="flex flex-wrap gap-x-3 gap-y-1 text-light-secondary">
                        <div class="flex items-center gap-1">
                            <i>
                                <MapPinIcon class="h-5 w-5 dark:text-gray-400"></MapPinIcon>
                            </i>
                            <p>{{ community ? community.address : "guest" }}</p>
                        </div>
                        <div class="flex items-center gap-1">
                            <i>
                                <LinkIcon class="h-5 w-5 dark:text-gray-400"></LinkIcon>
                            </i><router-link class="custom-underline text-main-accent" :to="`/group/${community ? community.slug : 'guest'}/${community ? community.hid : '6'
                                }`" target="_blank" rel="noreferrer">{{ community ? community.title : "guest" }}</router-link>
                        </div>
                        <div v-if="community && community.birth" class="flex items-center gap-1">
                            <i>
                                <CalendarDaysIcon class="h-5 w-5"></CalendarDaysIcon>
                            </i><button class="custom-underline group relative">
                                {{ community.birth }}
                                <div
                                    class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-1">
                                    <span>{{ "" }}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    class="flex gap-4 text-light-secondary [&amp;>a>div]:font-bold [&amp;>a>div]:text-accent-red dark:[&amp;>a>div]:text-dark-primary">
                    <router-link
                        class="hover-animation mt-0.5 mb-[3px] flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red"
                        :to="`/group/${community ? community.slug : 'guest'}/${community ? community.hid : '6'
                            }/members/`">
                        <div class="overflow-hidden">
                            <p class="text-sm dark:text-gray-400" data-projection-id="207"
                                style="opacity: 1; transform: none">
                                {{ community ? community.totalMembers : 0 }}
                            </p>
                        </div>
                        <p class="dark:text-gray-400">{{ " " }}Members</p>
                    </router-link>
                </div>
            </div>
        </section>
        <nav class="hover-animation flex justify-between overflow-y-auto scrollbar-thin border-b border-light-border dark:border-dark-border dark:bg-gray-800 rounded-b-lg"
            data-projection-id="209" style="opacity: 1">
            <router-link
                class="hover-animation main-tab dark-bg-tab flex flex-1 justify-center hover:bg-accent-red/10 dark:hover:bg-dark-primary/10"
                :to="`/group/${community ? community.slug : 'guest'}/${community ? community.hid : '6'
                    }/`">
                <div class="px-6 md:px-8">
                    <p
                        class="flex flex-col gap-3 whitespace-nowrap pt-3 font-bold transition-colors duration-200 text-accent-red dark:text-dark-primary [&amp;>i]:scale-100 [&amp;>i]:opacity-100">
                        Posts<i class="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200"></i>
                    </p>
                </div>
            </router-link><router-link
                class="hover-animation main-tab dark-bg-tab flex flex-1 justify-center hover:bg-accent-red/10 dark:hover:bg-dark-primary/10"
                :to="`/group/${community ? community.slug : 'guest'}/${community ? community.hid : '6'
                    }/members/`">
                <div class="px-6 md:px-8">
                    <p
                        class="flex flex-col gap-3 whitespace-nowrap pt-3 font-bold transition-colors duration-200 text-light-secondary">
                        Members<i
                            class="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200"></i>
                    </p>
                </div>
            </router-link><router-link
                class="hover-animation main-tab dark-bg-tab flex flex-1 justify-center hover:bg-accent-red/10 dark:hover:bg-dark-primary/10"
                :to="`/group/${community ? community.slug : 'guest'}/${community ? community.hid : '6'
                    }/media/`">
                <div class="px-6 md:px-8">
                    <p
                        class="flex flex-col gap-3 whitespace-nowrap pt-3 font-bold transition-colors duration-200 text-light-secondary">
                        Media<i class="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200"></i>
                    </p>
                </div>
            </router-link><router-link
                class="hover-animation main-tab dark-bg-tab flex flex-1 justify-center hover:bg-accent-red/10 dark:hover:bg-dark-primary/10"
                :to="`/group/${community ? community.slug : 'guest'}/${community ? community.hid : '6'
                    }/likes/`">
                <div class="px-6 md:px-8">
                    <p
                        class="flex flex-col gap-3 whitespace-nowrap pt-3 font-bold transition-colors duration-200 text-light-secondary">
                        Likes<i class="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200"></i>
                    </p>
                </div>
            </router-link>
        </nav>
        <div class="inner:px-2 inner:py-2 dark:bg-gray-900 dark:mt-4 dark:rounded-lg">
            <MemberList v-if="community" :key="communityId" :communityId="community.id" />
        </div>
        <CommunityEdit v-if="me && isShowEdit" @close="isShowEdit = false" />
    </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import {
    computed,
    ref,
    watch,
    defineAsyncComponent,
    getCurrentInstance,
} from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { FEED_COMMUNITY_DETAILS } from "@/gql/community";
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
    ArrowLeftIcon,
    CalendarDaysIcon,
    EllipsisHorizontalIcon,
    EnvelopeIcon,
    LinkIcon,
    MapPinIcon,
} from "@heroicons/vue/24/outline";
import { CheckBadgeIcon } from "@heroicons/vue/24/outline";
const CommunityEdit = defineAsyncComponent(() =>
    import("@/components/community/CommunityEdit.vue")
);
const MemberList = defineAsyncComponent(() =>
    import("@/components/community/MemberList.vue")
);
const { proxy } = getCurrentInstance();
const { site, isMobile } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const community = ref(null);
const router = useRouter();
const isShowEdit = ref(false);
if (
    router.currentRoute.value.params.hid &&
    router.currentRoute.value.name == "CommunityGroupMembers"
) {
    const { onResult, loading, error, refetch } = useQuery(
        FEED_COMMUNITY_DETAILS,
        {
            id: proxy.decodeId(router.currentRoute.value.params.hid),
        }
    );
    onResult((queryResult) => {
        community.value = queryResult.data.feedCommunity;
    });
    watch(router.currentRoute, () => {
        if (
            router.currentRoute.value.params.hid &&
            router.currentRoute.value.name == "CommunityGroupMembers"
        ) {
            refetch({ id: proxy.decodeId(router.currentRoute.value.params.hid) });
        }
    });
}
const follow = (id) => {
    if (me.value) {
    } else {
        router.push(`/login`);
    }
};
const isIframe = computed(() => {
    return window.location !== window.parent.location && isMobile.value;
});
</script>
