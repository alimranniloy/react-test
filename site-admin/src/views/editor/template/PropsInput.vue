<template>
  <div class="space-y-4">
    <transition name="fade-slide">
      <div
        v-if="addNewProp"
        class="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm"
      >
        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label
              for="prop-key"
              class="block text-xs font-medium uppercase tracking-wide text-slate-500"
              >Prop name</label
            >
            <input
              id="prop-key"
              ref="propKeyField"
              v-model="draftPropKey"
              type="text"
              autocomplete="off"
              spellcheck="false"
              class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="e.g. href"
            />
          </div>
          <div>
            <label
              for="prop-value"
              class="block text-xs font-medium uppercase tracking-wide text-slate-500"
              >Value</label
            >
            <input
              id="prop-value"
              v-model="draftPropValue"
              type="text"
              autocomplete="off"
              spellcheck="false"
              class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Literal value or expression"
            />
          </div>
        </div>
        <p v-if="propKeyError" class="mt-3 text-xs font-medium text-rose-500">
          {{ propKeyError }}
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
            @click="cancelAddProp"
          >
            Cancel
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-md bg-primary-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 disabled:cursor-not-allowed disabled:bg-primary-300"
            :disabled="!canSaveProp"
            @click="saveNewProp"
          >
            <PlusIcon class="h-3.5 w-3.5" />
            Add prop
          </button>
        </div>
      </div>
    </transition>

    <PairInput
      :addingNewField="addNewProp"
      :emptyValuesText="'No props set for this template'"
      @onChange="handleChange"
      :allowPropBinding="true"
      @onRemove="handleRemove"
      :getIdentifiablesForExpr="getIdentifiables"
      :values="propEntries"
      :idPlaceholder="'Prop'"
      :valuePlaceholder="'Value'"
    />
  </div>
</template>
<script setup>
import { PlusIcon } from "@heroicons/vue/24/outline";
import * as t from "@rekajs/types";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import { ref, inject, computed, defineAsyncComponent, nextTick } from "vue";
const { templateId } = storeToRefs(useEditorStore());

const reka = inject("reka");
const template = computed(() => {
  return reka.value.getNodeFromId(templateId.value);
});
const PairInput = defineAsyncComponent(() =>
  import("@/views/editor/template/PairInput.vue")
);
const addNewProp = ref(false);
const draftPropKey = ref("");
const draftPropValue = ref("");
const propKeyField = ref(null);

const propEntries = computed(() => {
  if (!template.value || !template.value.props) {
    return [];
  }
  return Object.keys(template.value.props).map((prop) => ({
    id: prop,
    value: template.value.props[prop],
  }));
});

const existingKeys = computed(() =>
  new Set(propEntries.value.map((entry) => entry.id))
);

const propKeyError = computed(() => {
  if (!draftPropKey.value.trim()) {
    return "";
  }
  if (existingKeys.value.has(draftPropKey.value.trim())) {
    return "This prop already exists on the template.";
  }
  return "";
});

const canSaveProp = computed(() => {
  return (
    !!draftPropKey.value.trim() &&
    !existingKeys.value.has(draftPropKey.value.trim())
  );
});

const startAddProp = () => {
  if (!template.value) {
    return;
  }
  addNewProp.value = true;
  draftPropKey.value = "";
  draftPropValue.value = "";
  nextTick(() => {
    if (propKeyField.value) {
      propKeyField.value.focus();
    }
  });
};

const cancelAddProp = () => {
  addNewProp.value = false;
  draftPropKey.value = "";
  draftPropValue.value = "";
};

const saveNewProp = () => {
  if (!canSaveProp.value || !template.value) {
    return;
  }
  const key = draftPropKey.value.trim();
  const value = draftPropValue.value;
  reka.change(() => {
    if (!template.value.props) {
      template.value.props = {};
    }
    template.value.props[key] = t.literal({
      value,
    });
  });
  cancelAddProp();
};

const handleChange = (id, value) => {
  if (!reka?.value?.change || !template.value?.props) {
    return;
  }
  reka.value.change(() => {
    template.value.props[id] = value;
  });
};

const handleRemove = (id) => {
  if (!reka?.value?.change || !template.value?.props) {
    return;
  }
  reka.value.change(() => {
    delete template.value.props[id];
  });
};

const getIdentifiables = () =>
  reka.value.getIdentifiablesAtNode(template.value, {
    filter: ({ identifiable }) => !t.is(identifiable, t.Component),
  });

const isEmpty = computed(() => {
  return !addNewProp.value && propEntries.value.length === 0;
});

defineExpose({
  startAddProp,
  isEmpty,
});
</script>
