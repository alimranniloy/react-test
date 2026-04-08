<template>
  <section
    class="pt-24 pb-16 relative bg-gradient-to-br from-gray-900 to-slate-950 font-sans overflow-hidden"
  >
    <div class="container mx-auto px-4">
      <div class="text-center mb-4">
        <span
          class="text-sm font-semibold text-amber-400 uppercase tracking-wide"
          >Careers</span
        >
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <h1
          class="text-4xl md:text-5xl font-bold text-white text-center leading-tight mb-6"
        >
          Be a Part of The Fastest Growing Talented Team
        </h1>
        <p class="text-lg text-gray-300 text-center max-w-2xl mx-auto mb-8">
          Join our fast-paced team as we empower employees to grow and develop
          in an environment with opportunities for growth. Be part of our team
          and contribute to delivering innovative software solutions.
        </p>
        <button
          class="bg-amber-300 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out block mx-auto w-max"
        >
          Explore All Openings
        </button>
      </div>

      <div
        class="hidden lg:block absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2"
      >
        <div
          class="w-64 h-80 rounded-lg shadow-xl overflow-hidden bg-black/10 -rotate-3"
        ></div>
      </div>
      <div
        class="hidden lg:block absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2"
      >
        <div
          class="w-64 h-80 rounded-lg shadow-xl overflow-hidden bg-white/5 rotate-3"
        ></div>
      </div>
    </div>
  </section>
  <section class="bg-[#100320] text-white py-24">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
        Why Join Us?
      </h2>
      <p class="text-gray-400 text-center max-w-2xl mx-auto mb-16">
        Bponi is a top-tier software outsourcing development company that offers
        premium solutions using the latest technology stacks.
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="flex flex-col gap-4">
          <div class="rounded-lg overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              alt="Team working in an office"
              class="w-full h-auto max-h-64 object-cover object-top"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
                alt="Team member smiling"
                class="w-full h-full max-h-40 object-cover"
              />
            </div>
            <div
              class="bg-amber-200 text-gray-900 rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full shadow-2xl"
            >
              <span class="text-base font-semibold text-gray-700"
                >Top Talents</span
              >
              <span class="text-5xl md:text-6xl font-bold text-gray-900 mt-1"
                >300+</span
              >
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
          <div
            v-for="benefit in benefits"
            :key="benefit.text"
            class="flex items-center space-x-4"
          >
            <div class="bg-gray-800 p-3 rounded-full flex-shrink-0">
              <component :is="benefit.icon" class="w-6 h-6 text-amber-400" />
            </div>
            <span class="font-semibold text-lg">{{ benefit.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="bg-gray-50 py-24">
    <div class="container mx-auto px-4">
      <!-- Section Heading -->
      <h2
        class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
      >
        Open Positions
      </h2>

      <!-- Job List Container -->
      <div class="max-w-4xl mx-auto space-y-4">
        <div
          v-for="position in openPositions"
          :key="position.title"
          class="bg-white hover:bg-amber-50 border border-gray-200 rounded-xl p-6 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg hover:border-amber-200"
        >
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <!-- Job Title and Info -->
            <div class="flex-grow">
              <h3 class="text-xl font-bold text-gray-800">
                {{ position.title }}
              </h3>
              <div
                class="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 mt-2"
              >
                <div class="flex items-center gap-2">
                  <MapPinIcon class="w-5 h-5" />
                  <span>{{ position.location }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>{{ position.experience }}</span>
                </div>
              </div>
            </div>
            <!-- Apply Button -->
            <div class="flex-shrink-0 mt-4 sm:mt-0">
              <button
                class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { MapPinIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

const IconCode = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>`,
};
const IconGamepad = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>`,
};
const IconClock = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
};
const IconShare = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 0-2.186m0 2.186c-.18.324-.283.696-.283 1.093s.103.77.283 1.093m0-2.186Zm-9.566-5.314a2.25 2.25 0 1 0 0-2.186m0 2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186Z" /></svg>`,
};
const IconLightbulb = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-4.5c0-3.314-2.686-6-6-6S1.5 4.936 1.5 8.25c0 1.657.672 3.156 1.5 4.5m8.25 0v5.25m0 0A2.25 2.25 0 0 1 9.75 20.25h-3.5a2.25 2.25 0 0 1-2.25-2.25m13.5-7.5a6.01 6.01 0 0 0-1.5-4.5c0-3.314 2.686-6 6-6s6 2.686 6 6c0 1.657-.672 3.156-1.5 4.5m-8.25 0v5.25m0 0a2.25 2.25 0 0 0 2.25 2.25h3.5a2.25 2.25 0 0 0 2.25-2.25" /></svg>`,
};
const IconWallet = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 3h-2.25m-13.5 0H3m10.5-3.375c0-1.621-1.328-2.925-2.95-2.925S8.55 7.004 8.55 8.625m2.95-.375a2.925 2.925 0 0 0-5.9 0m5.9 0a2.925 2.925 0 0 1-5.9 0m5.9 0v.375" /></svg>`,
};

const benefits = ref([
  { text: "Top-tier Software Outsourcing Development Company", icon: IconCode },
  { text: "Game Zone", icon: IconGamepad },
  { text: "Flexible Work-Hours", icon: IconClock },
  { text: "Knowledge Sharing", icon: IconShare },
  { text: "Revolutionary Software Culture", icon: IconLightbulb },
  { text: "Competitive Remuneration", icon: IconWallet },
]);
const openPositions = ref([
  {
    title: "Mid Level Backend Developer",
    location: "Kolkata, India",
    experience: "3+ Years Exp.",
  },
  {
    title: "Frontend Developer",
    location: "Kolkata, India",
    experience: "2+ Years Exp.",
  },
  {
    title: "Junior Frontend Developer",
    location: "Kolkata, India",
    experience: "1+ Years Exp.",
  },
]);
</script>
