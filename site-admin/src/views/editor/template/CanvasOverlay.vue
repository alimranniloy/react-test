<template>
  <div
    v-if="ready"
    class="absolute inset-0 select-none pointer-events-none"
  >
    <div
      class="absolute inset-0 opacity-[0.25]"
      :style="gridStyle"
      style="pointer-events: none"
    ></div>
    <div class="absolute top-0 left-0 right-0 h-6 bg-slate-900/80 text-white text-[10px] flex items-end px-10">
      <div class="relative w-full h-full" :style="topRulerStyle" style="pointer-events: none"></div>
    </div>
    <div class="absolute top-0 bottom-0 left-0 w-6 bg-slate-900/80 text-white text-[10px] flex flex-col items-end pb-10">
      <div class="relative w-full h-full" :style="leftRulerStyle" style="pointer-events: none"></div>
    </div>

    <div
      v-if="measurementBadge"
      class="absolute px-2 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-semibold uppercase tracking-[0.08em] shadow-sm"
      :style="measurementBadge.style"
    >
      {{ measurementBadge.label }}
    </div>
    <div
      v-if="deltaBadge"
      class="absolute px-2 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-semibold uppercase tracking-[0.08em] shadow-sm"
      :style="deltaBadge.style"
    >
      {{ deltaBadge.label }}
    </div>
    <div
      v-if="rotationBadge"
      class="absolute px-2 py-1 rounded-full bg-indigo-600/90 text-white text-[10px] font-semibold uppercase tracking-[0.08em] shadow-sm"
      :style="rotationBadge.style"
    >
      {{ rotationBadge.label }}
    </div>

    <template v-for="mark in horizontalRulerMarks" :key="`h-${mark.position}`">
      <div
        class="absolute w-px bg-slate-300/70"
        :style="{
          top: '6px',
          left: `${mark.position}px`,
          height: mark.breakpoint ? '18px' : '12px',
          pointerEvents: 'none'
        }"
      ></div>
      <div
        v-if="mark.label"
        class="absolute text-[9px] font-semibold tracking-[0.12em]"
        :class="mark.breakpoint ? 'text-blue-500' : 'text-slate-400'"
        :style="{
          top: mark.breakpoint ? '24px' : '20px',
          left: `${mark.position + 4}px`,
          pointerEvents: 'none'
        }"
      >
        {{ mark.label }}
      </div>
    </template>

    <template v-for="mark in verticalRulerMarks" :key="`v-${mark.position}`">
      <div
        class="absolute h-px bg-slate-300/70"
        :style="{
          left: '6px',
          top: `${mark.position}px`,
          width: '12px',
          pointerEvents: 'none'
        }"
      ></div>
      <div
        v-if="mark.label"
        class="absolute text-[9px] font-semibold tracking-[0.12em] text-slate-400"
        :style="{
          left: '18px',
          top: `${mark.position + 2}px`,
          pointerEvents: 'none'
        }"
      >
        {{ mark.label }}
      </div>
    </template>

    <div
      v-if="hoverOutline"
      class="absolute"
      :style="hoverOutline"
    ></div>

    <template v-for="indicator in spacingIndicators" :key="indicator.id">
      <div class="absolute bg-blue-400/50" :style="indicator.lineStyle" style="pointer-events: none"></div>
      <div
        v-if="indicator.label"
        class="absolute px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-semibold uppercase tracking-[0.12em] shadow-sm"
        :style="indicator.labelStyle"
        style="pointer-events: none"
      >
        {{ indicator.label }}
      </div>
    </template>

    <div
      v-if="moveHitboxStyle"
      class="absolute"
      :style="moveHitboxStyle"
      @pointerdown.prevent.stop="onMovePointerDown"
    ></div>
    <div
      v-if="selectionBox"
      class="absolute border border-blue-500/70"
      :style="selectionBox"
      style="pointer-events: none"
    ></div>
    <div
      v-if="rotateHandle"
      class="absolute"
      :style="rotateHandle.stem"
    ></div>
    <div
      v-if="rotateHandle"
      class="absolute border border-white bg-blue-600 shadow-sm"
      :style="rotateHandle.circle"
      @pointerdown.prevent.stop="onRotatePointerDown"
    ></div>
    <div
      v-if="selectionLabel"
      class="absolute px-2 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-semibold uppercase tracking-[0.08em] shadow-sm"
      :style="selectionLabel.style"
    >
      {{ selectionLabel.text }}
    </div>

    <div
      v-if="toolbarStyle"
      class="absolute"
      :style="toolbarStyle"
    >
      <div class="flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] font-medium text-slate-600 shadow-lg ring-1 ring-slate-200/60">
        <button
          v-for="action in toolbarActionsNormalized"
          :key="action.id"
          type="button"
          class="inline-flex items-center gap-1 rounded-full px-2 py-1 transition text-[11px] font-semibold"
          :class="[
            action.active ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-600'
          ]"
          @click.stop="onToolbarAction(action)"
        >
          <span v-if="action.icon" class="flex items-center">
            <component :is="action.icon" class="h-3.5 w-3.5" />
          </span>
          <span>{{ action.label }}</span>
        </button>
      </div>
    </div>

    <div
      v-for="guide in combinedGuides"
      :key="guide.id"
      class="absolute bg-blue-500/50"
      :style="guide.style"
      style="pointer-events: none"
    ></div>

    <div
      v-if="baselineStyle"
      class="absolute h-px bg-amber-400/80"
      :style="baselineStyle"
      style="pointer-events: none"
    ></div>

    <div
      v-for="handle in handles"
      :key="handle.id"
      class="absolute border border-white bg-blue-600 shadow-sm"
      :style="handle.style"
      @pointerdown.prevent.stop="onHandlePointerDown($event, handle.id)"
    ></div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const emit = defineEmits(["resize-start", "move-start", "rotate-start", "toolbar-action"]);

const props = defineProps({
  geometryMap: {
    type: Object,
    required: true,
  },
  hoveredTemplateId: {
    type: [String, null],
    default: null,
  },
  selectedTemplateId: {
    type: [String, null],
    default: null,
  },
  canvasRef: {
    type: Object,
    required: true,
  },
  activeGuides: {
    type: Array,
    default: () => [],
  },
  toolbarActions: {
    type: Array,
    default: () => [],
  },
  interactionPreview: {
    type: Object,
    default: null,
  },
});

const rootRect = ref({ width: 0, height: 0 });
const ready = computed(() => rootRect.value.width > 0 && rootRect.value.height > 0);
let resizeObserver;

const updateRootRect = () => {
  const el = props.canvasRef?.value;
  if (!el) {
    rootRect.value = { width: 0, height: 0 };
    return;
  }
  const rect = el.getBoundingClientRect();
  rootRect.value = {
    width: rect.width,
    height: rect.height,
  };
};

const observeCanvas = (el) => {
  if (!el || typeof window === "undefined") {
    return;
  }
  updateRootRect();
  if (!resizeObserver && "ResizeObserver" in window) {
    resizeObserver = new window.ResizeObserver(() => {
      updateRootRect();
    });
  }
  resizeObserver?.observe(el);
};

watch(
  () => props.canvasRef?.value,
  (newEl, oldEl) => {
    if (oldEl && resizeObserver) {
      resizeObserver.unobserve(oldEl);
    }
    if (newEl) {
      observeCanvas(newEl);
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.canvasRef?.value) {
    observeCanvas(props.canvasRef.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver && props.canvasRef?.value) {
    resizeObserver.unobserve(props.canvasRef.value);
  }
});

const gridStyle = computed(() => ({
  backgroundImage:
    "linear-gradient(to right, rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.08) 1px, transparent 1px)",
  backgroundSize: "8px 8px",
}));

const topRulerStyle = computed(() => ({
  backgroundImage: "repeating-linear-gradient(to right, rgba(255,255,255,0.25), rgba(255,255,255,0.25) 1px, transparent 1px, transparent 16px)",
}));

const leftRulerStyle = computed(() => ({
  backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0.25) 1px, transparent 1px, transparent 16px)",
}));

const geometryRef = computed(() => props.geometryMap);

const selectedGeometry = computed(() => {
  if (!props.selectedTemplateId) {
    return null;
  }
  return geometryRef.value[props.selectedTemplateId] ?? null;
});

const hoveredGeometry = computed(() => {
  if (!props.hoveredTemplateId) {
    return null;
  }
  if (props.selectedTemplateId && props.hoveredTemplateId === props.selectedTemplateId) {
    return null;
  }
  return geometryRef.value[props.hoveredTemplateId] ?? null;
});

const activeGeometry = computed(() => selectedGeometry.value ?? hoveredGeometry.value ?? null);

const formatDelta = (value) => {
  const rounded = Math.round(value);
  if (rounded === 0) {
    return "0";
  }
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
};

const activeRect = computed(() => {
  if (props.interactionPreview?.rect) {
    return props.interactionPreview.rect;
  }
  const geom = activeGeometry.value;
  return geom ? geom.absolute : null;
});

const selectionRotation = computed(() => {
  if (props.interactionPreview?.rotation !== undefined && props.interactionPreview?.rotation !== null) {
    return props.interactionPreview.rotation;
  }
  const geom = selectedGeometry.value;
  return geom?.rotation ?? 0;
});

const spacingIndicators = computed(() => {
  const preview = props.interactionPreview;
  if (preview && Array.isArray(preview.spacing)) {
    return preview.spacing;
  }
  return [];
});

const toolbarActionsNormalized = computed(() => {
  return (props.toolbarActions || []).map((action, index) => ({
    ...action,
    id: action.key ?? `action-${index}`,
  }));
});

const breakpointMarkers = [
  { value: 320, label: "xs" },
  { value: 640, label: "sm" },
  { value: 768, label: "md" },
  { value: 1024, label: "lg" },
  { value: 1280, label: "xl" },
  { value: 1536, label: "2xl" },
];

const createRulerMarks = (length, orientation) => {
  if (!length || Number.isNaN(length)) {
    return [];
  }
  const step = length > 1200 ? 100 : length > 800 ? 80 : 64;
  const marks = [];
  for (let position = 0; position <= length; position += step) {
    marks.push({
      position,
      label: position % (step * 2) === 0 ? `${Math.round(position)}` : null,
      breakpoint: false,
    });
  }
  if (orientation === "horizontal") {
    breakpointMarkers.forEach((mark) => {
      if (mark.value > 0 && mark.value < length) {
        marks.push({
          position: mark.value,
          label: mark.label,
          breakpoint: true,
        });
      }
    });
  }
  return marks.sort((a, b) => a.position - b.position);
};

const horizontalRulerMarks = computed(() =>
  createRulerMarks(rootRect.value.width ?? 0, "horizontal")
);

const verticalRulerMarks = computed(() =>
  createRulerMarks(rootRect.value.height ?? 0, "vertical")
);

const selectionRect = computed(() => {
  if (props.interactionPreview?.rect && props.interactionPreview.mode) {
    return props.interactionPreview.rect;
  }
  const geom = selectedGeometry.value;
  return geom ? geom.absolute : null;
});

const measurementAnchor = computed(() => {
  const rect = activeRect.value;
  if (!rect) {
    return null;
  }
  const centerX = rect.left + rect.width / 2;
  const tentativeTop = rect.top - 12;
  const placeBelow = tentativeTop < 8;
  return {
    rect,
    centerX,
    baseTop: placeBelow ? rect.top + rect.height + 12 : tentativeTop,
    placeBelow,
  };
});

const measurementBadge = computed(() => {
  const anchor = measurementAnchor.value;
  if (!anchor) {
    return null;
  }
  const width = Math.round(anchor.rect.width);
  const height = Math.round(anchor.rect.height);
  let label = `${width}px × ${height}px`;
  if (props.interactionPreview?.mode === "resize" && props.interactionPreview.sizeDelta) {
    const dw = Math.round(props.interactionPreview.sizeDelta.width ?? 0);
    const dh = Math.round(props.interactionPreview.sizeDelta.height ?? 0);
    if (dw || dh) {
      label += ` (${formatDelta(dw)}, ${formatDelta(dh)})`;
    }
  }
  return {
    label,
    style: {
      top: `${anchor.baseTop}px`,
      left: `${anchor.centerX}px`,
      transform: anchor.placeBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)",
      pointerEvents: "none",
      zIndex: 1100,
    },
  };
});

const deltaBadge = computed(() => {
  const anchor = measurementAnchor.value;
  const preview = props.interactionPreview;
  if (!anchor || !preview || preview.mode !== "move") {
    return null;
  }
  const dx = Math.round(preview.delta?.x ?? 0);
  const dy = Math.round(preview.delta?.y ?? 0);
  if (!dx && !dy) {
    return null;
  }
  const offsetTop = anchor.placeBelow ? anchor.baseTop + 18 : anchor.baseTop - 18;
  return {
    label: `${formatDelta(dx)} / ${formatDelta(dy)}`,
    style: {
      top: `${offsetTop}px`,
      left: `${anchor.centerX}px`,
      transform: anchor.placeBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)",
      pointerEvents: "none",
      zIndex: 1100,
    },
  };
});

const rotationBadge = computed(() => {
  const preview = props.interactionPreview;
  const anchor = measurementAnchor.value;
  if (!preview || preview.mode !== "rotate" || !anchor) {
    return null;
  }
  const rotation = Math.round(preview.rotation ?? 0);
  const delta = Math.round(preview.rotationDelta ?? 0);
  const label =
    delta && Math.abs(delta) >= 1
      ? `${rotation}° (${delta > 0 ? "+" : ""}${delta}°)`
      : `${rotation}°`;
  const offsetTop = anchor.placeBelow ? anchor.baseTop + 18 : anchor.baseTop - 18;
  return {
    label,
    style: {
      top: `${offsetTop}px`,
      left: `${anchor.centerX}px`,
      transform: anchor.placeBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)",
      pointerEvents: "none",
      zIndex: 1100,
    },
  };
});

const hoverOutline = computed(() => {
  const geom = hoveredGeometry.value;
  if (!geom) {
    return null;
  }
  const { absolute } = geom;
  return {
    top: `${absolute.top}px`,
    left: `${absolute.left}px`,
    width: `${absolute.width}px`,
    height: `${absolute.height}px`,
    border: "1px dashed rgba(59,130,246,0.65)",
    boxShadow: "0 0 0 1px rgba(59,130,246,0.15)",
    pointerEvents: "none",
  };
});

const selectionBox = computed(() => {
  const rect = selectionRect.value;
  if (!rect) {
    return null;
  }
  return {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    boxShadow: "0 0 0 1px rgba(37,99,235,0.45)",
  };
});

const selectionLabel = computed(() => {
  const rect = selectionRect.value;
  const geom = selectedGeometry.value;
  if (!rect || !geom) {
    return null;
  }
  const meta = geom.meta ?? {};
  const name = meta.componentName || meta.tag || meta.viewId || "Element";
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);
  const left = Math.round(rect.left);
  const top = Math.round(rect.top);
  const rotation = selectionRotation.value;
  const rotationText =
    rotation && Math.round(rotation) % 360 !== 0
      ? ` · ${Math.round(rotation)}°`
      : "";
  const label = `${name} · ${width}×${height}px · (${left}, ${top})${rotationText}`;
  const placeBelow = rect.top - 24 < 8;
  const topPosition = placeBelow ? rect.top + rect.height + 6 : rect.top - 6;
  const maxLeft = Math.max(rootRect.value.width - 12, 12);
  const clampedLeft = Math.min(Math.max(rect.left, 12), maxLeft);
  return {
    text: label,
    style: {
      top: `${topPosition}px`,
      left: `${clampedLeft}px`,
      transform: placeBelow ? "translateY(0)" : "translateY(-100%)",
      pointerEvents: "none",
      zIndex: 1100,
    },
  };
});

const handles = computed(() => {
  const rect = selectionRect.value;
  if (!rect) {
    return [];
  }
  const size = 8;
  const half = size / 2;
  return [
    { id: "tl", top: rect.top - half, left: rect.left - half, cursor: "nwse-resize" },
    { id: "tr", top: rect.top - half, left: rect.left + rect.width - half, cursor: "nesw-resize" },
    { id: "br", top: rect.top + rect.height - half, left: rect.left + rect.width - half, cursor: "nwse-resize" },
    { id: "bl", top: rect.top + rect.height - half, left: rect.left - half, cursor: "nesw-resize" },
  ].map((handle) => ({
    id: handle.id,
    style: {
      top: `${handle.top}px`,
      left: `${handle.left}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "9999px",
      cursor: handle.cursor,
      pointerEvents: "auto",
      zIndex: 1200,
    },
  }));
});

const rotateHandle = computed(() => {
  const rect = selectionRect.value;
  if (!rect) {
    return null;
  }
  const handleSize = 12;
  const offset = 28;
  return {
    circle: {
      top: `${Math.max(rect.top - offset, 4)}px`,
      left: `${rect.left + rect.width / 2 - handleSize / 2}px`,
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      borderRadius: "9999px",
      border: "1px solid #fff",
      backgroundColor: "rgba(37,99,235,0.9)",
      cursor: "grab",
      pointerEvents: "auto",
      zIndex: 1250,
    },
    stem: {
      top: `${rect.top - Math.min(offset / 2, rect.height / 4)}px`,
      left: `${rect.left + rect.width / 2 - 0.5}px`,
      width: "1px",
      height: `${Math.min(offset - 6, rect.height / 2)}px`,
      backgroundColor: "rgba(37,99,235,0.6)",
      pointerEvents: "none",
      zIndex: 1200,
    },
  };
});

const toolbarStyle = computed(() => {
  if (!toolbarActionsNormalized.value.length) {
    return null;
  }
  const rect = selectionRect.value;
  if (!rect) {
    return null;
  }
  const top = Math.max(rect.top - 48, 8);
  const centerX = rect.left + rect.width / 2;
  return {
    top: `${top}px`,
    left: `${centerX}px`,
    transform: "translate(-50%, -100%)",
    pointerEvents: "auto",
    zIndex: 1500,
  };
});

const baseGuides = computed(() => {
  const geom = selectedGeometry.value;
  if (!geom) {
    return [];
  }
  const { absolute } = geom;
  const centerX = absolute.left + absolute.width / 2;
  const centerY = absolute.top + absolute.height / 2;
  return [
    {
      id: "guide-v-center",
      style: {
        top: "0px",
        left: `${centerX}px`,
        width: "1px",
        height: `${rootRect.value.height}px`,
        backgroundColor: "rgba(37, 99, 235, 0.35)",
      },
    },
    {
      id: "guide-h-center",
      style: {
        left: "0px",
        top: `${centerY}px`,
        width: `${rootRect.value.width}px`,
        height: "1px",
        backgroundColor: "rgba(37, 99, 235, 0.35)",
      },
    },
  ];
});

const combinedGuides = computed(() => {
  return [...baseGuides.value, ...(props.activeGuides ?? [])];
});

const baselineStyle = computed(() => {
  const geom = selectedGeometry.value;
  if (!geom) {
    return null;
  }
  if (Number.isNaN(geom.baseline)) {
    return null;
  }
  const { absolute } = geom;
  return {
    top: `${geom.baseline}px`,
    left: `${absolute.left}px`,
    width: `${absolute.width}px`,
    height: "1px",
    backgroundColor: "rgba(251, 191, 36, 0.7)",
  };
});

const onHandlePointerDown = (event, handleId) => {
  if (event.pointerId !== undefined && event.target?.setPointerCapture) {
    event.target.setPointerCapture(event.pointerId);
  }
  emit("resize-start", {
    handleId,
    clientX: event.clientX,
    clientY: event.clientY,
    pointerId: event.pointerId,
  });
};

const canMoveNode = computed(() => {
  const geom = selectedGeometry.value;
  if (!geom) {
    return false;
  }
  const position = geom.position ?? "static";
  return ["absolute", "relative", "fixed", "sticky"].includes(position);
});

const moveHitboxStyle = computed(() => {
  if (!selectionBox.value || !canMoveNode.value) {
    return null;
  }
  const { boxShadow, ...rectStyle } = selectionBox.value;
  return {
    ...rectStyle,
    cursor: "move",
    backgroundColor: "rgba(59,130,246,0.05)",
    border: "1px solid transparent",
    pointerEvents: "auto",
  };
});

const onMovePointerDown = (event) => {
  if (!canMoveNode.value) {
    return;
  }
  if (event.pointerId !== undefined && event.target?.setPointerCapture) {
    event.target.setPointerCapture(event.pointerId);
  }
  emit("move-start", {
    clientX: event.clientX,
    clientY: event.clientY,
    pointerId: event.pointerId,
  });
};

const onRotatePointerDown = (event) => {
  if (event.pointerId !== undefined && event.target?.setPointerCapture) {
    event.target.setPointerCapture(event.pointerId);
  }
  emit("rotate-start", {
    clientX: event.clientX,
    clientY: event.clientY,
    pointerId: event.pointerId,
    shiftKey: event.shiftKey ?? false,
  });
};

const onToolbarAction = (action) => {
  emit("toolbar-action", action);
};
</script>

<style scoped>
</style>
