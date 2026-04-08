<template>
  <div class="relative">
    <button
      v-if="me.isSuperuser || me.isStaff"
      class="absolute top-2 left-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center p-1"
      @click="updateComponent()"
    >
      <PencilIcon class="h-4 w-4" />
    </button>
    <div
      :ref="drag"
      role="Box"
      class="h-24 w-full cursor-pointer overflow-hidden rounded-md border-2 border-transparent bg-gray-50 transition-all hover:-translate-y-0.5 hover:border-slate-300"
      :data-color="item.title"
      @click="handleClick"
    >
      <img
        v-lazy="item.image"
        class="rounded-md h-full object-contain w-full"
      />
      <span
        class="absolute right-0 text-[10px] bg-red-300 text-white bottom-2 px-2 py-1 rounded-l-sm"
        >{{ item.title }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { PencilIcon } from "@heroicons/vue/24/outline";
import { useDrag } from "vue3-dnd";
import * as t from "@rekajs/types";
import { inject, watch, computed } from "vue";
import { getComponentData } from "@/composables/site/component";
import { useQuery } from "@vue/apollo-composable";
import { toRefs } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import { useMeStore } from "@/stores/me";
import { useRouter } from "vue-router";
import { DND_PAYLOAD_SOURCES } from "@/reka";
const router = useRouter();
const { componentId } = storeToRefs(useEditorStore());
const { me } = storeToRefs(useMeStore());
const props = defineProps({ item: Object, type: String, isDropped: Boolean });
const reka = inject("reka");
const emit = defineEmits(["add", "close"]);

const updateComponent = () => {
  componentId.value = props.item.id;
  router.push(`/component/update/`);
};

const dispatchAdd = (schema, dropMeta) => {
  emit("add", {
    payload: {
      source: DND_PAYLOAD_SOURCES.COMPONENT,
      schema,
      componentJSON: schema,
      meta: {
        id: props.item.id,
        title: props.item.title,
      },
    },
    dropMeta: dropMeta ?? null,
  });
};

const toggleElement = async (element, dropMeta = null) => {
  try {
    const component = await getComponentData(element.id);
    if (!component?.componentData) {
      return;
    }
    const schema = t.Schema.fromJSON(component.componentData);
    const schemaJson =
      typeof schema?.toJSON === "function" ? schema.toJSON() : schema;
    if (!schemaJson?.program?.components?.length) {
      return;
    }
    dispatchAdd(schemaJson, dropMeta);
  } catch (error) {
    console.error("[editor] Failed to load component data", error);
  }
};

const dragPayload = computed(() => ({
  source: DND_PAYLOAD_SOURCES.COMPONENT,
  id: props.item.id,
  title: props.item.title,
}));

const [collectSource, drag] = useDrag(() => ({
  type: "Box",
  item: () => ({
    payload: dragPayload.value,
  }),
  end: (_, monitor) => {
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      toggleElement(props.item, dropResult);
    }
  },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
    handlerId: monitor.getHandlerId(),
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
  toggleElement(props.item);
};
</script>
