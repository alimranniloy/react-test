<template>
  <main>
    <Hero />
    <!-- <div
      class="bg-gradient-to-br from-gray-900 to-slate-900 w-full p-4 sm:p-24 flex items-center justify-center font-sans"
    >
      <div
        class="relative group w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl shadow-black/40 transition-all duration-300 hover:shadow-teal-500/20 hover:border-white/20"
      >
        <div
          class="relative flex flex-col md:flex-row overflow-hidden rounded-xl"
        >
          <div class="w-full md:w-2/3 p-6 sm:p-8 flex flex-col justify-center">
            <div class="mb-4">
              <span
                class="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg"
              >
                বিশেষ অফার
              </span>
            </div>
            <h2
              class="text-3xl sm:text-4xl font-extrabold text-white leading-tight"
            >
              ওয়্যারহাউজ ব্যবহারে <br class="hidden sm:block" />
              <span class="text-teal-400">ওয়েবসাইট একদম ফ্রি!</span>
            </h2>
            <p class="mt-3 text-base sm:text-lg text-gray-300">
              আমাদের আধুনিক ওয়্যারহাউজ সার্ভিস ব্যবহার করুন এবং প্রতি মাসে পান
              ২০০ অর্ডার লিমিটের একটি শক্তিশালী ই-কমার্স ওয়েবসাইট সম্পূর্ণ
              বিনামূল্যে।
            </p>
            <ul class="mt-5 space-y-3 text-gray-200">
              <li class="flex items-center">
                <svg
                  class="h-5 w-5 text-teal-400 flex-shrink-0 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>ঝামেলাহীন ইনভেন্টরি ম্যানেজমেন্ট</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="h-5 w-5 text-teal-400 flex-shrink-0 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>দ্রুত ডেলিভারি ও প্যাকেজিং-এর সুবিধা</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="h-5 w-5 text-teal-400 flex-shrink-0 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>প্রফেশনাল ই-কমার্স ওয়েবসাইট</span>
              </li>
            </ul>
            <span
              class="block mt-4 text-sm text-gray-400 transition-colors duration-300"
            >
              ওয়্যারহাউজ সম্পর্কে বিস্তারিত জানতে এখানে
              <a
                href="/offer-pricing"
                class="text-teal-500 hover:text-teal-400 underline"
                >ক্লিক</a
              >
              করুন
            </span>
          </div>

          <div class="relative w-full md:w-px">
            <div
              class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-8 h-8 bg-gradient-to-br from-gray-900 to-slate-800 rounded-full border border-white/10"
            ></div>
            <div
              class="hidden md:block absolute top-5 left-1/2 -translate-x-1/2 h-full border-l-2 border-dashed border-white/10"
            ></div>
            <div
              class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-8 h-8 bg-gradient-to-br from-gray-900 to-slate-800 rounded-full border border-white/10"
            ></div>
          </div>

          <div
            class="w-full md:w-1/3 p-6 sm:p-8 flex flex-col items-center justify-center bg-black/20"
          >
            <div class="text-center">
              <div
                class="w-24 h-24 mx-auto text-teal-400 mb-4 transition-transform duration-300 group-hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-full h-full"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15.75h.008v.008H12v-.008zM12 2.25c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white">
                আপনার ব্যবসার নতুন দিগন্ত
              </h3>

              <div class="mt-6">
                <p class="text-2xl font-bold text-amber-400 animate-pulse">
                  শীঘ্রই আসছে...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <Features />
    <!-- <StatsCounter /> -->
    <!-- <ThemesList /> -->
    <Details />
    <!-- <OurClients /> -->
    <!-- <Faq /> -->
    <div v-if="showGallery">
      <!-- <OurWings /> -->
    </div>
    <Services />
    <!-- <section
           class="bg-gradient-to-br from-gray-900 to-slate-900 w-full p-4 sm:p-24 flex items-center justify-center font-sans"
         >
           <router-link
             to="/google-play-console"
             class="relative group w-full max-w-5xl bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl shadow-black/40 transition-all duration-300 hover:shadow-green-500/20 hover:border-white/20"
           >
             <div
               class="relative flex flex-col md:flex-row overflow-hidden rounded-xl"
             >
               <div class="w-full md:w-2/3 p-6 sm:p-8 flex flex-col justify-center">
                 <div class="mb-4">
                   <span
                     class="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-lg"
                   >
                     গুগল প্লে কনসোল ক্রয়
                   </span>
                 </div>
                 <h2
                   class="text-3xl sm:text-4xl font-extrabold text-white leading-normal"
                 >
                   আপনার Google Play Console <br class="hidden sm:block" />
                   <span class="text-green-400">সর্বোচ্চ মূল্যে বিক্রি করুন</span>
                 </h2>
     
                 <p class="mt-3 text-base sm:text-lg text-gray-300">
                   আপনার গুগল প্লে কনসোল একাউন্ট আমাদের কাছে বিক্রি করুন সহজে ও
                   দ্রুত। আমরা প্রতিটি একাউন্ট যাচাই করি এবং
                   <strong>তাৎক্ষণিক পেমেন্ট</strong> প্রদান করি।
                 </p>
     
                 <ul class="mt-5 space-y-3 text-gray-200">
                   <li class="flex items-center">
                     <svg
                       class="h-5 w-5 text-green-400 flex-shrink-0 mr-3"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                     >
                       <path
                         stroke-linecap="round"
                         stroke-linejoin="round"
                         stroke-width="2"
                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                       />
                     </svg>
                     <span>১০০% নিরাপদ এবং বিশ্বস্ত ক্রেতা</span>
                   </li>
                   <li class="flex items-center">
                     <svg
                       class="h-5 w-5 text-green-400 flex-shrink-0 mr-3"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                     >
                       <path
                         stroke-linecap="round"
                         stroke-linejoin="round"
                         stroke-width="2"
                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                       />
                     </svg>
                     <span>লাইভ যাচাই – স্ক্রিনশেয়ার/ছবি দিয়ে প্রমাণ</span>
                   </li>
                   <li class="flex items-center">
                     <svg
                       class="h-5 w-5 text-green-400 flex-shrink-0 mr-3"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                     >
                       <path
                         stroke-linecap="round"
                         stroke-linejoin="round"
                         stroke-width="2"
                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                       />
                     </svg>
                     <span>তাৎক্ষণিক পেমেন্ট – কোনো ঝামেলা নয়</span>
                   </li>
                 </ul>
     
                 <span
                   class="block mt-4 text-sm text-gray-400 hover:text-green-400 hover:underline transition-colors duration-300"
                 >
                   আপনার একাউন্ট বিক্রি করতে চান?
                   <a
                     href="https://wa.me/+919836941943"
                     target="_blank"
                     class="text-green-500 underline"
                     >এখানে যোগাযোগ করুন</a
                   >
                 </span>
               </div>
     
               <div class="relative w-full md:w-px">
                 <div
                   class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-8 h-8 bg-gradient-to-br from-gray-900 to-slate-800 rounded-full border border-white/10"
                 ></div>
                 <div
                   class="hidden md:block absolute top-5 left-1/2 -translate-x-1/2 h-full border-l-2 border-dashed border-white/10"
                 ></div>
                 <div
                   class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-8 h-8 bg-gradient-to-br from-gray-900 to-slate-800 rounded-full border border-white/10"
                 ></div>
               </div>
     
               <div
                 class="w-full md:w-1/3 p-6 sm:p-8 flex flex-col items-center justify-center bg-black/20"
               >
                 <div class="text-center">
                   <img
                     src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/b6dc0d00-2e5d-4671-8b89-ba469641b63e.jpeg"
                     alt="Play Console Verification"
                     class="w-full h-64 object-cover object-top rounded-lg shadow-md shadow-black/40 transition-transform duration-300 group-hover:scale-105"
                   />
                   <h3 class="text-xl font-bold text-white mt-4">
                     রিয়েল-টাইম ডকুমেন্ট যাচাই
                   </h3>
     
                   <p class="text-gray-300 mt-2 mb-6 text-sm">
                     আমরা সব ডকুমেন্ট যাচাই করি এবং স্ক্রিনশেয়ার/ছবি দিয়ে আপনাকে
                     আশ্বস্ত করি।
                   </p>
                   <a
                     href="/google-play-console"
                     class="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                   >
                     বিস্তারিত জানুন
                   </a>
                 </div>
               </div>
             </div>
           </router-link>
         </section> -->

    <section
      class="relative bg-gradient-to-br from-gray-900 to-slate-950 text-white overflow-hidden font-sans"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
      ></div>
      <div
        class="absolute -top-10 -left-10 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"
      ></div>
      <div
        class="absolute -bottom-10 -right-10 w-96 h-96 bg-amber-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"
      ></div>

      <div
        class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 py-20 lg:py-24"
      >
        <div class="grid lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-5 space-y-4">
            <p class="text-sm uppercase tracking-[0.2em] text-amber-400">
              Visit us
            </p>
            <h2 class="text-3xl md:text-4xl font-extrabold leading-tight">
              See our office on the map
            </h2>
            <p class="text-gray-300 leading-relaxed">
              Subhash Sadan, Champadali More, 22, Jessore Rd,<br />
              Champadali, Barasat, Kolkata,<br />
              West Bengal 700124, India
            </p>
            <div class="flex flex-wrap gap-3">
              <a
                class="inline-flex items-center px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
                href="https://www.google.com/maps?q=Subhash%20Sadan%2C%20Champadali%20More%2C%2022%2C%20Jessore%20Rd%2C%20Champadali%2C%20Barasat%2C%20Kolkata%2C%20West%20Bengal%20700124%2C%20India"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
              <a
                class="inline-flex items-center px-4 py-2 rounded-lg border border-white/10 text-gray-200 hover:border-amber-400 hover:text-amber-300 transition"
                href="tel:+919836941943"
              >
                Call now
              </a>
            </div>
          </div>
          <div class="lg:col-span-7">
            <div class="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <iframe
                class="absolute inset-0 w-full h-full"
                src="https://www.google.com/maps?q=Subhash%20Sadan%2C%20Champadali%20More%2C%2022%2C%20Jessore%20Rd%2C%20Champadali%2C%20Barasat%2C%20Kolkata%2C%20West%20Bengal%20700124%2C%20India&output=embed"
                style="border: 0"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Optimum Soft office map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- <SubmitTicket /> -->
  </main>
</template>

<script setup>
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import Portfolio from "./Portfolio.vue";
import Services from "./Services.vue";
dayjs.extend(duration);
const Features = defineAsyncComponent(() =>
  import("@/components/Features.vue")
);
const Faq = defineAsyncComponent(() => import("@/components/Faq.vue"));
const Hero = defineAsyncComponent(() => import("@/components/Hero.vue"));

const Details = defineAsyncComponent(() => import("@/components/Details.vue"));

const ThemesList = defineAsyncComponent(() =>
  import("@/components/ThemesList.vue")
);
const scrollPosition = ref(0);
const navbarVisible = ref(false);
const handleScroll = () => {
  scrollPosition.value = window.scrollY;
};

watch(scrollPosition, (newScrollPosition) => {
  if (newScrollPosition < 240) {
    navbarVisible.value = false;
  } else {
    navbarVisible.value = true;
  }
});

const now = ref(new Date());
const getNow = () => {
  now.value = dayjs().toISOString();
};
onMounted(() => {
  setInterval(getNow, 1000);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
const showGallery = ref(false);

onMounted(() => {
  // After 200ms, show the gallery. You can change this delay.
  setTimeout(() => {
    showGallery.value = true;
  }, 2000);
});
</script>
