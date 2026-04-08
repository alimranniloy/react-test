<template>
  <div v-if="me && community.isPrivate && !community.admins.includes(me.id)" class="p-2 text-center bg-red-100 ">
    Only Admin can Post
  </div>
  <div v-else :class="feed ? 'relative z-10' : 'md:pt-4'">
    <div @click="feed = null" :class="feed ? 'fixed inset-0 bg-black/25 backdrop-blur-sm' : ''"></div>
    <div
      :class="feed ? 'fixed max-w-md md:max-w-xl overflow-hidden mx-auto bg-white shadow-xl md:rounded-lg w-full py-4 md:py-0' : 'md:border md:rounded-md'">
      <div v-if="feed && feedType == 1" class="flex flex-col gap-2 z-40">
        <div class="accent-tab hover-card relative flex flex-col gap-y-4 px-4 py-3 outline-none duration-200">
          <div class="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
            <div class="flex flex-col items-center gap-2">
              <router-link class="blur-picture flex self-start" tabindex="0" :to="`/${feed.user.username}`">
                <img :alt="feed.user.name" v-lazy="feed.user.avatar" class="rounded-full object-cover w-6 h-6" />
              </router-link><i class="hover-animation h-full w-0.5 bg-gray-200"></i>
            </div>
            <div class="flex min-w-0 flex-col">
              <div class="flex justify-between gap-2 text-light-secondary">
                <div class="flex gap-1 truncate xs:overflow-visible xs:whitespace-normal">
                  <router-link class="flex items-center gap-1 truncate font-bold custom-underline text-gray-700"
                    tabindex="0" :to="`/${feed.user.username}`">
                    <p class="truncate">
                      {{ feed.user.name }}
                    </p>
                  </router-link>
                  <div class="flex gap-1">
                    <i>·</i>
                    <div class="group relative">
                      <router-link class="custom-underline peer whitespace-nowrap" :to="`/${feed.hid}`">{{
                        dayjs(feed.updatedAt).fromNow()
                        }}</router-link>
                      <div
                        class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-1 peer-focus:opacity-100 peer-focus-visible:visible peer-focus-visible:delay-200">
                        <span>{{
                          dayjs(feed.updatedAt).fromNow()
                          }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="px-4"></div>
              </div>
              <p class="text-light-secondary order-1 my-2 text-left text-sm">
                Commenting to
                <router-link class="truncate text-light-secondary" tabindex="-1" :to="`/${feed.user.username}`">@{{
                  feed.user.name }}</router-link>
              </p>
              <router-link :to="`/feed/${feed.hid}/`" class="">
                <dynamic-content :content="feed.text.trim()" />
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="py-4 px-4 md:pt-4 md:pb-0 relative">
        <textarea @input="onInput" @keydown="onKeyDown" ref="textareaRef" v-model="text"
          class="w-full min-w-0 resize-none bg-transparent text-md placeholder:text-gray-400 placeholder:font-light placeholder:text-md border-0 border-light-line-reply rounded-md p-0 hover:outline-none hover:border-0 focus:border-transparent focus:ring-0"
          placeholder="What's going on?"></textarea>
        <ul v-if="showDropdown" :style="{ top: dropdownPosition.top + 'px', left: dropdownPosition.left + 'px' }"
          class="absolute bg-white border rounded-md min-w-[150px] min-h-[100px] px-3 py-2 shadow-md divide-y z-50">
          <li class="leading-4 py-1 text-sm" v-for="(item, index) in filteredItems" :key="item.username"
            @click="selectItem(item.username)" :class="{ selected: selectedIndex === index }">
            <div>{{ item.title ? item.title : item.username }}</div><small v-if="item.title"
              class="text-xs text-gray-500">{{
              item.username
              }}</small>
          </li>
        </ul>
        <div v-if="linkPreview" class="relative w-full mx-auto overflow-hidden bg-gray-100 rounded-md shadow ring-1">
          <div class="flex flex-col space-y">
            <a :href="linkPreview.url" target="_blank" class="w-full">
              <img class="object-cover aspect-video" v-lazy="linkPreview.image" :alt="linkPreview.title" />
            </a>
            <div class="flex flex-col p-3 space-y">
              <a :href="linkPreview.url" target="_blank"
                class="m-0 text-md leading-tight text-gray-900 no-underline hover:no-underline hover:text-gray-900 md:text-lg line-clamp-2">{{
                linkPreview.title }}</a>
              <p class="text-sm text-gray-500">{{ getHostname(linkPreview.url) }}</p>
              <p class="text-sm line-clamp-2">
                {{ linkPreview.description }}
              </p>
            </div>
          </div>
        </div>
        <!-- repost -->
        <div v-if="feed && feedType == 2" class="flex flex-col gap-2 z-40 border rounded-md">
          <div class="accent-tab hover-card relative flex flex-col gap-y-4 px-4 py-3 outline-none duration-200">
            <div class="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
              <div class="flex flex-col items-center gap-2">
                <router-link class="blur-picture flex self-start" tabindex="0" :to="`/${feed.user.username}`">
                  <img :alt="feed.user.name" v-lazy="feed.user.avatar" class="rounded-full object-cover w-6 h-6" />
                </router-link><i class="hover-animation h-full w-0.5 bg-gray-200"></i>
              </div>
              <div class="flex min-w-0 flex-col">
                <div class="flex justify-between gap-2 text-light-secondary">
                  <div class="flex gap-1 truncate xs:overflow-visible xs:whitespace-normal">
                    <router-link class="flex items-center gap-1 truncate font-bold custom-underline text-gray-700"
                      tabindex="0" :to="`/${feed.user.username}`">
                      <p class="truncate">
                        {{ feed.user.name }}
                      </p>
                    </router-link>
                    <div class="flex gap-1">
                      <i>·</i>
                      <div class="group relative">
                        <router-link class="custom-underline peer whitespace-nowrap" :to="`/${feed.hid}`">{{
                          dayjs(feed.updatedAt).fromNow()
                          }}</router-link>
                        <div
                          class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-1 peer-focus:opacity-100 peer-focus-visible:visible peer-focus-visible:delay-200">
                          <span>{{
                            dayjs(feed.updatedAt).fromNow()
                            }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <router-link :to="`/feed/${feed.hid}/`" class="">
                  <dynamic-content :content="feed.text.trim()" />

                  <div v-if="feed.link"
                    class="relative w-full mx-auto overflow-hidden bg-gray-100 rounded-md shadow ring-1 my-2">
                    <div class="flex flex-col space-y">
                      <a :href="feed.link.url" target="_blank" class="w-full">
                        <img class="object-cover aspect-video" v-lazy="feed.link.image" :alt="feed.link.title" />
                      </a>
                      <div class="flex flex-col p-3 space-y">
                        <a :href="feed.link.url" target="_blank"
                          class="m-0 text-md leading-tight text-gray-900 no-underline hover:no-underline hover:text-gray-900 line-clamp-1">{{
                          feed.link.title }}</a>
                        <p class="text-gray-500 text-sm">{{ getHostname(feed.link.url) }}</p>
                        <p class="text-sm line-clamp-2">
                          {{ feed.link.description }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div @click="images = feed.images" v-if="feed.images.length > 0" class="grid mt-2 gap-0.5" :class="{
                    'grid-cols-1 grid-rows-1': feed.images.length === 1,
                    'grid-cols-2 grid-rows-1': feed.images.length === 2,
                    'grid-cols-1 grid-rows-2': feed.images.length === 3,
                    'grid-cols-1 grid-rows-2': feed.images.length > 3
                  }">
                    <button v-if="feed.images.length == 4" type="button"
                      class="accent-tab relative transition-shadow row-span-2">
                      <figure
                        class="relative w-full flex items-center justify-center cursor-pointer transition hover:brightness-75 hover:duration-200">
                        <img :alt="''" :ref="'image0'" v-lazy="feed.images[0].image"
                          class="object-cover aspect-square" />
                      </figure>
                      <div class="grid grid-cols-4 gap-2 mt-2">
                        <template :key="index" v-for="(img, index) in feed.images">
                          <img :alt="''" v-lazy="img.image" class="object-cover aspect-square" />
                        </template>
                      </div>
                    </button>
                    <button v-if="feed.images.length > 4" type="button"
                      class="accent-tab relative transition-shadow row-span-2">
                      <figure
                        class="relative w-full flex items-center justify-center cursor-pointer transition hover:brightness-75 hover:duration-200">
                        <img :alt="''" :ref="'image0'" v-lazy="feed.images[0].image"
                          class="object-cover aspect-square" />
                      </figure>
                      <div class="grid grid-cols-4 gap-2 mt-2">
                        <template :key="index" v-for="(img, index) in feed.images.slice(1, 4)">
                          <img :alt="''" v-lazy="img.image" class="object-cover aspect-square" />
                        </template>
                        <div v-if="feed.images.length - 4 > 0"
                          class="flex items-center justify-center text-md object-cover aspect-square bg-gray-300">
                          +{{ feed.images.length - 4 }}
                        </div>
                      </div>
                    </button>

                    <template v-else>
                      <button v-for="(img, index) in feed.images" :key="index" type="button"
                        class="accent-tab relative transition-shadow row-span-2">
                        <figure
                          class="relative w-full cursor-pointer flex items-center justify-center transition hover:brightness-75 hover:duration-200 h-full">
                          <img :id="'image_' + feed.id" crossorigin="anonymous" v-lazy="img.image"
                            class="object-contain aspect-square" />
                        </figure>
                      </button>
                    </template>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>


        <div @click="images = images" v-if="images.length > 0" class="grid rounded-xl gap-0.5" :class="images.length == 2
          ? 'grid-cols-2 grid-rows-2'
          : 'grid-cols-1 grid-rows-1'
          ">
          <button v-if="images.length > 2" type="button" class="accent-tab relative transition-shadow row-span-2"
            :class="'rounded-xl'">
            <figure class="relative w-full cursor-pointer transition hover:brightness-75 hover:duration-200">
              <img :alt="''" v-lazy="images[0].image" :class="'rounded-t-xl'" class="object-cover w-[80px] h-[80px]" />
            </figure>
            <button @click="remove(images[0])"
              class="custom-button main-tab group absolute top-0 left-0 translate-x-1 translate-y-1 bg-accent-red/75 p-1 backdrop-blur-sm hover:bg-image-preview-hover/75"
              type="button">
              <XCircleIcon class="h-5 w-5 text-white" />
              <div
                class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-2">
                <span>Remove</span>
              </div>
            </button>
            <div class="flex items-center">
              <div class="relative" v-for="(img, index) in images.slice(1, 4)">
                <img :alt="''" v-lazy="img.image" :class="'rounded-b-md'"
                  class="object-cover w-[80px] h-[80px] md:w-[120px] md:h-[120px] mr-2 mt-2" /><button
                  @click="remove(img)"
                  class="custom-button main-tab group absolute top-0 left-0 translate-x-1 translate-y-1 bg-accent-red/75 p-1 backdrop-blur-sm hover:bg-image-preview-hover/75"
                  type="button">
                  <XCircleIcon class="h-5 w-5 text-white" />
                  <div
                    class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-2">
                    <span>Remove</span>
                  </div>
                </button>
              </div>
              <div v-if="images.length - 4 > 0"
                class="flex items-center justify-center text-2xl rounded-b-md object-cover w-[80px] h-[80px] md:w-[120px] md:h-[120px] mt-2 bg-gray-300">
                +{{ images.length - 4 }}
              </div>
            </div>
          </button>
          <button v-else v-for="(img, index) in images" type="button"
            class="accent-tab relative transition-shadow row-span-2" :class="images.length == 2
              ? index == 0
                ? 'rounded-l-xl'
                : 'rounded-r-2xl'
              : 'rounded-xl'
              ">
            <figure class="relative w-full cursor-pointer transition hover:brightness-75 hover:duration-200">
              <img :alt="''" v-lazy="img.image" :class="images.length == 2
                ? index == 0
                  ? 'rounded-l-xl'
                  : 'rounded-r-2xl'
                : 'rounded-xl'
                " class="object-cover w-[80px] h-[80px]" />
            </figure>
            <button @click="remove(img)"
              class="custom-button main-tab group absolute top-0 left-0 translate-x-1 translate-y-1 bg-accent-red/75 p-1 backdrop-blur-sm hover:bg-image-preview-hover/75"
              type="button">
              <XCircleIcon class="h-5 w-5 text-white" />

              <div
                class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-2">
                <span>Remove</span>
              </div>
            </button>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between py-0 px-4 md:py-4  font-medium">
        <div class="flex items-center gap-2 text-sm  flex-wrap">
          <input ref="fileInputRef" id="fileInputRef" class="hidden" @change="handleFileUpload" type="file"
            accept="image/*" multiple />
          <button for="image" @click="openFilePicker" type="button"
            class="flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100">
            <PhotoIcon class="h-5 w-5" />
            <span class="hidden md:block">Image</span>
          </button>
          <button for="image" @click="openFilePicker" type="button"
            class="flex items-center gap-1.5 bg-teal-50 text-teal-600 rounded-full py-1 px-2 border-2 border-teal-100">
            <VideoCameraIcon class="h-5 w-5" />
            <span class="hidden md:block">Video</span>
          </button>
          <button type="button"
            class="flex items-center gap-1.5 bg-orange-50 text-orange-600 rounded-full py-1 px-2 border-2 border-orange-100 ">
            <HeartIcon class="h-5 w-5" />
            <span class="hidden md:block">Feeling</span>
          </button>
          <button type="button"
            class="flex items-center gap-1.5 bg-red-50 text-red-600 rounded-full py-1 px-2 border-2 border-rose-100 ">
            <MapPinIcon class="h-5 w-5" />
            <span class="hidden md:block">Check in</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button @click="create()" type="button" :disabled="text.length < 2"
            class="button bg-blue-500 disabled:bg-blue-300 text-white py-2 px-6 text-[14px] rounded-md w-full">
            {{ me ? feed ? feedType == 1 ? "Comment" : "Repost" : "Post" : "Login"}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { debounce, cloneDeep } from "lodash";
import { ref, defineAsyncComponent, watch, onMounted, computed, reactive, nextTick } from "vue";
import { USERS } from "@/gql/user";
import { FEED_HASHTAGS, FEED_HASHTAG_DETAILS_BY_TITLE } from "@/gql/hashtag";
import { FEED_LINK_DETAILS_BY_URL } from "@/gql/link";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useNotificationsStore } from "@/stores/notifications";
import { SELF_FEED_FEED_CREATE } from "@/gql/feed";
import { SELF_FEED_MEMBER_CREATE } from "@/gql/member";
import {
  SELF_FILE_FILE_CREATE,
} from "@/gql/file";
import {
  GlobeAltIcon,
  PhotoIcon,
  XCircleIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  LinkIcon,
  MapPinIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import imageCompression from "browser-image-compression";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import {
  CheckBadgeIcon,
  HeartIcon,
  VideoCameraIcon,
} from "@heroicons/vue/24/outline";
import humps from "humps";
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useMemberStore } from "@/stores/member";
import { useCommunityStore } from "@/stores/community";
import { useFeedStore } from "@/stores/feed";
import { useQuery, useMutation } from "@vue/apollo-composable";
const DynamicContent = defineAsyncComponent(() =>
  import("@/components/community/DynamicContent.vue")
);
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { site, loading, isMobile } = storeToRefs(useSiteStore());
const { community } = storeToRefs(useCommunityStore());
const { member } = storeToRefs(useMemberStore());
const { setMember } = useMemberStore();
const { setLoading } = useSiteStore();
const { feed, isShowCreate, feedType } = storeToRefs(useFeedStore());
const router = useRouter();
const props = defineProps({
  community: {
    type: Object,
    required: false,
  },
  isParentShowCreate: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const fileInputRef = ref(null);
const images = ref([]);
const text = ref("");
const hashtag = ref([]);
const link = ref(null);
const linkId = ref(null);
const remove = (item) => {
  let index = images.value.indexOf(item);
  if (index > -1) {
    images.value.splice(index, 1);
  }
};
const isOpen = ref(feed.value ? true : false);

const emit = defineEmits(["uploaded"]);
const closeModal = () => {
  feed.value = null;
  isOpen.value = false;
  isShowCreate.value = false;
};
const openFilePicker = () => {
  fileInputRef.value.click();
};
const handleFileUpload = async (event) => {
  for (let file of event.target.files) {
    if (file) {
      const options = {
        maxSizeMB: 0.256,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        console.log(`compressedFile size ${compressedFile.size / 1024} KB`); // smaller than maxSizeMB
        let image = await fileUpload(
          "png",
          compressedFile.name,
          compressedFile,
          compressedFile.size
        );
        images.value.push(image);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
// end query
const create = async () => {
  if (me.value) {
    if (text.value.length > 0 || images.value.length > 0) {
      setLoading(true);
      const { mutate, loading, error } = useMutation(SELF_FEED_FEED_CREATE, {
        variables: {
          userId: me.value.id,
          communityId: props.community
            ? props.community.id
            : community.value
              ? community.value.id
              : null,
          feedType: feedType.value,
          hashtag: hashtag.value,
          link: link.value,
          linkId: linkId.value,
          parentId: feed.value ? feed.value.id : null,
          images: images.value,
          text: text.value,
        },
      });
      try {
        const response = await mutate();
        if (response.data.selfFeedFeedCreate) {
          text.value = "";
          images.value = [];
          link.value = null;
          linkId.value = null;
          hashtag.value = [];
          linkPreview.value = null;
          feedType.value = 1;

          textareaRef.value.style.height = '60px';
          // router.go(0);
        }
        closeModal();
        setLoading(false);
        emit("uploaded");
      } catch (error) {
        addNotification(
          { title: "Feed info", subTitle: error.message },
          "error"
        );
        setLoading(false);
      }
    } else {
      addNotification(
        { title: "Feed info", subTitle: "Post can not be empthy" },
        "error"
      );
    }
  } else {
    closeModal();
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
};
const toggleAction = () => {
  if (site.value.siteType == "store") {
    router.push(`/checkout/`);
  } else {
    join();
  }
};

const join = async () => {
  if (me.value && community.value) {
    const { mutate, loading, error } = useMutation(SELF_FEED_MEMBER_CREATE, {
      variables: {
        userId: me.value.id,
        communityId: community.value.id,
        avatar: me.value.avatar,
        isActive: true,
        isVerified: false,
        score: 0.0,
        title: me.value.name,
        username: me.value.username,
      },
    });
    try {
      const response = await mutate();
      let m = response.data.selfFeedMemberCreate;
      setMember({
        userId: m.userId,
        communityId: community.value.id,
        avatar: m.avatar,
        isActive: m.isActive,
        isVerified: m.isVerified,
        score: 0.0,
        title: m.title,
        username: m.username,
      });
    } catch (error) {
      addNotification({ title: "Feed info", subTitle: error.message }, "error");
    }
  } else {
    closeModal();
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
};
const fileUpload = async (mimeType, title, file, size) => {
  if (me.value) {
    const { mutate, loading, error } = useMutation(SELF_FILE_FILE_CREATE, {
      variables: {
        userId: me.value.id,
        mimeType: mimeType,
        file: file,
        size: size,
        title: title,
        url: "",
      },
    });
    try {
      const response = await mutate();
      if (response.data.selfFileFileCreate) {
        return {
          id: response.data.selfFileFileCreate.id,
          image: response.data.selfFileFileCreate.url,
        };
      }
    } catch (error) {
      addNotification(
        { title: "Product info", subTitle: error.message },
        "error"
      );
      return "";
    }
  } else {
    closeModal();
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
};
const textareaRef = ref(null);
const showDropdown = ref(false);
const filteredItems = ref([]);
const selectedIndex = ref(0);
const queryType = ref('');

const mentionQuery = ref('');
const hashtagQuery = ref('');
const urlQuery = ref('');
const linkPreview = ref(null);

const dropdownPosition = reactive({ top: 0, left: 0 });
const onInput = async (event) => {
  if (me.value == null) {
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
  const cursorPos = event.target.selectionStart;
  const textBeforeCursor = text.value.slice(0, cursorPos);

  const mentionStart = textBeforeCursor.lastIndexOf('@');
  const hashtagStart = textBeforeCursor.lastIndexOf('#');
  const urlStart = textBeforeCursor.lastIndexOf('http');

  if (mentionStart !== -1 && (hashtagStart === -1 || mentionStart > hashtagStart) && (urlStart === -1 || mentionStart > urlStart)) {
    mentionQuery.value = textBeforeCursor.slice(mentionStart + 1);
    hashtagQuery.value = '';
    urlQuery.value = '';
  } else if (hashtagStart !== -1 && (mentionStart === -1 || hashtagStart > mentionStart) && (urlStart === -1 || hashtagStart > urlStart)) {
    hashtagQuery.value = textBeforeCursor.slice(hashtagStart + 1);
    mentionQuery.value = '';
    urlQuery.value = '';
  } else if (urlStart !== -1 && (mentionStart === -1 || urlStart > mentionStart) && (hashtagStart === -1 || urlStart > hashtagStart)) {
    urlQuery.value = textBeforeCursor.slice(urlStart);
    mentionQuery.value = '';
    hashtagQuery.value = '';
  } else {
    showDropdown.value = false;
  }

  await nextTick();
  setDropdownPosition();

  textareaRef.value.style.height = '60px';
  textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
};

const onKeyDown = (event) => {
  if (showDropdown.value) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex.value = (selectedIndex.value + 1) % filteredItems.value.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex.value = (selectedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectItem(filteredItems.value[selectedIndex.value].username);
    } else if (event.key === ' ') {
      showDropdown.value = false;
    }
  }
};

const selectItem = (item) => {
  const cursorPos = textareaRef.value.selectionStart;
  const textBeforeCursor = text.value.slice(0, cursorPos);

  if (queryType.value === 'mention') {
    const mentionStart = textBeforeCursor.lastIndexOf('@');
    text.value = `${textBeforeCursor.slice(0, mentionStart)}@${item} ${text.value.slice(cursorPos)}`;
  } else if (queryType.value === 'hashtag') {
    const hashtagStart = textBeforeCursor.lastIndexOf('#');
    text.value = `${textBeforeCursor.slice(0, hashtagStart)}#${item} ${text.value.slice(cursorPos)}`;
  }

  showDropdown.value = false;
  textareaRef.value.focus();
};

const setDropdownPosition = () => {
  const textarea = textareaRef.value;
  const cursorPos = textarea.selectionStart;
  const textBeforeCursor = text.value.slice(0, cursorPos);
  const dummy = document.createElement('div');
  const span = document.createElement('span');

  const style = window.getComputedStyle(textarea);

  dummy.style.position = 'absolute';
  dummy.style.whiteSpace = 'pre-wrap';
  dummy.style.visibility = 'hidden';
  dummy.style.font = style.font;
  dummy.style.lineHeight = style.lineHeight;
  dummy.style.padding = style.padding;
  dummy.style.width = `${textarea.offsetWidth}px`;
  dummy.style.top = `${textarea.offsetTop}px`;
  dummy.style.left = `${textarea.offsetLeft}px`;
  dummy.style.border = style.border;
  dummy.style.overflow = 'auto';

  dummy.textContent = textBeforeCursor;
  document.body.appendChild(dummy);

  span.textContent = text.value.slice(cursorPos) || '.';
  dummy.appendChild(span);

  dropdownPosition.top = dummy.offsetTop + span.offsetTop + span.offsetHeight;
  dropdownPosition.left = dummy.offsetLeft + span.offsetLeft;

  document.body.removeChild(dummy);
};

const debounceFetchMentions = debounce((newQuery) => {
  if (/\s/.test(newQuery)) return;
  queryType.value = 'mention';
  const { onResult } = useQuery(USERS, {
    search: newQuery,
    first: 5,
    after: null,
  });
  onResult((query) => {
    filteredItems.value = query.data.users.edges.map((item) => ({ title: item.node.name, username: item.node.username }));
    showDropdown.value = filteredItems.value.length > 0;
  });
}, 1000);

const debounceFetchHashtags = debounce((newQuery) => {
  if (/\s/.test(newQuery)) return;
  queryType.value = 'hashtag';
  const { onResult } = useQuery(FEED_HASHTAGS, {
    search: newQuery,
    first: 5,
    after: null,
  });
  onResult((query) => {
    filteredItems.value = query.data.feedHashtags.edges.map((item) => ({ title: null, username: item.node.title }));
    showDropdown.value = filteredItems.value.length > 0;
  });
}, 1000);

const debounceFetchUrlPreview = debounce((url) => {
  if (/\s/.test(url)) return;
  queryType.value = 'url';
  const { onResult } = useQuery(FEED_LINK_DETAILS_BY_URL, {
    url: url,
  });
  onResult((query) => {
    var preview = cloneDeep(query.data.feedLinkByUrl);
    linkPreview.value = query.data.feedLinkByUrl;
    preview.image = preview.image.replace('https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/', '');
    link.value = humps.decamelizeKeys(preview);
    linkId.value = preview.id;
  });
}, 1000);

watch(mentionQuery, (newQuery) => {
  if (newQuery) {
    debounceFetchMentions(newQuery);
  } else {
    queryType.value = '';
    showDropdown.value = false;
  }
});

watch(hashtagQuery, (newQuery) => {
  if (newQuery) {
    debounceFetchHashtags(newQuery);
  } else {
    queryType.value = '';
    showDropdown.value = false;
  }
});

watch(urlQuery, (newQuery) => {
  if (newQuery) {
    debounceFetchUrlPreview(newQuery);
  } else {
    linkPreview.value = null;
  }
});

const getHostname = (url) => {
  return new URL(url).hostname;
}
</script>
