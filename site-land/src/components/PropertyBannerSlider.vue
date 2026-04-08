<template>
  <section class="bg-white pt-6 pb-12 sm:pt-8 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <div class="mb-8 flex flex-col items-center gap-3 text-center">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            Newest Properties Around You
          </p>
          <h2 class="text-3xl font-semibold text-slate-900 sm:text-4xl">Discover Latest Properties</h2>
        </div>
      </div>

      <div class="relative">
        <div
          v-if="useGrid"
          class="mx-auto grid max-w-7xl gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div
            v-for="item in properties"
            :key="item.name + '-grid'"
            class="panel grid-item px-2 sm:px-3"
          >
            <div class="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-white shadow-[0_15px_40px_-22px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-22px_rgba(0,0,0,0.5)]">
              <div class="relative overflow-hidden rounded-2xl bg-slate-100">
                <img :alt="item.name" :src="item.image" class="h-[260px] w-full object-cover sm:h-[320px]" />
              </div>
              <div class="flex flex-1 flex-col gap-2 px-4 pb-5">
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <h3 class="text-lg font-semibold text-slate-900">{{ item.name }}</h3>
                  <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    {{ item.tag }}
                  </span>
                </div>
                <p class="text-sm text-slate-600">
                  {{ item.address }}
                </p>
                <p class="text-sm font-semibold text-slate-800">{{ item.type }}</p>
                <div class="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span>🛏️ {{ item.beds }} Beds</span>
                  <span>🛁 {{ item.baths }} Baths</span>
                  <span>📐 {{ item.area }}</span>
                </div>
                <div class="pt-2 text-xs text-slate-500">Added: {{ item.added }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden justify-between px-2 sm:flex">
            <button
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-500 hover:text-brand-600"
              aria-label="Previous"
              @click="goPrev"
            >
              ‹
            </button>
            <button
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-500 hover:text-brand-600"
              aria-label="Next"
              @click="goNext"
            >
              ›
            </button>
          </div>
          <Flicking
            ref="flickingRef"
            :options="{
              align: 'center',
              circular: true,
              moveType: 'snap',
              bound: true,
              autoResize: true,
            }"
            @move-end="handleMoveEnd"
            class="overflow-visible"
            @mouseenter="pauseAuto"
            @mouseleave="startAuto"
          >
            <div v-for="item in properties" :key="item.name" class="panel px-2 sm:px-3 py-2">
              <div class="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-white shadow-[0_15px_40px_-22px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-22px_rgba(0,0,0,0.5)]">
                <div class="relative overflow-hidden rounded-2xl bg-slate-100">
                  <img :alt="item.name" :src="item.image" class="h-[260px] w-full object-cover sm:h-[320px]" />
                </div>
                <div class="flex flex-1 flex-col gap-2 px-4 pb-5">
                  <div class="flex flex-wrap items-start justify-between gap-2">
                    <h3 class="text-lg font-semibold text-slate-900">{{ item.name }}</h3>
                    <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                      {{ item.tag }}
                    </span>
                  </div>
                  <p class="text-sm text-slate-600">
                    {{ item.address }}
                  </p>
                  <p class="text-sm font-semibold text-slate-800">{{ item.type }}</p>
                  <div class="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span>🛏️ {{ item.beds }} Beds</span>
                    <span>🛁 {{ item.baths }} Baths</span>
                    <span>📐 {{ item.area }}</span>
                  </div>
                  <div class="pt-2 text-xs text-slate-500">Added: {{ item.added }}</div>
                </div>
              </div>
            </div>
          </Flicking>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-center gap-2">
        <button
          v-for="(item, index) in properties"
          :key="item.name + '-dot'"
          class="h-2 rounded-full bg-brand-100 transition"
          :class="index === activeIndex ? 'w-8 bg-brand-600' : 'w-3 hover:bg-brand-300'"
          aria-label="Go to slide"
          @click="goTo(index)"
        />
      </div>

      <div class="mt-6 flex items-center justify-center gap-4 sm:hidden">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-500 hover:text-brand-600"
          aria-label="Previous"
          @click="goPrev"
        >
          ‹
        </button>
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-500 hover:text-brand-600"
          aria-label="Next"
          @click="goNext"
        >
          ›
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import Flicking from "@egjs/vue3-flicking";
import "@egjs/flicking/dist/flicking.css";

const properties = [
  {
    name: "Fortress Empire",
    tag: "New Project",
    address: "Block-L, Road – 5th Sarani, Bashundhara R/A",
    type: "Condominium",
    beds: 4,
    baths: 4,
    area: "2510 & 5020 SFT",
    added: "08/28/2024",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "FDL Kabboneer",
    tag: "On Sale",
    address: "Bashundhara R/A, Dhaka",
    type: "Condominium",
    beds: 4,
    baths: 4,
    area: "2510 & 5020 SFT",
    added: "02/27/2024",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "FDL TWINPEAK – 2",
    tag: "New Launch",
    address: "Sector-16, Jolshiri Abashon, Dhaka",
    type: "Apartment Building",
    beds: 4,
    baths: 4,
    area: "2850 SFT",
    added: "09/24/2023",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Skylark Residences",
    tag: "Premium",
    address: "Uttara, Dhaka",
    type: "Penthouse Collection",
    beds: 5,
    baths: 5,
    area: "5700 SFT",
    added: "11/04/2023",
    image:
      "https://images.unsplash.com/photo-1467987506553-8f3916508521?auto=format&fit=crop&w=1200&q=80",
  },
];

const flickingRef = ref(null);
const activeIndex = ref(0);
let autoTimer = null;
const viewportWidth = ref(typeof window !== "undefined" ? window.innerWidth : 0);
let resizeHandler = null;

const useGrid = computed(() => viewportWidth.value >= 1280);

const goPrev = async () => {
  if (flickingRef.value) {
    await flickingRef.value.prev();
  }
};

const goNext = async () => {
  if (flickingRef.value) {
    await flickingRef.value.next();
  }
};

const goTo = async (index) => {
  if (flickingRef.value) {
    await flickingRef.value.moveTo(index);
    activeIndex.value = index;
  }
};

const handleMoveEnd = (e) => {
  activeIndex.value = e.index;
};

const startAuto = () => {
  clearInterval(autoTimer);
  autoTimer = window.setInterval(() => {
    goNext();
  }, 4600);
};

const pauseAuto = () => {
  clearInterval(autoTimer);
};

onMounted(() => {
  startAuto();
  resizeHandler = () => {
    viewportWidth.value = window.innerWidth;
  };
  window.addEventListener("resize", resizeHandler, { passive: true });
  resizeHandler();
});

onBeforeUnmount(() => {
  pauseAuto();
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }
});
</script>

<style scoped>
.panel {
  width: clamp(280px, 26vw, 360px);
}
</style>
