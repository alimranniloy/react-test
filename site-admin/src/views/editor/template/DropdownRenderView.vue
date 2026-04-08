<template>
  <div
    class="absolute text-white border shadow-lg rounded-lg z-[120] flex items-center"
    :class="containerClasses"
  >
    <!-- <div class="flex flex-col gap-1 pl-2 pr-1">
      <div v-if="title" class="text-xs font-semibold leading-none">{{ title }}</div>
      <div class="text-[10px] uppercase tracking-wide text-white/70">
        {{ anchor === 'bottom' ? 'Below element' : 'Above element' }}
      </div>
    </div> -->
    <div class="flex h-6 items-center gap-2 px-2 z-40">
      <button
        class="rounded-md p-1 transition hover:bg-white/20 focus:outline-none"
        title="Insert above"
        @click="onSelect('insert-above')"
      >
        <ArrowUpTrayIcon class="h-4 w-4" />
      </button>
      <button
        class="rounded-md p-1 transition hover:bg-white/20 focus:outline-none"
        title="Insert below"
        @click="onSelect('insert-below')"
      >
        <ArrowDownTrayIcon class="h-4 w-4" />
      </button>
      <button
        class="rounded-md p-1 transition hover:bg-white/20 focus:outline-none"
        title="Insert child"
        @click="onSelect('insert-child')"
      >
        <PlusIcon class="h-4 w-4" />
      </button>
      <button
        class="rounded-md p-1 transition hover:bg-white/20 focus:outline-none"
        title="Duplicate"
        @click="onSelect('duplicate')"
      >
        <DocumentDuplicateIcon class="h-4 w-4" />
      </button>
      <button
        class="rounded-md p-1 transition hover:bg-white/20 focus:outline-none"
        title="Move up"
        @click="onSelect('move-up')"
      >
        <ArrowUpIcon class="h-4 w-4" />
      </button>
      <button
        class="rounded-md p-1 transition hover:bg-white/20 focus:outline-none"
        title="Move down"
        @click="onSelect('move-down')"
      >
        <ArrowDownIcon class="h-4 w-4" />
      </button>
      <button
        class="rounded-md p-1 transition hover:bg-white/20 focus:outline-none"
        title="Send to top"
        @click="onSelect('send-top')"
      >
        <ArrowLongUpIcon class="h-4 w-4" />
      </button>
      <button
        class="rounded-md p-1 transition hover:bg-white/20 focus:outline-none"
        title="Send to bottom"
        @click="onSelect('send-bottom')"
      >
        <ArrowLongDownIcon class="h-4 w-4" />
      </button>
      <button
        class="rounded-md p-1 transition hover:bg-white/20 focus:outline-none"
        title="Delete"
        @click="onDelete()"
      >
        <TrashIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
  <div
    v-if="isTag"
    class="absolute w-40 h-6 flex items-center bg-amber-500 m-auto left-0 right-0 top-0 -bottom-14 rounded-md"
  >
    <button
      class="font-normal flex items-center px-2 py-1"
      @click="onSelect('insert-below')"
    >
      <PlusIcon class="h-4 w-4" />Add component
    </button>
  </div>
</template>
<script setup>
import { computed } from "vue";
import {
  PlusIcon,
  TrashIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DocumentDuplicateIcon,
  ArrowLongUpIcon,
  ArrowLongDownIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  isTag: {
    type: Boolean,
    required: true,
  },
  isCenter: {
    type: Boolean,
    required: false,
  },
  isElement: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  anchor: {
    type: String,
    default: "top",
  },
});
const emit = defineEmits(["select", "delete"]);
const containerClasses = computed(() => {
  const palette = props.isElement
    ? "border-red-500 bg-red-500 gap-2 pr-2"
    : "border-blue-500 bg-blue-500 gap-2 pr-2";
  const horizontal = props.isElement
    ? "right-0 left-auto"
    : "left-0 right-auto";
  const vertical =
    props.anchor === "bottom"
      ? "top-[calc(100%+0.5rem)] translate-y-0"
      : "-top-3 -translate-y-full";
  return [palette, horizontal, vertical];
});
const onSelect = (data) => {
  emit("select", data);
};
const onDelete = () => {
  emit("delete", true);
};
</script>
