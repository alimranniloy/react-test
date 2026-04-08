<template>
  <div class="border pt-24 bg-black relative landing-page container">
    <!-- <div class="absolute top-0 left-0" style="z-index: 0"> -->
    <!-- <img
      alt=""
      loading="lazy"
      width="1115"
      height="744"
      decoding="async"
      data-nimg="1"
      class="z-[0] opacity-[8%]"
      src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/2e441a2c-6e28-4a2c-8dc1-3c480194bc58.svg"
      style="color: transparent; z-index: 1"
    /> -->
    <!-- </div> -->

    <!-- Content -->
    <div class="flex items-center justify-start text-white w-[50%]">
      <div class="text-center">
        <h2 class="font-semibold text-3xl md:text-6xl text-white">
          <span class="text-amber-600">Centralize and automate</span> <br />
          Your E-commerce & Retail Business
        </h2>
        <p class="font-medium text-base sm:text-xl mt-5">
          Lorem ipsum dolor, sit
        </p>

        <div
          class="flex-col sm:flex-row flex items-center item-center justify-center mt-4"
        >
          <button
            class="py-3 px-7 bg-amber-600 font-semibold text-xl flex items-center justify-center rounded-md cursor-pointer"
          >
            <span>Get Started</span>
            <span>
              <ArrowRightIcon class="w-7 ml-3" />
            </span>
          </button>

          <button
            class="py-3 px-7 border font-semibold text-xl flex items-center justify-center rounded-md cursor-pointer mt-3 sm:mt-0 sm:ml-3"
          >
            <span>Get Started</span>
            <span>
              <ArrowRightIcon class="w-7 ml-3" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightIcon } from "@heroicons/vue/24/outline";
</script>

<style>
.landing-page {
  position: relative;
  height: 80vh;
}
.landing-page::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  /* background: url("https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/2e441a2c-6e28-4a2c-8dc1-3c480194bc58.svg"); */
  background-repeat: no-repeat;
  background-size: content;
  width: 100%;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-position: center center;
}
</style>
