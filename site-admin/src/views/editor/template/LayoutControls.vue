<template>
  <div class="px-4 py-4 space-y-6">
    <section>
      <header class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Layout Presets
      </header>
      <div class="mt-3 grid grid-cols-2 gap-2">
        <button
          v-for="preset in layoutPresets"
          :key="preset.key"
          type="button"
          :class="[
            'border rounded-lg px-3 py-2 text-left text-sm transition flex items-center justify-between',
            activePreset === preset.key
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-slate-200 hover:border-slate-300 text-slate-600'
          ]"
          @click="applyPreset(preset.key)"
        >
          <span>{{ preset.label }}</span>
          <span class="text-[10px] uppercase tracking-[0.16em] text-slate-400">
            {{ preset.short }}
          </span>
        </button>
      </div>
    </section>

    <section>
      <header class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Alignment
      </header>
      <div class="mt-3 grid grid-cols-3 gap-2">
        <button
          v-for="alignment in alignments"
          :key="alignment.key"
          type="button"
          :class="[
            'border rounded-lg px-2 py-1.5 text-xs font-medium transition',
            activeAlignment === alignment.key
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-slate-200 hover:border-slate-300 text-slate-600'
          ]"
          @click="setAlignment(alignment)"
        >
          {{ alignment.label }}
        </button>
      </div>
      <div class="mt-3 grid grid-cols-3 gap-2">
        <button
          v-for="justify in justifications"
          :key="justify.key"
          type="button"
          :class="[
            'border rounded-lg px-2 py-1.5 text-xs font-medium transition',
            activeJustify === justify.key
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-slate-200 hover:border-slate-300 text-slate-600'
          ]"
          @click="setJustify(justify)"
        >
          {{ justify.label }}
        </button>
      </div>
    </section>

    <section>
      <header class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Gap & Wrapping
      </header>
      <div class="mt-3 grid grid-cols-3 gap-2">
        <button
          v-for="gapOption in gapOptions"
          :key="gapOption"
          type="button"
          :class="[
            'border rounded-lg px-2 py-1.5 text-xs font-medium transition',
            hasToken(gapOption)
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-slate-200 hover:border-slate-300 text-slate-600'
          ]"
          @click="toggleToken(gapOption, gapOptions)"
        >
          {{ gapOption }}
        </button>
      </div>
      <div class="mt-3 flex items-center gap-3">
        <label class="flex items-center gap-2 text-xs font-medium text-slate-600">
          <input type="checkbox" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            :checked="hasToken('flex-wrap')" @change="toggleWrap" />
          Wrap items
        </label>
      </div>
    </section>

    <section>
      <header class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Breakpoint Visibility
      </header>
      <div class="mt-3 space-y-2">
        <label class="flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Base</span>
          <input type="checkbox" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            :checked="!hasToken('hidden')" @change="toggleBaseVisibility" />
        </label>
        <label
          v-for="bp in breakpointOptions"
          :key="bp.key"
          class="flex items-center justify-between text-xs font-medium text-slate-600"
        >
          <span>{{ bp.label }}</span>
          <input
            type="checkbox"
            class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            :checked="!hasBreakpointHidden(bp.key)"
            @change="toggleBreakpoint(bp.key)"
          />
        </label>
      </div>
    </section>
  </div>
</template>

<script setup>
import * as t from "@rekajs/types";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import { computed, inject } from "vue";

const { templateId } = storeToRefs(useEditorStore());
const reka = inject("reka");

const template = computed(() => reka.value.getNodeFromId(templateId.value, t.Template));

const classBinding = computed(() => {
  const target = template.value;
  if (!target) {
    return null;
  }
  if (target instanceof t.TagTemplate) {
    return target.props?.className ?? null;
  }
  if (target instanceof t.ComponentTemplate && target.template instanceof t.TagTemplate) {
    return target.template.props?.className ?? null;
  }
  return null;
});

const layoutPresets = [
  { key: "stack", label: "Stack", short: "Default", add: [], remove: ["flex", "grid", "flex-row", "flex-col", "grid-cols-2", "grid-cols-3", "grid-cols-4", "gap-2", "gap-3", "gap-4", "gap-6"] },
  { key: "flex-row", label: "Flex Row", short: "Flex", add: ["flex", "flex-row", "gap-4"], remove: ["grid", "grid-cols-2", "grid-cols-3", "grid-cols-4", "flex-col"] },
  { key: "flex-col", label: "Flex Column", short: "Flex", add: ["flex", "flex-col", "gap-4"], remove: ["grid", "grid-cols-2", "grid-cols-3", "grid-cols-4", "flex-row"] },
  { key: "grid-2", label: "Grid 2", short: "Grid", add: ["grid", "grid-cols-2", "gap-4"], remove: ["flex", "flex-row", "flex-col", "grid-cols-3", "grid-cols-4"] },
  { key: "grid-3", label: "Grid 3", short: "Grid", add: ["grid", "grid-cols-3", "gap-4"], remove: ["flex", "flex-row", "flex-col", "grid-cols-2", "grid-cols-4"] },
  { key: "grid-auto", label: "Grid Auto", short: "Grid", add: ["grid", "auto-rows-fr", "gap-4"], remove: ["flex", "flex-row", "flex-col", "grid-cols-2", "grid-cols-3", "grid-cols-4"] },
];

const alignments = [
  { key: "items-start", label: "Start" },
  { key: "items-center", label: "Center" },
  { key: "items-end", label: "End" },
];

const justifications = [
  { key: "justify-start", label: "Left" },
  { key: "justify-center", label: "Center" },
  { key: "justify-between", label: "Between" },
  { key: "justify-end", label: "End" },
];

const gapOptions = ["gap-2", "gap-3", "gap-4", "gap-6", "gap-8"];

const breakpointOptions = [
  { key: "sm", label: "≥ 640px" },
  { key: "md", label: "≥ 768px" },
  { key: "lg", label: "≥ 1024px" },
  { key: "xl", label: "≥ 1280px" },
];

const cleanWhitespace = (value = "") => value.replace(/\s+/g, " ").trim();

const getClassString = () => {
  const binding = classBinding.value;
  if (!binding) {
    return "";
  }
  if (typeof binding === "string") {
    return binding;
  }
  if (binding instanceof t.Literal && typeof binding.value === "string") {
    return binding.value;
  }
  if (binding instanceof t.Identifier) {
    const literal = reka.value.getNodeFromId(binding.id);
    if (literal instanceof t.Literal && typeof literal.value === "string") {
      return literal.value;
    }
  }
  return "";
};

const updateClassString = (transform) => {
  const binding = classBinding.value;
  const current = getClassString();
  const next = cleanWhitespace(transform(current));
  const targetTemplate = template.value;
  if (!targetTemplate) {
    return;
  }
  reka.value.change(() => {
    if (targetTemplate instanceof t.TagTemplate) {
      if (!targetTemplate.props) {
        targetTemplate.props = {};
      }
      targetTemplate.props.className = t.literal({ value: next });
    } else if (targetTemplate instanceof t.ComponentTemplate) {
      const target = targetTemplate.template;
      if (target instanceof t.TagTemplate) {
        if (!target.props) {
          target.props = {};
        }
        target.props.className = t.literal({ value: next });
      }
    }
  });
};

const removeTokens = (tokens) => {
  const tokenSet = new Set(tokens);
  updateClassString((current) =>
    current
      .split(/\s+/)
      .filter((token) => token && !tokenSet.has(token))
      .join(" ")
  );
};

const addTokens = (tokens) => {
  updateClassString((current) => {
    const currentTokens = new Set(current.split(/\s+/).filter(Boolean));
    tokens.forEach((token) => {
      if (token) {
        currentTokens.add(token);
      }
    });
    return Array.from(currentTokens).join(" ");
  });
};

const applyPreset = (presetKey) => {
  const preset = layoutPresets.find((item) => item.key === presetKey);
  if (!preset) {
    return;
  }
  removeTokens(preset.remove);
  addTokens(preset.add);
};

const hasToken = (token) => {
  if (!token) {
    return false;
  }
  const tokens = getClassString().split(/\s+/);
  return tokens.includes(token);
};

const toggleToken = (token, competing = []) => {
  if (hasToken(token)) {
    removeTokens([token]);
  } else {
    removeTokens(competing.filter((option) => option !== token));
    addTokens([token]);
  }
};

const alignmentTokens = alignments.map((item) => item.key);
const justificationTokens = justifications.map((item) => item.key);

const activePreset = computed(() => {
  const current = getClassString();
  const tokens = current.split(/\s+/);
  const preset = layoutPresets.find((candidate) =>
    candidate.add.every((token) => tokens.includes(token))
  );
  return preset ? preset.key : "stack";
});

const activeAlignment = computed(() => {
  const tokens = getClassString().split(/\s+/);
  return (
    alignments.find((item) => tokens.includes(item.key))?.key ?? "items-start"
  );
});

const activeJustify = computed(() => {
  const tokens = getClassString().split(/\s+/);
  return (
    justifications.find((item) => tokens.includes(item.key))?.key ??
    "justify-start"
  );
});

const setAlignment = (alignment) => {
  removeTokens(alignmentTokens);
  addTokens([alignment.key]);
};

const setJustify = (justify) => {
  removeTokens(justificationTokens);
  addTokens([justify.key]);
};

const toggleWrap = (event) => {
  if (event.target.checked) {
    addTokens(["flex-wrap"]);
  } else {
    removeTokens(["flex-wrap"]);
  }
};

const toggleBaseVisibility = (event) => {
  if (event.target.checked) {
    removeTokens(["hidden"]);
  } else {
    addTokens(["hidden"]);
  }
};

const hasBreakpointHidden = (bp) => hasToken(`${bp}:hidden`);

const toggleBreakpoint = (bp) => {
  const token = `${bp}:hidden`;
  if (hasBreakpointHidden(bp)) {
    removeTokens([token]);
  } else {
    addTokens([token]);
  }
};

const isEmpty = computed(() => false);

defineExpose({
  applyPreset,
  setAlignment,
  setJustify,
  toggleWrap,
  toggleBreakpoint,
  isEmpty,
});
</script>
