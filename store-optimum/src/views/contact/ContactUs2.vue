<template>
  <div class="bg-gray-900 pt-20 font-sans leading-normal tracking-normal">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <article
        class="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden"
      >
        <div>
          <img
            class="w-full h-64 sm:h-80 object-cover"
            :src="post.featuredImage"
            alt="Featured image for the blog post"
          />
        </div>

        <div class="p-6 sm:p-8">
          <header class="mb-6">
            <div class="flex items-center mb-4">
              <a
                href="#"
                class="text-yellow-500 dark:text-yellow-400 uppercase font-semibold text-sm tracking-wide hover:underline"
                >{{ post.category }}</a
              >
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              {{ post.title }}
            </h1>
            <div class="flex items-center text-sm text-gray-400">
              <img
                class="w-10 h-10 rounded-full mr-4"
                :src="post.author.avatar"
                alt="Author avatar"
              />
              <div>
                <p class="font-semibold text-gray-200">
                  {{ post.author.name }}
                </p>
                <p>
                  <time :datetime="post.publishedDate">{{
                    post.publishedDate
                  }}</time>
                  <span class="mx-1">&middot;</span>
                  <span>{{ post.readTime }}</span>
                </p>
              </div>
            </div>
          </header>

          <div
            class="prose prose-lg dark:prose-invert max-w-none prose-indigo prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl"
            v-html="post.content"
          ></div>

          <footer
            class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-gray-700 dark:text-gray-300"
                  >পোস্টটি শেয়ার করুন:</span
                >
                <a
                  href="https://www.facebook.com/BponiHQ/"
                  class="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                >
                  <svg
                    class="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// রিসেলার ই-কমার্স নিয়ে বাংলা ব্লগ পোস্টের জন্য মক ডেটা।
// বাস্তব অ্যাপ্লিকেশনে, এই ডেটা এপিআই (API) থেকে আসবে।
const post = ref({
  category: "ই-কমার্স",
  title:
    "আপনার নিজস্ব রিসেলার ব্যবসা তৈরি করুন আমাদের ই-কমার্স SaaS ফিচার দিয়ে",
  author: {
    name: "সফায়েত হোসেন",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  publishedDate: "অক্টোবর ১৬, ২০২৫",
  readTime: "৬ মিনিট পড়া",
  featuredImage:
    "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=1770",
  content: `
    <p class="lead">একটি SaaS (Software as a Service) ই-কমার্স সলিউশন ব্যবহার করে এখন আপনি মাত্র কয়েক মিনিটেই নিজের রিসেলিং ব্যবসা শুরু করতে পারেন। আমাদের রিসেলার ফিচারটি এমনভাবে তৈরি করা হয়েছে যাতে আপনি বা আপনার কাস্টমাররা সহজে পণ্য বিক্রি করতে পারেন — কোনো আলাদা টেকনিক্যাল স্কিল ছাড়াই।</p>

    <h2>রিসেলার ফিচার কীভাবে কাজ করে?</h2>
    <p>আমাদের ই-কমার্স প্ল্যাটফর্মে প্রতিটি দোকান মালিকের জন্য আলাদা রিসেলার সিস্টেম রয়েছে। আপনি চাইলে নির্দিষ্ট পণ্যগুলিকে “রিসেলেবল” হিসেবে মার্ক করতে পারবেন। এরপর যেকোনো ইউজার সেই পণ্যগুলি নিজের রিসেলার স্টোরে যুক্ত করে বিক্রি করতে পারবে, এবং বিক্রির পর নির্ধারিত কমিশন স্বয়ংক্রিয়ভাবে মূল বিক্রেতাকে পাঠানো হবে।</p>

    <h2>রিসেলার ফিচারের মূল সুবিধা</h2>
    <ul>
      <li><strong>অটো কমিশন সিস্টেম:</strong> বিক্রেতা ও রিসেলার উভয়ের আয়ের হিসাব স্বয়ংক্রিয়ভাবে ট্র্যাক ও আপডেট হয়।</li>
      <li><strong>ড্যাশবোর্ডে সব একসাথে:</strong> বিক্রি, কমিশন, রিসেলার পারফরম্যান্স — সব এক জায়গায় দেখা যায়।</li>
      <li><strong>ইজি সেটআপ:</strong> এক ক্লিকেই রিসেলিং অন/অফ করা যায়।</li>
      <li><strong>ব্র্যান্ডেড রিসেলার স্টোর:</strong> প্রত্যেক রিসেলারের জন্য কাস্টম ডোমেইন ও থিম অপশন।</li>
      <li><strong>ড্রপশিপিং ইন্টিগ্রেশন:</strong> প্রোডাক্ট ডেলিভারি ও ইনভেন্টরি ম্যানেজমেন্ট পুরোপুরি অটোমেটেড।</li>
    </ul>

    <blockquote>"আমাদের রিসেলার ফিচারের মাধ্যমে আপনি আপনার প্রোডাক্ট রেঞ্জকে শত শত রিসেলারের মাধ্যমে দেশে-বিদেশে ছড়িয়ে দিতে পারেন।"</blockquote>

    <h2>কেন আমাদের SaaS রিসেলার ফিচার ব্যবহার করবেন?</h2>
    <p><strong>১. স্কেলযোগ্য মডেল:</strong> আপনি একবার পণ্য আপলোড করলেই রিসেলাররা সেটি হাজারো গ্রাহকের কাছে পৌঁছে দিতে পারবে।</p>
    <p><strong>২. ঝুঁকি-মুক্ত আয়:</strong> রিসেলারেরা বিক্রি করলে তবেই কমিশন কাটবে — কোনো অগ্রিম বিনিয়োগের দরকার নেই।</p>
    <p><strong>৩. ব্র্যান্ড এক্সপোজার:</strong> রিসেলারদের নিজস্ব পেজ ও স্টোরের মাধ্যমে আপনার ব্র্যান্ডের দৃশ্যমানতা বৃদ্ধি পায়।</p>
    <p><strong>৪. ইন্টিগ্রেটেড পেমেন্ট ও অর্ডার ট্র্যাকিং:</strong> বিক্রয় থেকে ডেলিভারি পর্যন্ত প্রতিটি ধাপ স্বয়ংক্রিয়ভাবে ট্র্যাক করা যায়।</p>

    <h2>কীভাবে শুরু করবেন?</h2>
    <p><strong>১. সাইন আপ করুন:</strong> আমাদের প্ল্যাটফর্মে একটি ই-কমার্স অ্যাকাউন্ট তৈরি করুন।</p>
    <p><strong>২. রিসেলার ফিচার অ্যাকটিভ করুন:</strong> ড্যাশবোর্ড থেকে “Reseller Feature” অন করে নিন।</p>
    <p><strong>৩. পণ্য আপলোড করুন:</strong> আপনার বিক্রির জন্য পণ্য যুক্ত করুন এবং কমিশন নির্ধারণ করুন।</p>
    <p><strong>৪. রিসেলারদের আমন্ত্রণ জানান:</strong> যেকোনো ইউজার লিঙ্কের মাধ্যমে রিসেলার হিসেবে যুক্ত হতে পারবে।</p>

    <p>এই ফিচারটি ব্যবহার করে আপনি আপনার ব্যবসাকে এক ধাপ এগিয়ে নিতে পারবেন — যেখানে বিক্রি, মার্কেটিং ও ব্র্যান্ডিং সবকিছুই হবে স্মার্টভাবে এবং অটোমেটেড সিস্টেমে।</p>

   
  `,
  authorBio:
    "সফায়েত হোসেন একজন ফুল-স্ট্যাক ডেভেলপার এবং SaaS প্রোডাক্ট ক্রিয়েটর। তিনি ই-কমার্স ব্যবসাগুলোকে অটোমেট করতে এবং রিসেলার মডেল আরও সহজভাবে পরিচালনা করতে সহায়তা করেন।",
});
</script>
