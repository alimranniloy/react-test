<template>
  <section
    class="relative bg-gradient-to-br from-gray-900 to-slate-950 text-white py-24 sm:py-32 px-4 overflow-hidden font-sans"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
    ></div>
    <div
      class="absolute top-0 -left-1/4 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-purple-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"
    ></div>
    <div
      class="absolute bottom-0 -right-1/4 w-96 h-96 md:w-[40rem] md:h-[40rem] bg-teal-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"
    ></div>

    <div class="container mx-auto relative z-10">
      <div class="text-center mb-16">
        <span class="text-teal-400 font-semibold uppercase tracking-wider"
          >কমিউনিটি ফেভারিট</span
        >
        <h2 class="text-4xl md:text-5xl font-extrabold mt-2 mb-4 text-shadow">
          <span class="text-amber-400">সবচেয়ে জনপ্রিয়</span> থিম
        </h2>
        <p class="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
          বিশ্বব্যাপী হাজার হাজার ব্যবহারকারীর দ্বারা প্রিয়। এগুলো আমাদের
          সর্বোচ্চ বিক্রিত থিম।
        </p>
      </div>

      <div
        class="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-16 animate-fade-in-up delay-200"
      >
        <button
          v-for="category in ['all', ...uniqueCategories]"
          :key="category"
          @click="activeFilter = category"
          :class="[
            'relative px-1 py-2 font-medium text-lg transition-colors duration-300 capitalize',
            activeFilter === category
              ? 'text-amber-400'
              : 'text-gray-400 hover:text-white',
          ]"
        >
          {{ category === "all" ? "সব থিম" : category }}
          <span
            :class="[
              'absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 transition-transform duration-300 ease-out',
              activeFilter === category ? 'scale-x-100' : 'scale-x-0',
            ]"
          ></span>
        </button>
      </div>

      <transition-group
        name="card-fade"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <div
          v-for="theme in filteredThemes"
          :key="theme.id"
          class="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/10"
        >
          <div class="relative h-48 overflow-hidden">
            <img
              :src="theme.image"
              :alt="theme.title"
              class="w-full h-full object-top object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            ></div>
          </div>

          <div class="p-5 flex flex-col h-[calc(100%-192px)]">
            <div class="flex-grow">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-white">{{ theme.title }}</h3>
                <span
                  class="bg-white/10 text-teal-300 px-2 py-1 rounded text-xs font-medium capitalize"
                >
                  {{
                    Array.isArray(theme.category)
                      ? theme.category[0]
                      : theme.category
                  }}
                </span>
              </div>
              <p class="text-gray-400 text-sm mb-3">{{ theme.subTitle }}</p>
              <div class="flex items-center mb-4">
                <div class="flex mr-2">
                  <StarIcon
                    v-for="star in 5"
                    :key="star"
                    :class="`w-4 h-4 ${
                      star <= theme.rating ? 'text-yellow-400' : 'text-gray-600'
                    }`"
                  />
                </div>
                <span class="text-gray-400 text-xs"
                  >{{ theme.rating.toFixed(1) }}/5 ({{
                    theme.reviews
                  }}
                  রিভিউ)</span
                >
              </div>
            </div>
            <div class="mt-auto pt-4">
              <a
                :href="theme.url"
                target="_blank"
                class="w-full text-center block bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full font-semibold text-sm transition duration-300"
              >
                লাইভ প্রিভিউ
              </a>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { StarIcon } from "@heroicons/vue/24/solid";

const activeFilter = ref("all");

const themes = ref([
  {
    id: 1,
    title: "Foodi",
    category: ["ফ্যাশন", "গ্রোসারি স্টোর"],
    subTitle: "সরল, পরিষ্কার",
    url: "https://foodi.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/a902a251-67df-4a10-83eb-6cc3a2b96203.png",
    rating: 4.5,
    reviews: "১০০+",
  },
  {
    id: 2,
    title: "Edge",
    category: ["ফ্যাশন"],
    subTitle: "আধুনিক এবং স্টাইলিশ",
    url: "https://edge.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/d2e70897-d7ee-448c-b887-d8cefc7b5fbd.png",
    rating: 4.7,
    reviews: "১২০+",
  },
  {
    id: 3,
    title: "Tech",
    category: ["প্রযুক্তি", "শিক্ষামূলক"],
    subTitle: "টেক-স্যাভিদের জন্য",
    url: "https://storetech.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/f7402968-e9a5-4849-8018-23b801bafb15.png",
    rating: 4.3,
    reviews: "৮০+",
  },
  {
    id: 4,
    title: "Zero",
    category: ["গ্রোসারি স্টোর"],
    subTitle: "মিনিমালিস্ট ডিজাইন",
    url: "https://zero.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/a6d53c73-4cd5-4142-9ee0-5779f1c56685.png",

    rating: 4.8,
    reviews: "১৫০+",
  },
  {
    id: 5,
    title: "LMS",
    category: ["এলএমএস", "শিক্ষামূলক"],
    subTitle: "অনলাইন কোর্সের জন্য",
    url: "https://www.mainamatisurvey.com.bd/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/6400d9d4-b259-40ac-9176-de2ae2c27e94.png",
    rating: 4.9,
    reviews: "২০০+",
  },
  {
    id: 6,
    title: "Dropy",
    category: ["ফ্যাশন", "ড্রপিশিপিং", "প্রযুক্তি"],
    subTitle: "ড্রপশিপারদের পছন্দ",
    url: "https://dropy.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/b5090d8c-f332-4afb-a806-35d8e9cc364c.png",
    rating: 4.9,
    reviews: "১৮০+",
  },
  {
    id: 7,
    title: "Book",
    category: ["শিক্ষামূলক"],
    subTitle: "বইয়ের দোকানের জন্য",
    url: "https://boisodai.store.bponi.com/",
    image:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/1fd2267b-9541-4428-86fa-26860cd0ca7f.png",
    rating: 4.7,
    reviews: "১১০+",
  },
  // {
  //   id: 8,
  //   title: "Petra",
  //   category: ["ফ্যাশন"],
  //   subTitle: "লাক্সারি ফ্যাশন থিম",
  //   url: "https://petra.store.bponi.com/",
  //   image:
  //     "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/37efe0c5-64da-4bad-86d2-e31d299f2807.png",
  //   rating: 4.8,
  //   reviews: "১৪০+",
  // },
]);

const uniqueCategories = computed(() => {
  const categories = new Set();
  themes.value.forEach((theme) => {
    if (Array.isArray(theme.category)) {
      theme.category.forEach((cat) => categories.add(cat));
    } else {
      categories.add(theme.category);
    }
  });
  return Array.from(categories).sort();
});

const filteredThemes = computed(() => {
  if (activeFilter.value === "all") return themes.value;
  return themes.value.filter((theme) => {
    if (Array.isArray(theme.category))
      return theme.category.includes(activeFilter.value);
    return theme.category === activeFilter.value;
  });
});
</script>

<style>
/* Add these styles to your existing style block or a global CSS file if not already present */
.text-shadow {
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.delay-200 {
  animation-delay: 200ms;
}

/* Transition Group Animation */
.card-fade-move,
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
.card-fade-leave-active {
  position: absolute;
}
</style>
