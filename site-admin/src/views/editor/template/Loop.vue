<template>
  <div
    class="flex px-4 py-1.5 flex-col border-b border-solid border-outline setting-section last:border-none"
  >
    <div class="flex relative items-center cursor-pointer mt-2 mb-1">
      <header class="flex flex-1 items-center justify-between">
        <span class="text-slate-800 text-sm font-medium flex items-center"
          >Loop<span data-state="closed"
            ><div class="cursor-pointer ml-2 text-inherit">
              <InformationCircleIcon
                class="h-4 w-4"
              ></InformationCircleIcon></div></span></span
        ><button
          class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-1.5 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3 ml-1"
        >
          <ChevronRightIcon class="h-4 w-4"></ChevronRightIcon>
        </button>
      </header>
    </div>
    <section class="-mx-4">
      <div class="py-2 pb-4 px-4 h-full">
        <div class="flex gap-2.5 items-center">
          <div class="w-full relative">
            <div
              class="group flex-1 relative border border-solid border-outline flex items-center rounded-md "
            >
              <input
                placeholder="array"
                class="bg-transparent outline-none shadow-none py-3 px-3 text-black/80 transition border-none relative w-full text-xs"
                value=""
              /><button
                class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-1.5 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3 bg-none border-none mr-px opacity-0 group-hover:opacity-100"
              >
                <LinkIcon class="h-4 w-4"></LinkIcon>
              </button>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="mb-4 flex items-center">
            <span class="text-xs flex-1 text-gray-500">Expose Variables</span
            ><button
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-blue-600 hover:text-blue-500 text-xs [&amp;>svg]:w-4 [&amp;>svg]:h-4 p-0"
            >
              Add index variable
            </button>
          </div>
          <div class="mt-3 flex gap-2.5 items-center">
            <span class="text-gray-500 text-xs">For</span>
            <div
              class="group relative border border-solid border-outline flex items-center rounded-md  flex-1"
            >
              <input
                placeholder="item"
                class="bg-transparent outline-none shadow-none py-3 px-3 text-black/80 transition border-none relative w-full text-xs"
                value=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import {
  ChevronRightIcon,
  PlusIcon,
  LinkIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import * as t from "@rekajs/types";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import { ref, inject, computed, defineAsyncComponent } from "vue";
const reka = inject("reka");
</script>
