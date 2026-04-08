<template>
  <Popover class="relative" v-slot="{ open }">
    <PopoverButton
      @click="toggleShuffle"
      :class="[
        open ? 'text-gray-900' : 'text-gray-500',
        'flex max-w-xs items-center rounded-full text-sm focus:ring-offset-2',
      ]"
    >
      <span class="sr-only">Open user menu</span>
      <img
        class="h-8 w-8 rounded-full"
        v-lazy="'https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-black.png'"
        alt=""
      />
    </PopoverButton>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel
        class="absolute -right-4 md:right-0 z-10 mt-3 w-screen max-w-md -translate-x-0 transform px-2 sm:px-0 lg:max-w-2xl"
      >
        <div
          class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div
            class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2"
          >
            <a
              v-for="item in shuffledList"
              :key="item.name"
              :href="item.href" target="_blank"
              class="-m-3 flex items-start rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50"
            >
              <div
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white sm:h-10 sm:w-10"
              >
                <img class="h-10 w-10 rounded-full" v-lazy="item.icon" alt="" />
              </div>
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900">
                  {{ item.name }}
                </p>
                <p class="mt-0 text-sm text-gray-500">{{ item.description }}</p>
              </div>
            </a>
          </div>
          <div class="bg-gray-50 p-5 sm:pt-4 sm:px-8">
            <a
              href="mailto:support@bponi.com"
              class="-m-3 flow-root rounded-md p-3 transition duration-150 ease-in-out hover:bg-gray-100"
            >
              <span class="flex items-center">
                <span class="text-base font-medium text-gray-900"
                  >Enterprise</span
                >
                <span
                  class="ml-3 inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium leading-5 text-indigo-800"
                  >New</span
                >
              </span>
              <span class="mt-1 block text-sm text-gray-500"
                >Empower your entire team with even more advanced tools.</span
              >
            </a>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
const solutions = ref([
  {
    name: "Web",
    description: "Create newspaper, blog",
    href: "https://web.bponi.com",
    icon: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-web.png",
  },
  {
    name: "Logistics",
    description: "Streamlined Logistics Solutions",
    href: "https://logistics.bponi.com",
    icon: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-logistics.png",
  },
  {
    name: "Store",
    description: "Your E-commerce Solution",
    href: "https://store.bponi.com",
    icon: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-store.png",
  },
  {
    name: "Ticket",
    description: "Effortless Ticket Management",
    href: "https://ticket.bponi.com",
    icon: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-ticket.png",
  },
  {
    name: "Bponi",
    description: "What's happening now",
    href: "https://www.bponi.com",
    icon: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-black.png",
  },
  {
    name: "Site",
    description: "No Code Website Builder",
    href: "https://site.bponi.com",
    icon: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-site.png",
  },
]);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
const shuffledList = ref(shuffleArray([...solutions.value]));
const toggleShuffle = () => {
  shuffledList.value = shuffleArray([...solutions.value]);
};
onMounted(() => {
  shuffledList.value = shuffleArray([...solutions.value]);
});
</script>
