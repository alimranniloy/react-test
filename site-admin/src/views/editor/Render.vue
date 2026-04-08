<template>
  <div ref="canvasRoot" class="relative">
    <RenderView :key="version" :view="view" />
    <CanvasOverlay
      :geometry-map="geometryMap"
      :hovered-template-id="hoveredTemplate"
      :selected-template-id="templateId"
      :canvas-ref="canvasRoot"
      :interaction-preview="interactionOverlay"
      :toolbar-actions="selectionToolbarActions"
      @resize-start="onResizeStart"
      @move-start="onMoveStart"
      @rotate-start="onRotateStart"
      @toolbar-action="onToolbarAction"
      :active-guides="interactionState.guides"
    />
    <DndDrop :noDrop="true" :id="null" :position="'down'" />
  </div>
</template>

<script setup>
import { useDrop } from "vue3-dnd";
import { toRefs } from "@vueuse/core";
import {
  computed,
  defineComponent,
  h,
  ref,
  reactive,
  shallowRef,
  nextTick,
  watch,
  watchEffect,
  defineAsyncComponent,
  withModifiers,
  unref,
  inject,
  onMounted,
  onUnmounted,
  withDirectives,
  provide,
  Teleport,
  Fragment,
} from "vue";
import { debounce, throttle } from "lodash";
import {
  DocumentDuplicateIcon,
  TrashIcon,
  SparklesIcon,
  BoltIcon,
} from "@heroicons/vue/24/outline";
import * as t from "@rekajs/types";
import { useEditorStore } from "@/stores/editor";
import { storeToRefs } from "pinia";
const { isNewComponent } = storeToRefs(useEditorStore());
const props = defineProps({
  view: {
    type: t.View,
    required: true,
  },
});

const DndDrop = defineAsyncComponent(() =>
  import("@/views/editor/template/DndDrop.vue")
);
const DropdownRenderView = defineAsyncComponent(() =>
  import("@/views/editor/template/DropdownRenderView.vue")
);
const CanvasOverlay = defineAsyncComponent(() =>
  import("@/views/editor/template/CanvasOverlay.vue")
);
const { templateId, componentId, isOnComponent } = storeToRefs(
  useEditorStore()
);
const reka = inject("reka");

const template = computed(() => reka.value.getNodeFromId(templateId.value));
const hoveredTemplate = ref(null);
const hoveredComponent = ref(null);
const option = ref(null);
const overlayHoverTemplate = ref(null);
const hoverCleanupTimers = new Map();

const cancelHoverClear = (id) => {
  if (!id) {
    return;
  }
  const timer = hoverCleanupTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    hoverCleanupTimers.delete(id);
  }
};

const scheduleHoverClear = (id) => {
  if (!id) {
    return;
  }
  cancelHoverClear(id);
  if (typeof window === "undefined") {
    if (hoveredTemplate.value === id && overlayHoverTemplate.value !== id) {
      hoveredTemplate.value = null;
    }
    return;
  }
  const timer = window.setTimeout(() => {
    hoverCleanupTimers.delete(id);
    if (
      overlayHoverTemplate.value !== id &&
      hoveredTemplate.value === id &&
      templateId.value !== id
    ) {
      hoveredTemplate.value = null;
    }
  }, 100);
  hoverCleanupTimers.set(id, timer);
};

const canvasRoot = ref(null);
const elementRegistry = new Map();
const nodeMetaRegistry = new Map();
const geometryMap = reactive({});
const SNAP_THRESHOLD = 6;

let resizeObserver = null;
const pendingGeometry = new Set();
let geometryFrame = null;

if (typeof window !== "undefined" && "ResizeObserver" in window) {
  resizeObserver = new window.ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const key = entry.target.dataset.rekaTemplateId;
      if (key) {
        pendingGeometry.add(key);
      }
    });
    scheduleGeometryUpdate();
  });
}

const registerElement =
  (viewId, templateId, meta = {}) =>
  (el) => {
    const key = templateId ?? viewId;
    if (!key) {
      return;
    }
    if (!el) {
      const existing = elementRegistry.get(key);
      if (existing && resizeObserver) {
        resizeObserver.unobserve(existing);
      }
      elementRegistry.delete(key);
      nodeMetaRegistry.delete(key);
      delete geometryMap[key];
      return;
    }

    el.dataset.rekaTemplateId = key;
    elementRegistry.set(key, el);
    nodeMetaRegistry.set(key, {
      viewId,
      templateId: key,
      tag: meta.tag,
      componentName: meta.componentName ?? null,
    });

    if (resizeObserver) {
      resizeObserver.observe(el);
    }
    pendingGeometry.add(key);
    scheduleGeometryUpdate();
  };

const getElementMetrics = (templateId) => {
  const key = templateId;
  if (!key) {
    return null;
  }
  return geometryMap[key]?.absolute ?? null;
};

const scheduleGeometryUpdate = () => {
  if (typeof window === "undefined") {
    return;
  }
  if (geometryFrame !== null) {
    return;
  }
  geometryFrame = window.requestAnimationFrame(() => {
    geometryFrame = null;
    if (!canvasRoot.value) {
      pendingGeometry.clear();
      return;
    }
    if (pendingGeometry.size === 0) {
      elementRegistry.forEach((_, key) => pendingGeometry.add(key));
    }
    pendingGeometry.forEach((key) => {
      updateGeometryForKey(key);
    });
    pendingGeometry.clear();
  });
};

const updateGeometryForKey = (key) => {
  const el = elementRegistry.get(key);
  const rootEl = canvasRoot.value;
  if (!el) {
    delete geometryMap[key];
    return;
  }
  if (!rootEl) {
    return;
  }

  const rect = el.getBoundingClientRect();
  const rootRect = rootEl.getBoundingClientRect();
  const parentEl = el.parentElement ?? rootEl;
  const parentRect = parentEl.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(el);
  let rotation = 0;
  const transform = computedStyle.transform;
  if (transform && transform !== "none") {
    const matrixMatch = transform.match(/^matrix\(([^)]+)\)$/);
    if (matrixMatch) {
      const [a, b] = matrixMatch[1]
        .split(",")
        .map((value) => parseFloat(value.trim()));
      if (!Number.isNaN(a) && !Number.isNaN(b)) {
        rotation = (Math.atan2(b, a) * 180) / Math.PI;
      }
    } else {
      const rotateMatch = transform.match(/rotate\(([-\d.]+)deg\)/);
      if (rotateMatch) {
        rotation = parseFloat(rotateMatch[1] ?? "0");
      }
    }
  }

  let parentId = null;
  if (reka?.value?.getNodeFromId) {
    const templateNode = reka.value.getNodeFromId(key);
    if (templateNode instanceof t.Template) {
      try {
        const parentInfo = reka.value.getParentNode(templateNode, t.Template);
        parentId =
          parentInfo && parentInfo.node instanceof t.Template
            ? parentInfo.node.id
            : null;
      } catch (error) {
        parentId = null;
      }
    }
  }

  const absolute = {
    top: rect.top - rootRect.top,
    left: rect.left - rootRect.left,
    width: rect.width,
    height: rect.height,
  };

  const relative = {
    top: rect.top - parentRect.top,
    left: rect.left - parentRect.left,
    width: rect.width,
    height: rect.height,
  };

  const fontSize = parseFloat(computedStyle.fontSize) || 0;
  let lineHeight = parseFloat(computedStyle.lineHeight);
  if (!lineHeight || Number.isNaN(lineHeight)) {
    lineHeight = fontSize > 0 ? fontSize * 1.2 : rect.height;
  }
  const baseline = absolute.top + absolute.height - lineHeight * 0.2;

  geometryMap[key] = {
    absolute,
    relative,
    center: {
      x: absolute.left + absolute.width / 2,
      y: absolute.top + absolute.height / 2,
    },
    baseline,
    margin: {
      top: parseFloat(computedStyle.marginTop) || 0,
      right: parseFloat(computedStyle.marginRight) || 0,
      bottom: parseFloat(computedStyle.marginBottom) || 0,
      left: parseFloat(computedStyle.marginLeft) || 0,
    },
    padding: {
      top: parseFloat(computedStyle.paddingTop) || 0,
      right: parseFloat(computedStyle.paddingRight) || 0,
      bottom: parseFloat(computedStyle.paddingBottom) || 0,
      left: parseFloat(computedStyle.paddingLeft) || 0,
    },
    position: computedStyle.position || "static",
    rotation,
    parentId,
    zIndex: parseFloat(computedStyle.zIndex) || 0,
    meta: nodeMetaRegistry.get(key) ?? {},
  };
};

const refreshAllGeometry = () => {
  elementRegistry.forEach((_, key) => pendingGeometry.add(key));
  scheduleGeometryUpdate();
};

const interactionState = reactive({
  mode: null,
  templateId: null,
  handleId: null,
  pointerId: null,
  startPointer: { x: 0, y: 0 },
  startRect: null,
  startGeometry: null,
  previewRect: null,
  delta: { x: 0, y: 0 },
  sizeDelta: { width: 0, height: 0 },
  rotationInitial: 0,
  rotationStartAngle: 0,
  rotationCenter: { x: 0, y: 0 },
  rotationPreview: 0,
  rotationDelta: 0,
  canvasRect: null,
  guides: [],
});

const cursorByHandle = {
  tl: "nwse-resize",
  tr: "nesw-resize",
  br: "nwse-resize",
  bl: "nesw-resize",
};

const interactionOverlay = computed(() => {
  if (!interactionState.mode) {
    return null;
  }
  const rect =
    interactionState.previewRect ??
    (interactionState.startRect ? { ...interactionState.startRect } : null);
  if (!rect) {
    return null;
  }
  const templateKey = interactionState.templateId;
  const rotation =
    interactionState.mode === "rotate"
      ? interactionState.rotationPreview
      : geometryMap[templateKey]?.rotation ?? 0;
  const rotationDelta =
    interactionState.mode === "rotate"
      ? interactionState.rotationDelta ?? 0
      : 0;
  const spacing =
    interactionState.mode === "move" || interactionState.mode === "resize"
      ? calculateSpacingIndicators(rect, templateKey)
      : [];
  return {
    mode: interactionState.mode,
    rect,
    delta: { ...interactionState.delta },
    sizeDelta: { ...interactionState.sizeDelta },
    startRect: interactionState.startRect
      ? { ...interactionState.startRect }
      : null,
    rotation,
    rotationDelta,
    spacing,
  };
});

const computeResizedRect = (handleId, startRect, dx, dy) => {
  const minSize = 8;
  let { top, left, width, height } = startRect;
  switch (handleId) {
    case "tl":
      width = startRect.width - dx;
      height = startRect.height - dy;
      top = startRect.top + dy;
      left = startRect.left + dx;
      break;
    case "tr":
      width = startRect.width + dx;
      height = startRect.height - dy;
      top = startRect.top + dy;
      break;
    case "bl":
      width = startRect.width - dx;
      height = startRect.height + dy;
      left = startRect.left + dx;
      break;
    case "br":
    default:
      width = startRect.width + dx;
      height = startRect.height + dy;
      break;
  }
  width = Math.max(minSize, width);
  height = Math.max(minSize, height);
  return { top, left, width, height };
};

const applyGeometryPreview = (templateKey, rect) => {
  const existing = geometryMap[templateKey] ?? {};
  const baseRelative = interactionState.startGeometry?.relative ??
    existing.relative ?? {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

  let relativeTop = rect.top;
  let relativeLeft = rect.left;
  if (interactionState.mode === "move" && interactionState.startRect) {
    const deltaTop = rect.top - interactionState.startRect.top;
    const deltaLeft = rect.left - interactionState.startRect.left;
    relativeTop =
      (interactionState.startGeometry?.relative?.top ?? baseRelative.top) +
      deltaTop;
    relativeLeft =
      (interactionState.startGeometry?.relative?.left ?? baseRelative.left) +
      deltaLeft;
  } else {
    relativeTop = rect.top;
    relativeLeft = rect.left;
  }

  geometryMap[templateKey] = {
    ...existing,
    absolute: rect,
    relative: {
      ...baseRelative,
      top: relativeTop,
      left: relativeLeft,
      width: rect.width,
      height: rect.height,
    },
    center: {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    },
    baseline: rect.top + rect.height,
    meta: existing.meta ?? nodeMetaRegistry.get(templateKey) ?? {},
    margin: existing.margin ?? { top: 0, right: 0, bottom: 0, left: 0 },
    padding: existing.padding ?? { top: 0, right: 0, bottom: 0, left: 0 },
    position:
      interactionState.startGeometry?.position ?? existing.position ?? "static",
  };
};

const applyTemplateResize = (
  templateKey,
  rect,
  startRect,
  handleId,
  position,
  mode = "resize"
) => {
  const templateNode = reka.value.getNodeFromId(templateKey);
  if (!templateNode || !(templateNode instanceof t.TagTemplate)) {
    return;
  }
  const partialStyle = {
    width: `${Math.round(rect.width)}px`,
    height: `${Math.round(rect.height)}px`,
  };

  const positioned = ["absolute", "relative", "fixed", "sticky"].includes(
    position ?? "static"
  );
  if (positioned && startRect) {
    if (mode === "move" || handleId === null) {
      partialStyle.top = `${Math.round(rect.top)}px`;
      partialStyle.left = `${Math.round(rect.left)}px`;
    } else {
      if (handleId === "tl" || handleId === "tr") {
        partialStyle.top = `${Math.round(rect.top)}px`;
      }
      if (handleId === "tl" || handleId === "bl") {
        partialStyle.left = `${Math.round(rect.left)}px`;
      }
    }
  }

  reka.value.change(() => {
    const currentStyle = templateNode.props.style;
    let styleObj = {};
    if (
      currentStyle instanceof t.Literal &&
      typeof currentStyle.value === "object"
    ) {
      styleObj = { ...currentStyle.value };
    }
    styleObj = { ...styleObj, ...partialStyle };
    templateNode.props.style = t.literal({
      value: styleObj,
    });
  });
};

const applyRotationPreview = (templateKey, rotation) => {
  const existing = geometryMap[templateKey];
  if (!existing) {
    return;
  }
  geometryMap[templateKey] = {
    ...existing,
    rotation,
  };
};

const applyTemplateRotation = (templateKey, rotation) => {
  const templateNode = reka.value.getNodeFromId(templateKey);
  if (!templateNode || !(templateNode instanceof t.TagTemplate)) {
    return;
  }
  const normalized = ((rotation % 360) + 360) % 360;
  const rounded =
    Math.abs(normalized) < 0.5 || Math.abs(normalized - 360) < 0.5
      ? 0
      : Math.round(normalized * 100) / 100;

  reka.value.change(() => {
    if (!templateNode.props) {
      templateNode.props = {};
    }
    const currentStyle = templateNode.props.style;
    let styleObj = {};
    if (
      currentStyle instanceof t.Literal &&
      typeof currentStyle.value === "object"
    ) {
      styleObj = { ...currentStyle.value };
    }

    const existingTransform =
      typeof styleObj.transform === "string" ? styleObj.transform : "";
    const withoutRotate = existingTransform
      .split(/\s+/)
      .filter((token) => token && !/^rotate\(/.test(token))
      .join(" ")
      .trim();

    const rotateToken = rounded === 0 ? "" : `rotate(${rounded}deg)`;
    const nextTransform = rotateToken
      ? `${withoutRotate ? `${withoutRotate} ` : ""}${rotateToken}`.trim()
      : withoutRotate;

    if (nextTransform) {
      styleObj.transform = nextTransform;
    } else {
      delete styleObj.transform;
    }

    templateNode.props.style = t.literal({
      value: styleObj,
    });
  });
};

function calculateSpacingIndicators(rect, templateKey) {
  if (!templateKey) {
    return [];
  }
  const entry = geometryMap[templateKey];
  if (!entry) {
    return [];
  }
  const parentId = entry.parentId;
  const parentRect = parentId ? geometryMap[parentId]?.absolute : null;
  const siblings = Object.entries(geometryMap)
    .filter(
      ([key, value]) =>
        key !== templateKey && value?.parentId === parentId && value?.absolute
    )
    .map(([, value]) => value.absolute);

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const indicators = [];

  const pushVerticalIndicator = (idSuffix, start, distance) => {
    if (!distance || distance < 3) {
      return;
    }
    const label = `${Math.round(distance)}px`;
    indicators.push({
      id: `spacing-vertical-${idSuffix}`,
      lineStyle: {
        position: "absolute",
        left: `${centerX}px`,
        top: `${start}px`,
        width: "1px",
        height: `${distance}px`,
        backgroundColor: "rgba(59,130,246,0.6)",
        zIndex: 1040,
      },
      label,
      labelStyle: {
        position: "absolute",
        left: `${centerX + 8}px`,
        top: `${start + distance / 2}px`,
        transform: "translateY(-50%)",
        zIndex: 1041,
      },
    });
  };

  const pushHorizontalIndicator = (idSuffix, start, distance) => {
    if (!distance || distance < 3) {
      return;
    }
    const label = `${Math.round(distance)}px`;
    indicators.push({
      id: `spacing-horizontal-${idSuffix}`,
      lineStyle: {
        position: "absolute",
        left: `${start}px`,
        top: `${centerY}px`,
        height: "1px",
        width: `${distance}px`,
        backgroundColor: "rgba(59,130,246,0.6)",
        zIndex: 1040,
      },
      label,
      labelStyle: {
        position: "absolute",
        left: `${start + distance / 2}px`,
        top: `${centerY - 12}px`,
        transform: "translateX(-50%)",
        zIndex: 1041,
      },
    });
  };

  if (siblings.length) {
    const above = siblings
      .filter((sib) => sib.top + sib.height <= rect.top)
      .sort(
        (a, b) =>
          rect.top - (a.top + a.height) - (rect.top - (b.top + b.height))
      )[0];
    if (above) {
      const distance = rect.top - (above.top + above.height);
      pushVerticalIndicator("top", above.top + above.height, distance);
    } else if (parentRect) {
      const distance = rect.top - parentRect.top;
      pushVerticalIndicator("parent-top", parentRect.top, distance);
    }

    const below = siblings
      .filter((sib) => sib.top >= rect.top + rect.height)
      .sort((a, b) => a.top - b.top)[0];
    if (below) {
      const distance = below.top - (rect.top + rect.height);
      pushVerticalIndicator("bottom", rect.top + rect.height, distance);
    } else if (parentRect) {
      const distance =
        parentRect.top + parentRect.height - (rect.top + rect.height);
      pushVerticalIndicator("parent-bottom", rect.top + rect.height, distance);
    }

    const leftSibling = siblings
      .filter((sib) => sib.left + sib.width <= rect.left)
      .sort(
        (a, b) =>
          rect.left - (a.left + a.width) - (rect.left - (b.left + b.width))
      )[0];
    if (leftSibling) {
      const distance = rect.left - (leftSibling.left + leftSibling.width);
      pushHorizontalIndicator(
        "left",
        leftSibling.left + leftSibling.width,
        distance
      );
    } else if (parentRect) {
      const distance = rect.left - parentRect.left;
      pushHorizontalIndicator("parent-left", parentRect.left, distance);
    }

    const rightSibling = siblings
      .filter((sib) => sib.left >= rect.left + rect.width)
      .sort((a, b) => a.left - b.left)[0];
    if (rightSibling) {
      const distance = rightSibling.left - (rect.left + rect.width);
      pushHorizontalIndicator("right", rect.left + rect.width, distance);
    } else if (parentRect) {
      const distance =
        parentRect.left + parentRect.width - (rect.left + rect.width);
      pushHorizontalIndicator("parent-right", rect.left + rect.width, distance);
    }
  } else if (parentRect) {
    const distanceTop = rect.top - parentRect.top;
    pushVerticalIndicator("parent-top", parentRect.top, distanceTop);

    const distanceBottom =
      parentRect.top + parentRect.height - (rect.top + rect.height);
    pushVerticalIndicator(
      "parent-bottom",
      rect.top + rect.height,
      distanceBottom
    );

    const distanceLeft = rect.left - parentRect.left;
    pushHorizontalIndicator("parent-left", parentRect.left, distanceLeft);

    const distanceRight =
      parentRect.left + parentRect.width - (rect.left + rect.width);
    pushHorizontalIndicator(
      "parent-right",
      rect.left + rect.width,
      distanceRight
    );
  }

  return indicators;
}

const selectedTemplateNode = computed(() => {
  const current = template.value;
  return current instanceof t.TagTemplate ? current : null;
});

const readClassTokens = (templateNode) => {
  if (!templateNode?.props) {
    return [];
  }
  const binding = templateNode.props.className;
  if (!binding) {
    return [];
  }
  if (binding instanceof t.Literal) {
    return typeof binding.value === "string"
      ? binding.value.split(/\s+/).filter(Boolean)
      : [];
  }
  if (binding.id) {
    const resolved = reka.value.getNodeFromId(binding.id);
    if (resolved instanceof t.Literal && typeof resolved.value === "string") {
      return resolved.value.split(/\s+/).filter(Boolean);
    }
  }
  return [];
};

const hasClassToken = (templateNode, token) =>
  readClassTokens(templateNode).includes(token);

const toggleClassToken = (templateNode, token) => {
  if (!templateNode) {
    return;
  }
  reka.value.change(() => {
    if (!templateNode.props) {
      templateNode.props = {};
    }
    let binding = templateNode.props.className;
    let literal = null;
    if (binding instanceof t.Literal) {
      literal = binding;
    } else if (binding?.id) {
      const resolved = reka.value.getNodeFromId(binding.id);
      if (resolved instanceof t.Literal) {
        literal = resolved;
      }
    }
    if (!literal) {
      literal = t.literal({ value: "" });
      templateNode.props.className = literal;
    }
    if (typeof literal.value !== "string") {
      literal.value = "";
    }
    const tokens = literal.value.split(/\s+/).filter(Boolean);
    const index = tokens.indexOf(token);
    if (index === -1) {
      tokens.push(token);
    } else {
      tokens.splice(index, 1);
    }
    literal.value = tokens.join(" ");
  });
};

const selectionToolbarActions = computed(() => {
  const node = selectedTemplateNode.value;
  if (!node) {
    return [];
  }
  return [
    {
      key: "duplicate",
      label: "Duplicate",
      icon: DocumentDuplicateIcon,
    },
    {
      key: "delete",
      label: "Delete",
      icon: TrashIcon,
    },
    {
      key: "toggle-rounded",
      label: "Rounded",
      icon: SparklesIcon,
      active: hasClassToken(node, "rounded-lg"),
    },
    {
      key: "toggle-shadow",
      label: "Shadow",
      icon: BoltIcon,
      active: hasClassToken(node, "shadow-lg"),
    },
  ];
});

const computeSnapRect = (rect, templateKey) => {
  const hostEl = canvasRoot.value;
  if (!hostEl) {
    return { rect, guides: [] };
  }
  const rootRect = hostEl.getBoundingClientRect();
  let bestLeft = rect.left;
  let bestTop = rect.top;
  let bestDiffX = SNAP_THRESHOLD + 1;
  let bestDiffY = SNAP_THRESHOLD + 1;
  let bestXGuide = null;
  let bestYGuide = null;

  const considerVertical = (targetLeft, guideStyle) => {
    const diff = targetLeft - rect.left;
    if (Math.abs(diff) < bestDiffX) {
      bestDiffX = Math.abs(diff);
      bestLeft = targetLeft;
      bestXGuide = guideStyle
        ? {
            id: `snap-v-${guideStyle.id}`,
            style: {
              top: "0px",
              left: `${guideStyle.position}px`,
              width: "1px",
              height: `${rootRect.height}px`,
              backgroundColor: "rgba(59,130,246,0.45)",
            },
          }
        : null;
    }
  };

  const considerHorizontal = (targetTop, guideStyle) => {
    const diff = targetTop - rect.top;
    if (Math.abs(diff) < bestDiffY) {
      bestDiffY = Math.abs(diff);
      bestTop = targetTop;
      bestYGuide = guideStyle
        ? {
            id: `snap-h-${guideStyle.id}`,
            style: {
              left: "0px",
              top: `${guideStyle.position}px`,
              width: `${rootRect.width}px`,
              height: "1px",
              backgroundColor: "rgba(59,130,246,0.45)",
            },
          }
        : null;
    }
  };

  const currentEntry = geometryMap[templateKey];
  const position =
    currentEntry?.position ??
    interactionState.startGeometry?.position ??
    "static";

  Object.entries(geometryMap).forEach(([key, entry]) => {
    if (key === templateKey || !entry?.absolute) {
      return;
    }
    const other = entry.absolute;
    const otherLeft = other.left;
    const otherRight = other.left + other.width;
    const otherCenterX = other.left + other.width / 2;
    const otherTop = other.top;
    const otherBottom = other.top + other.height;
    const otherCenterY = other.top + other.height / 2;

    if (Math.abs(rect.left - otherLeft) <= SNAP_THRESHOLD) {
      considerVertical(otherLeft, { id: `${key}-left`, position: otherLeft });
    }
    if (Math.abs(rect.left - otherRight) <= SNAP_THRESHOLD) {
      considerVertical(otherRight, {
        id: `${key}-right`,
        position: otherRight,
      });
    }
    const rectRight = rect.left + rect.width;
    if (Math.abs(rectRight - otherRight) <= SNAP_THRESHOLD) {
      considerVertical(otherRight - rect.width, {
        id: `${key}-right-to-right`,
        position: otherRight,
      });
    }
    if (Math.abs(rectRight - otherLeft) <= SNAP_THRESHOLD) {
      considerVertical(otherLeft - rect.width, {
        id: `${key}-left-to-right`,
        position: otherLeft,
      });
    }
    const rectCenterX = rect.left + rect.width / 2;
    if (Math.abs(rectCenterX - otherCenterX) <= SNAP_THRESHOLD) {
      considerVertical(otherCenterX - rect.width / 2, {
        id: `${key}-center-x`,
        position: otherCenterX,
      });
    }

    if (Math.abs(rect.top - otherTop) <= SNAP_THRESHOLD) {
      considerHorizontal(otherTop, { id: `${key}-top`, position: otherTop });
    }
    if (Math.abs(rect.top - otherBottom) <= SNAP_THRESHOLD) {
      considerHorizontal(otherBottom, {
        id: `${key}-bottom`,
        position: otherBottom,
      });
    }
    const rectBottom = rect.top + rect.height;
    if (Math.abs(rectBottom - otherBottom) <= SNAP_THRESHOLD) {
      considerHorizontal(otherBottom - rect.height, {
        id: `${key}-bottom-to-bottom`,
        position: otherBottom,
      });
    }
    if (Math.abs(rectBottom - otherTop) <= SNAP_THRESHOLD) {
      considerHorizontal(otherTop - rect.height, {
        id: `${key}-top-to-bottom`,
        position: otherTop,
      });
    }
    const rectCenterY = rect.top + rect.height / 2;
    if (Math.abs(rectCenterY - otherCenterY) <= SNAP_THRESHOLD) {
      considerHorizontal(otherCenterY - rect.height / 2, {
        id: `${key}-center-y`,
        position: otherCenterY,
      });
    }
  });

  if (Math.abs(rect.left) <= SNAP_THRESHOLD) {
    considerVertical(0, { id: "canvas-left", position: 0 });
  }
  const canvasRight = rootRect.width;
  if (Math.abs(rect.left + rect.width - canvasRight) <= SNAP_THRESHOLD) {
    considerVertical(canvasRight - rect.width, {
      id: "canvas-right",
      position: canvasRight,
    });
  }
  if (Math.abs(rect.top) <= SNAP_THRESHOLD) {
    considerHorizontal(0, { id: "canvas-top", position: 0 });
  }
  const canvasBottom = rootRect.height;
  if (Math.abs(rect.top + rect.height - canvasBottom) <= SNAP_THRESHOLD) {
    considerHorizontal(canvasBottom - rect.height, {
      id: "canvas-bottom",
      position: canvasBottom,
    });
  }

  const snappedRect = {
    ...rect,
    left: bestLeft,
    top: bestTop,
  };

  if (position === "static") {
    return { rect, guides: [] };
  }

  const guides = [];
  if (bestXGuide) {
    guides.push(bestXGuide);
  }
  if (bestYGuide) {
    guides.push(bestYGuide);
  }

  return { rect: snappedRect, guides };
};

const handleResizeMove = (event) => {
  if (interactionState.mode !== "resize") {
    return;
  }
  event.preventDefault();
  const dx = event.clientX - interactionState.startPointer.x;
  const dy = event.clientY - interactionState.startPointer.y;
  const newRect = computeResizedRect(
    interactionState.handleId,
    interactionState.startRect,
    dx,
    dy
  );
  interactionState.previewRect = { ...newRect };
  const startRect = interactionState.startRect;
  if (startRect) {
    interactionState.delta = {
      x: newRect.left - startRect.left,
      y: newRect.top - startRect.top,
    };
    interactionState.sizeDelta = {
      width: newRect.width - startRect.width,
      height: newRect.height - startRect.height,
    };
  }
  applyGeometryPreview(interactionState.templateId, newRect);
};

const handleResizeEnd = (event) => {
  if (interactionState.mode !== "resize") {
    return;
  }
  event.preventDefault();
  window.removeEventListener("pointermove", handleResizeMove);
  window.removeEventListener("pointerup", handleResizeEnd);
  if (typeof document !== "undefined") {
    document.body.style.cursor = "";
  }

  const entry = geometryMap[interactionState.templateId];
  const finalRect = entry?.absolute ??
    interactionState.startRect ?? { width: 0, height: 0, top: 0, left: 0 };
  applyTemplateResize(
    interactionState.templateId,
    finalRect,
    interactionState.startRect,
    interactionState.handleId,
    interactionState.startGeometry?.position,
    "resize"
  );

  interactionState.mode = null;
  interactionState.templateId = null;
  interactionState.handleId = null;
  interactionState.pointerId = null;
  interactionState.startPointer = { x: 0, y: 0 };
  interactionState.startRect = null;
  interactionState.startGeometry = null;
  interactionState.previewRect = null;
  interactionState.delta = { x: 0, y: 0 };
  interactionState.sizeDelta = { width: 0, height: 0 };
  interactionState.rotationInitial = 0;
  interactionState.rotationStartAngle = 0;
  interactionState.rotationCenter = { x: 0, y: 0 };
  interactionState.rotationPreview = 0;
  interactionState.rotationDelta = 0;
  interactionState.canvasRect = null;
  interactionState.guides = [];

  nextTick(() => {
    refreshAllGeometry();
  });
};

const onResizeStart = ({ handleId, clientX, clientY, pointerId }) => {
  const templateKey = templateId.value;
  if (!templateKey || !geometryMap[templateKey]) {
    return;
  }
  const geom = geometryMap[templateKey];
  interactionState.mode = "resize";
  interactionState.templateId = templateKey;
  interactionState.handleId = handleId;
  interactionState.pointerId = pointerId ?? null;
  interactionState.startPointer = { x: clientX, y: clientY };
  interactionState.startRect = { ...geom.absolute };
  interactionState.startGeometry = {
    relative: geom.relative ? { ...geom.relative } : null,
    position: geom.position ?? "static",
  };
  interactionState.previewRect = { ...geom.absolute };
  interactionState.delta = { x: 0, y: 0 };
  interactionState.sizeDelta = { width: 0, height: 0 };
  interactionState.guides = [];

  if (typeof document !== "undefined") {
    document.body.style.cursor = cursorByHandle[handleId] ?? "nwse-resize";
  }

  window.addEventListener("pointermove", handleResizeMove);
  window.addEventListener("pointerup", handleResizeEnd);
};

const handleMove = (event) => {
  if (interactionState.mode !== "move") {
    return;
  }
  event.preventDefault();
  const dx = event.clientX - interactionState.startPointer.x;
  const dy = event.clientY - interactionState.startPointer.y;
  let newRect = {
    ...interactionState.startRect,
    left: interactionState.startRect.left + dx,
    top: interactionState.startRect.top + dy,
  };
  const { rect: snappedRect, guides } = computeSnapRect(
    newRect,
    interactionState.templateId
  );
  interactionState.guides = guides;
  interactionState.previewRect = { ...snappedRect };
  const startRect = interactionState.startRect;
  if (startRect) {
    interactionState.delta = {
      x: snappedRect.left - startRect.left,
      y: snappedRect.top - startRect.top,
    };
    interactionState.sizeDelta = {
      width: snappedRect.width - startRect.width,
      height: snappedRect.height - startRect.height,
    };
  }
  applyGeometryPreview(interactionState.templateId, snappedRect);
};

const handleMoveEnd = (event) => {
  if (interactionState.mode !== "move") {
    return;
  }
  event.preventDefault();
  window.removeEventListener("pointermove", handleMove);
  window.removeEventListener("pointerup", handleMoveEnd);
  if (typeof document !== "undefined") {
    document.body.style.cursor = "";
  }
  const entry = geometryMap[interactionState.templateId];
  const finalRect = entry?.absolute ??
    interactionState.startRect ?? { left: 0, top: 0, width: 0, height: 0 };
  applyTemplateResize(
    interactionState.templateId,
    finalRect,
    interactionState.startRect,
    interactionState.handleId,
    interactionState.startGeometry?.position,
    "move"
  );
  interactionState.mode = null;
  interactionState.templateId = null;
  interactionState.handleId = null;
  interactionState.pointerId = null;
  interactionState.startPointer = { x: 0, y: 0 };
  interactionState.startRect = null;
  interactionState.startGeometry = null;
  interactionState.previewRect = null;
  interactionState.delta = { x: 0, y: 0 };
  interactionState.sizeDelta = { width: 0, height: 0 };
  interactionState.rotationInitial = 0;
  interactionState.rotationStartAngle = 0;
  interactionState.rotationCenter = { x: 0, y: 0 };
  interactionState.rotationPreview = 0;
  interactionState.rotationDelta = 0;
  interactionState.canvasRect = null;
  interactionState.guides = [];
  nextTick(() => {
    refreshAllGeometry();
  });
};

const onMoveStart = ({ clientX, clientY, pointerId }) => {
  const templateKey = templateId.value;
  if (!templateKey || !geometryMap[templateKey]) {
    return;
  }
  const geom = geometryMap[templateKey];
  const position =
    geom.position ?? interactionState.startGeometry?.position ?? "static";
  if (
    !["absolute", "relative", "fixed", "sticky"].includes(position ?? "static")
  ) {
    return;
  }
  interactionState.mode = "move";
  interactionState.templateId = templateKey;
  interactionState.handleId = null;
  interactionState.pointerId = pointerId ?? null;
  interactionState.startPointer = { x: clientX, y: clientY };
  interactionState.startRect = { ...geom.absolute };
  interactionState.startGeometry = {
    relative: geom.relative ? { ...geom.relative } : null,
    position,
  };
  interactionState.previewRect = { ...geom.absolute };
  interactionState.delta = { x: 0, y: 0 };
  interactionState.sizeDelta = { width: 0, height: 0 };
  interactionState.rotationInitial = geom.rotation ?? 0;
  interactionState.rotationPreview = geom.rotation ?? 0;
  interactionState.rotationDelta = 0;
  interactionState.rotationCenter = { x: 0, y: 0 };
  interactionState.rotationStartAngle = 0;
  interactionState.canvasRect = null;
  interactionState.guides = [];
  if (typeof document !== "undefined") {
    document.body.style.cursor = "move";
  }
  window.addEventListener("pointermove", handleMove);
  window.addEventListener("pointerup", handleMoveEnd);
};

const handleRotateMove = (event) => {
  if (interactionState.mode !== "rotate") {
    return;
  }
  event.preventDefault();
  const origin = interactionState.rotationCenter;
  const angle = Math.atan2(event.clientY - origin.y, event.clientX - origin.x);
  let delta = angle - interactionState.rotationStartAngle;
  if (event.shiftKey) {
    const snap = Math.PI / 12; // 15°
    delta = Math.round(delta / snap) * snap;
  }
  const rotationDeg =
    interactionState.rotationInitial + (delta * 180) / Math.PI;
  if (!Number.isNaN(rotationDeg)) {
    interactionState.rotationPreview = rotationDeg;
    interactionState.rotationDelta =
      rotationDeg - interactionState.rotationInitial;
    applyRotationPreview(interactionState.templateId, rotationDeg);
  }
};

const handleRotateEnd = (event) => {
  if (interactionState.mode !== "rotate") {
    return;
  }
  event.preventDefault();
  window.removeEventListener("pointermove", handleRotateMove);
  window.removeEventListener("pointerup", handleRotateEnd);
  if (typeof document !== "undefined") {
    document.body.style.cursor = "";
  }
  applyTemplateRotation(
    interactionState.templateId,
    interactionState.rotationPreview
  );
  interactionState.mode = null;
  interactionState.templateId = null;
  interactionState.handleId = null;
  interactionState.pointerId = null;
  interactionState.startPointer = { x: 0, y: 0 };
  interactionState.startRect = null;
  interactionState.startGeometry = null;
  interactionState.previewRect = null;
  interactionState.delta = { x: 0, y: 0 };
  interactionState.sizeDelta = { width: 0, height: 0 };
  interactionState.rotationInitial = 0;
  interactionState.rotationStartAngle = 0;
  interactionState.rotationCenter = { x: 0, y: 0 };
  interactionState.rotationPreview = 0;
  interactionState.rotationDelta = 0;
  interactionState.canvasRect = null;
  interactionState.guides = [];
  nextTick(() => {
    refreshAllGeometry();
  });
};

const onRotateStart = ({ clientX, clientY, pointerId, shiftKey }) => {
  const templateKey = templateId.value;
  if (!templateKey || !geometryMap[templateKey]) {
    return;
  }
  const geom = geometryMap[templateKey];
  const rootEl = canvasRoot.value;
  if (!rootEl) {
    return;
  }
  const rootRect = rootEl.getBoundingClientRect();
  const center = {
    x: rootRect.left + geom.absolute.left + geom.absolute.width / 2,
    y: rootRect.top + geom.absolute.top + geom.absolute.height / 2,
  };
  interactionState.mode = "rotate";
  interactionState.templateId = templateKey;
  interactionState.handleId = "rotate";
  interactionState.pointerId = pointerId ?? null;
  interactionState.startPointer = { x: clientX, y: clientY };
  interactionState.startRect = { ...geom.absolute };
  interactionState.startGeometry = {
    relative: geom.relative ? { ...geom.relative } : null,
    position: geom.position ?? "static",
  };
  interactionState.previewRect = { ...geom.absolute };
  interactionState.delta = { x: 0, y: 0 };
  interactionState.sizeDelta = { width: 0, height: 0 };
  interactionState.rotationInitial = geom.rotation ?? 0;
  interactionState.rotationPreview = geom.rotation ?? 0;
  interactionState.rotationDelta = 0;
  interactionState.rotationCenter = center;
  interactionState.rotationStartAngle = Math.atan2(
    clientY - center.y,
    clientX - center.x
  );
  interactionState.canvasRect = rootRect;
  interactionState.guides = [];
  if (typeof document !== "undefined") {
    document.body.style.cursor = "crosshair";
  }
  handleRotateMove({
    preventDefault() {},
    clientX,
    clientY,
    shiftKey,
  });
  window.addEventListener("pointermove", handleRotateMove);
  window.addEventListener("pointerup", handleRotateEnd);
};
const onToolbarAction = (action) => {
  const key = typeof action === "string" ? action : action?.key;
  if (!key) {
    return;
  }
  const node = selectedTemplateNode.value;
  if (!node) {
    return;
  }
  switch (key) {
    case "duplicate":
      duplicateTemplateNode(node);
      break;
    case "delete":
      removeTemplateNode(node);
      break;
    case "toggle-rounded":
      toggleClassToken(node, "rounded-lg");
      nextTick(() => {
        refreshAllGeometry();
      });
      break;
    case "toggle-shadow":
      toggleClassToken(node, "shadow-lg");
      nextTick(() => {
        refreshAllGeometry();
      });
      break;
    default:
      break;
  }
};

provide("registerElement", registerElement);
provide("getElementMetrics", getElementMetrics);
provide("canvasRoot", canvasRoot);
provide("geometryMap", geometryMap);
provide("elementRegistry", elementRegistry);

const setOption = (value) => {
  option.value = value;
  isNewComponent.value = true;
};

const removeComponent = (view) => {
  const parent = reka.value.getParentNode(view.template, t.Template);
  if (parent instanceof t.SlottableTemplate) {
    reka.value.change(() => {
      const index = parent.children.indexOf(view.template);
      if (index !== -1) {
        parent.children.splice(index, 1);
      }
      const componentIndex = reka.value.state.program.components.findIndex(
        (a) => a.name === view.component?.name
      );
      if (componentIndex !== -1) {
        reka.value.state.program.components.splice(componentIndex, 1);
      }
    });
  }
};

const handleDragStart = (event) => {
  event.dataTransfer.setData("text/plain", "");
};

const handleInput = debounce((event, view) => {
  const literal = view.template.props.value;
  if (!(literal instanceof t.Literal)) {
    return;
  }
  const nextValue = event.target?.innerText ?? "";
  const currentValue =
    typeof literal.value === "string"
      ? literal.value
      : `${literal.value ?? ""}`;
  if (nextValue === currentValue) {
    return;
  }
  if (!reka?.value?.change) {
    return;
  }
  reka.value.change(() => {
    view.template.props.value = t.literal({
      value: nextValue,
    });
  });
}, 250);

const intersectDirective = {
  mounted(el, binding) {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (binding.value && typeof binding.value === "function") {
          binding.value(entry.isIntersecting);
        }
      });
    };
    const observer = new IntersectionObserver(callback, {
      root: null, // or set to a specific scrolling container element
      rootMargin: "0px",
      threshold: 0.1, // Adjust the threshold as needed
    });
    observer.observe(el);
    el._observer = observer;
  },
  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect();
      delete el._observer;
    }
  },
};

// const RenderView = defineComponent({
//   directives: {
//     intersect: intersectDirective,
//   },
//   props: {
//     view: {
//       type: t.View,
//       required: true,
//     },
//   },
//   setup(props) {
//     const { view } = toRefs(props);

//     const [drag] = useDrag(() => ({
//       type: "Box",
//       item: () => ({
//         id: "X281pgnsexAVxvsrHMof7",
//         meta: {},
//         name: "SimpleCard",
//         props: [],
//         state: [],
//         template: {
//           children: [
//             {
//               children: [
//                 {
//                   children: [
//                     {
//                       children: [],
//                       classList: null,
//                       each: null,
//                       id: "ArDnuqn7Kv222ufX0ZrE2",
//                       if: null,
//                       meta: {},
//                       props: {
//                         value: {
//                           id: "rgMzY475nKdjKbRoC0ci4",
//                           meta: {},
//                           type: "Literal",
//                           value: "SimpleCard",
//                         },
//                       },
//                       tag: "text",
//                       type: "TagTemplate",
//                     },
//                   ],
//                   classList: null,
//                   each: null,
//                   id: "ULyuA4xp90WQBI2v57da4",
//                   if: null,
//                   meta: {},
//                   props: {
//                     className: {
//                       id: "r1jZfpa3ypd4ucBfrQ4S8",
//                       meta: {},
//                       type: "Literal",
//                       value:
//                         "text-xs bg-red-400 py-2 px-2 text-white mb-4 rounded-md flex ",
//                     },
//                   },
//                   tag: "div",
//                   type: "TagTemplate",
//                 },
//                 {
//                   children: [
//                     {
//                       children: [],
//                       classList: null,
//                       each: null,
//                       id: "CSixqqbiN7PCtmHLA2FJd",
//                       if: null,
//                       meta: {},
//                       props: {
//                         value: {
//                           id: "I7m0GyrGQ6JUjQ0PIUUUI",
//                           meta: {},
//                           type: "Literal",
//                           value: "SimpleCard",
//                         },
//                       },
//                       tag: "text",
//                       type: "TagTemplate",
//                     },
//                   ],
//                   classList: null,
//                   each: null,
//                   id: "oIPB3tmXYv127fZXXIahm",
//                   if: null,
//                   meta: {},
//                   props: {
//                     className: {
//                       id: "TmAuyx599IyDl36EBj8QQ",
//                       meta: {},
//                       type: "Literal",
//                       value: "text-xs",
//                     },
//                   },
//                   tag: "div",
//                   type: "TagTemplate",
//                 },
//               ],
//               classList: null,
//               each: null,
//               id: "LAkrMbebOyRjxnv72KVHg",
//               if: null,
//               meta: {},
//               props: {
//                 className: {
//                   id: "35mdeStG13x5evJLsViW1",
//                   meta: {},
//                   type: "Literal",
//                   value:
//                     "px-4 py-4 max-auto border-2 relative rounded-md w-full border-black",
//                 },
//               },
//               tag: "div",
//               type: "TagTemplate",
//             },
//           ],
//           classList: null,
//           each: null,
//           id: "XebYlGHDK60Og5IMxto7f",
//           if: null,
//           meta: {},
//           props: {
//             className: {
//               id: "7V6c64QtMkX1R27J1YfUv",
//               meta: {},
//               type: "Literal",
//               value: "relative bg-white px-4 py-4",
//             },
//           },
//           tag: "div",
//           type: "TagTemplate",
//         },
//         type: "RekaComponent",
//       }),
//       end: (item, monitor) => {
//         const dropResult = monitor.getDropResult();
//         if (item && dropResult) {
//           console.log(`You dropped ${item.name} into ${dropResult.name}!`);
//         }
//       },
//       collect: (monitor) => ({
//         isDragging: monitor.isDragging(),
//         handlerId: monitor.getHandlerId(),
//       }),
//     }));

//     const cursorPositionY = ref("bottom");
//     const [collect, drop] = useDrop(() => ({
//       accept: "Box",
//       drop(item, monitor) {
//         const didDrop = monitor.didDrop();
//         if (didDrop) {
//           return { name: view.value.id };
//         } else {
//           const itemTemplate = t.Schema.fromJSON(item).template;
//           if (itemTemplate instanceof t.Template) {
//             reka.value.change(() => {
//               if ("option.value" === "child") {
//                 if (!(view.value.template instanceof t.SlottableTemplate)) {
//                   return;
//                 }

//                 view.value.template.children.push(itemTemplate);
//                 return;
//               }

//               const parent = reka.value.getParentNode(view.value.template);

//               if (!parent) {
//                 return;
//               }

//               if (!(parent.node instanceof t.SlottableTemplate)) {
//                 return;
//               }

//               const indexInParent = parent.node.children.indexOf(
//                 view.value.template
//               );

//               if (indexInParent === -1) {
//                 return;
//               }

//               if (cursorPositionY.value === "bottom") {
//                 parent.node.children.splice(indexInParent + 1, 0, itemTemplate);
//                 return;
//               }

//               parent.node.children.splice(indexInParent, 0, itemTemplate);
//             });
//           }
//           return { name: view.value.id };
//         }
//       },
//       collect: (monitor) => ({
//         isOver: monitor.isOver(),
//         canDrop: monitor.canDrop(),
//         isOverCurrent: monitor.isOver({ shallow: true }),
//         offset: monitor.getClientOffset(),
//       }),
//     }));
//     const { canDrop, isOver, isOverCurrent, offset } = toRefs(collect);
//     const dropTarget = ref(null);
//     const option = ref(null);

//     const setOption = (value) => {
//       option.value = value;
//       isNewComponent.value = true;
//     };
//     const renderDropdown = (isClicked, isCenter, isElement) => {
//       return isClicked
//         ? h(
//           DropdownRenderView,
//           {
//             onSelect: (data) => {
//               setOption(data);
//             },
//             onDelete: () => {
//               removeComponent(view.value);
//             },
//             isTag: false,
//             isCenter: isCenter,
//             isElement: isElement,
//             items: [
//               {
//                 title: "Add Before",
//                 value: "before",
//               },
//               {
//                 title: "Add After",
//                 value: "after",
//               },
//               {
//                 title: "Add child",
//                 value: "child",
//               },
//             ],
//           },
//           () => [
//             h("span", [
//               h("div", { content: "Add new template" }, [
//                 h("button", [h("div")]),
//               ]),
//             ]),
//           ]
//         )
//         : null;
//     };

//     const renderComponent = () => {
//       if (view.value instanceof t.TagView) {
//         const isHovered = hoveredTemplate.value === view.value?.template?.id;
//         const content = view.value.props.value;
//         const isCenter = ref(true);
//         const handleVisibility = (isVisible) => {
//           isCenter.value = isVisible
//         };
//         if (view.value.tag === "text") {
//           return withDirectives(h(
//             "span",
//             {
//               onMouseover: withModifiers(() => { hoveredTemplate.value = view.value?.template?.id }, ["self"]),
//               onMouseleave: withModifiers(() => () => { hoveredTemplate.value = null }, ["self"]),
//               onClick: withModifiers(() => { templateId.value = view.value?.template?.id }, ["self"]),
//               style: {
//                 outline: isHovered ? "2px dashed #0166de" : "none",
//               },
//               class: 'relative',
//               draggable: true,
//               contenteditable: isHovered,
//               onInput: (e) => handleInput(e, view.value),
//               id: view.value.id,
//               // ref: drop,
//             },
//             [
//               content,
//               unref(isOverCurrent)
//                 ? h("span", { class: ["indicator", cursorPositionY.value + "x"] })
//                 : null,
//               renderDropdown(isHovered, isCenter.value, false),
//             ]
//           ),
//             [
//               [intersectDirective, handleVisibility]
//             ]);
//         }
//         if (view.value.tag === "img") {
//           return withDirectives(h("img", {
//             style: view.value.props.style,
//             src: view.value.props.src,
//             class: view.value.props.className,
//             alt: view.value.props.alt || "",
//             width: view.value.props.width || 500,
//             height: view.value.props.height || 500,
//             onMouseover: withModifiers(() => { hoveredTemplate.value = view.value?.template?.id }, ["self"]),
//             onMouseleave: withModifiers(() => { hoveredTemplate.value = null }, ["self"]),
//             onClick: withModifiers(() => { templateId.value = view.value?.template?.id }, ["self"]),
//           }),
//             [
//               [intersectDirective, handleVisibility]
//             ]);
//         }
//         return withDirectives(h(
//           view.value.tag,
//           {
//             ...view.value.props,
//             onMouseover: withModifiers(() => { hoveredTemplate.value = view.value?.template?.id }, ["self"]),
//             onMouseleave: withModifiers(() => { hoveredTemplate.value = null }, ["self"]),
//             onClick: withModifiers(() => { templateId.value = view.value?.template?.id }, ["self"]),
//             style: {
//               cursor: "pointer",
//               outline: isHovered ? "2px dashed #0166de" : "none",
//               outlineOffset: "0px",
//               position: "relative",
//               ...view.value.props.style, // Preserve existing styles
//             },
//             id: view.value.id,
//             // ref: drop,
//             directives: [{
//               name: 'intersect',
//               value: handleVisibility,
//               arg: 'visibility',
//             }],
//           }, view.value.children.length > 0
//           ? view.value.children.map((child) =>
//             h(RenderView, {
//               key: child.id,
//               view: child,
//             })
//           )
//           : null,
//           [
//             unref(isOverCurrent)
//               ? h("span", { class: ["indicator", cursorPositionY.value + "x"] })
//               : null,
//             renderDropdown(isHovered, isCenter.value, false),
//           ]
//         ),
//           [
//             [intersectDirective, handleVisibility]
//           ]);
//       }
//       if (view.value instanceof t.RekaComponentView) {
//         return view.value.render.map((r) => {
//           return [
//             h("span", {
//               onMouseover: withModifiers(() => { componentId.value = r.id }, ["self"]),
//               onMouseleave: withModifiers(() => { componentId.value = r.id }, ["self"]),
//               class: ["relative"],
//             }, h(
//               RenderView, {
//               key: r.id,
//               view: r
//             }),
//               h("span", {
//                 class: [
//                   "border border border-red-500 absolute top-0 left-1/2 transform -translate-x-1/2 w-full z-40", componentId.value == r.id ? 'block' : 'hidden',
//                 ],
//               },
//                 renderDropdown(componentId.value == r.id, true, true),
//               )
//             ),
//           ];
//         });
//       }

//       if (view.value instanceof t.ExternalComponentView) {
//         return view.value.component.render(view.value.props);
//       }

//       if (
//         view.value instanceof t.SlotView ||
//         view.value instanceof t.SlotView
//       ) {
//         return view.value.children.map((r) =>
//           h(RenderView, { key: r.id, view: r })
//         );
//       }

//       if (view.value instanceof t.ErrorSystemView) {
//         return null;
//       }

//       if (view.value instanceof t.FragmentView) {
//         return view.value.children.map((child) =>
//           h(RenderView, { key: child.id, view: child })
//         );
//       }
//       return null;

//     };

//     return () => renderComponent();
//   },
// });

const getSlottableParent = (templateNode) => {
  if (!templateNode) {
    return null;
  }
  const parentInfo = reka.value.getParentNode(templateNode, t.Template);
  if (!parentInfo || !(parentInfo.node instanceof t.SlottableTemplate)) {
    return null;
  }
  return parentInfo.node;
};

const moveTemplateByOffset = (templateNode, offset) => {
  const parent = getSlottableParent(templateNode);
  if (!parent || !Number.isInteger(offset) || offset === 0) {
    return;
  }
  reka.value.change(() => {
    const list = parent.children;
    const currentIndex = list.indexOf(templateNode);
    if (currentIndex === -1) {
      return;
    }
    const targetIndex = currentIndex + offset;
    const [node] = list.splice(currentIndex, 1);
    let adjusted = targetIndex;
    if (adjusted < 0) {
      adjusted = 0;
    }
    if (adjusted > list.length) {
      adjusted = list.length;
    }
    list.splice(adjusted, 0, node);
  });
};

const moveTemplateToEdge = (templateNode, edge) => {
  const parent = getSlottableParent(templateNode);
  if (!parent) {
    return;
  }
  reka.value.change(() => {
    const list = parent.children;
    const currentIndex = list.indexOf(templateNode);
    if (currentIndex === -1) {
      return;
    }
    const [node] = list.splice(currentIndex, 1);
    if (edge === "start") {
      list.unshift(node);
    } else {
      list.push(node);
    }
  });
};

const removeTemplateNode = (templateNode) => {
  const parent = getSlottableParent(templateNode);
  if (!parent) {
    return;
  }
  const currentIndex = parent.children.indexOf(templateNode);
  if (currentIndex === -1) {
    return;
  }
  reka.value.change(() => {
    parent.children.splice(currentIndex, 1);
  });
  if (templateId.value === templateNode.id) {
    const fallback =
      parent.children[currentIndex] ??
      parent.children[currentIndex - 1] ??
      null;
    templateId.value = fallback?.id ?? parent.id ?? null;
  }
  nextTick(() => {
    refreshAllGeometry();
  });
};

const duplicateTemplateNode = (templateNode) => {
  const parent = getSlottableParent(templateNode);
  if (!parent) {
    return;
  }
  let clone = null;
  reka.value.change(() => {
    const index = parent.children.indexOf(templateNode);
    if (index === -1) {
      return;
    }
    clone = t.clone(templateNode, { replaceExistingId: true });
    parent.children.splice(index + 1, 0, clone);
  });
  if (clone?.id) {
    templateId.value = clone.id;
  }
  nextTick(() => {
    refreshAllGeometry();
  });
};

const resolveTargetComponentId = (currentView) => {
  if (!currentView) {
    return componentId.value ?? null;
  }
  if (currentView.component?.id) {
    return currentView.component.id;
  }
  if (currentView.owner?.component?.id) {
    return currentView.owner.component.id;
  }
  if (currentView.owner?.componentView?.component?.id) {
    return currentView.owner.componentView.component.id;
  }
  return componentId.value ?? null;
};

const createDropContext = (currentView) => {
  const dropFactory = (position) => () => {
    const targetId = resolveTargetComponentId(currentView);
    const templateTargetId = currentView?.template?.id ?? null;
    return {
      targetId,
      position,
      templateId: templateTargetId,
    };
  };

  const [dropAboveCollect, dropAboveRef] = useDrop(() => ({
    accept: "Box",
    drop: dropFactory("up"),
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [dropBelowCollect, dropBelowRef] = useDrop(() => ({
    accept: "Box",
    drop: dropFactory("down"),
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [dropChildCollect, dropChildRef] = useDrop(() => ({
    accept: "Box",
    drop: () => {
      const templateTargetId = currentView?.template?.id ?? null;
      if (!templateTargetId) {
        return null;
      }
      return {
        targetId: resolveTargetComponentId(currentView),
        position: "child",
        templateId: templateTargetId,
      };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop() && canAcceptChildren(currentView),
    }),
  }));

  return {
    dropAboveState: toRefs(dropAboveCollect),
    dropAboveRef,
    dropBelowState: toRefs(dropBelowCollect),
    dropBelowRef,
    dropChildState: toRefs(dropChildCollect),
    dropChildRef,
  };
};

const resolveNodeMetrics = (view, ctx) => {
  const templateKey = view?.template?.id;
  if (!templateKey) {
    return null;
  }
  const cached = ctx?.getElementMetrics?.(templateKey);
  if (cached) {
    return cached;
  }
  const hostEl = ctx?.canvasRoot?.value;
  const elementMap = ctx?.elementRegistry;
  if (!hostEl || !elementMap) {
    return null;
  }
  const el =
    typeof elementMap.get === "function"
      ? elementMap.get(templateKey)
      : elementMap[templateKey];
  if (!el) {
    return null;
  }
  const rect = el.getBoundingClientRect();
  const rootRect = hostEl.getBoundingClientRect();
  return {
    top: rect.top - rootRect.top,
    left: rect.left - rootRect.left,
    width: rect.width,
    height: rect.height,
  };
};

const renderDropZone = (
  view,
  direction,
  isHovered,
  allow = true,
  dropContext,
  ctx
) => {
  if (!allow || !dropContext) {
    return null;
  }
  const hostEl = ctx?.canvasRoot?.value;
  if (!hostEl) {
    return null;
  }
  const metrics = resolveNodeMetrics(view, ctx);
  if (!metrics || !Number.isFinite(metrics.top)) {
    return null;
  }
  const state =
    direction === "up"
      ? dropContext.dropAboveState
      : dropContext.dropBelowState;
  const dropRef =
    direction === "up" ? dropContext.dropAboveRef : dropContext.dropBelowRef;

  if (!state || !dropRef || !state.isOver || !state.canDrop) {
    return null;
  }

  const style = {
    position: "absolute",
    left: `${metrics.left}px`,
    width: `${Math.max(metrics.width, 24)}px`,
    height: "4px",
    borderRadius: "9999px",
    pointerEvents: "none",
    zIndex: 1000,
    transition: "opacity 150ms ease-out, transform 150ms ease-out",
    backgroundColor: state.isOver.value
      ? "rgba(37, 99, 235, 0.9)"
      : "rgba(96, 165, 250, 0.7)",
    opacity: state.isOver.value
      ? 1
      : state.canDrop.value
      ? 0.8
      : isHovered
      ? 0.35
      : 0,
  };

  if (state.isOver.value || state.canDrop.value) {
    style.pointerEvents = "auto";
    style.cursor = "pointer";
  }

  if (direction === "up") {
    style.top = `${metrics.top - 6}px`;
  } else {
    style.top = `${metrics.top + metrics.height + 2}px`;
  }

  const interactive = state.isOver.value || state.canDrop.value;
  if (interactive) {
    style.pointerEvents = "auto";
  }

  const label = direction === "up" ? "Above element" : "Below element";
  const showLabel = state.isOver.value || (isHovered && state.canDrop.value);
  const labelNode =
    showLabel && metrics.width > 40
      ? h(
          "span",
          {
            style: {
              position: "absolute",
              left: "50%",
              transform:
                direction === "up"
                  ? "translate(-50%, -130%)"
                  : "translate(-50%, 130%)",
              padding: "2px 8px",
              borderRadius: "9999px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              backgroundColor: "rgba(37, 99, 235, 0.85)",
              color: "#fff",
              pointerEvents: "none",
              boxShadow: "0 2px 6px rgba(37, 99, 235, 0.35)",
            },
          },
          label
        )
      : null;

  return h(
    Teleport,
    { to: hostEl },
    h(
      "div",
      {
        ref: dropRef,
        style,
      },
      labelNode ? [labelNode] : null
    )
  );
};

const renderChildDropZone = (
  view,
  isHovered,
  allow = true,
  dropContext,
  ctx
) => {
  if (!allow || !dropContext) {
    return null;
  }
  const hostEl = ctx?.canvasRoot?.value;
  if (!hostEl) {
    return null;
  }
  const metrics = resolveNodeMetrics(view, ctx);
  if (!metrics || metrics.width < 16) {
    return null;
  }
  const dropChildState = dropContext.dropChildState;
  if (!dropChildState) {
    return null;
  }
  let opacity = 0;
  if (dropChildState.isOver.value) {
    opacity = 0.9;
  } else if (dropChildState.canDrop.value) {
    opacity = 0.55;
  } else if (isHovered) {
    opacity = 0.35;
  }

  const horizontalInset = Math.min(12, metrics.width / 6);
  const width = Math.max(metrics.width - horizontalInset * 2, 16);
  const style = {
    position: "absolute",
    left: `${metrics.left + horizontalInset}px`,
    top: `${metrics.top + metrics.height / 2 - 14}px`,
    width: `${width}px`,
    height: "28px",
    borderRadius: "12px",
    border: "1px dashed rgba(59, 130, 246, 0.6)",
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    pointerEvents: "none",
    transition: "opacity 150ms ease-out, transform 150ms ease-out",
    opacity,
    zIndex: 999,
  };

  if (dropChildState.isOver.value || dropChildState.canDrop.value) {
    style.pointerEvents = "auto";
    style.cursor = "pointer";
  }

  return h(
    Teleport,
    { to: hostEl },
    h("div", { ref: dropContext.dropChildRef, style })
  );
};

const renderHoverOutline = (view, ctx, isActive) => {
  if (!isActive) {
    return null;
  }
  const hostEl = ctx?.canvasRoot?.value;
  if (!hostEl) {
    return null;
  }
  const metrics = resolveNodeMetrics(view, ctx);
  if (!metrics || metrics.width <= 0 || metrics.height <= 0) {
    return null;
  }
  const inset = 3;
  const style = {
    position: "absolute",
    top: `${metrics.top - inset}px`,
    left: `${metrics.left - inset}px`,
    width: `${metrics.width + inset * 2}px`,
    height: `${metrics.height + inset * 2}px`,
    border: "2px dashed #0166de",
    borderRadius: "4px",
    pointerEvents: "none",
    boxSizing: "border-box",
    transition: "opacity 120ms ease-out",
    opacity: 1,
    zIndex: 950,
  };
  return h(Teleport, { to: hostEl }, h("div", { style }));
};

function canAcceptChildren(view) {
  const templateNode = view?.template;
  if (!templateNode) {
    return false;
  }
  if (templateNode instanceof t.SlottableTemplate) {
    return true;
  }
  if (templateNode instanceof t.ComponentTemplate) {
    return true;
  }
  if (templateNode instanceof t.TagTemplate) {
    const tag = templateNode.tag ?? "";
    return !["text", "img", "input", "br", "meta"].includes(tag);
  }
  return false;
}

function computeOverlayAnchor(view) {
  if (typeof window === "undefined" || !view?.id) {
    return "top";
  }
  const key = view.template?.id ?? view.id;
  const el = elementRegistry.get(key) || document.getElementById(view.id);
  if (!el) {
    return "top";
  }
  const rect = el.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 0;
  const isAboveViewport = rect.bottom <= 0;
  const isPartiallyAbove = rect.top < 0 && rect.bottom > 0;
  const spaceAbove = rect.top;
  const spaceBelow = viewportHeight - rect.bottom;
  const required = 160;
  if (isAboveViewport || isPartiallyAbove) {
    return "bottom";
  }
  if (spaceBelow < required && spaceAbove > spaceBelow) {
    return "top";
  }
  return "bottom";
}

function buildInteractiveStyle(baseStyle) {
  return baseStyle ? { ...baseStyle } : undefined;
}

function mapElementProps(props = {}) {
  const { className, style, ...rest } = props;
  const next = { ...rest };
  if (style) {
    next.style = style;
  }
  if (className) {
    next.class = className;
  }
  return next;
}

const renderDropdown = (view, isClicked, isCenter, isElement, title, ctx) => {
  const overlayId = view.template?.id ?? view.id;
  const isActive =
    isClicked || overlayHoverTemplate.value === overlayId || false;
  if (!isActive) {
    return null;
  }
  const anchor = computeOverlayAnchor(view);
  const hostEl = ctx?.canvasRoot?.value;
  if (!hostEl) {
    return null;
  }
  const metrics = ctx?.getElementMetrics?.(view.template?.id);
  if (!metrics) {
    return null;
  }
  const verticalOffset = anchor === "bottom" ? 8 : 4;
  const hostWidth = hostEl.clientWidth || metrics.width;
  const hostHeight = hostEl.clientHeight || metrics.height;
  const desiredWidth = Math.max(Math.min(metrics.width, hostWidth - 24), 160);
  const centerX = metrics.left + metrics.width / 2;
  const clampedCenter = Math.min(
    Math.max(centerX, desiredWidth / 2),
    hostWidth - desiredWidth / 2
  );
  const style = {
    position: "absolute",
    left: `${clampedCenter}px`,
    width: `${desiredWidth}px`,
    transform: "translateX(-50%)",
    pointerEvents: "auto",
    zIndex: 1100,
  };
  if (anchor === "bottom") {
    const maxTop = Math.max(hostHeight - 64, 0);
    style.top = `${Math.min(
      metrics.top + metrics.height + verticalOffset,
      maxTop
    )}px`;
  } else {
    style.top = `${Math.max(metrics.top - verticalOffset, 0)}px`;
    style.transform = "translate(-50%, -100%)";
  }

  return h(
    Teleport,
    { to: hostEl },
    h(
      "div",
      {
        style,
        onPointerenter: () => {
          cancelHoverClear(overlayId);
          overlayHoverTemplate.value = overlayId;
          hoveredTemplate.value = overlayId;
        },
        onPointerleave: () => {
          overlayHoverTemplate.value = null;
          scheduleHoverClear(overlayId);
        },
        onMouseenter: () => {
          cancelHoverClear(overlayId);
          overlayHoverTemplate.value = overlayId;
          hoveredTemplate.value = overlayId;
        },
        onMouseleave: () => {
          overlayHoverTemplate.value = null;
          scheduleHoverClear(overlayId);
        },
      },
      h(
        DropdownRenderView,
        {
          onSelect: (data) => {
            switch (data) {
              case "move-up":
                moveTemplateByOffset(view.template, -1);
                break;
              case "move-down":
                moveTemplateByOffset(view.template, 1);
                break;
              case "send-top":
                moveTemplateToEdge(view.template, "start");
                break;
              case "send-bottom":
                moveTemplateToEdge(view.template, "end");
                break;
              case "duplicate":
                duplicateTemplateNode(view.template);
                break;
              case "insert-above":
                setOption("before");
                break;
              case "insert-below":
                setOption("after");
                break;
              case "insert-child":
                setOption("child");
                break;
              default:
                setOption(data);
            }
          },
          onDelete: () => {
            removeComponent(view);
          },
          isTag: false,
          isCenter: isCenter,
          isElement: isElement,
          title: title,
          anchor,
          items: [
            {
              title: "Add Before",
              value: "before",
            },
            {
              title: "Add After",
              value: "after",
            },
            {
              title: "Add child",
              value: "child",
            },
          ],
        },
        () => [
          h("span", [
            h("div", { content: "Add new template" }, [
              h("button", [h("div")]),
            ]),
          ]),
        ]
      )
    )
  );
};

const dummyItem = ref({
  id: "X281pgnsexAVxvsrHMof7",
  meta: {},
  name: "SimpleCard",
  props: [],
  state: [],
  template: {
    children: [
      {
        children: [
          {
            children: [
              {
                children: [],
                classList: null,
                each: null,
                id: "ArDnuqn7Kv222ufX0ZrE2",
                if: null,
                meta: {},
                props: {
                  value: {
                    id: "rgMzY475nKdjKbRoC0ci4",
                    meta: {},
                    type: "Literal",
                    value: "SimpleCard",
                  },
                },
                tag: "text",
                type: "TagTemplate",
              },
            ],
            classList: null,
            each: null,
            id: "ULyuA4xp90WQBI2v57da4",
            if: null,
            meta: {},
            props: {
              className: {
                id: "r1jZfpa3ypd4ucBfrQ4S8",
                meta: {},
                type: "Literal",
                value:
                  "text-xs bg-red-400 py-2 px-2 text-white mb-4 rounded-md flex ",
              },
            },
            tag: "div",
            type: "TagTemplate",
          },
          {
            children: [
              {
                children: [],
                classList: null,
                each: null,
                id: "CSixqqbiN7PCtmHLA2FJd",
                if: null,
                meta: {},
                props: {
                  value: {
                    id: "I7m0GyrGQ6JUjQ0PIUUUI",
                    meta: {},
                    type: "Literal",
                    value: "SimpleCard",
                  },
                },
                tag: "text",
                type: "TagTemplate",
              },
            ],
            classList: null,
            each: null,
            id: "oIPB3tmXYv127fZXXIahm",
            if: null,
            meta: {},
            props: {
              className: {
                id: "TmAuyx599IyDl36EBj8QQ",
                meta: {},
                type: "Literal",
                value: "text-xs",
              },
            },
            tag: "div",
            type: "TagTemplate",
          },
        ],
        classList: null,
        each: null,
        id: "LAkrMbebOyRjxnv72KVHg",
        if: null,
        meta: {},
        props: {
          className: {
            id: "35mdeStG13x5evJLsViW1",
            meta: {},
            type: "Literal",
            value:
              "px-4 py-4 max-auto border-2 relative rounded-md w-full border-black",
          },
        },
        tag: "div",
        type: "TagTemplate",
      },
    ],
    classList: null,
    each: null,
    id: "XebYlGHDK60Og5IMxto7f",
    if: null,
    meta: {},
    props: {
      className: {
        id: "7V6c64QtMkX1R27J1YfUv",
        meta: {},
        type: "Literal",
        value: "relative bg-white px-4 py-4",
      },
    },
    tag: "div",
    type: "TagTemplate",
  },
  type: "RekaComponent",
});

// Define the RenderView component
const RenderTagView = (view, dropContext, ctx) => {
  const { tag, props, children = [] } = view;
  const nodeMeta = {
    tag,
    componentName: view.owner?.component?.name ?? null,
  };
  const registerRef =
    ctx?.registerElement?.(view.id, view.template?.id, nodeMeta) ?? null;

  // const [drag] = useDrag(() => ({
  //   type: "Box",
  //   item: () => dummyItem.value,
  //   end: (item, monitor) => {
  //     const dropResult = monitor.getDropResult();
  //     if (item && dropResult) {
  //       console.log(`You dropped ${item.name} into ${dropResult.name}!`);
  //     }
  //   },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //     handlerId: monitor.getHandlerId(),
  //   }),
  // }));

  // const cursorPositionY = ref("bottom");
  // const [collect, drop] = useDrop(() => ({
  //   accept: "Box",
  //   drop(item, monitor) {
  //     // const didDrop = monitor.didDrop();
  //     // if (didDrop) {
  //     //   return { name: view.value.id };
  //     // } else {
  //     //   const itemTemplate = t.Schema.fromJSON(item).template;
  //     //   if (itemTemplate instanceof t.Template) {
  //     //     reka.value.change(() => {
  //     //       if ("option.value" === "child") {
  //     //         if (!(view.value.template instanceof t.SlottableTemplate)) {
  //     //           return;
  //     //         }

  //     //         view.value.template.children.push(itemTemplate);
  //     //         return;
  //     //       }

  //     //       const parent = reka.value.getParentNode(view.value.template);

  //     //       if (!parent) {
  //     //         return;
  //     //       }

  //     //       if (!(parent.node instanceof t.SlottableTemplate)) {
  //     //         return;
  //     //       }

  //     //       const indexInParent = parent.node.children.indexOf(
  //     //         view.value.template
  //     //       );

  //     //       if (indexInParent === -1) {
  //     //         return;
  //     //       }

  //     //       if (cursorPositionY.value === "bottom") {
  //     //         parent.node.children.splice(indexInParent + 1, 0, itemTemplate);
  //     //         return;
  //     //       }

  //     //       parent.node.children.splice(indexInParent, 0, itemTemplate);
  //     //     });
  //     //   }
  //     //   return { name: view.value.id };
  //     // }
  //   },
  //   collect: (monitor) => ({
  //     // isOver: monitor.isOver(),
  //     // canDrop: monitor.canDrop(),
  //     // isOverCurrent: monitor.isOver({ shallow: true }),
  //     // offset: monitor.getClientOffset(),
  //   }),
  // }));
  // const { canDrop, isOver, offset } = toRefs(collect);
  // const dropTarget = ref(null);
  // const option = ref(null);

  const isHovered =
    hoveredTemplate.value === view.template?.id ||
    (!isOnComponent.value ? false : templateId.value === view.template?.id);
  if (isHovered && view.owner?.component?.id) {
    hoveredComponent.value = view.owner?.component?.id;
  }
  const isCenter = ref(true);
  const allowChild = canAcceptChildren(view);
  switch (tag) {
    case "text": {
      // const [dropCollect, drop] = useDrop(() => ({
      //   accept: 'Box',
      //   drop: () => ({ name: 'Dustbin' }),
      //   collect: monitor => ({
      //     isOver: monitor.isOver(),
      //     canDrop: monitor.canDrop(),
      //   }),
      // }));

      // const canDrop = computed(() => unref(dropCollect).canDrop);
      // const isOver = computed(() => unref(dropCollect).isOver);
      // const isActive = computed(() => unref(canDrop) && unref(isOver));
      // const backgroundColor = computed(() =>
      //   unref(isActive) ? 'darkgreen' : unref(canDrop) ? 'darkkhaki' : '#222'
      // );

      const isSelected = computed(
        () => templateId.value === view.template?.id
      );
      const templateKey = view.template?.id ?? view.id;
      const overlay = renderDropdown(
        view,
        isHovered || isSelected.value,
        isCenter.value,
        false,
        null,
        ctx
      );
      const hoverOutline = renderHoverOutline(view, ctx, isHovered);
      const markers = [
        hoverOutline,
        renderDropZone(view, "up", isHovered, true, dropContext, ctx),
        renderChildDropZone(view, isHovered, allowChild, dropContext, ctx),
        renderDropZone(view, "down", isHovered, true, dropContext, ctx),
        overlay,
      ].filter(Boolean);
      const elementProps = mapElementProps(props);
      const baseNode = h(
        "span",
        {
          ...elementProps,
          ref: registerRef,
          draggable: true,
          contenteditable: isHovered,
          id: view.id,
          onBlur: (e) => handleInput(e, view),
          onInput: null,
          onMouseover: withModifiers(() => {
            cancelHoverClear(templateKey);
            hoveredTemplate.value = view.template?.id;
          }, ["self"]),
          onMouseleave: withModifiers(() => {
            scheduleHoverClear(templateKey);
          }, ["self"]),
          onClick: withModifiers(() => {
            templateId.value = view.template?.id;
          }, ["self"]),
          style: buildInteractiveStyle(elementProps.style),
        },
        [props.value]
      );
      return markers.length ? h(Fragment, [baseNode, ...markers]) : baseNode;
    }
    case "img": {
      const elementProps = mapElementProps(props);
      const templateKey = view.template?.id ?? view.id;
      const imgNode = h("img", {
        ...elementProps,
        ref: registerRef,
        id: view.id,
        onMouseover: withModifiers(() => {
          cancelHoverClear(templateKey);
          hoveredTemplate.value = view.template?.id;
        }, ["self"]),
        onMouseleave: withModifiers(() => {
          scheduleHoverClear(templateKey);
        }, ["self"]),
        onClick: withModifiers(() => {
          templateId.value = view.template?.id;
        }, ["self"]),
        style: buildInteractiveStyle(elementProps.style),
      });
      const overlay = renderDropdown(
        view,
        isHovered,
        isCenter.value,
        false,
        null,
        ctx
      );
      const hoverOutline = renderHoverOutline(view, ctx, isHovered);
      const markers = [
        hoverOutline,
        renderDropZone(view, "up", isHovered, true, dropContext, ctx),
        renderChildDropZone(view, isHovered, allowChild, dropContext, ctx),
        renderDropZone(view, "down", isHovered, true, dropContext, ctx),
        overlay,
      ].filter(Boolean);
      return markers.length ? h(Fragment, [imgNode, ...markers]) : imgNode;
    }
    case "svg": {
      const elementProps = mapElementProps(props);
      const templateKey = view.template?.id ?? view.id;
      const svgNode = h(
        "svg",
        {
          ...elementProps,
          ref: registerRef,
          id: view.id,
          onMouseover: withModifiers(() => {
            cancelHoverClear(templateKey);
            hoveredTemplate.value = view.template?.id;
          }, ["self"]),
          onMouseleave: withModifiers(() => {
            scheduleHoverClear(templateKey);
          }, ["self"]),
          onClick: withModifiers(() => {
            templateId.value = view.template?.id;
          }, ["self"]),
          style: buildInteractiveStyle(elementProps.style),
        },
        view.children.length > 0
          ? view.children.map((child) =>
              h(RenderView, {
                key: child.id,
                view: child,
              })
            )
          : null
      );
      const overlay = renderDropdown(
        view,
        isHovered,
        isCenter.value,
        false,
        null,
        ctx
      );
      const hoverOutline = renderHoverOutline(view, ctx, isHovered);
      const markers = [
        hoverOutline,
        renderDropZone(view, "up", isHovered, true, dropContext, ctx),
        renderChildDropZone(view, isHovered, allowChild, dropContext, ctx),
        renderDropZone(view, "down", isHovered, true, dropContext, ctx),
        overlay,
      ].filter(Boolean);
      return markers.length ? h(Fragment, [svgNode, ...markers]) : svgNode;
    }
    case "iframe": {
      const elementProps = mapElementProps(props);
      const templateKey = view.template?.id ?? view.id;
      const frameNode = h(
        "iframe",
        {
          ...elementProps,
          ref: registerRef,
          id: view.id,
          onMouseover: withModifiers(() => {
            cancelHoverClear(templateKey);
            hoveredTemplate.value = view.template?.id;
          }, ["self"]),
          onMouseleave: withModifiers(() => {
            scheduleHoverClear(templateKey);
          }, ["self"]),
          onClick: withModifiers(() => {
            templateId.value = view.template?.id;
          }, ["self"]),
          style: buildInteractiveStyle(elementProps.style),
        },
        []
      );
      const overlay = renderDropdown(
        view,
        isHovered,
        isCenter.value,
        false,
        null,
        ctx
      );
      const hoverOutline = renderHoverOutline(view, ctx, isHovered);
      const markers = [
        hoverOutline,
        renderDropZone(view, "up", isHovered, true, dropContext, ctx),
        renderChildDropZone(view, isHovered, allowChild, dropContext, ctx),
        renderDropZone(view, "down", isHovered, true, dropContext, ctx),
        overlay,
      ].filter(Boolean);
      return markers.length ? h(Fragment, [frameNode, ...markers]) : frameNode;
    }
    case "a": {
      const childNodes =
        view.children.length > 0
          ? view.children.map((child) =>
              h(RenderView, {
                key: child.id,
                view: child,
              })
            )
          : [];

      const overlay = renderDropdown(
        view,
        isHovered,
        isCenter.value,
        false,
        null,
        ctx
      );
      const hoverOutline = renderHoverOutline(view, ctx, isHovered);
      const markers = [
        hoverOutline,
        renderDropZone(view, "up", isHovered, true, dropContext, ctx),
        renderChildDropZone(view, isHovered, allowChild, dropContext, ctx),
        renderDropZone(view, "down", isHovered, true, dropContext, ctx),
        overlay,
      ].filter(Boolean);
      const elementProps = mapElementProps(props);
      const templateKey = view.template?.id ?? view.id;
      const baseNode = h(
        tag,
        {
          ...elementProps,
          ref: registerRef,
          href: "#",
          id: view.id,
          onMouseover: withModifiers(() => {
            cancelHoverClear(templateKey);
            hoveredTemplate.value = view.template?.id;
          }, ["self"]),
          onMouseleave: withModifiers(() => {
            scheduleHoverClear(templateKey);
          }, ["self"]),
          onClick: withModifiers(() => {
            templateId.value = view.template?.id;
          }, ["self"]),
          style: buildInteractiveStyle(elementProps.style),
        },
        childNodes
      );
      return markers.length ? h(Fragment, [baseNode, ...markers]) : baseNode;
    }
    default: {
      const childNodes =
        view.children.length > 0
          ? view.children.map((child) =>
              h(RenderView, {
                key: child.id,
                view: child,
              })
            )
          : [];

      const overlay = renderDropdown(
        view,
        isHovered,
        isCenter.value,
        false,
        null,
        ctx
      );
      const hoverOutline = renderHoverOutline(view, ctx, isHovered);
      const markers = [
        hoverOutline,
        renderDropZone(view, "up", isHovered, true, dropContext, ctx),
        renderChildDropZone(view, isHovered, allowChild, dropContext, ctx),
        renderDropZone(view, "down", isHovered, true, dropContext, ctx),
        overlay,
      ].filter(Boolean);
      const elementProps = mapElementProps(props);
      const templateKey = view.template?.id ?? view.id;
      const baseNode = h(
        tag,
        {
          ...elementProps,
          ref: registerRef,
          id: view.id,
          onMouseover: withModifiers(() => {
            cancelHoverClear(templateKey);
            hoveredTemplate.value = view.template?.id;
          }, ["self"]),
          onMouseleave: withModifiers(() => {
            scheduleHoverClear(templateKey);
          }, ["self"]),
          onClick: withModifiers(() => {
            templateId.value = view.template?.id;
          }, ["self"]),
          style: buildInteractiveStyle(elementProps.style),
        },
        childNodes
      );
      return markers.length ? h(Fragment, [baseNode, ...markers]) : baseNode;
    }
  }
};

const RekaComponentView = (currentView, ctx) => {
  return currentView.render.map((r) => {
    const parent = reka.value.getParentNode(r.template);
    const isComponentHovered = hoveredComponent.value == r.owner?.component?.id;
    return [
      h(
        "div",
        {
          style: {
            position: "relative",
            zIndex: isComponentHovered ? 40 : undefined,
          },
        },
        [
          h(DndDrop, {
            id: parent?.id,
            position: "down",
            style: {
              display: isComponentHovered ? "block" : "none",
              zIndex: isComponentHovered ? 40 : undefined,
            },
          }),
          h(RenderView, {
            key: r.id,
            view: r,
          }),
          h(
            "span",
            {
              class: [
                "border border border-blue-500 absolute top-0 left-1/2 transform -translate-x-1/2 w-full ",
                isComponentHovered ? "block z-40" : "hidden",
              ],
            },
            renderDropdown(
              currentView,
              isComponentHovered,
              true,
              true,
              r.owner?.component?.name,
              ctx
            )
          ),
        ]
      ),
    ];
  });
};

const ExternalComponentView = (currentView) => {
  return currentView.component.render(currentView.props);
};

const ErrorSystemView = (currentView, ctx) => {
  return [
    h("div", {}, "Something went wrong.", h("br"), currentView.error),
    h(
      "span",
      {
        class: [
          "border border border-blue-500 absolute top-0 left-1/2 transform -translate-x-1/2 w-full ",
          true ? "block z-40" : "hidden",
        ],
      },
      renderDropdown(currentView, true, true, true, currentView.error, ctx)
    ),
  ];
};

const FragmentView = (currentView, ctx) => {
  return currentView.children.map((child) =>
    h(RenderView, { view: child, key: child.id })
  );
};
const RenderView = defineComponent({
  props: {
    view: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const registerElementFn = inject("registerElement");
    const getElementMetricsFn = inject("getElementMetrics");
    const canvasRootRef = inject("canvasRoot");
    const elementRegistryRef = inject("elementRegistry");
    const renderComponent = computed(() => {
      const dropContext =
        props.view instanceof t.TagView ? createDropContext(props.view) : null;
  const ctx = {
        registerElement: registerElementFn,
        getElementMetrics: getElementMetricsFn,
        canvasRoot: canvasRootRef,
        elementRegistry: elementRegistryRef,
        setHovered: (id) => {
          hoveredTemplate.value = id;
        },
      };
      if (props.view instanceof t.TagView) {
        return () => RenderTagView(props.view, dropContext, ctx);
      } else if (props.view instanceof t.RekaComponentView) {
        return () => RekaComponentView(props.view, ctx);
      } else if (props.view instanceof t.ExternalComponentView) {
        return () => ExternalComponentView(props.view);
      } else if (
        props.view instanceof t.FrameView ||
        props.view instanceof t.SlotView ||
        props.view instanceof t.FragmentView
      ) {
        return () => FragmentView(props.view, ctx);
      } else if (props.view instanceof t.ErrorSystemView) {
        return () => ErrorSystemView(props.view, ctx);
      }
      return () => h("div", {}, `Rendering:`);
    });

    return renderComponent.value;
  },
});
const version = ref(1);
const throttledVersion = debounce(() => {
  version.value += 1;
}, 100);
const viewportSync = throttle(() => {
  scheduleGeometryUpdate();
  if (!hoveredTemplate.value && !templateId.value) {
    return;
  }
  throttledVersion();
}, 100);
onMounted(() => {
  window.addEventListener("scroll", viewportSync, { passive: true });
  window.addEventListener("touchmove", viewportSync, { passive: true });
  window.addEventListener("resize", viewportSync, { passive: true });
  reka.value.listenToChangeset((a) => {
    if (hoveredTemplate.value == null) {
      throttledVersion();
    }
    scheduleGeometryUpdate();
  });
  nextTick(() => {
    refreshAllGeometry();
  });
});
onUnmounted(() => {
  window.removeEventListener("scroll", viewportSync);
  window.removeEventListener("touchmove", viewportSync);
  window.removeEventListener("resize", viewportSync);
  window.removeEventListener("pointermove", handleRotateMove);
  window.removeEventListener("pointerup", handleRotateEnd);
  hoverCleanupTimers.forEach((timer) => clearTimeout(timer));
  hoverCleanupTimers.clear();
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
watch(
  () => version.value,
  () => {
    nextTick(() => {
      refreshAllGeometry();
    });
  }
);
watch(
  () => hoveredTemplate.value,
  (templateKey) => {
    if (templateKey) {
      pendingGeometry.add(templateKey);
      scheduleGeometryUpdate();
    }
    interactionState.guides = [];
  },
  { flush: "post" }
);
watch(
  () => templateId.value,
  (templateKey) => {
    if (templateKey) {
      pendingGeometry.add(templateKey);
      scheduleGeometryUpdate();
    }
    interactionState.guides = [];
  },
  { flush: "post" }
);
</script>

<style></style>
