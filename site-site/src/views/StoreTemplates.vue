<script setup>
import { onMounted, ref, computed, defineAsyncComponent, inject } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { SITE } from "@/gql/site";

</script>
<template>
  <div class="w-full min-h-screen-header pt-[60px]">
    <div class="pt-16 lg:pt-32">
      <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl mb-8 flex justify-between">
        <div class="absolute inset-0 z-0"><img
            src="https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/5/grid-pattern.png" alt=""
            class="object-cover w-full h-full"></div>
        <div class="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div class="max-w-3xl mx-auto text-center">
            <div class="relative">
              <div
                class="absolute z-0 duration-1000 -inset-2 transitiona-all opacity-20 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200">
              </div>
              <h1 class="text-3xl font-semibold text-gray-900 sm:text-4xl lg:text-5xl lg:leading-tight relative z-10">
                Landing page templates for
                <span style="color: rgb(65, 82, 255);">Webflow</span> &amp;
                <span style="color: rgb(23, 189, 202);">Tailwind</span>.
              </h1>
            </div>
            <p class="max-w-2xl mx-auto mt-6 text-base font-normal leading-7 text-gray-500">
              Building a beautiful landing page has never been easier. Find your
              favorite template, copy and paste the code in your project and go
              live. No design skills needed.
            </p>
          </div>
        </div>
      </div>
      <div
        class="hidden lg:grid grid-cols-1 mx-auto sm:grid-cols-3 max-w-7xl gap-x-8 gap-y-8 sm:gap-y-12 mt-8 relative z-10">
        <div class="flex items-center">
          <div class="flex items-center justify-center bg-white border border-gray-200 shadow-md rounded-2xl w-16 h-16">
            <img src="https://cdn.rareblocks.xyz/collection/clarity/images/cta/7/command-symbol.svg" alt=""
              class="md:w-5 md:h-5 w-3 h-3"> <span
              class="text-[16px] md:text-[28px] font-bold text-gray-900 font-pj ml-1 inline-flex">
              C
            </span></div>
          <div class="ml-4">
            <h3 class="text-base font-bold text-gray-900">Copy the code</h3>
            <p class="mt-1 text-sm font-normal text-gray-600">
              Pick your favorite template
            </p>
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center justify-center bg-white border border-gray-200 shadow-md rounded-2xl w-16 h-16">
            <img src="https://cdn.rareblocks.xyz/collection/clarity/images/cta/7/command-symbol.svg" alt=""
              class="md:w-5 md:h-5 w-3 h-3"> <span
              class="text-[16px] md:text-[28px] font-bold text-gray-900 font-pj ml-1 inline-flex">
              V
            </span></div>
          <div class="ml-4">
            <h3 class="text-base font-bold text-gray-900">Paste anywhere</h3>
            <p class="mt-1 text-sm font-normal text-gray-600">
              Paste into your project
            </p>
          </div>
        </div>
        <div class="flex items-center"><svg width="44" height="30" viewBox="0 0 22 15" fill="none"
            xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
            <path
              d="M15.78 4.32C15.78 4.32 14.05 9.74 13.92 10.2C13.87 9.74 12.61 0 12.61 0C9.66 0 8.09 2.09 7.26 4.32C7.26 4.32 5.16 9.76 4.99 10.22C4.98 9.79 4.67 4.38 4.67 4.38C4.49 1.66 2.01 0.0100002 0 0.0100002L2.42 14.77C5.51 14.76 7.17 12.67 8.04 10.45C8.04 10.45 9.89 5.65 9.97 5.43C9.99 5.64 11.3 14.77 11.3 14.77C14.39 14.77 16.06 12.81 16.96 10.67L21.28 0C18.22 0 16.61 2.09 15.78 4.32Z"
              fill="#4652F6"></path>
          </svg>
          <div class="ml-4">
            <h3 class="text-base font-bold text-gray-900">Use everywhere</h3>
            <p class="mt-1 text-sm font-normal text-gray-600">
              Available for wide variaty of tools/frameworks
            </p>
          </div>
        </div>
      </div>
      <section id="kits" class="bg-white">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 mt-16">
          <div class="grid grid-cols-1 mt-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 sm:mt-12 sm:gap-8">
            <div class="relative group text-center">
              <div class="relative">
                <div class="overflow-hidden rounded-xl border border-gray-200"><a
                    href="/store/templates/62c7e40ef2dca75c86e1ac7a" class="block" rel="nofollow"><img
                      src="https://landingfoliocom.imgix.net/store/components/1657267229589-552240bf-9ff8-487e-ad03-7fd819059972.png"
                      class="object-cover w-full h-full group-hover:scale-105 transition-transform v-lazy-image v-lazy-image-loaded"
                      alt=""></a>
                </div>
              </div>
              <div class="flex items-center justify-between mt-4 px-2">
                <div class="flex items-center justify-start space-x-2"><a
                    href="/store/templates/62c7e40ef2dca75c86e1ac7a" class="block">
                    <h3 class="text-base font-bold text-gray-900">
                      Single Page Template
                    </h3>
                  </a></div>
                <div class="flex space-x-1.5"><svg xmlns="http://www.w3.org/2000/svg" height="64"
                    preserveAspectRatio="xMidYMid" width="64" viewBox="0 0 256 153.6" class="w-4 h-4"
                    style="color: rgb(23, 189, 202);">
                    <linearGradient id="a" x1="-2.778%" y1="32%" y2="67.556%">
                      <stop offset="0" stop-color="#2298bd"></stop>
                      <stop offset="1" stop-color="#0ed7b5"></stop>
                    </linearGradient>
                    <path
                      d="M128 0C93.867 0 72.533 17.067 64 51.2 76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0zM64 76.8C29.867 76.8 8.533 93.867 0 128c12.8-17.067 27.733-23.467 44.8-19.2 9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8z"
                      fill="url(#a)"></path>
                  </svg><svg width="44" height="30" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4" style="color: rgb(65, 82, 255);">
                    <path
                      d="M15.78 4.32C15.78 4.32 14.05 9.74 13.92 10.2C13.87 9.74 12.61 0 12.61 0C9.66 0 8.09 2.09 7.26 4.32C7.26 4.32 5.16 9.76 4.99 10.22C4.98 9.79 4.67 4.38 4.67 4.38C4.49 1.66 2.01 0.0100002 0 0.0100002L2.42 14.77C5.51 14.76 7.17 12.67 8.04 10.45C8.04 10.45 9.89 5.65 9.97 5.43C9.99 5.64 11.3 14.77 11.3 14.77C14.39 14.77 16.06 12.81 16.96 10.67L21.28 0C18.22 0 16.61 2.09 15.78 4.32Z"
                      fill="#4652F6"></path>
                  </svg></div>
              </div>
            </div>
            
          </div>
        </div>
      </section> <!---->
    </div>
  </div>
</template>
