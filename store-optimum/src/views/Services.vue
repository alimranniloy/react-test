<template>
  <div
    class="flex flex-col items-center justify-center px-5 py-32 overflow-x-hidden pb-24 bg-gradient-to-b from-[#04121a] via-[#021f24] to-[#020c14]"
  >
    <div class="w-full max-w-[1200px] text-center lg:mb-8">
      <div class="mb-16">
        <h1
          class="text-3xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-300 mb-2 lg:mb-4 py-2"
        >
          Beyond the storefront: services from Optimum Soft
        </h1>
        <p
          class="subtitle text-lg text-slate-200/80 max-w-xl mx-auto leading-relaxed"
        >
          From strategy to fulfillment, our team becomes an embedded partner so you can focus on bold ideas.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <div
          v-for="(service, index) in services"
          :key="index"
          class="cursor-pointer service-card relative overflow-hidden bg-white/5 rounded-2xl p-10 border border-white/10 shadow-2xl transition-all duration-400 hover:-translate-y-2.5 hover:shadow-[0_25px_50px_rgba(8,35,45,0.45)] hover:border-emerald-200/30 hover:bg-white/10 flex flex-col items-center text-center"
          :style="{ transitionDelay: `${index * 0}s` }"
        >
          <div
            class="floating-shapes absolute w-full h-full top-0 left-0 pointer-events-none z-0"
          >
            <div
              class="shape shape-1"
              :style="{ background: service.shapes[0].bg }"
            ></div>
            <div
              class="shape shape-2"
              :style="{ background: service.shapes[1].bg }"
            ></div>
          </div>
          <div
            :class="['icon-container', { 'pulse-animation': service.pulse }]"
            class="w-[90px] h-[90px] rounded-full flex items-center justify-center mb-6 relative z-[1] before:content-[''] before:absolute before:w-full before:h-full before:bg-inherit before:rounded-full before:z-[-1] before:opacity-20 before:scale-125"
            :style="{ background: service.iconBg }"
          >
            <component
              :is="service.icon"
              class="w-9 h-9 sm:w-12 sm:h-12"
              :style="{ color: service.iconColor }"
            />

            <!-- <i
              :class="['service-icon', service.icon]"
              :style="{ color: service.iconColor }"
            ></i> -->
          </div>
          <h3 class="service-title text-2xl font-bold mb-4 text-slate-50">
            {{ service.title }}
          </h3>
          <p
            class="service-description text-slate-400 leading-relaxed mb-5 flex-grow"
          >
            {{ service.description }}
          </p>
          <!-- <a
            href="#"
            class="service-link group inline-flex items-center text-amber-500 font-semibold transition-all duration-300 hover:text-amber-500"
          >
            See more
            <i
              class="fas fa-arrow-right ml-2 transition-transform duration-300 group-hover:-translate-x-1"
            ></i>
          </a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { CloudIcon, CodeBracketIcon, DevicePhoneMobileIcon } from "@heroicons/vue/24/outline";

const services = ref([
  {
    icon: CodeBracketIcon,
    iconColor: "#60a5fa",
    iconBg: "rgba(96, 165, 250, 0.15)",
    title: "Custom software & automation",
    description:
      "Full-stack product pods that own discovery, delivery, and documentation. Built to plug into your ops.",
    shapes: [{ bg: "#60a5fa" }, { bg: "#8b5cf6" }],
    pulse: true,
  },
  {
    icon: DevicePhoneMobileIcon,
    iconColor: "#8b5cf6",
    iconBg: "rgba(139, 92, 246, 0.15)",
    title: "Mobile app development",
    description:
      "Native and hybrid builds with shared design tokens so your brand feels identical online and offline.",
    shapes: [{ bg: "#8b5cf6" }, { bg: "#60a5fa" }],
    pulse: false,
  },
  {
    icon: CloudIcon,
    iconColor: "#10b981",
    iconBg: "rgba(16, 185, 129, 0.15)",
    title: "Cloud & platform engineering",
    description:
      "Scalable infrastructure, observability, and CI/CD that keep every release predictable.",
    shapes: [{ bg: "#10b981" }, { bg: "#f59e0b" }],
    pulse: true,
  },
]);

</script>

<style scoped>
.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 15s infinite linear;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: -30px;
  right: -30px;
  animation-delay: 0s;
  animation-duration: 20s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  bottom: 20px;
  left: -20px;
  animation-delay: -5s;
  animation-duration: 25s;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(20px, 20px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.pulse-animation {
  position: relative;
}

.pulse-animation:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  border-radius: 50%;
  background: transparent;
  border: 2px solid rgba(59, 130, 246, 0.3);
  animation: pulse 2s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% {
    width: 120%;
    height: 120%;
    opacity: 1;
  }
  100% {
    width: 160%;
    height: 160%;
    opacity: 0;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .service-card {
    padding: 7.5rem 5rem;
  }

  .cta-title {
    font-size: 1.8rem;
  }
}
</style>
