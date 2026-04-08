<template>
  <div
    class="relative min-h-screen bg-gradient-to-br from-gray-900 to-slate-950 text-white pt-40 pb-20 overflow-hidden font-sans"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
    ></div>
    <div
      class="absolute top-0 -left-1/4 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-teal-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"
    ></div>
    <div
      class="absolute bottom-0 -right-1/4 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-amber-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"
    ></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center mb-16">
        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-shadow"
        >
          <span
            class="bg-gradient-to-r py-1 from-amber-400 to-amber-500 bg-clip-text text-transparent"
            >Flexible Pricing Plans</span
          >
        </h1>
        <p class="mt-5 max-w-xl mx-auto text-lg text-gray-300 leading-relaxed">
          Get your business moving today - no credit card required.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8 items-start">
        <div class="pricing-card">
          <div class="p-8">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-2xl font-bold text-white">Starter</h3>
                <p class="mt-1 text-gray-400">Ideal for new businesses</p>
              </div>
            </div>
            <div class="mt-8">
              <div
                class="flex items-baseline text-5xl font-extrabold text-white"
              >
                ₹ 500
                <span class="ml-2 text-xl font-medium text-gray-400">/month</span>
              </div>
              <p class="mt-2 text-gray-400">Limited orders &amp; products</p>
            </div>
            <ul class="space-y-4 mt-8 text-gray-300">
              <li
                v-for="feature in starterFeatures"
                :key="feature"
                class="flex items-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-6 w-6 text-teal-400 mr-3 flex-shrink-0"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L10.5 13.19l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
          <div class="px-8 pb-8">
            <a
              href="https://wa.me/8801626993634"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                class="w-full bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-all duration-300"
              >
                Contact us
              </button>
            </a>
          </div>
        </div>

        <div class="pricing-card popular">
          <div class="absolute top-0 right-0 -mr-4 -mt-4 z-20">
            <span
              class="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg"
              >Popular</span
            >
          </div>
          <div class="p-8">
            <h3 class="text-2xl font-bold text-white">Lite</h3>
            <p class="mt-1 text-gray-400">Built for growing teams</p>
            <div class="mt-8">
              <div
                class="flex items-baseline text-5xl font-extrabold text-white"
              >
                ₹ 1,500
                <span class="ml-2 text-xl font-medium text-gray-400">/month</span>
              </div>
              <p class="mt-2 text-gray-400">
                Expanded order &amp; product capacity
              </p>
            </div>
            <ul class="space-y-4 mt-8 text-gray-300">
              <li
                v-for="feature in liteFeatures"
                :key="feature"
                class="flex items-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-6 w-6 text-teal-400 mr-3 flex-shrink-0"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L10.5 13.19l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
          <div class="px-8 pb-8">
            <a
              href="https://wa.me/8801626993634"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                class="w-full bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-all duration-300"
              >
                Contact us
              </button>
            </a>
          </div>
        </div>

        <div class="pricing-card">
          <div class="p-8">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-2xl font-bold text-white">Business</h3>
                <p class="mt-1 text-gray-400">For established brands</p>
              </div>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400"
                >Premium</span
              >
            </div>
            <div class="mt-8">
              <div
                class="flex items-baseline text-5xl font-extrabold text-white"
              >
                ₹ 3,000
                <span class="ml-2 text-xl font-medium text-gray-400">/month</span>
              </div>
              <p class="mt-2 text-gray-400">
                Unlimited access to advanced features
              </p>
            </div>
            <ul class="space-y-4 mt-8 text-gray-300">
              <li
                v-for="feature in businessFeatures"
                :key="feature"
                class="flex items-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-6 w-6 text-teal-400 mr-3 flex-shrink-0"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L10.5 13.19l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
          <div class="px-8 pb-8">
            <a
              href="https://wa.me/8801626993634"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                class="w-full bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-all duration-300"
              >
                Contact us
              </button>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-24 max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-white mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300"
            :class="{ 'bg-slate-700/70': openFaqs.includes(index) }"
          >
            <button
              @click="toggleFAQ(index)"
              class="w-full flex justify-between items-center text-left p-6 focus:outline-none"
            >
              <h3 class="text-lg font-medium text-white">{{ faq.question }}</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6 text-gray-400 transform transition-transform duration-300"
                :class="{
                  'rotate-180 text-amber-400': openFaqs.includes(index),
                }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <div class="faq-answer" :class="{ open: openFaqs.includes(index) }">
              <p class="px-6 pb-6 text-gray-300">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// Heroicons import is no longer needed
// import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/vue/24/solid";

const openFaqs = ref([]);

const faqs = [
  {
    question: "Can I manage my ecommerce website on my own?",
    answer:
      "Absolutely. Our intuitive dashboard lets you handle products, orders, customers, and content without touching code.",
  },
  {
    question: "How fast will my website be?",
    answer:
      "Lightning fast. We run Rust on the backend and Vue on the frontend so your storefront stays reliable and responsive.",
  },
  {
    question: "How secure is my customer data?",
    answer:
      "It's completely private. Your business data stays encrypted and locked down - no third parties and not even our team can access it without your consent.",
  },
  {
    question: "Do you also provide domain and hosting?",
    answer:
      "Yes. We include domain registration and high-performance hosting so you launch with a single partner.",
  },
];

const toggleFAQ = (index) => {
  const faqIndex = openFaqs.value.indexOf(index);
  if (faqIndex === -1) {
    openFaqs.value.push(index);
  } else {
    openFaqs.value.splice(faqIndex, 1);
  }
};

const starterFeatures = [
  "Basic website with subdomain",
  "Option to add a custom domain",
  "100 product listings",
  "300 orders every month",
  "1,000 SKU codes",
  "Essential customer portal",
  "Standard dashboard",
  "Courier integrations",
  "3 customizations per month included",
  "Support: 10 AM - 6 PM (BST)",
  "Email and ticket support",
];
const liteFeatures = [
  "Everything in Starter",
  "Warehouse & inventory transfer system",
  "500 product listings",
  "1,000 orders every month",
  "2,000 SKU codes",
  "Advanced customer portal",
  "Detailed analytics dashboard",
  "Fraud detection",
  "Abandoned cart tracking",
  "Preferred courier integrations",
  "24/7 customer assistance",
  "Reseller tools",
  "Campaign, voucher & flash sale tools",
];
const businessFeatures = [
  "Everything in Lite",
  "Affiliate & reseller management",
  "Unlimited products and orders",
  "10,000 SKU codes",
  "Custom landing pages",
  "Advanced analytics & reporting",
  "Up to 35 team users",
  "Customizable reports",
  "Facebook Conversion API",
  "Google Tag Manager & data layer",
];
</script>

<style>
.pricing-card {
  @apply relative flex flex-col bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40;
}
.pricing-card.popular {
  @apply border-2 border-teal-400 scale-105 shadow-2xl shadow-teal-500/20;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0, 1, 0, 1);
}

.faq-answer.open {
  max-height: 1000px; /* A large value to ensure content fits */
  transition: max-height 1s ease-in-out;
}
.faq-answer > p {
  overflow: hidden;
}

/* --- Animation helpers --- */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  /* Use 'forwards' so the animation keeps the element visible */
  animation: fadeInUp 0.8s ease-out forwards;
}

.text-shadow {
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

/* Animation delays */
.animation-delay-2000 {
  animation-delay: 2000ms;
}
.delay-200 {
  animation-delay: 200ms;
}
.delay-300 {
  animation-delay: 300ms;
}
.delay-400 {
  animation-delay: 400ms;
}
.delay-500 {
  animation-delay: 500ms;
}
.delay-600 {
  animation-delay: 600ms;
}
</style>
