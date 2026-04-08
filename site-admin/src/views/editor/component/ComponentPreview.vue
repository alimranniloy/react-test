<template>
  <div class="flex flex-col">
    <div class="px-4 flex items-center">
      <h1 class="flex-1 text-lg mt-4">{{ component.name }}</h1>
    </div>
    <Props />
    <TemplateNode />
  </div>
</template>
<script setup>
import * as t from "@rekajs/types";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import { ref, inject, computed, defineAsyncComponent } from "vue";
const { componentId, } = storeToRefs(useEditorStore());
const reka = inject("reka");
const TemplateNode = defineAsyncComponent(() =>
  import("@/views/editor/template/TemplateNode.vue")
);
const Props = defineAsyncComponent(() =>
  import("@/views/editor/template/Props.vue")
);
const component = computed(() => {
return reka.value.getNodeFromId(componentId.value)
})
</script>
