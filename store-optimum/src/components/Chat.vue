<template>
  <div class="fixed bottom-14 right-3 md:bottom-5 md:right-5 z-40">
    <!-- Chat Options (Messenger, WhatsApp, Call) -->
    <div v-if="isOpen" class="flex flex-col items-end mb-2 space-y-2">
      <!-- Call Icon -->
      <button
        v-if="site?.phone"
        @click="redirectTo('call')"
        class="p-2 bg-white shadow-[0px_1px_4px_rgba(0_0_0/0.17)] rounded-full transition-all"
        aria-label="Call"
      >
        <img
          class="h-6 lg:h-8"
          src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/c7921534-be11-4b72-9ffe-7dcad8e53601.jpg"
          alt="contact"
        />
      </button>
      <!-- WhatsApp Icon -->
      <button
        @click="redirectTo('whatsapp')"
        class="p-2 bg-white shadow-[0px_1px_4px_rgba(0_0_0/0.17)] rounded-full transition-all"
        aria-label="WhatsApp"
      >
        <img
          class="h-6 lg:h-8"
          src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/f06bb84d-38aa-4039-a63d-4d6d8c658ecb.jpg"
          alt="whatsapp"
        />
      </button>
      <!-- Messenger Icon -->
      <!-- <button
        v-if="site.social?.facebook"
        @click="redirectTo('messenger')"
        class="p-2 bg-white shadow-[0px_1px_4px_rgba(0_0_0/0.17)] rounded-full transition-all"
        aria-label="Messenger"
      >
        <img
          class="h-6 lg:h-8"
          src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/3e23952b-62a7-4745-ba33-0467a8601f92.jpg"
          alt="messenger"
        />
      </button> -->
    </div>
    <!-- Chat Icon / Cross Icon -->
    <button
      @click="toggleChat"
      class="p-2 bg-black text-white rounded-full transition-all cursor-default lg:cursor-pointer"
      aria-label="toggle chat"
    >
      <span v-if="!isOpen">
        <ChatBubbleOvalLeftEllipsisIcon
          class="w-[23px] h-[23px] lg:w-8 lg:h-8 text-white"
        />
      </span>
      <span v-else>
        <XMarkIcon class="w-[23px] h-[23px] lg:w-8 lg:h-8 text-white" />
      </span>
    </button>
  </div>
</template>
<script setup>
import {
  ChatBubbleOvalLeftEllipsisIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
const { site } = storeToRefs(useSiteStore());
const isOpen = ref(false);
// Toggle chat options visibility
const toggleChat = () => {
  isOpen.value = !isOpen.value;
};
// Redirect based on icon clicked
const redirectTo = (type) => {
  if (type === "messenger") {
    window.open(
      `https://m.me/${site.value.social?.facebook.replace(
        "https://www.facebook.com/",
        ""
      )}`,
      "_blank"
    );
  } else if (type === "whatsapp") {
    window.open(`https://wa.me/+919836941943`, "_blank");
  } else if (type === "call") {
    window.open(`tel:+919836941943`, "_blank");
  }
};
</script>
