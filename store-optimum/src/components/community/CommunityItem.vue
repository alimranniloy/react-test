<template>
  <div
    class="rounded-xl accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-2 py-2 hover:bg-red-500/5 dark:hover:bg-dark-primary/5"
    :to="`/feed/group/${community.slug}/${community.hid}`"
  >
    <div
      class="group relative self-start text-gray-800 dark:text-dark-primary [&amp;>div]:translate-y-2"
    >
      <router-link
        class="blur-picture flex self-start"
        tabindex="0"
        :to="`/feed/group/${community.slug}/${community.hid}`"
        ><img
          :alt="community.hid"
          v-lazy="community.avatar"
          class="rounded-full object-cover w-10 h-10"
      /></router-link>
      <div
        class="menu-container invisible absolute left-1/2 w-72 -translate-x-1/2 rounded-2xl opacity-0 [transition:visibility_0ms_ease_400ms,opacity_200ms_ease_200ms] group-hover:visible group-hover:opacity-100 group-hover:delay-500 bg-white z-40 shadow-md"
      >
        <div class="flex flex-col gap-3 p-4">
          <div class="flex flex-col gap-2">
            <div class="-mx-4 -mt-4">
              <router-link class="blur-picture" :to="`/feed/group/${community.slug}/${community.hid}`"
                ><img
                  :alt="community.hid"
                  v-lazy="{ src: community.cover, error: community.avatar }"
                  class="rounded-t-2xl object-cover"
              /></router-link>
            </div>
            <div class="flex justify-between">
              <div class="mb-10">
                <router-link
                  class="blur-picture flex self-start absolute -translate-y-1/2 bg-white p-1 hover:brightness-100 [&amp;>figure>span]:[transition:200ms] [&amp;:hover>figure>span]:brightness-75"
                  tabindex="0"
                  :to="`/feed/group/${community.slug}/${community.hid}`"
                  ><img
                    :alt="community.hid"
                    v-lazy="community.avatar"
                    class="rounded-full object-cover w-10 h-10"
                /></router-link>
              </div>
              <router-link
                :to="`/feed/group/${community.slug}/${community.hid}`"
                class="rounded-md border-transparent main-tab self-start border bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-500/90 focus-visible:bg-red-500/90 active:bg-light-border/75"
                type="button"
              >
                Follow
              </router-link>
            </div>
            <div>
              <router-link
                class="flex items-center gap-1 truncate font-bold custom-underline -mb-1 text-lg"
                tabindex="0"
                :to="`/feed/group/${community.slug}/${community.hid}`"
                ><p class="truncate">
                  {{ community.name ? community.name : community.title }}
                </p>
                <i
                  ><CheckBadgeIcon
                class="fill-blue-400 w-5 h-5 stroke-transparent"
              ></CheckBadgeIcon></i
              ></router-link>
              <div class="flex items-center gap-1 text-light-secondary">
                <router-link
                  class="truncate text-light-secondary"
                  tabindex="-1"
                  :to="`/feed/group/${community.slug}/${community.hid}`"
                  >@{{ community.slug }}/{{ community.hid }}</router-link
                >
              </div>
            </div>
          </div>
          <p>{{ community.bio }}</p>
          <div class="text-secondary flex gap-4">
            <router-link
              class="hover-animation flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red"
              :to="`/feed/group/${community.slug}/${community.hid}/following`"
              ><p class="font-bold">{{ community.following }}</p>
              <p class="text-light-secondary">Following</p></router-link
            ><router-link
              class="hover-animation flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red"
              :to="`/feed/group/${community.slug}/${community.hid}/followers`"
              ><p class="font-bold">{{ community.followers }}</p>
              <p class="text-light-secondary">Followers</p></router-link
            >
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-1 truncate xs:overflow-visible">
      <div
        class="flex items-center justify-between gap-2 truncate xs:overflow-visible"
      >
        <div
          class="flex flex-col justify-center truncate xs:overflow-visible xs:whitespace-normal"
        >
          <div
            class="group relative self-start text-gray-800 dark:text-dark-primary grid [&amp;>div]:translate-y-7"
          >
            <router-link
              class="flex items-center gap-1 truncate font-bold custom-underline -mb-1"
              tabindex="0"
              :to="`/feed/group/${community.slug}/${community.hid}`"
              ><p class="truncate">
                {{ community.name ? community.name : community.title }}
              </p>
              <i
                ><CheckBadgeIcon
                class="fill-blue-400 w-5 h-5 stroke-transparent"
              ></CheckBadgeIcon></i
            ></router-link>
            <div
              class="menu-container invisible absolute left-1/2 w-72 -translate-x-1/2 rounded-2xl opacity-0 [transition:visibility_0ms_ease_400ms,opacity_200ms_ease_200ms] group-hover:visible group-hover:opacity-100 group-hover:delay-500 bg-white z-40 shadow-md"
            >
              <div class="flex flex-col gap-3 p-4">
                <div class="flex flex-col gap-2">
                  <div class="-mx-4 -mt-4">
                    <router-link class="blur-picture" :to="`/feed/group/${community.slug}/${community.hid}`"
                      ><img
                        :alt="community.hid"
                        v-lazy="{
                          src: community.cover,
                          error: community.avatar,
                        }"
                        class="rounded-t-2xl object-cover"
                    /></router-link>
                  </div>
                  <div class="flex justify-between">
                    <div class="mb-10">
                      <router-link
                        class="blur-picture flex self-start absolute -translate-y-1/2 bg-white p-1 hover:brightness-100 [&amp;>figure>span]:[transition:200ms] [&amp;:hover>figure>span]:brightness-75"
                        tabindex="0"
                        :to="`/feed/group/${community.slug}/${community.hid}`"
                        ><img
                          :alt="community.hid"
                          v-lazy="community.avatar"
                          class="rounded-full object-cover w-10 h-10"
                      /></router-link>
                    </div>
                    <router-link
                      :to="`/feed/group/${community.slug}/${community.hid}`"
                      class="rounded-md border-transparent main-tab self-start border bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-500/90 focus-visible:bg-red-500/90 active:bg-light-border/75"
                      type="button"
                    >
                      Follow
                    </router-link>
                  </div>
                  <div>
                    <router-link
                      class="flex items-center gap-1 truncate font-bold custom-underline -mb-1 text-lg"
                      tabindex="0"
                      :to="`/feed/group/${community.slug}/${community.hid}`"
                      ><p class="truncate">
                        {{ community.name ? community.name : community.title }}
                      </p>
                      <i
                        ><CheckBadgeIcon
                class="fill-blue-400 w-5 h-5 stroke-transparent"
              ></CheckBadgeIcon></i
                    ></router-link>
                    <div class="flex items-center gap-1 text-light-secondary">
                      <router-link
                        class="truncate text-light-secondary"
                        tabindex="-1"
                        :to="`/feed/group/${community.slug}/${community.hid}`"
                        >@{{ community.slug }}/{{ community.hid }}</router-link
                      >
                    </div>
                  </div>
                </div>
                <p>{{ community.bio }}</p>
                <div class="text-secondary flex gap-4">
                  <router-link
                    class="hover-animation flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red"
                    :to="`/feed/group/${community.slug}/${community.hid}/following`"
                    ><p class="font-bold">{{ community.following }}</p>
                    <p class="text-light-secondary">Following</p></router-link
                  ><router-link
                    class="hover-animation flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red"
                    :to="`/feed/group/${community.slug}/${community.hid}/followers`"
                    ><p class="font-bold">{{ community.followers }}</p>
                    <p class="text-light-secondary">Followers</p></router-link
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1 text-light-secondary">
            <div
              class="group relative self-start text-gray-800 dark:text-dark-primary grid [&amp;>div]:translate-y-7"
            >
              <router-link
                class="truncate text-light-secondary"
                tabindex="-1"
                :to="`/feed/group/${community.slug}/${community.hid}`"
                >@{{ community.slug }}/{{ community.hid }}</router-link
              >
              <div
                class="menu-container invisible absolute left-1/2 w-72 -translate-x-1/2 rounded-2xl opacity-0 [transition:visibility_0ms_ease_400ms,opacity_200ms_ease_200ms] group-hover:visible group-hover:opacity-100 group-hover:delay-500 bg-white z-40 shadow-md"
              >
                <div class="flex flex-col gap-3 p-4">
                  <div class="flex flex-col gap-2">
                    <div class="-mx-4 -mt-4">
                      <router-link
                        class="blur-picture"
                        :to="`/feed/group/${community.slug}/${community.hid}`"
                        ><img
                          :alt="community.hid"
                          v-lazy="{
                            src: community.cover,
                            error: community.avatar,
                          }"
                          decoding="async"
                          data-nimg="fill"
                          class="rounded-t-2xl object-cover"
                      /></router-link>
                    </div>
                    <div class="flex justify-between">
                      <div class="mb-10">
                        <router-link
                          class="blur-picture flex self-start absolute -translate-y-1/2 bg-white p-1 hover:brightness-100 [&amp;>figure>span]:[transition:200ms] [&amp;:hover>figure>span]:brightness-75"
                          tabindex="0"
                          :to="`/feed/group/${community.slug}/${community.hid}`"
                          ><img
                            :alt="community.hid"
                            v-lazy="community.avatar"
                            class="rounded-full object-cover w-10 h-10"
                        /></router-link>
                      </div>
                      <router-link
                        :to="`/feed/group/${community.slug}/${community.hid}`"
                        class="rounded-md border-transparent main-tab self-start border bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-500/90 focus-visible:bg-red-500/90 active:bg-light-border/75"
                        type="button"
                      >
                        Follow
                      </router-link>
                    </div>
                    <div>
                      <router-link
                        class="flex items-center gap-1 truncate font-bold custom-underline -mb-1 text-lg"
                        tabindex="0"
                        :to="`/feed/group/${community.slug}/${community.hid}`"
                        ><p class="truncate">
                          {{
                            community.name ? community.name : community.title
                          }}
                        </p>
                        <i
                          ><CheckBadgeIcon
                class="fill-blue-400 w-5 h-5 stroke-transparent"
              ></CheckBadgeIcon></i
                      ></router-link>
                      <div class="flex items-center gap-1 text-light-secondary">
                        <router-link
                          class="truncate text-light-secondary"
                          tabindex="-1"
                          :to="`/feed/group/${community.slug}/${community.hid}`"
                          >@{{ community.slug }}/{{ community.hid }}</router-link
                        >
                      </div>
                    </div>
                  </div>
                  <p>{{ community.bio }}</p>
                  <div class="text-secondary flex gap-4">
                    <router-link
                      class="hover-animation flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red"
                      :to="`/feed/group/${community.slug}/${community.hid}/following`"
                      ><p class="font-bold">{{ community.following }}</p>
                      <p class="text-light-secondary">Following</p></router-link
                    ><router-link
                      class="hover-animation flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red"
                      :to="`/feed/group/${community.slug}/${community.hid}/followers`"
                      ><p class="font-bold">{{ community.followers }}</p>
                      <p class="text-light-secondary">Followers</p></router-link
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <router-link
          :to="`/feed/group/${community.slug}/${community.hid}`"
          class="rounded-md border-transparent main-tab self-start border bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-500/90 focus-visible:bg-red-500/90 active:bg-light-border/75"
          type="button"
        >
          Follow
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckBadgeIcon
} from "@heroicons/vue/24/outline";
import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useMeStore } from "@/stores/me";
import { useShareStore } from "@/stores/share";
import { useNotificationsStore } from "@/stores/notifications";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useSiteStore } from "@/stores/site";
dayjs.extend(relativeTime);
const router = useRouter();
const { addNotification } = useNotificationsStore();
const { addShare } = useShareStore();
const { me } = storeToRefs(useMeStore());
const { site, locale } = storeToRefs(useSiteStore());
const props = defineProps({
  community: {
    type: Object,
    required: true,
  },
});
const share = () => {
  addShare({
    title: "",
    url: "",
    description: "",
    quote: "",
    media: "",
    twitterUser: "",
    hashtags: [],
  });
};
</script>
