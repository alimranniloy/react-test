<template>
  <div class="relative font-inter antialiased border-t border-slate-500">
    <h1
      class="text-black mb-4 text-center sm:text-4xl text-2xl sm:pt-10 pt-2 sm:hidden block"
    >
      Top Favourite Themes
    </h1>
    <main
      class="relative h-fit flex flex-col justify-center bg-black overflow-hidden"
    >
      <div
        class="absolute z-10 top-0 left-0 w-full h-full bg-white/10 pointer-events-none"
      ></div>

      <h1
        class="text-white text-center sm:text-4xl text-2xl sm:pt-10 pt-2 sm:block hidden"
      >
        Top Favourite Themes
      </h1>
      <div class="w-full mx-auto px-4 md:px-6 sm:py-0 sm:mt-6 py-4">
        <div class="text-center">
          <div
            class="carousel-wrapper w-full inline-flex flex-nowrap overflow-hidden sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
            ref="carouselWrapper"
          >
            <ul
              ref="themes"
              class="flex items-center justify-center md:justify-start [&_li]:mx-2 [&_img]:max-w-none animate-theme-scroll"
            >
              <li
                v-for="(theme, i) in themeList"
                :key="i"
                class="relative group"
              >
                <img
                  class="sm:w-96 sm:h-[32rem] w-48 h-80 object-cover"
                  :src="theme.src"
                  :alt="theme.alt"
                />

                <div
                  class="absolute inset-0 bg-black bg-opacity-60 hidden group-hover:flex items-center justify-center"
                >
                  <div
                    class="link-box h-12 w-12 cursor-pointer bg-white flex items-center justify-center rounded-full"
                  >
                    <a :href="theme.link" target="_blank">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const carouselWrapper = ref(null);
const themes = ref(null);

const themeList = [
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/9c947fb5-73ae-42e2-b8c8-f8b272a3c30f.jpeg",
    alt: "Theme One",
    link: "https://foodi.store.bponi.com/",
  },
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/a8c0a47c-1726-4873-b2e3-703077d8aac2.jpg",
    alt: "Theme Two",
    link: "https://edge.store.bponi.com/",
  },
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/449ec20a-b76b-4e81-9c29-a93d1b40ea91.jpg",
    alt: "Theme Three",
    link: "https://zero.store.bponi.com/",
  },
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/449ec20a-b76b-4e81-9c29-a93d1b40ea91.jpg",
    alt: "Theme Four",
    link: "https://dropy.store.bponi.com/",
  },
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/afd027eb-56cb-43f3-87ae-926aa03e7826.jpg",
    alt: "Theme Five",
    link: "https://mohnazpro.store.bponi.com/",
  },
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/9c947fb5-73ae-42e2-b8c8-f8b272a3c30f.jpeg",
    alt: "Theme Six",
    link: "https://fabrilife.store.bponi.com/",
  },
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/af6e17ae-ab1c-4ea8-890f-7b4c9992bf37.jpg",
    alt: "Theme Seven",
    link: "https://storetech.store.bponi.com/",
  },
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/449ec20a-b76b-4e81-9c29-a93d1b40ea91.jpg",
    alt: "Theme Eight",
    link: "https://boisodai.store.bponi.com/",
  },
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/af6e17ae-ab1c-4ea8-890f-7b4c9992bf37.jpg",
    alt: "Theme Nine",
    link: "https://alhudashop.store.bponi.com/",
  },
  {
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/af6e17ae-ab1c-4ea8-890f-7b4c9992bf37.jpg",
    alt: "Theme Ten",
    link: "https://boiadda.store.bponi.com/",
  },
];

onMounted(() => {
  if (themes.value && carouselWrapper.value) {
    const clone = themes.value.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    carouselWrapper.value.appendChild(clone);
  }
});
</script>

<style>
@keyframes theme-scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-theme-scroll {
  animation: theme-scroll 15s linear infinite;
}
.carousel-wrapper:hover .animate-theme-scroll {
  animation-play-state: paused;
}
</style>
