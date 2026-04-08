<template>
  <div
    class="flex px-4 py-1.5 flex-col border-b border-solid border-outline setting-section last:border-none"
  >
    <div class="flex relative items-center cursor-pointer mt-2 mb-1">
      <header class="flex flex-1 items-center">
        <span class="text-slate-800 text-sm font-medium flex items-center"
          >Class List<span data-state="closed"
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
      <button
        class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-1.5 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3"
      >
        <PlusIcon class="h-4 w-4"></PlusIcon>
      </button>
    </div>
    <section class="-mx-4">
      <div class="py-2 pb-4 px-4 h-full">
        <div>
          <div
            class="group grid grid-cols-[80px_1fr] relative gap-0 border-solid border border-outline -mb-px first:rounded-tr-md first:rounded-tl-md last:rounded-br-md last:rounded-bl-md [&amp;:not:last-child]:border-b-transparent [&amp;_input]:rounded-none [&amp;_input]:border-none [&amp;_input]:border-r [&amp;_input]:border-r-solid"
          >
            <div
              class="group flex-1 relative border border-solid border-outline flex items-center  pair-input-id-field rounded-none border-l-0 border-t-0 border-b-0 border-r border-r-outline"
            >
              <input
                placeholder="CSS class"
                class="bg-transparent outline-none shadow-none py-3 px-3 text-black/80 transition border-none relative w-full text-xs overflow-hidden text-ellipsis"
                value=""
              />
            </div>
            <div
              class="w-full grid grid-cols-[1fr_auto_auto] items-center relative"
            >
              <div class="w-full static">
                <div
                  class="group flex-1 relative border border-outline flex items-center  rounded-none border-none"
                >
                  <input
                    placeholder="Condition"
                    class="bg-transparent outline-none shadow-none py-3 px-3 text-black/80 transition border-none relative w-full text-xs"
                    value=""
                  />
                </div>
              </div>
              <button
                class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-1.5 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3 opacity-0 m-0 group-hover:opacity-100"
              >
                <LinkIcon class="h-4 w-4"></LinkIcon>
              </button>
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
