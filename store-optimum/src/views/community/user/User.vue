<template>
    <main class="hover-animation flex min-h-screen w-full max-w-xl flex-col pb-96">
      <header v-if="!isIframe"
        class="hover-animation even z-40 bg-inherit px-4 py-2 backdrop-blur-md sticky top-0 flex items-center gap-6 mb-3">
        <a @click="$router.back()"
          class="rounded-md border-transparent main-tab group relative p-2 active:bg-red-500/20">
          <ArrowLeftIcon class="h-5 w-5"></ArrowLeftIcon>
          <div
            class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3">
            <span>Back</span>
          </div>
        </a>
        <div class="-mb-1 truncate" data-projection-id="191" style="opacity: 1" data-motion-pop-id=":r149:">
          <router-link class="flex items-center gap-1 truncate font-bold pointer-events-none -mt-1 text-xl"
            tabindex="-1" :to="`/feed/${user ? user.username : 'guest'}`">
            <h2 class="truncate dark:text-gray-100">
              {{ user ? user.name : "guest" }}
            </h2>
            <i>
              <CheckBadgeIcon v-if="user && user.isVerified" class="fill-blue-400 w-6 h-6 stroke-transparent">
              </CheckBadgeIcon>
            </i>
          </router-link>
          <p class="text-xs text-light-secondary dark:text-gray-100">
            {{ user ? user.totalFeed : 0 }} Posts
          </p>
        </div>
      </header>
      <section
        class="cursor-pointer bg-white md:my-5 shadow-sm md:shadow-[rgba(0_0_0/0.16)_0px_1px_4px] md:rounded-2xl flex flex-col justify-between dark:bg-gray-900">
        <div class="mt-0.5 h-36 xs:h-48 sm:h-52">
          <button
            class="rounded-md border-transparent main-tab accent-tab relative h-full w-full rounded-none p-0 transition hover:brightness-75"
            type="button">
            <img :alt="user ? user.name : 'guest'" v-lazy="user ? user.cover : 'guest'"
              class="object-cover rounded-b-xl h-[200px] w-full bg-light-line-reply" />
          </button>
        </div>
        <div class="relative flex flex-col gap-3 px-4 py-3">
          <div class="flex justify-between">
            <div class="mb-8 xs:mb-8 sm:mb-8">
              <button
                class="p-2 main-tab accent-tab absolute -mt-0 aspect-square w-24 -translate-y-1/2 overflow-hidden disabled:cursor-auto disabled:opacity-100 xs:w-24 sm:w-24 [&amp;:hover>figure>span]:brightness-75"
                type="button">
                <img :alt="user ? user.name : 'guest'" v-lazy="user ? user.avatar : 'guest'"
                  class="rounded-full object-cover border-2 border-blue-400 max-h-24 h-full w-full" />
              </button>
            </div>
            <div class="flex gap-2 self-start">
              <div class="relative" data-headlessui-state="">
                <button
                  class="rounded-md border-transparent main-tab group relative border border-light-line-reply p-2 active:bg-red-500/20 dark:py-1"
                  id="headlessui-popover-button-:r15r:" aria-expanded="false" data-headlessui-state="" type="button">
                  <EllipsisHorizontalIcon class="h-5 w-5 dark:text-gray-200"></EllipsisHorizontalIcon>

                  <div
                    class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3">
                    <span>More</span>
                  </div>
                </button>
              </div>
              <button v-if="me && user && me.id != user.id" @click="sendMessage(user)"
                class="rounded-md border-transparent main-tab group relative border border-light-line-reply p-2 active:bg-red-500/20 dark:py-1"
                type="button">
                <EnvelopeIcon class="h-5 w-5 dark:text-gray-200"></EnvelopeIcon>

                <div
                  class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3 dark:py-1">
                  <span>Message</span>
                </div>
              </button>
              <button v-if="me && user && me.id == user.id" @click="isShowEdit = true"
                class="rounded-md border-transparent main-tab self-start border bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-500/90 focus-visible:bg-red-500/90 active:bg-light-border/75 dark:bg-gray-100 dark:text-gray-900 dark:py-1 dark:font-semibold dark:hover:bg-gray-300"
                type="button">
                Edit Profile
              </button>
              <button v-else @click="
                follow(
                  user ? user.id : 1,
                  user ? user.topFollowers.includes(me ? me.id : 1) : false
                )
                "
                class="rounded-md border-transparent main-tab self-start border bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-500/90 focus-visible:bg-red-500/90 active:bg-light-border/75 dark:bg-gray-50 dark:py-1 dark:text-gray-900 dark:text-sm dark:hover:bg-gray-950 dark:hover:text-gray-100"
                type="button">
                {{
                user
                ? user.topFollowers.includes(me ? me.id : 1)
                ? "Following"
                : "Follow"
                : "Follow"
                }}
              </button>
            </div>
          </div>
          <div>
            <router-link class="flex items-center gap-1 truncate font-bold pointer-events-none -mb-1 text-xl"
              tabindex="-1" :to="`/feed/${user ? user.username : 'guest'}`">
              <p class="truncate dark:text-gray-100">
                {{ user ? user.name : "guest" }}
              </p>
              <i>
                <CheckBadgeIcon v-if="user && user.isVerified" class="fill-blue-400 w-6 h-6 stroke-transparent">
                </CheckBadgeIcon>
              </i>
            </router-link>
            <div class="flex items-center gap-1 text-light-secondary">
              <p>{{ user ? user.bio : "guest" }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <!-- <p class="whitespace-pre-line break-words">
            {{ user ? user.bio : "guest" }}
          </p> -->
            <div class="flex flex-wrap gap-x-3 gap-y-1 text-light-secondary">
              <div class="flex items-center gap-1">
                <i>
                  <MapPinIcon class="h-5 w-5"></MapPinIcon>
                </i>
                <p>{{ user ? user.address : "guest" }}</p>
              </div>
              <!-- <div class="flex items-center gap-1">
              <i> <LinkIcon class="h-5 w-5"></LinkIcon> </i
              ><router-link
                class="custom-underline text-main-accent"
                :to="`/${user ? user.username : 'guest'}`"
                target="_blank"
                rel="noreferrer"
                >{{ user ? user.username : "guest" }}</router-link
              >
            </div> -->
              <div v-if="user && user.birth" class="flex items-center gap-1">
                <i>
                  <CalendarDaysIcon class="h-5 w-5"></CalendarDaysIcon>
                </i><button class="custom-underline group relative">
                  {{ user.birth }}
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
              class="hover-animation mt-0.5 mb-[3px] flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red dark:text-gray-300"
              :to="`/feed/${user ? user.username : 'guest'}/following/`">
              <div class="overflow-hidden">
                <p class="text-sm" data-projection-id="207" style="opacity: 1; transform: none">
                  {{ user ? user.following : 0 }}
                </p>
              </div>
              <p>Following</p>
            </router-link><router-link
              class="hover-animation mt-0.5 mb-[3px] flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-accent-red focus-visible:border-b-accent-red dark:text-gray-300"
              :to="`/feed/${user ? user.username : 'guest'}/followers/`">
              <div class="overflow-hidden">
                <p class="text-sm" data-projection-id="208" style="opacity: 1; transform: none">
                  {{ user ? user.followers : 0 }}
                </p>
              </div>
              <p>Followers</p>
            </router-link>
          </div>
        </div>
      </section>
      <nav
        class="hover-animation flex justify-between overflow-y-auto scrollbar-thin border-b border-light-border dark:bg-gray-900 dark:rounded dark:border-dark-border bg-white">
        <router-link :class="path == 'User' ? 'bg-red-500 dark:bg-blue-500 text-white' : ''
          " class="hover-animation main-tab flex flex-1 justify-center"
          :to="`/feed/${user ? user.username : 'guest'}/`">
          <div class="px-4 md:px-4">
            <p
              class="flex flex-col gap-2 whitespace-nowrap pt-2 font-bold transition-colors duration-200 dark:text-gray-100">
              Posts<i class="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200"></i>
            </p>
          </div>
        </router-link><router-link :class="path == 'UserFollowers'
            ? 'bg-red-500 dark:bg-blue-500 text-white'
            : ''
          " class="hover-animation main-tab flex flex-1 justify-center"
          :to="`/feed/${user ? user.username : 'guest'}/followers/`">
          <div class="px-4 md:px-4">
            <p
              class="flex flex-col gap-2 whitespace-nowrap pt-2 font-bold transition-colors duration-200 text-light-secondary dark:text-gray-100">
              Followers<i class="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200"></i>
            </p>
          </div>
        </router-link><router-link :class="path == 'UserFollowing'
            ? 'bg-red-500 dark:bg-blue-500 text-white'
            : ''
          " class="hover-animation main-tab flex flex-1 justify-center"
          :to="`/feed/${user ? user.username : 'guest'}/following/`">
          <div class="px-4 md:px-4">
            <p
              class="flex flex-col gap-2 whitespace-nowrap pt-2 font-bold transition-colors duration-200 text-light-secondary dark:text-gray-100">
              Following<i class="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200"></i>
            </p>
          </div>
        </router-link>

        <!-- <router-link
        :class="path == 'UserMedia' ? 'bg-red-500 text-white' : ''"
        class="hover-animation main-tab flex flex-1 justify-center "
        :to="`/feed/${user ? user.username : 'guest'}/media/`"
        ><div class="px-4 md:px-4">
          <p
            class="flex flex-col gap-2 whitespace-nowrap pt-2 font-bold transition-colors duration-200 text-light-secondary"
          >
            Media<i
              class="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200"
            ></i>
          </p></div></router-link
      ><router-link
        class="hover-animation main-tab flex flex-1 justify-center "
        :to="`/feed/${user ? user.username : 'guest'}/likes/`"
        ><div class="px-4 md:px-4">
          <p
            class="flex flex-col gap-2 whitespace-nowrap pt-2 font-bold transition-colors duration-200 text-light-secondary"
          >
            Likes<i
              class="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200"
            ></i>
          </p></div
      ></router-link> -->
      </nav>

      <ProfileEdit v-if="me && isShowEdit" @close="isShowEdit = false" @refresh="isShowEdit = false" />

      <div v-if="path == 'User' && user">
        <FeedList :userId="user.id" />
      </div>
      <div class="bg-white px-1 py-2 dark:bg-gray-900" v-else-if="path == 'UserFollowers' && user">
        <UserList :followerId="user.id" />
      </div>
      <div class="bg-white px-1 py-2 dark:bg-gray-900" v-else-if="path == 'UserFollowing' && user">
        <UserList :followingId="user.id" />
      </div>
    </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import {
  USER_DETAILS_BY_USERNAME,
  SELF_USER_ADD_FOLLOWING,
  SELF_USER_REMOVE_FOLLOWING,
} from "@/gql/user";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "@/stores/notifications";
import { SELF_CHAT_THREAD_CREATE } from "@/gql/chat";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  LinkIcon,
  MapPinIcon,
} from "@heroicons/vue/24/outline";
import { CheckBadgeIcon } from "@heroicons/vue/24/outline";
const { addNotification } = useNotificationsStore();
const ProfileEdit = defineAsyncComponent(() =>
  import("@/components/community/ProfileEdit.vue")
);
const NavBar = defineAsyncComponent(() => import("@/components/NavBar.vue"));
const FeedList = defineAsyncComponent(() =>
  import("@/components/community/FeedList.vue")
);
const UserList = defineAsyncComponent(() =>
  import("@/components/community/UserList.vue")
);
const { site, isMobile } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const user = ref(null);
const router = useRouter();
const isShowEdit = ref(false);
if (
  router.currentRoute.value.params.username &&
  ["CommunityUser", "CommunityUserFollowers", "CommunityUserFollowing"].includes(
    router.currentRoute.value.name
  )
) {
  const { onResult, loading, error, refetch } = useQuery(
    USER_DETAILS_BY_USERNAME,
    {
      username: router.currentRoute.value.params.username,
    }
  );
  onResult((queryResult) => {
    user.value = queryResult.data.userByUsername;
  });
  watch(router.currentRoute, () => {
    if (
      router.currentRoute.value.params.username &&
      ["CommunityUser"].includes(router.currentRoute.value.name)
    ) {
      refetch({ username: router.currentRoute.value.params.username });
    }
  });
}
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

const sendMessage = async (receiver) => {
  const { mutate, loading, error } = useMutation(SELF_CHAT_THREAD_CREATE, {
    variables: {
      userId: me.value.id,
      channel: "me.value.id",
      lastMessage: "Hey...",
      receiverId: receiver.id,
      receiverName: receiver.name,
      senderId: me.value.id,
      senderName: me.value.name,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfChatThreadCreate) {
      addNotification(
        { title: "Feed info", subTitle: "User profile saved" },
        "success"
      );
      router.push("/messages/");
    }
  } catch (error) {
    addNotification({ title: "Feed info", subTitle: error.message }, "error");
  }
};
const isIframe = computed(() => {
  return window.location !== window.parent.location && isMobile.value || true;
});
const path = computed(() => router.currentRoute.value.name);
</script>
