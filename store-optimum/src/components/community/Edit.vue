<template>
  <div class="flex flex-col">
    <label
      class="hover-animation grid w-full grid-cols-[auto,1fr] gap-3 px-4 py-3 border-b-2 border-light-border dark:border-dark-border"
      for=":r2:"
      ><router-link
        class="blur-picture flex self-start"
        tabindex="0"
        :to="`/${me ? me.username : 'guest'}`"
        ><img
          :alt="me ? me.name : 'guest'"
          v-lazy="me ? me.avatar : 'guest'"
          class="rounded-full object-cover w-10 h-10"
      /></router-link>
      <div class="flex w-full flex-col gap-4">
        <div class="flex min-h-[48px] w-full flex-col justify-center gap-4">
          <div class="flex flex-col gap-6">
            <!-- <button
              type="button"
              class="custom-button accent-tab accent-bg-tab flex cursor-not-allowed items-center gap-1 self-start border border-light-line-reply py-0 px-3 text-main-accent hover:bg-main-accent/10 active:bg-main-accent/20 dark:border-light-secondary"
            >
              <p class="font-bold">Everyone</p>
              <ChevronDownIcon class="h-4 w-4" />
            </button> -->
            <div class="flex items-center gap-3">
              <textarea
                @input="resize()"
                ref="textareaRef"
                v-model="text"
                class="w-full min-w-0 resize-none bg-transparent text-md placeholder:text-light-secondary placeholder:text-md border-0 border-light-line-reply rounded-md py-0 hover:outline-none hover:border-0 focus:border-transparent focus:ring-0"
                placeholder="What's happening?"
              ></textarea>
            </div>

            <div
              @click="images = images"
              v-if="images.length > 0"
              class="grid rounded-xl mt-2 gap-0.5"
              :class="
                images.length == 2
                  ? 'grid-cols-2 grid-rows-2'
                  : 'grid-cols-1 grid-rows-1'
              "
            >
              <button
                v-if="images.length > 2"
                type="button"
                class="accent-tab relative transition-shadow row-span-2"
                :class="'rounded-xl'"
              >
                <figure
                  class="relative w-full cursor-pointer transition hover:brightness-75 hover:duration-200"
                >
                  <img
                    :alt="''"
                    v-lazy="images[0].image"
                    :class="'rounded-t-xl'"
                    class="object-cover w-full"
                  />
                </figure>
                <button
                  @click="remove(images[0])"
                  class="custom-button main-tab group absolute top-0 left-0 translate-x-1 translate-y-1 bg-accent-red/75 p-1 backdrop-blur-sm hover:bg-image-preview-hover/75"
                  type="button"
                >
                  <XCircleIcon class="h-5 w-5 text-white" />
                  <div
                    class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-2"
                  >
                    <span>Remove</span>
                  </div>
                </button>
                <div class="flex items-center">
                  <div
                    class="relative"
                    v-for="(img, index) in images.slice(1, 4)"
                  >
                    <img
                      :alt="''"
                      v-lazy="img.image"
                      :class="'rounded-b-md'"
                      class="object-cover w-[80px] h-[80px] md:w-[120px] md:h-[120px] mr-2 mt-2"
                    /><button
                      @click="remove(img)"
                      class="custom-button main-tab group absolute top-0 left-0 translate-x-1 translate-y-1 bg-accent-red/75 p-1 backdrop-blur-sm hover:bg-image-preview-hover/75"
                      type="button"
                    >
                      <XCircleIcon class="h-5 w-5 text-white" />
                      <div
                        class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-2"
                      >
                        <span>Remove</span>
                      </div>
                    </button>
                  </div>
                  <div
                    v-if="images.length - 4 > 0"
                    class="flex items-center justify-center text-2xl rounded-b-md object-cover w-[80px] h-[80px] md:w-[120px] md:h-[120px] mt-2 bg-gray-300"
                  >
                    +{{ images.length - 4 }}
                  </div>
                </div>
              </button>
              <button
                v-else
                v-for="(img, index) in images"
                type="button"
                class="accent-tab relative transition-shadow row-span-2"
                :class="
                  images.length == 2
                    ? index == 0
                      ? 'rounded-l-xl'
                      : 'rounded-r-2xl'
                    : 'rounded-xl'
                "
              >
                <figure
                  class="relative w-full cursor-pointer transition hover:brightness-75 hover:duration-200"
                >
                  <img
                    :alt="''"
                    v-lazy="img.image"
                    :class="
                      images.length == 2
                        ? index == 0
                          ? 'rounded-l-xl'
                          : 'rounded-r-2xl'
                        : 'rounded-xl'
                    "
                    class="object-cover w-full"
                  />
                </figure>
                <button
                  @click="remove(img)"
                  class="custom-button main-tab group absolute top-0 left-0 translate-x-1 translate-y-1 bg-accent-red/75 p-1 backdrop-blur-sm hover:bg-image-preview-hover/75"
                  type="button"
                >
                  <XCircleIcon class="h-5 w-5 text-white" />

                  <div
                    class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-2"
                  >
                    <span>Remove</span>
                  </div>
                </button>
              </button>
            </div>
          </div>
          <!-- <div
            class="flex border-b border-light-border pb-2 dark:border-dark-border"
            style="opacity: 1; transform: none"
          >
            <button
              type="button"
              class="custom-button accent-tab accent-bg-tab flex cursor-not-allowed items-center gap-1 py-0 px-3 text-main-accent hover:bg-main-accent/10 active:bg-main-accent/20"
            >
              <GlobeAltIcon class="h-4 w-4" />

              <p class="font-bold">Everyone can reply</p>
            </button>
          </div> -->
        </div>
        <div class="flex justify-between" style="opacity: 1">
          <div
            class="flex text-main-accent xs:[&amp;>button:nth-child(n+6)]:hidden md:[&amp;>button]:!block [&amp;>button:nth-child(n+4)]:hidden"
          >
            <input
              ref="fileInputRef"
              id="fileInputRef"
              class="hidden"
              @change="handleFileUpload"
              type="file"
              accept="image/*"
              multiple
            /><button
              for="image"
              @click="openFilePicker"
              class="custom-button main-tab accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20"
              type="button"
            >
              <PhotoIcon class="h-5 w-5" />
              <div
                class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
              >
                <span>Media</span>
              </div>
            </button>
            <!-- <button
              class="custom-button main-tab accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20"
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
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                ></path>
              </svg>
              <div
                class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease]  group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
              >
                <span>GIF</span>
              </div></button
            ><button
              class="custom-button main-tab accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20"
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
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                ></path>
              </svg>
              <div
                class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease]  group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
              >
                <span>Poll</span>
              </div></button
            ><button
              class="custom-button main-tab accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20"
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
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                ></path>
              </svg>
              <div
                class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease]  group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
              >
                <span>Emoji</span>
              </div></button
            ><button
              class="custom-button main-tab accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20"
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
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                ></path>
              </svg>
              <div
                class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease]  group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
              >
                <span>Schedule</span>
              </div></button
            ><button
              class="custom-button main-tab accent-tab accent-bg-tab group relative rounded-full p-2 hover:bg-main-accent/10 active:bg-main-accent/20"
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
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                ></path>
              </svg>
              <div
                class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease]  group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
              >
                <span>Location</span>
              </div>
            </button> -->
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-4">
              <button
                class="group relative cursor-pointer outline-none"
                type="button"
              >
                <i
                  class="flex h-5 w-5 -rotate-90 items-center justify-center transition"
                  ><svg
                    class="overflow-visible"
                    width="100%"
                    height="100%"
                    viewBox="0 0 20 20"
                  >
                    <circle
                      class="stroke-light-border dark:stroke-dark-border"
                      cx="50%"
                      cy="50%"
                      fill="none"
                      stroke-width="2"
                      r="9"
                    ></circle>
                    <circle
                      class="transition-colors stroke-main-accent"
                      cx="50%"
                      cy="50%"
                      fill="none"
                      stroke-width="2"
                      r="9"
                      stroke-linecap="round"
                      :style="{
                        strokeDashoffset: 100 - (text.length / 280) * 100,
                        strokeDasharray: (text.length / 280) * 100,
                      }"
                    ></circle></svg></i
                ><span
                  class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] scale-50 text-xs opacity-0"
                  >280</span
                >
                <div
                  class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease] group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
                >
                  <span>{{ 280 - text.length }} characters remaining</span>
                </div></button
              ><i
                class="hidden h-8 w-[1px] bg-[#B9CAD3] dark:bg-[#3E4144] xs:block"
              ></i>
              <!-- <button
                class="custom-button main-tab group relative hidden rounded-full border border-light-line-reply p-[1px] text-main-accent dark:border-light-secondary xs:block"
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
                  class="h-5 w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  ></path>
                </svg>
                <div
                  class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease]  group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
                >
                  <span>Add</span>
                </div>
              </button> -->
            </div>
            <button
              :disabled="loading"
              @click="update"
              class="custom-button main-tab accent-tab bg-main-accent px-4 py-1.5 font-bold text-white enabled:hover:bg-main-accent/90 enabled:active:bg-main-accent/75"
              type="submit"
            >
              {{ me ? "Update" : "Join" }}
            </button>
          </div>
        </div>
      </div></label
    >
  </div>
</template>
<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useNotificationsStore } from "@/stores/notifications";
import { SELF_FEED_FEED_UPDATE } from "@/gql/feed";
import { SELF_FILE_FILE_DELETE, SELF_FILE_FILE_CREATE } from "@/gql/file";
import { PhotoIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import imageCompression from "browser-image-compression";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useMemberStore } from "@/stores/member";
import { useCommunityStore } from "@/stores/community";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { cloneDeep } from "lodash";
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { loading } = storeToRefs(useSiteStore());
const { community } = storeToRefs(useCommunityStore());
const { member } = storeToRefs(useMemberStore());
const { setMember } = useMemberStore();
const { setLoading } = useSiteStore();
const router = useRouter();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const fileInputRef = ref(null);
const images = ref([]);
const text = ref("");
const remove = (item) => {
  let index = images.value.indexOf(item);
  if (index > -1) {
    images.value.splice(index, 1);
  }
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
const update = async () => {
  if (me.value) {
    if (text.value.length > 0 || images.value.length > 0) {
      setLoading(true);
      const { mutate, loading, error } = useMutation(SELF_FEED_FEED_UPDATE, {
        variables: {
          userId: me.value.id,
          id: props.item.id,
          communityId: community.value ? community.value.id : null,
          images: images.value,
          text: text.value,
        },
      });
      try {
        const response = await mutate();
        if (response.data.selfFeedFeedUpdate) {
          text.value = "";
          router.go(0);
        }
        setLoading(false);
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
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
};
const textareaRef = ref(null);
const resize = () => {
  textareaRef.value.style.height = "60px";
  textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
};
onMounted(() => {
  text.value = cloneDeep(props.item.text);
  images.value = cloneDeep(props.item.images);
  setTimeout(() => {
    resize();
  }, 100);
});
</script>
