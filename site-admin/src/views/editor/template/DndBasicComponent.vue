<template>
  <div
    :ref="drag"
    role="listitem"
    tabindex="0"
    data-testid="basic-block"
    :class="[
      'drop-container group flex cursor-pointer select-none flex-col items-center rounded-lg border border-transparent bg-slate-100 px-3 py-3 text-center transition-all hover:-translate-y-0.5 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      isDragging ? 'opacity-60 ring-2 ring-primary-400 ring-offset-2' : '',
    ]"
    @click="handleClick"
    @keyup.enter.prevent="handleClick"
    @keyup.space.prevent="handleClick"
  >
    <Icon
      :name="item.icon"
      :className="'h-5 w-5 transition-transform group-hover:scale-110'"
    />
    <span class="mt-2 text-sm font-medium text-slate-700">{{ item.label }}</span>
  </div>
</template>

<script setup>
import { watch, computed, inject, defineAsyncComponent } from "vue";
import { useDrag } from "vue3-dnd";
import { toRefs } from "@vueuse/core";
import { DND_PAYLOAD_SOURCES } from "@/reka";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["add"]);
const reka = inject("reka");

const Icon = defineAsyncComponent(() =>
  import("@/views/editor/components/Icon.vue")
);

const dragPayload = computed(() => ({
  source: DND_PAYLOAD_SOURCES.BASIC,
  key: props.item.key,
  options: props.item.options ?? {},
}));

const dispatchAdd = (dropMeta) => {
  emit("add", {
    payload: dragPayload.value,
    dropMeta: dropMeta ?? null,
  });
};

const [collectSource, drag] = useDrag(() => ({
  type: "Box",
  item: () => ({
    payload: dragPayload.value,
  }),
  end: (_, monitor) => {
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      dispatchAdd(dropResult);
    }
  },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
}));

const { isDragging } = toRefs(collectSource);

watch(
  isDragging,
  (dragging) => {
    if (!reka?.value?.updateExternalState) {
      return;
    }

    if (dragging) {
      reka.value.updateExternalState("dragPayload", dragPayload.value);
    } else {
      reka.value.updateExternalState("dragPayload", null);
      reka.value.updateExternalState("dropTarget", null);
    }
  },
  { immediate: false }
);

const handleClick = () => {
  dispatchAdd({
    targetId: null,
    position: "down",
  });
};
</script>
