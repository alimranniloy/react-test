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
              <DialogTitle as="h3" class="flex flex-col gap-3 text-center">
                <h2 class="text-2xl font-bold">Customize your view</h2>
                <p class="text-light-secondary ">
                  These settings affect all the Twitter accounts on this
                  browser.
                </p>
              </DialogTitle>
              <article
                class="hover-animation mx-8 rounded-2xl border border-light-border px-4 py-3 dark:border-dark-border w-full"
              >
                <div class="grid grid-cols-[auto,1fr] gap-3 w-full">
                  <router-link
                    class="blur-picture flex self-start pointer-events-none"
                    tabindex="-1"
                    :to="`/`"
                  >
                    <img
                      :alt="site.title"
                      sizes="100vw"
                      v-lazy="site.favicon"
                      class="rounded-full object-cover"
                  /></router-link>
                  <div>
                    <div class="flex gap-1">
                      <router-link
                        class="flex items-center gap-1 truncate font-bold pointer-events-none"
                        tabindex="-1"
                        :to="`/`"
                        ><p class="truncate">{{ site.title }}</p>
                        <i
                          ><CheckBadgeIcon
                            class="fill-accent-red h-5 w-5"
                          ></CheckBadgeIcon> </i
                      ></router-link>
                      <p class="text-light-secondary ">
                        @{{ site.domain }}
                      </p>
                      <div
                        class="flex gap-1 text-light-secondary "
                      >
                        <i>·</i>
                        <p>26m</p>
                      </div>
                    </div>
                    <p class="sm:whitespace-pre-line sm:break-words">
                      At the heart of {{ site.title }} are short messages called
                      post — just like this one — which can include photos,
                      videos, links, text, hashtags, and mentions like
                      <span class="text-main-accent">@{{ site.domain }}</span
                      >.
                    </p>
                  </div>
                </div>
              </article>
              <div class="flex w-full flex-col gap-1">
                <p
                  class="text-sm font-bold text-light-secondary "
                >
                  Color
                </p>
                <div
                  class="hover-animation grid grid-cols-3 grid-rows-2 justify-items-center gap-3 rounded-2xl bg-main-sidebar-background py-3 xs:grid-cols-6 xs:grid-rows-none"
                >
                  <label
                    class="hover-animation flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:ring bg-accent-red hover:ring-accent-red/10 active:ring-accent-red/20"
                    for="blue"
                    ><input
                      @click="changeColor('29 155 240')"
                      class="peer absolute h-0 w-0 opacity-0"
                      id="blue"
                      type="radio"
                      name="accent"
                      value="blue"
                      tabindex="0" /><i
                      class="text-white peer-checked:inner:opacity-100"
                      ><CheckIcon
                        class="h-6 w-6 opacity-0 transition-opacity duration-200"
                      ></CheckIcon></i></label
                  ><label
                    class="hover-animation flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:ring bg-accent-yellow hover:ring-accent-yellow/10 active:ring-accent-yellow/20"
                    for="yellow"
                    ><input
                      @click="changeColor('255 213 0')"
                      class="peer absolute h-0 w-0 opacity-0"
                      id="yellow"
                      type="radio"
                      name="accent"
                      value="yellow"
                      checked="" /><i
                      class="text-white peer-checked:inner:opacity-100"
                      ><CheckIcon
                        class="h-6 w-6 opacity-0 transition-opacity duration-200"
                      ></CheckIcon></i></label
                  ><label
                    class="hover-animation flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:ring bg-accent-pink hover:ring-accent-pink/10 active:ring-accent-pink/20"
                    for="pink"
                    ><input
                      @click="changeColor('249 25 130')"
                      class="peer absolute h-0 w-0 opacity-0"
                      id="pink"
                      type="radio"
                      name="accent"
                      value="pink" /><i
                      class="text-white peer-checked:inner:opacity-100"
                      ><CheckIcon
                        class="h-6 w-6 opacity-0 transition-opacity duration-200"
                      ></CheckIcon></i></label
                  ><label
                    class="hover-animation flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:ring bg-accent-purple hover:ring-accent-purple/10 active:ring-accent-purple/20"
                    for="purple"
                    ><input
                      @click="changeColor('127 87 255')"
                      class="peer absolute h-0 w-0 opacity-0"
                      id="purple"
                      type="radio"
                      name="accent"
                      value="purple" /><i
                      class="text-white peer-checked:inner:opacity-100"
                      ><CheckIcon
                        class="h-6 w-6 opacity-0 transition-opacity duration-200"
                      ></CheckIcon></i></label
                  ><label
                    class="hover-animation flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:ring bg-accent-orange hover:ring-accent-orange/10 active:ring-accent-orange/20"
                    for="orange"
                    ><input
                      @click="changeColor('255 121 0')"
                      class="peer absolute h-0 w-0 opacity-0"
                      id="orange"
                      type="radio"
                      name="accent"
                      value="orange" /><i
                      class="text-white peer-checked:inner:opacity-100"
                      ><CheckIcon
                        class="h-6 w-6 opacity-0 transition-opacity duration-200"
                      ></CheckIcon></i></label
                  ><label
                    class="hover-animation flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:ring bg-accent-green hover:ring-accent-green/10 active:ring-accent-green/20"
                    for="green"
                    ><input
                      @click="changeColor('0 184 122')"
                      class="peer absolute h-0 w-0 opacity-0"
                      id="green"
                      type="radio"
                      name="accent"
                      value="green" /><i
                      class="text-white peer-checked:inner:opacity-100"
                      ><CheckIcon
                        class="h-6 w-6 opacity-0 transition-opacity duration-200"
                      ></CheckIcon></i
                  ></label>
                </div>
              </div>
              <div class="flex w-full flex-col gap-1">
                <p
                  class="text-sm font-bold text-light-secondary "
                >
                  Background
                </p>
                <div
                  class="hover-animation grid grid-rows-3 gap-3 rounded-2xl bg-main-sidebar-background px-4 py-3 xs:grid-cols-3 xs:grid-rows-none"
                >
                  <label
                    class="flex cursor-pointer items-center gap-2 rounded p-3 font-bold ring-main-accent transition duration-200 [&amp;:has(div>input:checked)]:ring-2 text-black bg-white [&amp;:hover>div]:bg-light-secondary/10 [&amp;:active>div]:bg-light-secondary/20"
                    for="light"
                    ><div
                      class="hover-animation flex h-10 w-10 items-center justify-center rounded-full"
                    >
                      <input
                        class="peer absolute h-0 w-0 opacity-0"
                        id="light"
                        type="radio"
                        name="theme"
                        value="light"
                        checked=""
                      /><i
                        class="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#B9CAD3] text-white transition duration-200 peer-checked:border-transparent peer-checked:bg-main-accent peer-checked:inner:opacity-100 border-[#B9CAD3]"
                      >
                        <CheckIcon
                          class="h-full w-full p-0.5 opacity-0 transition-opacity duration-200"
                        ></CheckIcon>
                      </i>
                    </div>
                    Default</label
                  ><label
                    class="flex cursor-pointer items-center gap-2 rounded p-3 font-bold ring-main-accent transition duration-200 [&amp;:has(div>input:checked)]:ring-2 text-[#F7F9F9] bg-[#15202B] [&amp;:hover>div]:bg-light-secondary/10 [&amp;:active>div]:bg-light-secondary/20"
                    for="dim"
                    ><div
                      class="hover-animation flex h-10 w-10 items-center justify-center rounded-full"
                    >
                      <input
                        class="peer absolute h-0 w-0 opacity-0"
                        id="dim"
                        type="radio"
                        name="theme"
                        value="dim"
                      /><i
                        class="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#B9CAD3] text-white transition duration-200 peer-checked:border-transparent peer-checked:bg-main-accent peer-checked:inner:opacity-100 border-[#5C6E7E]"
                        ><CheckIcon
                          class="h-full w-full p-0.5 opacity-0 transition-opacity duration-200"
                        ></CheckIcon
                      ></i>
                    </div>
                    Dim</label
                  ><label
                    class="flex cursor-pointer items-center gap-2 rounded p-3 font-bold ring-main-accent transition duration-200 [&amp;:has(div>input:checked)]:ring-2 text-dark-primary bg-black [&amp;:hover>div]:bg-dark-primary/10 [&amp;:active>div]:bg-dark-primary/20"
                    for="dark"
                    ><div
                      class="hover-animation flex h-10 w-10 items-center justify-center rounded-full"
                    >
                      <input
                        class="peer absolute h-0 w-0 opacity-0"
                        id="dark"
                        type="radio"
                        name="theme"
                        value="dark"
                      /><i
                        class="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#B9CAD3] text-white transition duration-200 peer-checked:border-transparent peer-checked:bg-main-accent peer-checked:inner:opacity-100 border-[#3E4144]"
                        ><CheckIcon
                          class="h-full w-full p-0.5 opacity-0 transition-opacity duration-200"
                        ></CheckIcon
                      ></i>
                    </div>
                    Lights out</label
                  >
                </div>
              </div>

              <div class="mt-4">
                <button
                  type="button"
                  class="custom-button main-tab bg-main-accent px-4 py-1.5 font-bold text-white hover:bg-main-accent/90 active:bg-main-accent/75"
                  @click="closeModal"
                >
                  Done
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, defineAsyncComponent } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { CheckBadgeIcon, CheckIcon } from "@heroicons/vue/24/outline";
const { site } = storeToRefs(useSiteStore());
const { setColor } = useSiteStore();

const emit = defineEmits(["close"]);
const isOpen = ref(true);

function closeModal() {
  emit("close");
  isOpen.value = false;
}
const root = ref(null);
const changeColor = (color) => {
  root.value = document.documentElement;
  setColor(color);
  let name = "--accent-red";
  if (root.value) {
    root.value.style.setProperty(name, color);
  }
};
</script>
