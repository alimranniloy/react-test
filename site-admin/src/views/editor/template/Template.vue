<template>
  <div v-if="isTemplateReady" class="flex h-full flex-col">
    <header
      class="flex items-start gap-3 px-5 py-4 shadow-sm border-b border-slate-200"
    >
      <div class="flex-1">
        <h2 class="text-base font-semibold text-slate-900">
          {{ `<${title}/>` }}
        </h2>
        <p class="text-xs text-slate-500 mt-1 leading-4">
          {{ subtitle }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
        >
          {{ template.type }}
        </span>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto px-4 pb-6">
      <section
        v-for="section in sections"
        :key="section.key"
        class="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="flex items-start justify-between px-4 py-3">
          <button
            class="flex flex-1 flex-col text-left"
            type="button"
            @click="toggleSection(section.key)"
          >
            <span
              class="flex items-center gap-2 text-sm font-semibold text-slate-800"
            >
              <component :is="section.icon" class="h-4 w-4 text-slate-400" />
              {{ section.label }}
            </span>
            <span class="mt-1 text-xs text-slate-500">{{
              section.description
            }}</span>
          </button>
          <div class="ml-3 flex items-center gap-1">
            <button
              v-for="action in section.actions || []"
              :key="action.key"
              type="button"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              :title="action.label"
              @click.stop="triggerSectionAction(action, section.key)"
            >
              <component :is="action.icon" class="h-4 w-4" />
            </button>
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50"
              type="button"
              @click="toggleSection(section.key)"
            >
              <svg
                class="h-4 w-4 transition-transform"
                :class="{ 'rotate-180': openSections[section.key] }"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.108l3.71-3.876a.75.75 0 111.08 1.04l-4.25 4.444a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="actionFeedback[section.key]" class="px-4 pb-2">
          <span
            class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
            :class="{
              'bg-emerald-50 text-emerald-600':
                actionFeedback[section.key].intent === 'success',
              'bg-rose-50 text-rose-600':
                actionFeedback[section.key].intent === 'error',
              'bg-slate-100 text-slate-600':
                actionFeedback[section.key].intent !== 'success' &&
                actionFeedback[section.key].intent !== 'error',
            }"
          >
            {{ actionFeedback[section.key].text }}
          </span>
        </div>
        <transition name="fade-slide">
          <div
            v-if="openSections[section.key]"
            class="border-t border-slate-100 bg-white"
          >
            <Suspense>
              <template #default>
                <div class="flex flex-col">
                  <div
                    :class="['section-body', section.bodyClass || 'px-2 py-2']"
                  >
                    <component
                      :is="section.component"
                      :ref="sectionRefSetter(section.key)"
                    />
                  </div>
                  <div
                    v-if="
                      sectionStates[section.key]?.empty && section.emptyMessage
                    "
                    class="px-4 pb-4 text-[11px] uppercase tracking-wide text-slate-400"
                  >
                    {{ section.emptyMessage }}
                  </div>
                </div>
              </template>
              <template #fallback>
                <div
                  :class="[
                    'flex items-center gap-2 text-xs text-slate-400',
                    section.bodyClass || 'px-4 py-5',
                  ]"
                >
                  <svg
                    class="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Loading…
                </div>
              </template>
            </Suspense>
          </div>
        </transition>
      </section>
    </div>
  </div>
  <div
    v-else
    class="px-8 py-4 flex flex-col justify-center items-center h-full text-center gap-2"
  >
    <span class="text-gray-500 text-xs leading-5 max-w-[250px]">
      Select an element on the canvas to inspect styles, props, and logic.
    </span>
  </div>
</template>
<script setup>
import * as t from "@rekajs/types";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import {
  computed,
  defineAsyncComponent,
  inject,
  nextTick,
  onBeforeUnmount,
  reactive,
  watch,
  unref,
} from "vue";
import {
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  SwatchIcon,
  ListBulletIcon,
  ArrowsRightLeftIcon,
  Squares2X2Icon,
  PlusIcon,
  ClipboardDocumentIcon,
} from "@heroicons/vue/24/outline";
const { templateId } = storeToRefs(useEditorStore());
const reka = inject("reka");
const template = computed(() => reka.value.getNodeFromId(templateId.value));
const Loop = defineAsyncComponent(() =>
  import("@/views/editor/template/Loop.vue")
);
const Conditional = defineAsyncComponent(() =>
  import("@/views/editor/template/Conditional.vue")
);
const ClassList = defineAsyncComponent(() =>
  import("@/views/editor/template/ClassList.vue")
);
const PropsInput = defineAsyncComponent(() =>
  import("@/views/editor/template/PropsInput.vue")
);
const Style = defineAsyncComponent(() =>
  import("@/views/editor/style/Style.vue")
);
const LayoutControls = defineAsyncComponent(() =>
  import("@/views/editor/template/LayoutControls.vue")
);
const title = computed(() => {
  if (template.value == null) {
    return "Template";
  } else if (template.value instanceof t.ComponentTemplate) {
    return template.value.component.name;
  } else if (template.value instanceof t.TagTemplate) {
    return template.value.tag;
  } else if (template.value instanceof t.SlotTemplate) {
    return "Slot";
  } else {
    return "Template";
  }
});
const subtitle = computed(() => {
  if (!template.value) {
    return "No selection";
  }
  if (template.value instanceof t.TagTemplate) {
    const id = template.value.id.slice(0, 6);
    return `Tag template · #${id}`;
  }
  if (template.value instanceof t.ComponentTemplate) {
    return `Component template · ${template.value.component.name}`;
  }
  if (template.value instanceof t.SlotTemplate) {
    return "Slot binding";
  }
  return "Template";
});

const sectionRefs = reactive({});
const sectionStates = reactive({});
const actionFeedback = reactive({});
const feedbackTimers = new Map();
const sectionWatchStops = new Map();

const sections = [
  {
    key: "props",
    label: "Props & Data",
    description: "Manage bound attributes and literal values for this node.",
    component: PropsInput,
    icon: Cog6ToothIcon,
    bodyClass: "px-2 py-2",
    emptyMessage:
      "No props yet. Use “Add prop” to bind attributes and literals.",
    actions: [
      {
        key: "add-prop",
        label: "Add prop",
        icon: PlusIcon,
        run: (sectionInstance) => sectionInstance?.startAddProp?.(),
      },
    ],
  },
  {
    key: "style",
    label: "Styles",
    description: "Tailwind class tokens, layout, and visual presets.",
    component: Style,
    icon: SwatchIcon,
    bodyClass: "px-2 py-2",
    emptyMessage:
      "No Tailwind classes applied. Use search or quick tokens to style this node.",
    actions: [
      {
        key: "copy-classes",
        label: "Copy classes",
        icon: ClipboardDocumentIcon,
        run: (sectionInstance) => sectionInstance?.copyClasses?.(),
      },
    ],
  },
  {
    key: "layout",
    label: "Layout & Responsive",
    description: "Auto-layout presets, alignment, and breakpoint visibility.",
    component: LayoutControls,
    icon: Squares2X2Icon,
    actions: [
      {
        key: "layout-flex-row",
        label: "Flex row",
        icon: Squares2X2Icon,
        run: (sectionInstance) => sectionInstance?.applyPreset?.("flex-row"),
      },
      {
        key: "layout-grid",
        label: "Grid 2",
        icon: Squares2X2Icon,
        run: (sectionInstance) => sectionInstance?.applyPreset?.("grid-2"),
      },
    ],
  },
  {
    key: "loop",
    label: "Loop / Each",
    description: "Repeat this element for collections or arrays.",
    component: Loop,
    icon: ListBulletIcon,
  },
  {
    key: "conditional",
    label: "Conditional Rendering",
    description: "Render this element only when conditions are met.",
    component: Conditional,
    icon: AdjustmentsHorizontalIcon,
  },
  {
    key: "classList",
    label: "Classes & Tokens",
    description: "Curate frequently used class groups and reusable tokens.",
    component: ClassList,
    icon: ArrowsRightLeftIcon,
  },
];

const openSections = reactive({
  props: true,
  style: true,
  layout: true,
  loop: false,
  conditional: false,
  classList: false,
});

sections.forEach((section) => {
  if (!(section.key in openSections)) {
    openSections[section.key] =
      section.key === "props" || section.key === "style";
  }
});

const isTemplateReady = computed(() => template.value instanceof t.Template);

const clearActionFeedback = (key) => {
  if (feedbackTimers.has(key)) {
    clearTimeout(feedbackTimers.get(key));
    feedbackTimers.delete(key);
  }
  if (key in actionFeedback) {
    delete actionFeedback[key];
  }
};

const sectionRefSetter = (key) => (el) => {
  if (sectionWatchStops.has(key)) {
    sectionWatchStops.get(key)();
    sectionWatchStops.delete(key);
  }
  if (el) {
    sectionRefs[key] = el;
    const stop = watch(
      () => {
        const exposed = sectionRefs[key];
        if (!exposed || !("isEmpty" in exposed)) {
          return false;
        }
        return !!unref(exposed.isEmpty);
      },
      (value) => {
        if (!sectionStates[key]) {
          sectionStates[key] = { empty: value };
        } else if (sectionStates[key].empty !== value) {
          sectionStates[key].empty = value;
        }
      },
      { immediate: true }
    );
    sectionWatchStops.set(key, stop);
  } else {
    delete sectionRefs[key];
    delete sectionStates[key];
  }
};

const toggleSection = (key) => {
  openSections[key] = !openSections[key];
};

const interpretFeedback = (payload) => {
  if (!payload) {
    return null;
  }
  if (typeof payload === "string") {
    return { intent: "success", text: payload };
  }
  if (typeof payload === "object") {
    if ("message" in payload) {
      const intent =
        "intent" in payload
          ? payload.intent
          : payload.success === false
          ? "error"
          : "success";
      return { intent, text: payload.message };
    }
    if ("text" in payload) {
      return { intent: payload.intent ?? "info", text: payload.text };
    }
  }
  return null;
};

const setActionFeedback = (key, payload) => {
  clearActionFeedback(key);
  const interpreted = interpretFeedback(payload);
  if (!interpreted) {
    return;
  }
  actionFeedback[key] = interpreted;
  const timeoutId = setTimeout(() => {
    clearActionFeedback(key);
  }, 2400);
  feedbackTimers.set(key, timeoutId);
};

const ensureSectionRef = async (key) => {
  if (!openSections[key]) {
    openSections[key] = true;
  }
  let attempts = 0;
  while (!sectionRefs[key] && attempts < 10) {
    await nextTick();
    attempts += 1;
  }
  return sectionRefs[key];
};

const triggerSectionAction = async (action, key) => {
  if (!action?.run) {
    return;
  }
  try {
    const sectionInstance = await ensureSectionRef(key);
    if (!sectionInstance) {
      setActionFeedback(key, {
        intent: "info",
        text: "Section is still loading…",
      });
      return;
    }
    const result = action.run(sectionInstance);
    const resolved = result instanceof Promise ? await result : result;
    setActionFeedback(key, resolved);
  } catch (error) {
    console.error(error);
    setActionFeedback(key, {
      intent: "error",
      text: "Something went wrong while running this action.",
    });
  }
};

const ensurePinnedSections = () => {
  openSections.props = true;
  openSections.style = true;
  openSections.layout = true;
};

watch(
  () => template.value?.id ?? null,
  () => {
    ensurePinnedSections();
    Object.keys(actionFeedback).forEach((key) => clearActionFeedback(key));
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  feedbackTimers.forEach((id) => clearTimeout(id));
  feedbackTimers.clear();
  sectionWatchStops.forEach((stop) => stop());
  sectionWatchStops.clear();
});
</script>
<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
