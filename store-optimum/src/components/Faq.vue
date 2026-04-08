<template>
  <div>
    <h1
      class="text-xl sm:text-2xl lg:text-3xl text-black xl:text-4xl font-bold g:mb-10 text-center mb-6 mt-20"
    >
      Frequently Asked Questions
    </h1>
  </div>
  <div class="my-20">
    <div
      class="mx-auto max-w-[1600px] grid grid-cols-1 lg:grid-cols-2 sm:gap-8 gap-4 px-4"
    >
      <div class="grid sm:grid-cols-2 sm:gap-4 gap-2">
        <div
          class="faq-icons w-full h-full min-h-96 bg-amber-600 flex items-center justify-center flex-col rounded-bl-[6rem] sm:text-2xl text-lg sm:px-0 px-2"
        >
          Successfull Clients
          <span class="counting sm:text-4xl text-xl font-bold">12400+</span>
        </div>
        <div class="faq-icons w-full h-full">
          <img
            class="h-full object-cover rounded-tr-[8rem]"
            src="../assets/customer-care.jpg"
            alt="support customer"
          />
        </div>
        <div class="faq-icons w-full h-48 bg-orange-200 col-span-2">
          <img
            class="h-full w-full object-cover"
            src="../assets/support-team.jpg"
            alt="support customer"
          />
        </div>
      </div>
      <div class="mx-auto md:pt-0 pt-4 md:mb-0 space-y-4">
        <div v-for="(item, index) in items" :key="index" class="relative">
          <div
            @click="toggle(index)"
            class="w-full text-left flex items-start gap-4 p-4 relative"
          >
            <p class="font-thin sm:text-2xl text-lg">
              {{ index <= 8 ? "0" : "" }}{{ index + 1 }}
            </p>
            <div class="faq-content flex justify-between">
              <p class="md:text-xl text-base w-[100%]">
                {{ item.title }}
              </p>
              <div
                class="absolute flex items-center justify-center right-0 top-5 p-1 rounded-full transform transition-colors duration-1000"
                :class="index === openIndex ? 'bg-black' : 'bg-slate-100'"
              >
                <ChevronDownIcon
                  class="text-black w-4 h-4 transform transition-transform duration-300"
                  :class="
                    openIndex === index ? 'rotate-180 text-white' : 'text-black'
                  "
                />
              </div>
            </div>
          </div>
          <div
            ref="contentRefs"
            :style="{
              maxHeight:
                openIndex === index ? contentHeights[index] + 'px' : '0px',
            }"
            class="ml-14 overflow-hidden transition-all duration-500 ease-in-out"
          >
            <div class="text-gray-800 sm:text-sm text-xs" ref="innerContent">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";

import { ChevronDownIcon } from "@heroicons/vue/24/outline";

const items = ref([
  {
    title: "আমি কি আমার ই-কমার্স ওয়েবসাইট নিজে পরিচালনা করতে পারব?",
    content:
      "হ্যাঁ। আমরা একটি ইউজার-ফ্রেন্ডলি ড্যাশবোর্ড সরবরাহ করি, যার মাধ্যমে আপনি সহজেই প্রোডাক্ট, অর্ডার, কাস্টমার এবং কনটেন্ট ম্যানেজ করতে পারবেন।",
  },
  {
    title: "চেকআউট প্রক্রিয়াটি কতটা সহজ?",
    content:
      "খুবই সহজ। আমাদের চেকআউট সিস্টেম ইউজার-ফ্রেন্ডলি, যা কাস্টমারদের দ্রুত ও ঝামেলাহীনভাবে অর্ডার সম্পন্ন করতে সহায়তা করে।",
  },
  {
    title: "ওয়েবসাইটের গতি কেমন?",
    content:
      "সুপার ফাস্ট। আমরা ব্যাকএন্ডে RUST এবং ফ্রন্টএন্ডে Vue ব্যবহার করি, যা ওয়েবসাইটকে দ্রুত ও নির্ভরযোগ্য করে তোলে।",
  },
  {
    title: "আমার কাস্টমারদের ডেটা কতটা নিরাপদ?",
    content:
      "সম্পূর্ণ নিরাপদ। আপনার ব্যবসার সকল ডেটা সম্পূর্ণভাবে প্রাইভেট ও নিরাপদ থাকে, যেখানে বাইরের কেউ তো নয়ই, এমনকি আমাদের টিমেরও কোনো অ্যাক্সেস নেই।",
  },
  {
    title: "আমি কি ডিজিটাল পণ্য বিক্রি করতে পারব?",
    content:
      "হ্যাঁ। বিপণি স্টোরের মাধ্যমে আপনি ই-বুক, ভিডিও, কোর্স, সফটওয়্যার, অ্যাপস ও টেমপ্লেটসহ বিভিন্ন ডিজিটাল পণ্য বিক্রি বা ভাড়ার জন্য তালিকাভুক্ত করতে পারবেন।",
  },
  {
    title: "ড্রপ শিপিং সেবা কি পাওয়া যাবে?",
    content:
      "হ্যাঁ। আমরা দ্রুত ও সহজ ড্রপ শিপিং সিস্টেম সরবরাহ করি, যেখানে আপনি পণ্য স্টক না রেখেই সরাসরি গ্রাহকের কাছে পণ্য শিপ করতে পারবেন।",
  },
  {
    title: "মাল্টিভেন্ডর ই-কমার্স সিস্টেম কি আছে?",
    content:
      "হ্যাঁ। আমাদের মাল্টিভেন্ডর সিস্টেমে একাধিক বিক্রেতা তাদের পণ্য সহজে তালিকাভুক্ত করতে এবং অর্ডার পরিচালনা করতে পারবেন, যার ফলে ব্যবসা পরিচালনা আরও সহজ হয়।",
  },
  {
    title: "ডোমেইন এবং হোস্টিং কি আপনারা প্রদান করেন?",
    content:
      "হ্যাঁ। আমরা ডোমেইন রেজিস্ট্রেশন এবং নির্ভরযোগ্য হোস্টিং সেবা সহ সম্পূর্ণ প্যাকেজ সরবরাহ করি।",
  },
  {
    title: "ওয়েবসাইটে কি মাল্টিপল পেমেন্ট মেথড যুক্ত করা যাবে?",
    content:
      "হ্যাঁ। আপনার চাহিদা অনুযায়ী বিকাশ, নগদ, ব্যাংক, কার্ড এবং অন্যান্য পেমেন্ট গেটওয়ে ইন্টিগ্রেট করা যাবে।",
  },
  {
    title: "ওয়েবসাইটের সিকিউরিটি কেমন হবে?",
    content:
      "আমরা SSL সার্টিফিকেট সহ সর্বাধুনিক সিকিউরিটি স্ট্যান্ডার্ড ব্যবহার করি, যাতে আপনার ও আপনার কাস্টমারদের তথ্য নিরাপদ থাকে।",
  },
]);

// State variables
const openIndex = ref(null); // Tracks the currently open accordion
const contentRefs = ref([]); // Refs for content divs
const contentHeights = ref([]); // Heights of each accordion content

// Toggle accordion open/close
const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};
toggle(0);
// Measure heights of accordion content after mounting
onMounted(() => {
  nextTick(() => {
    contentRefs.value = contentRefs.value.slice(0, items.value.length);
    contentHeights.value = contentRefs.value.map((content) => {
      const baseHeight = content.scrollHeight;
      // Check if the screen width is small (e.g., less than 640px)
      const isSmallDisplay = window.innerWidth < 640;
      // Increase height by a percentage or fixed amount if on a small display
      const heightAdjustment = isSmallDisplay ? baseHeight * 1.2 : baseHeight;
      return heightAdjustment;
    });
  });
});
</script>

<style scoped>
/* Optional: Style for rotating arrow */
button span {
  transition: transform 0.3s ease;
}
</style>
