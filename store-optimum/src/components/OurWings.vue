<template>
  <section
    ref="mainRef"
    class="relative w-full mx-auto font-sora text-white"
    :style="{ height: height > 0 ? `${height}px` : '80vh' }"
    id="gallery-end-target"
  >
    <div class="relative h-full w-full overflow-hidden">
      <section
        v-for="(slide, i) in slides"
        :key="slide.id"
        class="slide w-full !overflow-x-hidden"
        :ref="(el) => (slideRefs[i] = el)"
      >
        <div
          class="slide__outer !overflow-x-hidden"
          :ref="(el) => (outerWrapperRefs[i] = el)"
        >
          <div
            class="slide__inner !overflow-x-hidden"
            :ref="(el) => (innerWrapperRefs[i] = el)"
          >
            <div
              class="slide__content !overflow-x-hidden"
              :style="{ backgroundColor: slide.bgColor }"
            >
              <div class="slide__container !overflow-x-hidden">
                <h2
                  class="slide__heading"
                  :ref="(el) => (headingRefs[i] = el)"
                  :style="{ '--width': 200 }"
                >
                  {{ slide.heading }}
                </h2>
                <figure class="slide__img-cont">
                  <img
                    :src="slide.imgSrc"
                    :alt="slide.heading"
                    class="slide__img"
                    :ref="(el) => (slideImageRefs[i] = el)"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="overlay">
        <div class="overlay__content">
          <p class="overlay__count">0<span ref="countRef">1</span></p>
          <figure class="overlay__img-cont">
            <img
              v-for="(image, i) in overlayImages"
              :key="image.id"
              :src="image.src"
              class="image"
              alt=""
              :ref="(el) => (overlayImageRefs[i] = el)"
            />
          </figure>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Define the 'height' prop that the parent will pass
const props = defineProps({
  height: {
    type: Number,
    required: true,
  },
});

const slides = ref([
  {
    id: 1,
    heading: "KHATA",
    imgSrc:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/5bb52a57-cfef-4c08-b35b-71a22add4cb5.png",
    link: "https://khata.bponi.com/",
    bgColor: "#6d597a",
  },
  {
    id: 2,
    heading: "FUND BPONI",
    imgSrc:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/4eef89fd-97b2-4930-802a-fd021e7ad699.png",
    link: "https://fund.bponi.com/",
    bgColor: "#b56576",
  },
  {
    id: 3,
    heading: "BPONI SITE",
    imgSrc:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/4eef89fd-97b2-4930-802a-fd021e7ad699.png",
    bgColor: "#355070",
  },
  {
    id: 4,
    heading: "AMAR TRAVELS",
    imgSrc:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/63c2aa63-4fa1-4025-93e6-0391349b1cb0.png",
    link: "https://site.bponi.com/",
    bgColor: "#9a8c98",
  },
  {
    id: 5,
    heading: "BPONI",
    imgSrc:
      "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/63c2aa63-4fa1-4025-93e6-0391349b1cb0.png",
    link: "https://bponi.com/",
    bgColor: "#9a8c98",
  },
]);
const overlayImages = ref([
  {
    id: 1,
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/63c2aa63-4fa1-4025-93e6-0391349b1cb0.png",
  },
  {
    id: 2,
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/63c2aa63-4fa1-4025-93e6-0391349b1cb0.png",
  },
  {
    id: 3,
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/63c2aa63-4fa1-4025-93e6-0391349b1cb0.png",
  },
  {
    id: 4,
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/63c2aa63-4fa1-4025-93e6-0391349b1cb0.png",
  },
  {
    id: 5,
    src: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/63c2aa63-4fa1-4025-93e6-0391349b1cb0.png",
  },
]);
const mainRef = ref(null);
const slideRefs = ref([]);
const outerWrapperRefs = ref([]);
const innerWrapperRefs = ref([]);
const headingRefs = ref([]);
const slideImageRefs = ref([]);
const overlayImageRefs = ref([]);
const countRef = ref(null);

let ctx;
let masterTl;

const initAnimations = () => {
  if (!mainRef.value) return;
  const reversedOverlayImages = overlayImageRefs.value.slice().reverse();

  ctx = gsap.context(() => {
    gsap.set(outerWrapperRefs.value, { xPercent: 100 });
    gsap.set(innerWrapperRefs.value, { xPercent: -100 });
    gsap.set(slideRefs.value[0].querySelector(".slide__outer"), {
      xPercent: 0,
    });
    gsap.set(slideRefs.value[0].querySelector(".slide__inner"), {
      xPercent: 0,
    });
    gsap.set(slideRefs.value, { visibility: "hidden" });
    gsap.set(slideRefs.value[0], { visibility: "visible" });

    masterTl = gsap.timeline({
      defaults: { duration: 1, ease: "none" },
      scrollTrigger: {
        trigger: mainRef.value,
        start: "top top",
        end: () => `+=${slides.value.length * 800}`,
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (slides.value.length - 1),
          duration: 0.3,
          ease: "power1.inOut",
        },
      },
    });

    slides.value.forEach((slide, index) => {
      if (index === 0) return;
      const prevSlideIndex = index - 1;
      const direction = 1;

      if (index > 1) {
        masterTl.to({}, { duration: 0.5 }); // Pause between slides
      }

      masterTl
        .set(
          slideRefs.value[index],
          { zIndex: 1, visibility: "visible" },
          `slide${index}`
        )
        .to(
          outerWrapperRefs.value[prevSlideIndex],
          { xPercent: -100 * direction },
          `slide${index}`
        )
        .to(
          innerWrapperRefs.value[prevSlideIndex],
          { xPercent: 100 * direction },
          `slide${index}`
        )
        .fromTo(
          outerWrapperRefs.value[index],
          { xPercent: 100 * direction },
          { xPercent: 0 },
          `slide${index}`
        )
        .fromTo(
          innerWrapperRefs.value[index],
          { xPercent: -100 * direction },
          { xPercent: 0 },
          `slide${index}`
        )
        .to(
          headingRefs.value[prevSlideIndex],
          { "--width": 800, xPercent: 30 * direction },
          `slide${index}`
        )
        .fromTo(
          headingRefs.value[index],
          { "--width": 800, xPercent: -30 * direction },
          { "--width": 200, xPercent: 0 },
          `slide${index}`
        )
        .fromTo(
          reversedOverlayImages[prevSlideIndex],
          { xPercent: 0, scale: 1 },
          { xPercent: -125 * direction, scale: 1.3 },
          `slide${index}`
        )
        .fromTo(
          reversedOverlayImages[index],
          { xPercent: 125 * direction, scale: 1.3 },
          { xPercent: 0, scale: 1 },
          `slide${index}`
        )
        .fromTo(
          slideImageRefs.value[index],
          { scale: 2 },
          { scale: 1 },
          `slide${index}`
        )
        .set(countRef.value, { textContent: index + 1 }, `slide${index}+=0.1`)
        .set(slideRefs.value[prevSlideIndex], { zIndex: 0 });
    });
  }, mainRef.value);
};

onMounted(() => {
  initAnimations();
});

onBeforeUnmount(() => {
  if (ctx) {
    ctx.revert();
  }
});
</script>

<style scoped>
.slide {
  @apply absolute top-0 left-0 h-full w-full;
}
.slide__outer,
.slide__inner {
  @apply w-full h-full overflow-y-hidden;
}
.slide__content {
  @apply flex items-center justify-center absolute top-0 h-full w-full;
}
.slide__container {
  @apply relative max-w-[1400px] w-full mx-auto h-full grid grid-cols-10 grid-rows-[repeat(10,_minmax(0,_1fr))] px-4;
}
.slide__heading {
  font-family: "Bandeins Sans & Strange Variable", sans-serif;
  font-weight: 900;
  font-variation-settings: "wdth" var(--width);
  mix-blend-mode: difference;
  font-size: clamp(3rem, 12vw, 8rem);
  @apply block text-left m-0 p-0 text-[#f2f1fc] z-[999] absolute top-24 left-8;
}
.slide__img-cont {
  @apply mt-8 overflow-hidden;
  grid-area: 3 / 1 / 8 / 8;
}
.slide__img {
  @apply w-full h-full object-cover;
}
.overlay {
  @apply absolute top-0 bottom-0 left-0 right-0 z-[2] pointer-events-none;
}
.overlay__content {
  @apply max-w-[1400px] w-full mx-auto px-4 h-full grid grid-cols-10 grid-rows-[repeat(10,_minmax(0,_1fr))];
}
.overlay__img-cont {
  @apply relative overflow-hidden m-0;
  grid-area: 4 / 4 / 10 / 11;
}
.overlay__img-cont .image {
  @apply absolute w-full h-full object-cover;
}
.overlay__count {
  font-size: clamp(2rem, 3vw, 4rem);
  @apply text-right m-0 p-0 border-b-[5px] border-white;
  grid-area: 3 / 10 / 4 / 10;
}
@media screen and (min-width: 900px) {
  .overlay__content,
  .slide__container {
    @apply px-12;
  }
  .overlay__img-cont {
    grid-area: 4 / 5 / 10 / 11;
  }
  .overlay__count {
    grid-area: 2 / 10 / 3 / 11;
  }
  .slide__img-cont {
    @apply mt-0;
    grid-area: 3 / 2 / 9 / 7;
  }
  .slide__heading {
    grid-area: 1 / 1 / 5 / 10;
  }
}
</style>
