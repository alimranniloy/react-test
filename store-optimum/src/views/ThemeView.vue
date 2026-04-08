<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->

    <!-- ==================== -->
    <!-- 1. BEST THEME HIGHLIGHT (Eye-catching centerpiece) -->
    <!-- ==================== -->

    <!-- ==================== -->
    <!-- 2. HIGHLIGHT 2+ THEMES (Featured Duo/Trio) -->
    <!-- ==================== -->

    <ThemeCate />

    <!-- ==================== -->
    <!-- 3. MOST POPULAR THEMES (Bestsellers) -->
    <!-- ==================== -->

    <!-- ==================== -->
    <!-- THEME SHOWCASE CAROUSEL -->
    <!-- ==================== -->

    <!-- <FeatureThemeSlide /> -->

    <!-- Our client  -->
    <!-- <OurClients /> -->

    <!-- ==================== -->
    <!-- PREMIUM FEATURES (Glass Cards) -->
    <!-- ==================== -->

    <!-- <StatsCounter /> -->

    <!-- ==================== -->
    <!-- THEME CUSTOMIZER SHOWCASE -->
    <!-- ==================== -->
    <section
      class="py-20 px-4 bg-gradient-to-br from-[#1a1a1a] to-[#141414] relative overflow-hidden"
    >
      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full opacity-20">
        <div
          class="absolute top-20 left-10 w-32 h-32 rounded-full bg-purple-500 blur-xl"
        ></div>
        <div
          class="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-blue-500 blur-xl"
        ></div>
      </div>

      <div class="container mx-auto relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <div class="lg:w-1/2">
            <span
              class="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-amber-600 font-medium"
            >
              🎨 লাইভ কাস্টমাইজেশন
            </span>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
              আপনার <span class="text-amber-600">স্টাইল</span> আপনার
              <span class="text-amber-600">পছন্দ</span>
            </h2>
            <p class="text-gray-300 text-lg mb-8">
              রিয়েল-টাইম কাস্টমাইজার দিয়ে যেকোনো থিমকে আপনার ব্র্যান্ডের সাথে
              মিলিয়ে নিন। কোন কোডিং জ্ঞান প্রয়োজন নেই - শুধু ক্লিক করুন এবং
              পরিবর্তনগুলি সরাসরি দেখুন।
            </p>

            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-medium text-white">
                    ৫০+ রেডিমেড কালার স্কিম
                  </h3>
                  <p class="text-gray-400 mt-1">
                    এক ক্লিকে সম্পূর্ণ থিমের রঙ পরিবর্তন করুন
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-medium text-white">
                    ফন্ট কাস্টমাইজেশন
                  </h3>
                  <p class="text-gray-400 mt-1">
                    Google Fonts থেকে ৮০০+ ফন্ট চয়েস করুন
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://site.bponi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                class="mt-8 inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-400 text-gray-900 font-bold rounded-lg transition duration-300"
              >
                কাস্টমাইজার এক্সপ্লোর করুন
                <svg
                  class="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </a>
          </div>

          <div class="lg:w-1/2 mt-12 lg:mt-0">
            <div
              class="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <!-- Before/After Comparison -->
              <div class="relative h-96 w-full">
                <!-- Before -->
                <img
                  src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/32091006-9ccb-4479-a14a-e8adbad65a42.png"
                  class="absolute inset-0 w-full h-full object-cover"
                  alt="Default Theme"
                />
                <!-- After (50% width) -->
                <img
                  src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/1df2c576-8d66-49a1-99b6-c52d1d0c71ab.png"
                  class="absolute inset-0 w-full h-full object-cover"
                  style="clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%)"
                  alt="Customized Theme"
                />
                <!-- Slider Handle -->
                <div
                  class="absolute top-0 left-1/2 h-full w-1 bg-white cursor-col-resize"
                  style="transform: translateX(-50%)"
                >
                  <div
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg
                      class="w-5 h-5 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-[#1a1a1a] p-4 flex justify-between items-center">
                <span class="text-sm font-medium text-gray-300"
                  >ডিফল্ট ভিউ</span
                >
                <span class="text-sm font-medium text-amber-600"
                  >কাস্টম ভিউ</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section
      class="py-20 px-4 bg-gradient-to-r from-black to-amber-300 text-white final-cta"
    >
      <div class="container mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          আপনার ওয়েবসাইট ট্রান্সফর্ম করতে প্রস্তুত?
        </h2>
        <p class="text-xl max-w-2xl mx-auto mb-10">
          ৫০,০০০+ সন্তুষ্ট গ্রাহকের সাথে যোগ দিন যারা আমাদের থিম দিয়ে
          দৃষ্টিনন্দন ওয়েবসাইট তৈরি করেছেন।
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <!-- <a href="#bestsellers">
            <button
              class="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition duration-300"
            >
              সব থিম ব্রাউজ করুন
            </button>
          </a> -->
          <router-link to="/pricing">
            <button
              class="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition duration-300"
            >
              আমাদের প্যাকেজ
            </button>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { EyeIcon } from "@heroicons/vue/24/outline";
import { defineAsyncComponent, ref } from "vue";
import StatsCounter from "../components/StatsCounter.vue";
const OurClients = defineAsyncComponent(() =>
  import("../components/OurClients.vue")
);
const FeatureThemeSlide = defineAsyncComponent(() =>
  import("./FeatureThemeSlide.vue")
);

// const StatsCounter = defineAsyncComponent(() =>
//   import("@/components/StatsCounter.vue")
// );
const ThemeCate = defineAsyncComponent(() => import("./ThemeCate.vue"));
const featuredThemes = ref([
  {
    title: "Fabrilife",
    description: "উন্নত ফিচার সহ কর্পোরেট থিম",
    price: 75,
    color: "2563EB",
    accent: "blue",
    badge: "বিজনেস",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/3c68a9f3-acc3-4594-b0e0-e97e47f9a0e0.png",
    link: "https://fabrilife.store.bponi.com/",
  },
  {
    title: "Store tech",
    description:
      "Store tech — আপনার অনলাইন স্টোর লেটেস্ট গ্যাজেট ও স্মার্ট ডিভাইসের জন্য, দ্রুত ডেলিভারি ও সেরা সেবা সহ।",
    price: 45,
    color: "10B981",
    accent: "green",
    badge: "ব্লগিং",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/eedd3a4b-04b9-41a3-a313-2570487af11c.png",
    link: "https://storetech.store.bponi.com/",
  },
  {
    description: "LSM—জমি মাপ, কাগজপত্র, দক্ষতা, সব একসাথে।",

    color: "F59E0B",
    accent: "yellow",
    badge: "LMS",

    title: "LMS",
    code: "lms",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/6400d9d4-b259-40ac-9176-de2ae2c27e94.png",
    link: "https://www.mainamatisurvey.com.bd/",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার, হাইপার-লোকেশন",
    device: "desktop",
  },
]);

const popularThemes = ref([
  {
    title: "Divi Alternative",
    description: "Visual builder with 100+ layouts",
    color: "7C3AED",
    isBestseller: true,
    rating: 4.9,
    reviews: 1243,

    title: "Foodi",
    code: "foodi",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://foodi.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/a902a251-67df-4a10-83eb-6cc3a2b96203.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার",
    device: "mobile",
  },
  {
    description: "Modern theme for creative agencies",
    price: 69,
    color: "EC4899",
    isNew: true,
    rating: 4.7,
    reviews: 456,
    sales: 3200,

    title: "Edge",
    code: "edge",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://edge.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/d2e70897-d7ee-448c-b887-d8cefc7b5fbd.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার, হাইপার-লোকেশন",
    device: "desktop",
  },
  {
    title: "Zero",
    code: "zero",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://zero.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/a6d53c73-4cd5-4142-9ee0-5779f1c56685.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার, হাইপার-লোকেশন",
    device: "desktop",
  },
  {
    description: "Visual builder with 100+ layouts",
    color: "7C3AED",
    isBestseller: true,
    rating: 4.9,
    reviews: 1243,
    sales: 8500,

    title: "Dropy",
    code: "dropy",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://dropy.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/b5090d8c-f332-4afb-a806-35d8e9cc364c.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার, হাইপার-লোকেশন",
    device: "desktop",
  },
  {
    description: "WooCommerce optimized eCommerce theme",
    color: "F97316",
    isBestseller: true,
    rating: 4.9,
    reviews: 1562,
    sales: 9100,

    title: "SPR",
    code: "sprstore",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://bdshopping4.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/9e4a606b-9912-422f-a1d3-2c37ca79ca57.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার",
    device: "mobile",
  },
  {
    title: "Fabri",
    code: "fabri",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://fabrilife.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/3c68a9f3-acc3-4594-b0e0-e97e47f9a0e0.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার",
    device: "mobile",
  },
  {
    title: "Tech",
    code: "tech",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://storetech.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/eedd3a4b-04b9-41a3-a313-2570487af11c.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার",
    device: "mobile",
  },
  {
    title: "Book",
    code: "book",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://boisodai.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/1fd2267b-9541-4428-86fa-26860cd0ca7f.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার, হাইপার-লোকেশন",
    device: "desktop",
  },
  {
    title: "Boi",
    code: "boi",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://boiadda.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/131ec897-b789-448e-8062-35e138ae0214.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার, হাইপার-লোকেশন",
    device: "desktop",
  },
  {
    title: "Bing",
    code: "bing",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://bing.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/14e9eed2-dbfc-4aa4-8ab7-90b778b802d8.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার, হাইপার-লোকেশন",
    device: "desktop",
  },
  {
    title: "Petra",
    code: "petra",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    url: "https://petra.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/37efe0c5-64da-4bad-86d2-e31d299f2807.png",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার",
    device: "mobile",
  },
  {
    title: "LMS",
    code: "lms",
    subTitle: "সরল, পরিষ্কার",
    price: 3000,
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/6400d9d4-b259-40ac-9176-de2ae2c27e94.png",
    url: "https://www.mainamatisurvey.com.bd/",
    tag: "অফিসিয়াল, সব, পেইড",
    collection: "সব, সিঙ্গেল-ভেন্ডর, মাল্টি-ভেন্ডর, রিসেলার, হাইপার-লোকেশন",
    device: "desktop",
  },
]);

const listViewThemes = ref([
  {
    name: "বেসিক",
    price: 49,
    isRecommended: false,
  },
  {
    name: "প্রফেশনাল",
    price: 89,
    isRecommended: true,
  },
  {
    name: "এজেন্সি",
    price: 149,
    isRecommended: false,
  },
]);

const themeFeatures = ref([
  {
    name: "ভিজুয়াল বিল্ডার",
    description: "ড্র্যাগ অ্যান্ড ড্রপ পেজ বিল্ডার",
    values: [false, true, true],
  },
  {
    name: "প্রিমেড লেআউট",
    description: "অন্তর্ভুক্ত টেমপ্লেট সংখ্যা",
    values: ["১০", "৫০+", "১০০+"],
  },
  {
    name: "WooCommerce রেডি",
    description: "ই-কমার্স কার্যকারিতা",
    values: [true, true, true],
  },
  {
    name: "হেডার বিল্ডার",
    description: "কাস্টমাইজযোগ্য হেডার",
    values: [false, true, true],
  },
  {
    name: "প্রিমিয়াম সাপোর্ট",
    description: "ডেডিকেটেড সাপোর্ট টিম",
    values: ["১ বছর", "লাইফটাইম", "লাইফটাইম"],
  },
  {
    name: "থিম আপডেট",
    description: "ফ্রি আপডেটের সময়কাল",
    values: ["১ বছর", "লাইফটাইম", "লাইফটাইম"],
  },
  {
    name: "কাস্টম উইজেট",
    description: "অতিরিক্ত এলিমেন্ট",
    values: ["৫", "১৫+", "৩০+"],
  },
]);
</script>

<style scoped>
/* Custom animations */
.rotate-1 {
  transform: rotate(1deg);
}
.-rotate-1 {
  transform: rotate(-1deg);
}

/* Smooth transitions */
.transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Backdrop blur for modern glass effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.bponi-theme-landing {
  position: relative;
}

.bponi-theme-landing::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  clip-path: polygon(0 0, 100% 0%, 100% 92%, 0% 100%);
}

.bestsellers {
  position: relative;
  z-index: 0;
}
.bestsellers::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  clip-path: polygon(0 0, 100% 0%, 100% 92%, 0% 100%);
  z-index: -1;
}

.final-cta {
  position: relative;
  background: url("https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/901fc781-a730-411d-8784-ba6124a823a5.png");
  z-index: 0;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}

.final-cta::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  background: #000000c1;
  left: 0;
  top: 0;
  z-index: -1;
}
</style>
