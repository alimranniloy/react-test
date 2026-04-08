<template>
  <section
    ref="sectionRef"
    class="relative bg-gray-900 pt-32 pb-16 text-white overflow-hidden font-sans"
  >
    <div
      class="absolute -top-1/4 left-0 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"
    ></div>
    <div
      class="absolute -bottom-1/4 right-0 w-96 h-96 bg-amber-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"
    ></div>

    <div
      class="container mx-auto text-center flex items-center justify-center flex-col relative z-10"
    >
      <div class="animate-fade-in-up">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4">
          <span
            class="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg py-2"
          >
            Technologies We Use
          </span>
        </h2>
        <p class="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed">
          We rely on proven, world-class technologies to ship dependable, fast,
          and secure solutions that help your business scale with confidence.
        </p>
      </div>

      <div
        class="flex flex-wrap justify-center items-center gap-5 max-w-6xl mx-auto py-16"
      >
        <div
          v-for="(logo, index) in logos"
          :key="logo.name"
          class="logo group relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center p-3 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 ease-in-out hover:border-teal-400/50 hover:-translate-y-2"
          :class="{ 'logo--visible': visible[index] }"
          :style="{
            '--tx': startOffsets[index]?.x + 'px',
            '--ty': startOffsets[index]?.y + 'px',
            '--r': startOffsets[index]?.r + 'deg',
            '--animation-duration':
              startOffsets[index]?.animationDuration + 'ms',
            '--animation-delay': startOffsets[index]?.animationDelay + 'ms',
            transitionDelay: randomDelays[index] + 'ms',
          }"
        >
          <img
            :src="logo.src"
            :alt="logo.name"
            class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
            :class="{ 'dark-logo-filter': logo.isDark }"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const logos = [
  {
    name: "Rust",
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg",
    isDark: true,
  },
  {
    name: "Postgres",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
  },
  {
    name: "AI",
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/b135d432-b06d-4c28-82bd-602d893c09a8.png",
  },
  {
    name: "Vue",
    src: "https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg",
  },
  {
    name: "Nuxt",
    src: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Nuxt_logo.svg",
  },
  {
    name: "TailwindCSS",
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  },
  {
    name: "AWS",
    src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    isDark: true,
  },
  // {
  //   name: "DigitalOcean",
  //   src: "https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_icon_blue.svg",
  // },
  {
    name: "TypeScript",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
  },
  { name: "Vite", src: "https://vitejs.dev/logo.svg" },
  {
    name: "GraphQL",
    src: "https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg",
  },
  {
    name: "Docker",
    src: "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png",
  },
  {
    name: "Kubernetes",
    src: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg",
  },
  // {
  //   name: "GitHub",
  //   src: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  //   isDark: true,
  // },
];

const sectionRef = ref(null);
const visible = ref(new Array(logos.length).fill(false));
const randomDelays = ref(new Array(logos.length).fill(0));
const startOffsets = ref(
  new Array(logos.length).fill({
    x: 0,
    y: 0,
    r: 0,
    animationDuration: 0,
    animationDelay: 0,
  })
);
let observer = null;

function pickRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomValues() {
  randomDelays.value = logos.map(() => pickRandom(350, 900));
  startOffsets.value = logos.map(() => ({
    x: pickRandom(-15, 15),
    y: pickRandom(-15, 15),
    r: pickRandom(-8, 8),
    animationDuration: pickRandom(5000, 10000), // Slower, more subtle animation
    animationDelay: pickRandom(0, 4000),
  }));
}

function revealItems() {
  visible.value = visible.value.map(() => true);
}

onMounted(async () => {
  generateRandomValues();
  await nextTick();

  const options = {
    root: null,
    threshold: 0.1, // A little bit more of the section needs to be visible
    rootMargin: "-20% 0px -40% 0px",
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealItems();
        observer.disconnect();
      }
    });
  }, options);

  if (sectionRef.value) observer.observe(sectionRef.value);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.logo {
  opacity: 0;
  transform: translate(var(--tx, 0px), var(--ty, 0px)) rotate(var(--r, 0deg))
    scale(0.8);
  transition: transform 1000ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease;
  will-change: transform, opacity;
}

.logo--visible {
  opacity: 1;
  transform: translate(0px, 0px) rotate(0deg) scale(1);
  animation-name: float;
  animation-duration: var(--animation-duration);
  animation-delay: var(--animation-delay);
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.dark-logo-filter {
  filter: invert(1) brightness(1.5);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Global animations if not present elsewhere */
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
  animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.animation-delay-2000 {
  animation-delay: 2s;
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
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}
</style>
