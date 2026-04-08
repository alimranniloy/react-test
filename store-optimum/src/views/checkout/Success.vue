<template>
  <main
    class="min-h-[86vh] grid place-items-center"
  >
    <div
      class="text-center bg-gray-50 max-w-4xl py-16 rounded-lg px-4 mx-auto shadow shadow-gray-200"
    >
      <h2 class="xl:text-3xl text-xl text-[--primary]">
        ধন্যবাদ! আপনার অর্ডারটি সম্পন্ন হয়েছে।
      </h2>
      <h4 class="py-2">
        To Track Your Order, Please
        <router-link to="/user/order/" class="text-[--primary] underline">
          Click Here</router-link
        >
      </h4>
      <div class="max-w-3xl mx-auto">
        <p class="py-4 text-gray-500">
          আমাদের একজন কাস্টমার কেয়ার এক্সিকিউটিভ খুব শীঘ্রই আপনার সাথে যোগাযোগ করে অর্ডারটি কনফার্ম করে নিবে। <router-link to="/" class="text-[--primary] underline underline-offset-2">{{site.title}}</router-link> এ অর্ডার করার জন্য অসংখ্য ধন্যবাদ।
        </p>
      </div>
      <div class="mt-5 flex flex-wrap sm:flex-nowrap justify-center gap-5 md:gap-6 sm:border-l sm:border-transparent max-w-lg mx-auto sm:px-8">
        <router-link
          :to="`/`"
          class="inline-flex items-center justify-center w-full px-6 py-3 text-white transition-all duration-200 border-2 border-[--primary] rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] bg-[--primary] hover:bg-transparent focus:bg-[--primary] hover:text-[--primary] focus:text-white hover:border-[--primary] focus:border-[--primary]"
          >Go back home</router-link
        >
        <router-link
          :to="`/user/order/invoice`"
          class="inline-flex items-center justify-center w-full px-6 py-3 text-[--primary] transition-all duration-200 border-2 border-[--primary] rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] hover:bg-[--primary] focus:bg-[--primary] hover:text-white focus:text-white hover:border-[--primary] focus:border-[--primary]"
          >Check order details</router-link
        >
      </div>
      
    </div>    
  </main>
</template>
<script setup>
import { useSiteStore } from "@/stores/site"
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const { site } = storeToRefs(useSiteStore());
</script>
