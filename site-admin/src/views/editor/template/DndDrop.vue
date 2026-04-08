<template>
  <div v-if="canDrop"
    class="h-10 w-full inset-0 -z-10 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] text-center text-white flex items-center justify-center"
    :ref="drop" role="Dustbin" :style="{ backgroundColor }" data-testid="dustbin">
    {{
    isActive
    ? 'Release to drop'
    : 'Drag and drop here'
    }}
  </div>
  <div v-else-if="props.noDrop" @click="isNewComponent = true"
    class="h-10 w-full inset-0 -z-10 bg-gray-400 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] text-center text-white flex items-center justify-center">
    Add component
  </div>
</template>

<script setup>
import { computed, inject, unref } from "vue";
import { useDrop } from "vue3-dnd";
import { toRefs } from "@vueuse/core";
import { useEditorStore } from "@/stores/editor";
import { storeToRefs } from "pinia";
const { isNewComponent, position, positionId } = storeToRefs(useEditorStore());
const props = defineProps({ item: Object, noDrop: Boolean, id: String, position: String });
const reka = inject("reka");

const onDrop = () => {
  position.value = props.position;
  positionId.value = props.id;
  const dropMeta = {
    targetId: props.id ?? null,
    position: props.position ?? "down",
  };
  if (reka?.value) {
    reka.value.updateExternalState?.("dropTarget", dropMeta);
  }
  return dropMeta;
};

const [collect, drop] = useDrop({
  accept: "Box",
  drop: onDrop,
  collect: (monitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
})

const { canDrop, isOver } = toRefs(collect)
const isActive = computed(() => unref(canDrop) && unref(isOver));
const backgroundColor = computed(() =>
  unref(isActive) ? "darkgreen" : unref(canDrop) ? "darkkhaki" : "#222"
);
</script>
