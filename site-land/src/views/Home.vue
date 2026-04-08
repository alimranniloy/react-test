<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import NavBar from "@/components/layout/NavBar.vue";
import FooterBar from "@/components/layout/FooterBar.vue";
import Button from "@/components/ui/Button.vue";
import Badge from "@/components/ui/Badge.vue";
import Card from "@/components/ui/Card.vue";
import Input from "@/components/ui/Input.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import StatPill from "@/components/ui/StatPill.vue";
import PropertyBannerSlider from "@/components/PropertyBannerSlider.vue";
import { AutoPlay } from "@egjs/store-alixa-plugins";
const sliderPlugin = [
  new AutoPlay({ duration: 3000, direction: "NEXT", stopOnHover: true }),
];
const communityCards = [
  {
    name: "Bashundhara R/A",
    properties: 24,
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Jolshiri Abashon",
    properties: 31,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Purbachal",
    properties: 18,
    image:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Uttara",
    properties: 12,
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
  },
];

const featuredProjects = [
  {
    name: "FDL Kolpotoru",
    location: "Jolshiri Abashon, Rupganj",
    type: "Apartment Building · Single Unit",
    beds: 4,
    baths: 4,
    area: "2850 sft",
    added: "Jul 19, 2023",
    status: ["On Sale", "Fully Serviced"],
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Fortress Skylark",
    location: "Bashundhara R/A",
    type: "Penthouse Collection",
    beds: 4,
    baths: 4,
    area: "5700 sft",
    added: "Aug 4, 2023",
    status: ["Ongoing"],
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "FDL Tuttoputtu",
    location: "Jolshiri Abashon",
    type: "Apartment Building · Single Unit",
    beds: 4,
    baths: 4,
    area: "2850 sft",
    added: "Sep 24, 2023",
    status: ["Ongoing"],
    image:
      "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=1200&q=80",
  },
];

const agents = [
  {
    name: "Proshanta Kumar",
    role: "Sr. Manager (Sales)",
    email: "proshanta@fortress.com.bd",
    phone: "+880 13137 14079",
    image:
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Tamim Mia",
    role: "Deputy Manager (Sales)",
    email: "tamim@fortress.com.bd",
    phone: "+880 13137 14080",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1200&q=80",
  },
];

const logos = computed(() => [
  {
    name: "Fortress Foundation",
    src: "https://raw.githubusercontent.com/shadcn-ui/extras/main/logos/green-circle.svg",
  },
  {
    name: "FDL",
    src: "https://raw.githubusercontent.com/shadcn-ui/extras/main/logos/triangle-blue.svg",
  },
  {
    name: "Fortress Master Builders",
    src: "https://raw.githubusercontent.com/shadcn-ui/extras/main/logos/hands.svg",
  },
  {
    name: "Agro & Fisheries",
    src: "https://raw.githubusercontent.com/shadcn-ui/extras/main/logos/leaf.svg",
  },
  {
    name: "Fortress Foundation 2",
    src: "https://raw.githubusercontent.com/shadcn-ui/extras/main/logos/green-circle.svg",
  },
]);

const heroSlides = [
  {
    image:
      "https://plus.unsplash.com/premium_photo-1684175656320-5c3f701c082c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1676823547752-1d24e8597047?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    image:
      "https://images.unsplash.com/photo-1580041065738-e72023775cdc?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1684175656154-ac52b3cc2c60?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const activeSlide = ref(0);
let slideTimer = null;

const goToSlide = (index) => {
  activeSlide.value = (index + heroSlides.length) % heroSlides.length;
  restartTimer();
};

const startTimer = () => {
  slideTimer = window.setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % heroSlides.length;
  }, 3000);
};

const restartTimer = () => {
  if (slideTimer) {
    clearInterval(slideTimer);
  }
  startTimer();
};

const stopTimer = () => {
  if (slideTimer) {
    clearInterval(slideTimer);
  }
};

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  stopTimer();
});

const showVideo = ref(false);
const playVideo = () => {
  showVideo.value = true;
};
</script>

<template>
  <div id="top">
    <NavBar />
    <main class="pt-0">
      <section class="relative w-full pb-0">
        <div class="absolute inset-0 h-[340px] w-full bg-gradient-to-b from-white to-sand-50/40" />
        <div
          class="hero-panel relative left-1/2 w-[100vw] max-w-none -translate-x-1/2 overflow-hidden bg-black"
          @mouseenter="stopTimer"
          @mouseleave="startTimer"
        >
          <transition name="fade" mode="out-in">
            <img
              v-if="heroSlides[activeSlide]"
              :key="heroSlides[activeSlide].image"
              :alt="`hero-slide-${activeSlide + 1}`"
              class="absolute inset-0 h-full w-full object-cover opacity-95 transition-all duration-400"
              :src="heroSlides[activeSlide].image"
            />
          </transition>
          <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-black/8 to-black/20" />
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <button
              v-for="(slide, index) in heroSlides"
              :key="slide.image"
              class="h-2.5 rounded-full bg-white/60 transition"
              :class="index === activeSlide ? 'w-8 bg-white' : 'w-3 hover:bg-white/80'"
              @click="goToSlide(index)"
              :aria-label="`Go to slide ${index + 1}`"
            />
          </div>
        </div>
      </section>

      <PropertyBannerSlider />

      <section id="team" class="mx-auto max-w-6xl px-6 pb-16">
        <SectionHeader
          eyebrow="Team"
          title="Meet your dedicated advisors"
          description="A responsive sales team ready to answer every question—no hard sells, just clarity."
        />
        <div class="mt-8 grid gap-6 md:grid-cols-2">
          <Card v-for="agent in agents" :key="agent.email" class="overflow-hidden">
            <div class="grid gap-0 md:grid-cols-[1fr,1.1fr] md:items-center">
              <img :alt="agent.name" :src="agent.image" class="h-full w-full object-cover" />
              <div class="space-y-3 p-6">
                <p class="text-sm font-semibold uppercase tracking-wide text-brand-700">
                  Sales
                </p>
                <h3 class="font-display text-2xl font-semibold">{{ agent.name }}</h3>
                <p class="text-slate-600">{{ agent.role }}</p>
                <div class="flex flex-wrap gap-2 text-sm text-slate-600">
                  <Button variant="outline" size="sm" as="a" :href="`tel:${agent.phone}`">
                    📞 Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    as="a"
                    :href="`https://wa.me/${agent.phone.replace(/[^0-9]/g, '')}`"
                    target="_blank"
                  >
                    💬 WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" as="a" :href="`mailto:${agent.email}`">
                    ✉️ Email
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section class="w-full bg-[#1f2255] py-12 sm:py-16">
        <div class="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 text-center text-white">
          <h2 class="font-display text-2xl font-semibold uppercase tracking-[0.15em] sm:text-3xl">
            Explore our landmark projects
          </h2>
          <div class="relative w-full overflow-hidden rounded-[18px] shadow-xl">
            <template v-if="showVideo">
              <div class="aspect-[16/9] w-full">
                <iframe
                  class="h-full w-full"
                  src="https://www.youtube.com/embed/lNC3JqzaBCQ?autoplay=1&rel=0"
                  title="Landmark projects video"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </template>
            <template v-else>
              <img
                src="https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1600&q=80"
                alt="Landmark project"
                class="h-full max-h-[540px] w-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30"
              />
              <button
                type="button"
                class="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/70 bg-white/15 text-white shadow-lg backdrop-blur-md transition hover:bg-white/25"
                aria-label="Play landmark projects video"
                @click="playVideo"
              >
                ▶
              </button>
            </template>
          </div>
        </div>
      </section>

      <section id="communities" class="mx-auto max-w-6xl px-6 pb-16">
        <SectionHeader
          eyebrow="Communities"
          title="Discover our neighborhoods"
          description="Handpicked locations that balance greenery, connectivity, and vibrant community life."
        />
        <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card v-for="item in communityCards" :key="item.name" class="overflow-hidden">
            <div class="relative h-64 overflow-hidden rounded-[30px]">
              <img :alt="item.name" :src="item.image" class="h-full w-full object-cover" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"
              />
              <div class="absolute bottom-4 left-4 right-4 space-y-2">
                <Badge variant="brand">{{ item.name }}</Badge>
                <div class="flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3">
                  <p class="font-display text-2xl font-semibold text-slate-900">
                    {{ item.properties }}
                  </p>
                  <p class="text-sm text-slate-500">Properties</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="projects" class="mx-auto max-w-6xl px-6 pb-16">
        <SectionHeader
          eyebrow="Featured"
          title="Crafted residences ready to explore"
          description="Select from our latest launches, designed with light, ventilation, and thoughtful amenities."
        />
        <div class="mt-8 grid gap-8 lg:grid-cols-3">
          <Card
            v-for="project in featuredProjects"
            :key="project.name"
            class="flex h-full flex-col overflow-hidden"
          >
            <div class="relative h-64 overflow-hidden">
              <img :alt="project.name" :src="project.image" class="h-full w-full object-cover" />
              <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge v-for="tag in project.status" :key="tag" variant="sand">{{ tag }}</Badge>
              </div>
              <div class="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm">Save</Button>
              </div>
            </div>
            <div class="flex flex-1 flex-col gap-4 p-6">
              <div class="space-y-1">
                <h3 class="font-display text-xl font-semibold text-slate-900">
                  {{ project.name }}
                </h3>
                <p class="text-slate-600">{{ project.location }}</p>
                <p class="text-sm font-medium text-brand-700">{{ project.type }}</p>
              </div>
              <div class="flex items-center gap-4 text-sm text-slate-600">
                <span>🛏️ {{ project.beds }} beds</span>
                <span>🛁 {{ project.baths }} baths</span>
                <span>📐 {{ project.area }}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-slate-500">
                <span>Added: {{ project.added }}</span>
                <a class="font-semibold text-brand-700 hover:underline" href="#contact">
                  Book a visit →
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="about" class="mx-auto max-w-6xl px-6 pb-16">
        <div class="grid gap-8 rounded-[28px] bg-white/90 p-8 shadow-md lg:grid-cols-[1.05fr_0.95fr]">
          <div class="space-y-4">
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Why Fortress
            </p>
            <h3 class="font-display text-3xl font-semibold leading-tight text-slate-900">
              Future-proof spaces, delivered with precision.
            </h3>
            <p class="text-base text-slate-700">
              From structural engineering to interior finishes, we obsess over detail. Our teams
              prioritize cross-ventilation, daylight, and modern amenities so every square foot
              works for you.
            </p>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl bg-emerald-50/70 p-4 text-slate-800">
                <p class="text-sm font-semibold text-emerald-800">Transparent delivery</p>
                <p class="text-sm text-slate-700">
                  Milestone updates, on-time handovers, and open books throughout.
                </p>
              </div>
              <div class="rounded-2xl bg-amber-50/80 p-4 text-slate-800">
                <p class="text-sm font-semibold text-amber-900">Community-first</p>
                <p class="text-sm text-slate-700">
                  Landscaped play areas, rooftop greens, and walkable blocks to keep life balanced.
                </p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4 text-slate-800">
                <p class="text-sm font-semibold text-slate-900">Engineering excellence</p>
                <p class="text-sm text-slate-700">
                  Seismic-ready frames, premium materials, and QC at every stage.
                </p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4 text-slate-800">
                <p class="text-sm font-semibold text-slate-900">After-sales care</p>
                <p class="text-sm text-slate-700">
                  Dedicated maintenance desk with 24/7 support for residents.
                </p>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 pt-2">
              <Button size="md" as="a" href="#contact">Download brochure</Button>
              <Button size="md" variant="secondary" as="a" href="#projects">
                View current projects
              </Button>
            </div>
          </div>
          <div class="relative overflow-hidden rounded-[24px] bg-slate-100">
            <img
              alt="Modern living"
              class="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?auto=format&fit=crop&w=1400&q=80"
            />
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 pb-20">
        <div
          class="overflow-hidden rounded-[28px] bg-gradient-to-r from-emerald-700/90 via-emerald-600/85 to-amber-500/80 p-8 shadow-lg md:p-12"
        >
          <div class="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div class="space-y-4 text-white">
              <p class="text-xs uppercase tracking-[0.25em] text-white/80">Move-in ready</p>
              <h3 class="font-display text-3xl font-semibold leading-tight md:text-4xl">
                Secure your preferred unit today.
              </h3>
              <p class="text-white/85">
                Tell us your preferred city, size, and timeline—we’ll handpick options and arrange a
                guided tour with our senior advisors.
              </p>
              <div class="flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" as="a" href="#contact">Get matched</Button>
                <Button size="lg" variant="ghost" as="a" href="tel:+8801313714079">
                  Call sales desk
                </Button>
              </div>
            </div>
            <div class="rounded-3xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md">
              <div class="grid gap-3 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-white/85">Available slots this week</span>
                  <span class="font-semibold text-white">14</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-white/85">Average response time</span>
                  <span class="font-semibold text-white">1 hour</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-white/85">Project handover reliability</span>
                  <span class="font-semibold text-white">98%</span>
                </div>
              </div>
              <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input placeholder="Your email" class="flex-1" />
                <Button variant="secondary" size="md" class="w-full sm:w-auto">Notify me</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <FooterBar />
  </div>
</template>

<style>
.parallax-bridge {
  position: relative;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.parallax-bridge__beam {
  width: 100%;
  max-width: 900px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(29, 140, 102, 0) 0%,
    rgba(29, 140, 102, 0.45) 20%,
    rgba(240, 185, 11, 0.55) 50%,
    rgba(29, 140, 102, 0.45) 80%,
    rgba(29, 140, 102, 0) 100%
  );
  box-shadow: 0 0 40px rgba(240, 185, 11, 0.25);
}

.parallax-bridge__beam--alt {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(12, 74, 110, 0.4) 25%,
    rgba(236, 72, 153, 0.45) 50%,
    rgba(12, 74, 110, 0.4) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  box-shadow: 0 0 35px rgba(12, 74, 110, 0.25);
}

.hero-panel {
  min-height: clamp(360px, 55vw, 760px);
}
</style>
