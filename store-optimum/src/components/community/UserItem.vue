<template>
  <div
    class="rounded-xl accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-2 py-2 hover:bg-red-500/5 dark:hover:bg-dark-primary/5"
  >
    <div
      class="group relative self-start text-gray-800 dark:text-dark-primary [&amp;>div]:translate-y-2"
    >
      <router-link
        class="blur-picture flex self-start"
        tabindex="0"
        :to="`/feed/${user.username}`"
        ><img
          :alt="user.username"
          v-lazy="user.avatar"
          class="rounded-full object-cover w-10 h-10"
      /></router-link>
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
              :to="`/feed/${user.username}`"
              ><p class="truncate">{{ user.name ? user.name : user.title }}</p>
              <i
                ><CheckBadgeIcon
                  v-if="user.isVerified"
                  class="fill-blue-400 w-5 h-5 stroke-transparent"
                ></CheckBadgeIcon></i
            ></router-link>
          </div>
          <div class="flex items-center gap-1 text-light-secondary">
            <div
              class="group relative self-start text-gray-800 grid [&amp;>div]:translate-y-7 pt-1"
            >
              <router-link
                class="truncate text-light-secondary dark:text-gray-400 text-xs"
                tabindex="-1"
                :to="`/feed/${user.username}`"
                >{{
                  user.followers
                    ? `${user.followers} Following`
                    : `@${user.username}`
                }}</router-link
              >
            </div>
          </div>
        </div>
        <router-link
          :to="`/feed/${user.username}`"
          class="rounded-md border-transparent main-tab self-start border bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-500/90 focus-visible:bg-red-500/90 active:bg-light-border/75 dark:bg-gray-100 dark:text-gray-900 dark:text-sm dark:hover:bg-gray-950 dark:hover:text-gray-100"
          type="button"
        >
          Follow
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckBadgeIcon } from "@heroicons/vue/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import {
  USER_DETAILS_BY_USERNAME,
  SELF_USER_ADD_FOLLOWING,
  SELF_USER_REMOVE_FOLLOWING,
} from "@/gql/user";
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
  user: {
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
const follow = async (id, status) => {
  if (me.value) {
    const { mutate, loading, error } = useMutation(
      status ? SELF_USER_REMOVE_FOLLOWING : SELF_USER_ADD_FOLLOWING,
      {
        variables: {
          userId: me.value.id,
          followerId: id,
        },
      }
    );
    try {
      const response = await mutate();
      if (
        response.data.selfUserAddFollowing ||
        response.data.selfUserRemoveFollowing
      ) {
        addNotification(
          { title: "Feed info", subTitle: "User profile saved" },
          "success"
        );
        const { onResult } = useQuery(USER_DETAILS_BY_USERNAME, {
          username: router.currentRoute.value.params.username,
        });
        onResult((queryResult) => {
          user.value = queryResult.data.userByUsername;
        });
      }
    } catch (error) {
      addNotification({ title: "Feed info", subTitle: error.message }, "error");
    }
  } else {
    router.push(`/login`);
  }
};
</script>
