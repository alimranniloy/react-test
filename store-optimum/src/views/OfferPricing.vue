<template>
  <div
    class="bg-gradient-to-br from-gray-900 to-slate-800 text-white font-sans"
  >
    <section
      class="relative pt-32 pb-20 lg:pt-48 lg:pb-28 text-center overflow-hidden"
    >
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-teal-500/10 rounded-full blur-3xl"
      ></div>

      <div class="container mx-auto px-6 relative z-10">
        <span
          class="inline-flex items-center px-4 py-1.5 mb-4 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg"
        >
          আপনার ব্যবসার নতুন দিগন্ত
        </span>
        <h1
          class="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4"
        >
          ওয়্যারহাউজ এবং ওয়েবসাইট <br />
          <span class="text-teal-400">এখন একসাথে!</span>
        </h1>
        <p class="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-8">
          আমাদের আধুনিক ওয়্যারহাউজ সার্ভিস ব্যবহার করে পান একটি শক্তিশালী
          ই-কমার্স ওয়েবসাইট একদম বিনামূল্যে। আপনার প্রোডাক্ট ম্যানেজমেন্ট এবং
          অনলাইন বিক্রয় এখন হবে আরও সহজ।
        </p>
        <button
          class="bg-teal-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transform hover:scale-105"
        >
          শীঘ্রই আসছে...
        </button>
      </div>
    </section>

    <section class="py-16 sm:py-24">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-4">মাত্র ৩টি সহজ ধাপে শুরু করুন</h2>
        <p class="max-w-2xl mx-auto text-gray-400 mb-12">
          আমাদের সাথে যুক্ত হওয়া এবং অফারটি গ্রহণ করা খুবই সহজ।
        </p>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="bg-slate-800/50 p-8 rounded-xl border border-white/10 text-center"
          >
            <div
              class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gray-900 rounded-full border-2 border-teal-400 text-teal-400 font-bold text-2xl"
            >
              1
            </div>
            <h3 class="text-xl font-semibold mb-2">প্ল্যান বেছে নিন</h3>
            <p class="text-gray-400">
              আপনার ব্যবসার প্রয়োজন অনুযায়ী আমাদের যেকোনো ওয়্যারহাউজ প্ল্যান
              বেছে নিন।
            </p>
          </div>
          <div
            class="bg-slate-800/50 p-8 rounded-xl border border-white/10 text-center"
          >
            <div
              class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gray-900 rounded-full border-2 border-teal-400 text-teal-400 font-bold text-2xl"
            >
              2
            </div>
            <h3 class="text-xl font-semibold mb-2">আপনার প্রোডাক্ট পাঠান</h3>
            <p class="text-gray-400">
              আপনার সকল পণ্য আমাদের সুরক্ষিত ওয়্যারহাউজে পাঠিয়ে দিন। বাকিটা আমরা
              দেখব।
            </p>
          </div>
          <div
            class="bg-slate-800/50 p-8 rounded-xl border border-white/10 text-center"
          >
            <div
              class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gray-900 rounded-full border-2 border-teal-400 text-teal-400 font-bold text-2xl"
            >
              3
            </div>
            <h3 class="text-xl font-semibold mb-2">ফ্রি ওয়েবসাইট বুঝে নিন</h3>
            <p class="text-gray-400">
              আপনার ওয়্যারহাউজ প্ল্যান চালু হওয়ার সাথে সাথেই আপনার ফ্রি
              ওয়েবসাইটটি পেয়ে যাবেন।
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-24">
      <div
        class="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center"
      >
        <div>
          <h2 class="text-3xl font-bold mb-8">
            আমাদের বিশ্বমানের ওয়্যারহাউজ সার্ভিসের সুবিধাসমূহ
          </h2>
          <ul class="space-y-6">
            <li
              v-for="feature in warehouseFeatures"
              :key="feature.name"
              class="flex items-start"
            >
              <div
                class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-teal-500/10 text-teal-400 rounded-lg mr-4"
                v-html="feature.icon"
              ></div>
              <div>
                <h3 class="font-semibold text-lg">{{ feature.name }}</h3>
                <p class="text-gray-400">{{ feature.description }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-8">
            বিনামূল্যে যা পাচ্ছেন আপনার নতুন ওয়েবসাইটে
          </h2>
          <ul class="space-y-6">
            <li
              v-for="feature in websiteFeatures"
              :key="feature.name"
              class="flex items-start"
            >
              <div
                class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-yellow-500/10 text-yellow-400 rounded-lg mr-4"
                v-html="feature.icon"
              ></div>
              <div>
                <h3 class="font-semibold text-lg">{{ feature.name }}</h3>
                <p class="text-gray-400">{{ feature.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-24">
      <div class="container mx-auto px-6 max-w-3xl">
        <h2 class="text-3xl font-bold text-center mb-12">
          সাধারণ প্রশ্নাবলী (FAQ)
        </h2>
        <div class="space-y-4">
          <details
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-slate-800/50 p-6 rounded-lg border border-white/10 cursor-pointer"
          >
            <summary
              class="font-semibold text-lg list-none flex justify-between items-center"
            >
              {{ faq.question }}
              <svg
                class="w-5 h-5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p class="mt-4 text-gray-300">
              {{ faq.answer }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- <section class="py-16 sm:py-24">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          আপনার ই-কমার্স ব্যবসাকে পরবর্তী স্তরে নিয়ে যেতে প্রস্তুত?
        </h2>
        <p class="text-gray-400 text-lg mb-8">
          দেরি না করে আজই আমাদের ওয়্যারহাউজ সার্ভিসে যুক্ত হোন।
        </p>
        <button
          class="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold py-4 px-10 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg transform hover:scale-105"
        >
          আজই শুরু করুন
        </button>
      </div>
    </section> -->
  </div>
</template>

<script setup>
const warehouseFeatures = [
  {
    name: "স্বয়ংক্রিয় ইনভেন্টরি ম্যানেজমেন্ট",
    description: "আমাদের সফটওয়্যার স্বয়ংক্রিয়ভাবে আপনার পণ্যের হিসাব রাখবে।",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>',
  },
  {
    name: "নিরাপদ এবং সুরক্ষিত স্টোরেজ",
    description:
      "আপনার সকল পণ্য আমাদের ২৪/৭ নিরাপত্তাবেষ্টিত ওয়্যারহাউজে সুরক্ষিত থাকবে।",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" /></svg>',
  },
  {
    name: "দ্রুত শিপিং এবং ডেলিভারি",
    description:
      "অর্ডার পাওয়ার সাথে সাথেই আমরা দ্রুততম সময়ে প্যাকেজিং ও ডেলিভারি নিশ্চিত করি।",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5-13.5h16.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  },
];

const websiteFeatures = [
  {
    name: "আধুনিক ও রেসপন্সিভ ডিজাইন",
    description:
      "আপনার ওয়েবসাইটটি মোবাইল, ট্যাব এবং ডেস্কটপে সুন্দরভাবে দেখা যাবে।",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>',
  },
  {
    name: "মাসে ২০০ অর্ডার প্রসেসিং",
    description: "বিনামূল্যে ২০০টি পর্যন্ত অর্ডার গ্রহণ ও ম্যানেজ করার সুবিধা।",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>',
  },
  {
    name: "সহজ প্রোডাক্ট ম্যানেজমেন্ট",
    description: "খুব সহজেই নতুন প্রোডাক্ট যোগ, এডিট এবং ডিলিট করতে পারবেন।",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m0 0a15.998 15.998 0 013.388-1.62m-5.043-.025a15.998 15.998 0 00-3.388-1.62m0 0a15.998 15.998 0 01-3.388 1.62m5.043.025a15.998 15.998 0 00-1.622 3.385" /></svg>',
  },
];

const faqs = [
  {
    question: "এই অফারটি কাদের জন্য?",
    answer:
      "এই অফারটি মূলত নতুন এবং মাঝারি আকারের ই-কমার্স ব্যবসায়ীদের জন্য, যারা তাদের ইনভেন্টরি ম্যানেজমেন্ট এবং অনলাইন উপস্থিতি সহজ করতে চান।",
  },
  {
    question: "মাসে ২০০ অর্ডারের বেশি হলে কী হবে?",
    answer:
      "আপনার ব্যবসা ২০০ অর্ডারের সীমা অতিক্রম করলে, আপনি খুব সহজেই আমাদের পরবর্তী ওয়েবসাইট প্ল্যানে আপগ্রেড করতে পারবেন। আপনার কোনো তথ্য হারাবে না।",
  },
  {
    question: "ওয়েবসাইট কি আমি নিজের মতো সাজাতে পারব?",
    answer:
      "হ্যাঁ, আপনাকে একটি ইউজার-ফ্রেন্ডলি অ্যাডমিন প্যানেল দেওয়া হবে, যেখান থেকে আপনি সহজেই আপনার ওয়েবসাইটের লোগো, ব্যানার এবং পণ্যের তথ্য পরিবর্তন করতে পারবেন।",
  },
  {
    question: "ওয়্যারহাউজে পণ্য পাঠাব কীভাবে?",
    answer:
      "আমাদের সাথে সাইন-আপ করার পর, আমাদের টিম আপনার সাথে যোগাযোগ করে পণ্য পিক-আপ বা পাঠানোর সম্পূর্ণ প্রক্রিয়াটি বুঝিয়ে দেবে।",
  },
];
</script>

<style scoped>
/* Optional: For the FAQ accordion animation */
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}
details[open] summary svg {
  transform: rotate(180deg);
}
</style>
