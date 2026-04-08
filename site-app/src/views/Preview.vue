<template>
  <RenderView
    :key="version"
    :view="frame.view"
    :render-context="{
      viewportWidth: viewportMetrics.width,
      viewportHeight: viewportMetrics.height,
      hostWidth: viewportMetrics.width,
      responsiveScale: 1,
      isRoot: true,
    }"
  />
</template>

<script setup>
import { debounce } from "lodash";
import * as t from "@rekajs/types";
import {
  ref,
  inject,
  computed,
  defineComponent,
  h,
  onMounted,
  onUnmounted,
} from "vue";
import { useRouter } from "vue-router";

const reka = inject("reka");
const router = useRouter();

const DESIGN_VIEWPORT_WIDTH = 1280;
const MOBILE_BREAKPOINT = 767;
const TEXT_LIKE_TAGS = new Set([
  "p",
  "span",
  "a",
  "label",
  "strong",
  "em",
  "small",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);
const CONTAINER_LIKE_TAGS = new Set([
  "div",
  "section",
  "article",
  "aside",
  "nav",
  "main",
  "header",
  "footer",
  "form",
]);
const SCALEABLE_STYLE_KEYS = new Set([
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "gap",
  "rowGap",
  "columnGap",
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius",
  "top",
  "right",
  "bottom",
  "left",
]);
const HORIZONTAL_CENTER_SNAP_THRESHOLD = 24;
const FULL_WIDTH_CANVAS_THRESHOLD = 24;
const DESKTOP_CANVAS_WIDTH = 1280;
const STUDIO_CLICK_ACTION_PROP = "studioClickAction";
const STUDIO_CLICK_PAGE_SLUG_PROP = "studioClickPageSlug";
const STUDIO_CLICK_URL_PROP = "studioClickUrl";

const frame = computed(() => {
  return reka.value.frames[0];
});

const viewportMetrics = ref({
  width: typeof window !== "undefined" ? window.innerWidth : DESIGN_VIEWPORT_WIDTH,
  height: typeof window !== "undefined" ? window.innerHeight : 900,
});

function parsePx(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/i);

  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[1] ?? "");
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveRelativePx(value, relativeSize) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const pxMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)px$/i);

  if (pxMatch) {
    const parsed = Number.parseFloat(pxMatch[1] ?? "");
    return Number.isFinite(parsed) ? parsed : null;
  }

  const percentMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)%$/i);

  if (percentMatch && Number.isFinite(relativeSize) && relativeSize > 0) {
    const parsed = Number.parseFloat(percentMatch[1] ?? "");
    return Number.isFinite(parsed) ? (parsed / 100) * relativeSize : null;
  }

  const centeredCalcMatch = trimmed.match(
    /^calc\(\s*50%\s*-\s*(-?\d+(?:\.\d+)?)px\s*\)$/i
  );

  if (centeredCalcMatch && Number.isFinite(relativeSize) && relativeSize > 0) {
    const parsed = Number.parseFloat(centeredCalcMatch[1] ?? "");
    return Number.isFinite(parsed) ? relativeSize / 2 - parsed : null;
  }

  return null;
}

function parsePercent(value) {
  if (typeof value !== "string") {
    return null;
  }

  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)%$/i);

  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[1] ?? "");
  return Number.isFinite(parsed) ? parsed : null;
}

function hasStudioFreeBlockClass(value) {
  return typeof value === "string" && value.split(/\s+/).includes("studio-free-block");
}

function normalizeProps(raw) {
  const props = {};

  if (!raw) {
    return props;
  }

  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (key === "class" || key === "className") {
      props.class = String(value);
      continue;
    }

    if (key === "htmlFor") {
      props.for = String(value);
      continue;
    }

    if (key === "style" && value && typeof value === "object" && !Array.isArray(value)) {
      props.style = { ...value };
      continue;
    }

    props[key] = value;
  }

  return props;
}

function normalizePageSlug(value) {
  const normalized = String(value ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "");

  return normalized || null;
}

function buildPagePath(slug) {
  const normalizedSlug = normalizePageSlug(slug);
  return normalizedSlug ? `/${normalizedSlug}/` : "/";
}

function readClickActionConfig(raw) {
  const type = String(raw?.[STUDIO_CLICK_ACTION_PROP] ?? "")
    .trim()
    .toLowerCase();

  return {
    type: type === "page" || type === "link" ? type : "none",
    pageSlug: normalizePageSlug(raw?.[STUDIO_CLICK_PAGE_SLUG_PROP]),
    url: String(raw?.[STUDIO_CLICK_URL_PROP] ?? "").trim() || null,
  };
}

function omitClickActionProps(raw) {
  const next = { ...(raw ?? {}) };

  delete next[STUDIO_CLICK_ACTION_PROP];
  delete next[STUDIO_CLICK_PAGE_SLUG_PROP];
  delete next[STUDIO_CLICK_URL_PROP];

  return next;
}

function scalePxValue(value, scale) {
  if (scale >= 0.999) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value * scale * 1000) / 1000;
  }

  if (typeof value !== "string") {
    return value;
  }

  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/i);

  if (!match) {
    return value;
  }

  const parsed = Number.parseFloat(match[1] ?? "");

  if (!Number.isFinite(parsed)) {
    return value;
  }

  return `${Math.round(parsed * scale * 1000) / 1000}px`;
}

function scaleResponsiveChildStyle(style, scale) {
  if (scale >= 0.999) {
    return style;
  }

  return Object.fromEntries(
    Object.entries(style).map(([key, value]) => [
      key,
      SCALEABLE_STYLE_KEYS.has(key) ? scalePxValue(value, scale) : value,
    ])
  );
}

function normalizeDesktopFreeBlockStyle(style, hostWidth, mobileKind) {
  const widthPx = resolveRelativePx(style.width, hostWidth);
  const leftPx = resolveRelativePx(style.left, hostWidth);

  if (
    typeof widthPx !== "number" ||
    !Number.isFinite(widthPx) ||
    typeof leftPx !== "number" ||
    !Number.isFinite(leftPx) ||
    !Number.isFinite(hostWidth) ||
    hostWidth <= 0
  ) {
    return style;
  }

  const centerDelta = Math.abs(leftPx + widthPx / 2 - hostWidth / 2);
  const rightGap = hostWidth - (leftPx + widthPx);
  const shouldFillViewport =
    (Math.abs(leftPx) <= HORIZONTAL_CENTER_SNAP_THRESHOLD &&
      Math.abs(rightGap) <= HORIZONTAL_CENTER_SNAP_THRESHOLD) ||
    (mobileKind === "container" &&
      centerDelta <= HORIZONTAL_CENTER_SNAP_THRESHOLD &&
      Math.abs(widthPx - DESKTOP_CANVAS_WIDTH) <= FULL_WIDTH_CANVAS_THRESHOLD);

  if (shouldFillViewport) {
    return {
      ...style,
      left: "0px",
      width: "100%",
      right: "auto",
    };
  }

  if (centerDelta > HORIZONTAL_CENTER_SNAP_THRESHOLD) {
    return style;
  }

  return {
    ...style,
    left: `calc(50% - ${Math.round(widthPx / 2)}px)`,
    right: "auto",
  };
}

function getStudioFreeBlockMobileKind(view) {
  const primaryChild = (view.children ?? []).find((child) => child instanceof t.TagView);

  if (!primaryChild) {
    return "generic";
  }

  if (primaryChild.tag === "img" || primaryChild.tag === "video") {
    return "media";
  }

  if (primaryChild.tag === "button") {
    return "button";
  }

  if (TEXT_LIKE_TAGS.has(primaryChild.tag)) {
    return "text";
  }

  if (CONTAINER_LIKE_TAGS.has(primaryChild.tag)) {
    return "container";
  }

  return "generic";
}

function getResponsiveFreeBlockStyle(style, viewportWidth, hostWidth, mobileKind) {
  if (viewportWidth > MOBILE_BREAKPOINT) {
    return {
      scale: 1,
      style: normalizeDesktopFreeBlockStyle(style, hostWidth, mobileKind),
    };
  }

  const gutter = viewportWidth <= 520 ? 12 : 16;
  const layoutWidth = Math.max(1, Math.min(viewportWidth, hostWidth || viewportWidth));
  const availableWidth = Math.max(160, layoutWidth - gutter * 2);
  const widthPx = parsePx(style.width);
  const heightPx = parsePx(style.height);
  const hasExplicitWidth = typeof widthPx === "number";
  const derivedWidth = widthPx ?? availableWidth;
  const scale = Math.min(1, availableWidth / Math.max(derivedWidth, 1));
  const mobileWidth = Math.max(140, Math.round(Math.min(availableWidth, derivedWidth)));
  const mobileHeight =
    typeof heightPx === "number" && Number.isFinite(heightPx)
      ? Math.max(48, Math.round(heightPx * scale))
      : null;

  const baseStyle = {
    ...style,
    position: "relative",
    left: "auto",
    top: "auto",
    right: "auto",
    bottom: "auto",
    minWidth: "0px",
    margin: `${gutter}px auto 0`,
    transform: "none",
    boxSizing: "border-box",
    maxWidth: `${availableWidth}px`,
    overflowWrap: style.overflowWrap ?? "break-word",
  };

  if (mobileKind === "media") {
    return {
      scale,
      style: {
        ...baseStyle,
        display: "block",
        width: `${mobileWidth}px`,
        ...(mobileHeight
          ? {
              height: `${mobileHeight}px`,
              minHeight: `${mobileHeight}px`,
            }
          : {
              height: "auto",
              minHeight: "0px",
            }),
      },
    };
  }

  if (!hasExplicitWidth) {
    return {
      scale: 1,
      style: {
        ...baseStyle,
        display: mobileKind === "container" ? "block" : "inline-block",
        width: mobileKind === "container" ? "100%" : "fit-content",
        height: "auto",
        minHeight: "0px",
      },
    };
  }

  return {
    scale,
    style: {
      ...baseStyle,
      display: "block",
      width: `${mobileWidth}px`,
      height: "auto",
      minHeight: "0px",
    },
  };
}

function hasDirectFreeBlockChildren(view) {
  return (view.children ?? []).some((child) => {
    if (!(child instanceof t.TagView)) {
      return false;
    }

    const childProps = normalizeProps(child.props);
    return hasStudioFreeBlockClass(childProps.class);
  });
}

function estimateFreeBlockOffset(value, viewportHeight) {
  const pxValue = parsePx(value);

  if (typeof pxValue === "number") {
    return pxValue;
  }

  const percentValue = parsePercent(value);

  if (typeof percentValue === "number") {
    return (viewportHeight * percentValue) / 100;
  }

  return 0;
}

function estimateFreeBlockSize(style, viewportHeight) {
  const heightPx = parsePx(style.height) ?? parsePx(style.minHeight);

  if (typeof heightPx === "number") {
    return heightPx;
  }

  const heightPercent = parsePercent(style.height) ?? parsePercent(style.minHeight);

  if (typeof heightPercent === "number") {
    return (viewportHeight * heightPercent) / 100;
  }

  return 0;
}

function computeDesktopCanvasHeight(children, viewportHeight) {
  let maxBottom = viewportHeight;

  children.forEach((child) => {
    if (!(child instanceof t.TagView)) {
      return;
    }

    const props = normalizeProps(child.props);
    const style = props.style ?? {};
    const top = estimateFreeBlockOffset(style.top, viewportHeight);
    const height = estimateFreeBlockSize(style, viewportHeight);
    maxBottom = Math.max(maxBottom, top + height + 24);
  });

  return Math.max(viewportHeight, Math.ceil(maxBottom));
}

const renderChildren = (children = [], renderContext = {}) =>
  children.map((child) =>
    h(RenderView, {
      view: child,
      renderContext,
      key: child.id ?? child.key,
    })
  );

const RenderView = defineComponent({
  props: {
    view: {
      type: Object,
      required: true,
    },
    renderContext: {
      type: Object,
      default: () => ({
        viewportWidth: DESIGN_VIEWPORT_WIDTH,
        viewportHeight: 900,
        hostWidth: DESIGN_VIEWPORT_WIDTH,
        responsiveScale: 1,
        isRoot: false,
      }),
    },
  },
  setup(props) {
    return () => {
      const currentView = props.view;
      const context = {
        viewportWidth: DESIGN_VIEWPORT_WIDTH,
        viewportHeight: 900,
        hostWidth: DESIGN_VIEWPORT_WIDTH,
        responsiveScale: 1,
        isRoot: false,
        ...(props.renderContext ?? {}),
      };

      if (currentView instanceof t.TagView) {
        if (currentView.tag === "text") {
          const value = currentView.props?.value;
          return value == null ? "" : String(value);
        }

        const normalizedProps = normalizeProps(currentView.props);
        const clickActionConfig = readClickActionConfig(currentView.props);
        const normalizedElementProps = omitClickActionProps(normalizedProps);
        const isStudioFreeBlock = hasStudioFreeBlockClass(normalizedProps.class);
        const hasRootFreeBlocks = context.isRoot && hasDirectFreeBlockChildren(currentView);
        let style = normalizedProps.style ?? {};
        let childContext = {
          ...context,
          isRoot: false,
        };
        const handleElementClick = (event) => {
          normalizedElementProps.onClick?.(event);

          if (clickActionConfig.type === "page") {
            event?.preventDefault?.();
            router.push(buildPagePath(clickActionConfig.pageSlug));
            return;
          }

          if (clickActionConfig.type === "link" && clickActionConfig.url) {
            event?.preventDefault?.();
            window.location.assign(clickActionConfig.url);
          }
        };

        const shouldUseDesktopCanvas =
          hasRootFreeBlocks &&
          Math.max(
            1,
            Math.min(context.viewportWidth, context.hostWidth || context.viewportWidth)
          ) > MOBILE_BREAKPOINT;

        if (shouldUseDesktopCanvas) {
          const freeBlockChildren = [];
          const regularChildren = [];

          (currentView.children ?? []).forEach((child) => {
            if (child instanceof t.TagView) {
              const childProps = normalizeProps(child.props);

              if (hasStudioFreeBlockClass(childProps.class)) {
                freeBlockChildren.push(child);
                return;
              }
            }

            regularChildren.push(child);
          });

          const canvasViewportWidth = Math.max(
            1,
            Math.min(context.viewportWidth, context.hostWidth || context.viewportWidth)
          );
          const canvasScale = Math.min(1, canvasViewportWidth / DESIGN_VIEWPORT_WIDTH);
          const canvasHeight = computeDesktopCanvasHeight(
            freeBlockChildren,
            context.viewportHeight
          );

          return h(
            currentView.tag,
            {
              ...normalizedElementProps,
              style,
              onClick: handleElementClick,
            },
            [
              ...renderChildren(regularChildren, {
                ...context,
                isRoot: false,
                hostWidth: context.viewportWidth,
                responsiveScale: 1,
              }),
              h(
                "div",
                {
                  class: "studio-design-canvas-host",
                  style: {
                    position: "relative",
                    width: "100%",
                    height: `${Math.max(1, Math.round(canvasHeight * canvasScale))}px`,
                    overflow: "visible",
                  },
                },
                [
                  h(
                    "div",
                    {
                      class: "studio-design-canvas",
                      style: {
                        position: "absolute",
                        left: "50%",
                        top: "0",
                        width: `${DESIGN_VIEWPORT_WIDTH}px`,
                        minHeight: `${canvasHeight}px`,
                        transform: `translateX(-50%) scale(${canvasScale})`,
                        transformOrigin: "top center",
                        overflow: "visible",
                      },
                    },
                    renderChildren(freeBlockChildren, {
                      ...context,
                      isRoot: false,
                      hostWidth: DESIGN_VIEWPORT_WIDTH,
                      responsiveScale: 1,
                    })
                  ),
                ]
              ),
            ]
          );
        }

        if (isStudioFreeBlock) {
          if (context.viewportWidth <= MOBILE_BREAKPOINT) {
            const responsiveResult = getResponsiveFreeBlockStyle(
              style,
              context.viewportWidth,
              context.hostWidth,
              getStudioFreeBlockMobileKind(currentView)
            );

            style = responsiveResult.style;
            childContext = {
              ...childContext,
              hostWidth: Math.min(context.viewportWidth, context.hostWidth),
              responsiveScale: responsiveResult.scale,
            };
          } else {
            style = {
              ...style,
              boxSizing: "border-box",
              maxWidth: style.maxWidth ?? "100%",
              overflowWrap: style.overflowWrap ?? "break-word",
            };
          }
        } else if (context.responsiveScale < 0.999) {
          style = scaleResponsiveChildStyle(style, context.responsiveScale);
        }

        return h(
          currentView.tag,
          {
            ...normalizedElementProps,
            class: normalizedElementProps.class,
            style,
            onClick: handleElementClick,
          },
          renderChildren(currentView.children ?? [], childContext)
        );
      }

      if (currentView instanceof t.RekaComponentView) {
        return renderChildren(currentView.render ?? [], context);
      }

      if (currentView instanceof t.ExternalComponentView) {
        return currentView.component.render(currentView.props);
      }

      if (
        currentView instanceof t.FrameView ||
        currentView instanceof t.SlotView ||
        currentView instanceof t.FragmentView ||
        currentView instanceof t.EachSystemView
      ) {
        return renderChildren(currentView.children ?? [], context);
      }

      if (currentView instanceof t.ErrorSystemView) {
        return h("div", {}, `Something went wrong. ${String(currentView.error ?? "")}`);
      }

      return h("div", {}, `Unsupported view type: ${currentView?.type ?? "unknown"}`);
    };
  },
});

const version = ref(1);
const throttledVersion = debounce(() => {
  version.value += 1;
}, 100);

const updateViewportMetrics = () => {
  viewportMetrics.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

onMounted(() => {
  updateViewportMetrics();
  window.addEventListener("resize", updateViewportMetrics, { passive: true });
  reka.value.listenToChangeset(() => {
    throttledVersion();
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateViewportMetrics);
});
</script>
