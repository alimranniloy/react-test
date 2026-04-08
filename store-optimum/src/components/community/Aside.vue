<template>
  <aside class="w-96 flex-col gap-4 px-4 py-3 pt-1 hidden xl:flex">
    <form class="hover-animation sticky top-0 z-10 -my-2 p-2">
      <label
        class="group flex items-center justify-between gap-2 rounded-full bg-main-search-background px-4 py-0 transition focus-within:ring-2 focus-within:ring-main-accent dark:bg-gray-900 dark:border dark:border-gray-600"
        ><i>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            class="h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            ></path>
          </svg>
        </i>
        <input
          class="peer border-0 flex-1 bg-transparent outline-none placeholder:text-light-secondary focus:ring-transparent"
          type="text"
          :placeholder="'Search...'"
          value="" /><button
          class="custom-button main-tab accent-tab scale-50 bg-main-accent p-1 opacity-0 transition hover:brightness-90 disabled:opacity-0"
          type="button"
          disabled=""
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            class="h-3 w-3 stroke-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg></button
      ></label>
    </form>
    <section
      v-if="(community || tempCommunity) && me"
      style="opacity: 1"
      class="border border-gray-700 rounded-lg shadow-4xl"
    >
      <div class="mt-0.5 h-36 xs:h-48 sm:h-52">
        <button
          class="custom-button main-tab accent-tab relative h-full w-full rounded-none p-0 transition hover:brightness-75"
          type="button"
        >
          <img
            :alt="tempCommunity ? tempCommunity.title : community.title"
            v-lazy="tempCommunity ? tempCommunity.cover : community.cover"
            class="object-cover rounded-md h-[200px] w-full bg-light-line-reply"
          />
        </button>
      </div>
      <div class="relative flex flex-col gap-3 px-4 py-3">
        <div class="flex justify-between">
          <div class="mb-8 xs:mb-8 sm:mb-8">
            <button
              class="custom-button main-tab accent-tab absolute -mt-3 aspect-square w-24 -translate-y-1/2 overflow-hidden p-0 disabled:cursor-auto disabled:opacity-100 xs:w-32 sm:w-36 [&amp;:hover>figure>span]:brightness-75"
              type="button"
            >
              <img
                :alt="tempCommunity ? tempCommunity.title : community.title"
                v-lazy="tempCommunity ? tempCommunity.avatar : community.avatar"
                class="rounded-full object-cover h-[80px] w-[80px] bg-white border-2 border-blue-400"
              />
            </button>
          </div>
          <div class="flex gap-2 self-start">
            <div class="relative" data-headlessui-state="">
              <button
                class="custom-button main-tab dark-bg-tab group relative border border-light-line-reply p-2 hover:bg-accent-red/10 active:bg-accent-red/20"
                id="headlessui-popover-button-:r15r:"
                aria-expanded="false"
                data-headlessui-state=""
                type="button"
              >
                <EllipsisHorizontalIcon
                  class="h-5 w-5 dark:text-gray-200"
                ></EllipsisHorizontalIcon>

                <div
                  class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
                >
                  <span>More</span>
                </div>
              </button>
            </div>
            <router-link
              :to="`/group/${
                tempCommunity ? tempCommunity.slug : community.slug
              }/${tempCommunity ? tempCommunity.hid : community.hid}`"
              class="custom-button main-tab self-start border bg-accent-red px-4 py-1.5 font-bold text-white hover:bg-accent-red/90 focus-visible:bg-accent-red/90 active:bg-light-border/75 dark:bg-gray-50 dark:text-gray-900 dark:text-sm dark:hover:bg-gray-950 dark:hover:text-gray-100"
              type="button"
            >
              {{ "View" }}
            </router-link>
          </div>
        </div>
        <div>
          <router-link
            class="flex items-center gap-1 truncate font-bold pointer-events-none -mb-1 text-xl"
            tabindex="-1"
            :to="`/group/${tempCommunity ? tempCommunity : community.slug}/${
              tempCommunity ? tempCommunity.hid : community.hid
            }`"
          >
            <p class="truncate dark:text-gray-100">
              {{ tempCommunity ? tempCommunity.title : community.title }}
            </p>
            <i
              ><CheckBadgeIcon
                class="fill-blue-400 w-5 h-5 stroke-transparent"
              ></CheckBadgeIcon>
            </i>
          </router-link>
          <div
            class="flex items-center gap-1 text-light-secondary dark:text-gray-300"
          >
            <p>@{{ tempCommunity ? tempCommunity.slug : community.slug }}</p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <p
            v-if="community && community.interest.length > 0"
            class="whitespace-pre-line break-words"
          >
            {{ community.interest }}
          </p>
          <div class="flex flex-wrap gap-x-3 gap-y-1 text-light-secondary">
            <div class="flex items-center gap-1">
              <i> <LinkIcon class="h-5 w-5 dark:text-gray-300"></LinkIcon> </i>
              <router-link
                class="custom-underline text-main-accent"
                :to="`/group/${
                  tempCommunity ? tempCommunity.slug : community.slug
                }/${tempCommunity ? tempCommunity.hid : community.hid}`"
                target="_blank"
                rel="noreferrer"
                >{{
                  tempCommunity ? tempCommunity.slug : community.slug
                }}</router-link
              >
            </div>
            <div class="flex items-center gap-1">
              <i
                ><CalendarDaysIcon
                  class="h-5 w-5 dark:text-gray-400"
                ></CalendarDaysIcon> </i
              ><button
                class="custom-underline group relative dark:text-gray-300"
              >
                {{
                  dayjs(
                    tempCommunity
                      ? tempCommunity.createdAt
                      : community.createdAt
                  ).fromNow()
                }}
                <div
                  class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-1"
                >
                  <span>{{ "" }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <!-- <div
          class="flex gap-4 text-light-secondary [&amp;>a>div]:font-bold [&amp;>a>div]:text-accent-red dark:[&amp;>a>div]:text-dark-primary"
        >
          <router-link
            class="hover-animation mt-0.5 mb-[3px] flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red"
            :to="`/group/${tempCommunity ? tempCommunity.slug : community.slug}/${tempCommunity ? tempCommunity.hid : community.hid}/members/`"
            ><div class="overflow-hidden">
              <p
                class="text-sm"
                data-projection-id="207"
                style="opacity: 1; transform: none"
              >
                {{ tempCommunity ? tempCommunity.totalMembers : community.totalMembers }}
              </p>
            </div>
            <p>Members</p></router-link
          >
        </div> -->
      </div>
    </section>
    <div
      class="sticky top-16 flex flex-col gap-3 text-center text-sm text-light-secondary dark:text-gray-400"
    >
      <section
        class="hover-animation rounded-2xl bg-main-sidebar-background dark:bg-gray-900"
      >
        <div class="inner:px-2 inner:py-2" style="opacity: 1">
          <h2 class="text-xl font-bold dark:text-gray-100">Who to follow</h2>
          <MemberList v-if="community" />
          <UserList v-else />
        </div>
      </section>
    </div>
    <footer
      class="sticky top-[520px] flex flex-col gap-3 text-center text-sm text-light-secondary dark:text-gray-400"
    >
      <nav class="flex flex-wrap justify-center gap-2">
        <router-link
          class="custom-underline"
          target="_blank"
          rel="noreferrer"
          :to="`/tos/`"
          >Terms of Service</router-link
        ><router-link
          class="custom-underline"
          target="_blank"
          rel="noreferrer"
          :to="`/privacy/`"
          >Privacy Policy</router-link
        ><router-link
          class="custom-underline"
          target="_blank"
          rel="noreferrer"
          :to="`/accessibility/`"
          >Accessibility</router-link
        ><router-link
          class="custom-underline"
          target="_blank"
          rel="noreferrer"
          :to="`/ads/`"
          >Ads Info</router-link
        >
      </nav>
    </footer>
  </aside>
</template>
<script setup>
import {
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
} from "@heroicons/vue/24/outline";
import { CheckBadgeIcon } from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useMemberStore } from "@/stores/member";
import { useCommunityStore } from "@/stores/community";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const UserList = defineAsyncComponent(() =>
  import("@/components/community/UserList.vue")
);
const MemberList = defineAsyncComponent(() =>
  import("@/components/community/MemberList.vue")
);
const CommunityList = defineAsyncComponent(() =>
  import("@/components/community/CommunityList.vue")
);
const { me } = storeToRefs(useMeStore());
const { member } = storeToRefs(useMemberStore());
const { community, tempCommunity } = storeToRefs(useCommunityStore());
</script>
