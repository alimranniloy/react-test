<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="hover-animation fixed inset-0 bg-black/40 "
        />
      </TransitionChild>

      <div
        class="fixed inset-0 overflow-y-auto scrollbar-thin p-4 flex items-center justify-center"
      >
        <div
          class="max-w-xl bg-white w-full p-8 rounded-2xl hover-animation"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="flex flex-col items-center gap-6">
              <DialogTitle
                as="h3"
                class="flex items-center justify-between w-full"
              >
                <h2 class="text-md font-bold">Edit profile</h2>

                <div class="ml-auto flex items-center gap-3">
                  <button
                    class="rounded-md border-transparent main-tab dark-bg-tab group relative p-2 hover:bg-red-500/10 active:bg-red-500/20 "
                    type="button"
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
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      ></path>
                    </svg>
                    <div
                      class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease]  group-hover:visible group-hover:opacity-100 group-hover:delay-500 group-focus-visible:visible group-focus-visible:opacity-100 translate-y-3"
                    >
                      <span>Reset</span>
                    </div></button
                  ><button
                    @click="save()"
                    class="rounded-md border-transparent main-tab bg-red-500 py-1 px-4 font-bold text-white focus-visible:bg-red-500/90 enabled:hover:bg-red-500/90 enabled:active:bg-red-500/80 disabled:brightness-75 "
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </DialogTitle>

              <section class="h-full overflow-y-auto scrollbar-thin transition-opacity w-full">
                <div class="group relative h-36 xs:h-44 sm:h-48">
                  <input
                    ref="coverRef"
                    id="coverRef"
                    @change="handleCoverUpload"
                    class="hidden"
                    type="file"
                    accept="image/*"
                  />
                  <img
                    v-lazy="community.cover"
                    class="h-full bg-light-line-reply "
                  />
                  <div
                    class="absolute left-1/2 top-1/2 flex -translate-y-1/2 -translate-x-1/2 gap-4"
                  >
                    <button
                      @click="openCoverPicker"
                      class="rounded-md border-transparent main-tab group/inner relative bg-red-500/60 p-2 hover:bg-image-preview-hover/50 focus-visible:bg-image-preview-hover/50"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        class="hover-animation h-6 w-6 text-dark-primary group-hover:text-white"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                        ></path>
                      </svg>
                      <div
                        class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease]  group-hover/inner:visible group-hover/inner:opacity-100 group-hover/inner:delay-500 group-focus-visible/inner:visible group-focus-visible/inner:opacity-100 group-focus-visible/inner:delay-200 translate-y-3"
                      >
                        <span>Add photo</span>
                      </div>
                    </button>
                  </div>
                </div>
                <div class="relative flex flex-col gap-6 px-4 py-3">
                  <div class="mb-8 xs:mb-12 sm:mb-14">
                    <input
                      ref="avatarRef"
                      id="avatarRef"
                      @change="handleAvatarUpload"
                      class="hidden"
                      type="file"
                      accept="image/*"
                    />
                    <div
                      class="group absolute aspect-square w-24 -translate-y-1/2 overflow-hidden rounded-full xs:w-32 sm:w-36"
                    >
                      <figure
                        class="h-full w-full bg-white inner:!m-1 inner:rounded-full"
                      >
                        <img
                          v-lazy="community.avatar"
                          alt="Bponi Dev"
                          class="rounded-full transition group-hover:brightness-75 duration-200 group-focus-within:brightness-75 object-cover"
                        />
                      </figure>
                      <button
                        @click="openAvatarPicker"
                        class="rounded-md border-transparent main-tab group/inner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/60 p-2 hover:bg-image-preview-hover/50 focus-visible:bg-image-preview-hover/50"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          class="hover-animation h-6 w-6 text-dark-primary group-hover:text-white"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                          ></path>
                        </svg>
                        <div
                          class="invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#666666] px-1 py-0.5 text-xs text-white opacity-0 [transition:visibility_0ms_ease_200ms,opacity_200ms_ease]  group-hover/inner:visible group-hover/inner:opacity-100 group-hover/inner:delay-500 group-focus-visible/inner:visible group-focus-visible/inner:opacity-100 group-focus-visible/inner:delay-200 translate-y-3"
                        >
                          <span>Add photo</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div
                      class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
                    >
                      <label
                        for="title"
                        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >Title</label
                      >
                      <input
                        v-model="community.title"
                        type="text"
                        name="title"
                        id="title"
                        autocomplete="off"
                        class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter title"
                      />
                      <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <ExclamationCircleIcon
                          v-if="community.title.length < 3"
                          class="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                        <CheckCircleIcon
                          v-else
                          class="h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import { SELF_FEED_COMMUNITY_UPDATE } from "@/gql/community";
import { storeToRefs } from "pinia";
// import { cloneDeep } from "lodash";
import { useNotificationsStore } from "@/stores/notifications";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useMeStore } from "@/stores/me";
import { useCommunityStore } from "@/stores/community";
import { CheckBadgeIcon, CheckIcon } from "@heroicons/vue/24/outline";
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { community } = storeToRefs(useCommunityStore());
const emit = defineEmits(["close"]);
const isOpen = ref(true);
const avatar = ref(null);
const avatarRef = ref(null);
const cover = ref(null);
const coverRef = ref(null);
function closeModal() {
  emit("close");
  isOpen.value = false;
}
const openAvatarPicker = () => {
  avatarRef.value.click();
};
const handleAvatarUpload = async (event) => {
  let file = event.target.files[0];
  if (file) {
    avatar.value = file;
    community.value.avatar = URL.createObjectURL(file);
  }
};
const openCoverPicker = () => {
  coverRef.value.click();
};
const handleCoverUpload = async (event) => {
  let file = event.target.files[0];
  if (file) {
    cover.value = file;
    community.value.cover = URL.createObjectURL(file);
  }
};
const save = async () => {
  const { mutate, loading, error } = useMutation(SELF_FEED_COMMUNITY_UPDATE, {
    variables: {
      userId: me.value.id,
      id: community.value.id,
      avatar: avatar.value,
      cover: cover.value,
      title: community.value.title,
      interest: []
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfFeedCommunityUpdate) {
      emit("refresh");
      addNotification(
        { title: "Feed info", subTitle: "User profile saved" },
        "success"
      );
    }
  } catch (error) {
    addNotification({ title: "Feed info", subTitle: error.message }, "error");
  }
};
</script>
