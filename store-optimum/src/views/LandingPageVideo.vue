<template>
  <div class="w-[30%] mx-auto relative">
    <!-- Background Video -->
    <video
      ref="videoRef"
      class="z-0 top-0 left-0 w-full h-full object-cover rounded-xl"
      autoplay
      muted
      loop
      playsinline
      @loadeddata="handleVideoLoaded"
    >
      <source
        src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/video/87j0qky7xjwtnzg.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>

    <!-- Overlay -->
    <div class="absolute inset-0 z-10 bg-black/50"></div>

    <!-- Video Play Button with Waves -->
    <div
      class="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
    >
      <div
        v-if="activeFeature"
        @click="toggleShowVideo"
        class="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center cursor-pointer"
      >
        <!-- Waves -->
        <span
          v-for="i in 3"
          :key="i"
          class="absolute rounded-full bg-amber-200 opacity-50 animate-wave"
          :style="{
            animationDelay: `${i - 1}s`,
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
          }"
        ></span>

        <!-- Inner Circle -->
        <span class="absolute inset-2 rounded-full bg-white z-10"></span>

        <!-- Play Icon -->
        <PlayIcon
          class="relative z-20 text-amber-600 w-8 h-8 sm:w-10 sm:h-10"
        />
      </div>
    </div>

    <!-- Video Modal -->
    <div v-if="showVideo">
      <div
        class="fixed inset-0 z-40 bg-black/70"
        @click="showVideo = false"
      ></div>
      <div
        class="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-7xl"
      >
        <button
          @click="showVideo = false"
          class="absolute -top-10 -right-2 md:right-0 text-white text-4xl z-50"
        >
          &times;
        </button>
        <div class="aspect-video w-full">
          <iframe
            src="https://player.vimeo.com/video/1109004822?h=8272103f6e&autoplay=1"
            class="w-full h-full"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
            title="Vimeo video player"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlayIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

const showVideo = ref(false);
const activeFeature = ref(true);
const videoRef = ref(null);

const toggleShowVideo = () => {
  showVideo.value = !showVideo.value;
};

const buttonSize = 80; // Size of outer wave
const handleVideoLoaded = () => {
  // Video is loaded
};
</script>

<style>
/* Wave animation */
@keyframes wave {
  0% {
    transform: scale(0.3);
    opacity: 0.7;
  }
  50% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.animate-wave {
  position: absolute;
  border-radius: 50%;
  animation: wave 2s ease-in-out infinite;
}

/* Tailwind override for smoother ping */
@keyframes ping-smooth {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping-smooth {
  animation: ping-smooth 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
