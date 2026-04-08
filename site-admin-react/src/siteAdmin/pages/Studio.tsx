import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Reka } from "@rekajs/core";
import { RekaProvider } from "@rekajs/react";
import * as t from "@rekajs/types";

import { SELF_SITE_UPDATE } from "@/graphql/mutations/siteUpdate";
import {
  SELF_SITE_PAGE_CREATE,
  SELF_SITE_PAGE_DELETE,
  SELF_SITE_PAGE_UPDATE,
} from "@/graphql/mutations/page";
import { SITE_PAGE } from "@/graphql/queries/page";
import { SITE_SCHEMA_DETAILS } from "@/graphql/queries/site";
import { SITE_PAGES } from "@/graphql/queries/tools";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import {
  StudioPageContextProvider,
  type StudioPageItem,
} from "@/siteAdmin/studio/studioPageContext";
import { StudioAIAssistant } from "@/siteAdmin/studio/StudioAIAssistant";
import { StudioAIProvider } from "@/siteAdmin/studio/studioAIContext";

import { EditorContext, EditorContextProvider } from "@app/editor";
import { Editor, type StudioRouter } from "@app/editor/Editor";
import { EditorLayout } from "@app/components/editor-layout";
import { ToolbarApp } from "@app/components/toolbar-app";
import { createSharedStateGlobals } from "@app/constants/shared-state-globals";
import { ensureUserFramesState } from "@app/editor/userFrames";
import { UserAnimation } from "@app/external/UserAnimation";
import { buildStudioPagePath, normalizeStudioPageSlug } from "@app/utils/studioClickAction";
import appCssHref from "@/index.css?url";
import Icon from "@/siteAdmin/editor/Icon";

type StudioLocationState = {
  siteId?: number | null;
  themeId?: number | null;
  pageId?: number | null;
  title?: string | null;
  schema?: unknown;
  entityType?: "site" | "theme";
  promptOnSave?: boolean;
} | null;

type ProgramComponentLike = {
  name?: string | null;
};

type SitePageRecord = {
  id?: number | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  html?: unknown;
  schema?: unknown;
  isActive?: boolean | null;
};

function createFallbackSchema() {
  return t.state({
    extensions: {},
    program: t.program({
      globals: [],
      components: [
        t.rekaComponent({
          name: "App",
          props: [],
          state: [],
          template: t.tagTemplate({
            tag: "div",
            props: {
              className: t.literal({
                value:
                  "min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900"
              })
            },
            children: [
              t.tagTemplate({
                tag: "div",
                props: {
                  className: t.literal({
                    value: "rounded-xl border bg-white px-6 py-5 shadow-sm text-center"
                  })
                },
                children: [
                  t.tagTemplate({
                    tag: "h2",
                    props: {
                      className: t.literal({ value: "text-xl font-semibold" })
                    },
                    children: [
                      t.tagTemplate({
                        tag: "text",
                        props: {
                          value: t.literal({ value: "Studio is ready" })
                        },
                        children: []
                      })
                    ]
                  }),
                  t.tagTemplate({
                    tag: "p",
                    props: {
                      className: t.literal({ value: "mt-2 text-sm text-slate-600" })
                    },
                    children: [
                      t.tagTemplate({
                        tag: "text",
                        props: {
                          value: t.literal({
                            value: "No saved schema was found for this site, so an empty App schema was loaded."
                          })
                        },
                        children: []
                      })
                    ]
                  })
                ]
              })
            ]
          })
        })
      ]
    })
  });
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildStudioStatePath(options: {
  pathname: string;
  siteId?: number | null;
  themeId?: number | null;
  pageId?: number | null;
  component?: string | null;
}) {
  const params = new URLSearchParams();

  if (options.siteId) {
    params.set("siteId", String(options.siteId));
  }

  if (options.themeId) {
    params.set("themeId", String(options.themeId));
  }

  if (options.pageId) {
    params.set("pageId", String(options.pageId));
  }

  if (options.component) {
    params.set("component", options.component);
  }

  const query = params.toString();

  return `${options.pathname}${query ? `?${query}` : ""}`;
}

function readLinkedThemeSiteId(site: {
  parent?: { id?: number | null } | null;
  parents?: unknown;
} | null) {
  const directParentId = Number(site?.parent?.id ?? 0);

  if (Number.isFinite(directParentId) && directParentId > 0) {
    return directParentId;
  }

  if (Array.isArray(site?.parents)) {
    const firstParentId = site.parents
      .map((value) => Number(value))
      .find((value) => Number.isFinite(value) && value > 0);

    if (typeof firstParentId === "number") {
      return firstParentId;
    }
  }

  return null;
}

function readLiteralString(value: unknown) {
  if (value instanceof t.Literal) {
    return String(value.value ?? "");
  }

  if (value && typeof value === "object") {
    const candidate = value as { type?: string; value?: unknown };

    if (candidate.type === "Literal") {
      return String(candidate.value ?? "");
    }
  }

  return "";
}

function ensureStyleExpression(template: t.Template) {
  if (!(template instanceof t.TagTemplate)) {
    return null;
  }

  const currentStyle = template.props.style;

  if (currentStyle instanceof t.ObjectExpression) {
    return currentStyle;
  }

  const nextStyle = t.objectExpression({
    properties: {},
  });

  template.props.style = nextStyle;

  return nextStyle;
}

function setStyleLiteral(template: t.Template, key: string, value: string) {
  const style = ensureStyleExpression(template);

  if (!style) {
    return;
  }

  style.properties[key] = t.literal({ value });
}

const HORIZONTAL_CENTER_SNAP_THRESHOLD = 24;
const FULL_WIDTH_EDGE_SNAP_THRESHOLD = 12;

function getFreeBlockHorizontalLiterals(
  left: number,
  width: number,
  parentWidth: number | null | undefined
) {
  const normalizedWidth = Math.max(1, Math.round(width));

  if (
    Number.isFinite(width) &&
    parentWidth &&
    Number.isFinite(parentWidth) &&
    parentWidth > 0
  ) {
    const rightGap = parentWidth - (left + width);

    if (
      Math.abs(left) <= FULL_WIDTH_EDGE_SNAP_THRESHOLD &&
      Math.abs(rightGap) <= FULL_WIDTH_EDGE_SNAP_THRESHOLD
    ) {
      return {
        left: "0px",
        width: "100%",
      };
    }

    const centerDelta = Math.abs(left + width / 2 - parentWidth / 2);

    if (centerDelta <= HORIZONTAL_CENTER_SNAP_THRESHOLD) {
      return {
        left: `calc(50% - ${Math.round(width / 2)}px)`,
        width: `${normalizedWidth}px`,
      };
    }
  }

  return {
    left: `${Math.round(left)}px`,
    width: `${normalizedWidth}px`,
  };
}

function isStudioFreeBlockTemplate(template: t.Template) {
  if (!(template instanceof t.TagTemplate)) {
    return false;
  }

  return readLiteralString(template.props.className)
    .split(/\s+/)
    .includes("studio-free-block");
}

function normalizeFreeBlocksFromDom(
  reka: Reka,
  activeFrame:
    | {
        tplElements: Map<t.Template, Set<HTMLElement>>;
      }
    | null
    | undefined
) {
  if (!activeFrame) {
    return;
  }

  reka.change(() => {
    for (const [template, doms] of activeFrame.tplElements) {
      if (!isStudioFreeBlockTemplate(template)) {
        continue;
      }

      const dom = [...doms][0];

      if (!dom) {
        continue;
      }

      let parentTemplate: t.Template | null = null;

      try {
        parentTemplate = reka.getParentNode(template, t.Template);
      } catch {
        parentTemplate = null;
      }

      const parentDom = parentTemplate
        ? [...(activeFrame.tplElements.get(parentTemplate) ?? [])][0] ?? null
        : null;

      if (!parentDom) {
        continue;
      }

      const domRect = dom.getBoundingClientRect();
      const parentRect = parentDom.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(parentDom);
      const borderLeft = Number.parseFloat(computedStyle.borderLeftWidth ?? "0");
      const borderTop = Number.parseFloat(computedStyle.borderTopWidth ?? "0");
      const left =
        domRect.left -
        parentRect.left -
        (Number.isFinite(borderLeft) ? borderLeft : 0) +
        parentDom.scrollLeft;
      const top =
        domRect.top -
        parentRect.top -
        (Number.isFinite(borderTop) ? borderTop : 0) +
        parentDom.scrollTop;

      setStyleLiteral(template, "position", "absolute");

      const horizontal = getFreeBlockHorizontalLiterals(
        left,
        domRect.width,
        parentDom.clientWidth
      );

      setStyleLiteral(template, "left", horizontal.left);
      setStyleLiteral(template, "top", `${Math.round(top)}px`);
      setStyleLiteral(template, "width", horizontal.width);
      setStyleLiteral(template, "height", `${Math.round(domRect.height)}px`);
      setStyleLiteral(template, "maxWidth", "100%");
      setStyleLiteral(template, "boxSizing", "border-box");
      setStyleLiteral(template, "overflowWrap", "break-word");
    }
  });
}

function applySchemaToReka(reka: Reka, schema: unknown) {
  const cloned = JSON.parse(JSON.stringify(schema));

  reka.load(t.Schema.fromJSON(cloned as Parameters<typeof t.Schema.fromJSON>[0]));

  const components = (reka.state?.program?.components ?? []) as ProgramComponentLike[];
  const frames = components
    .map((component) => ({
      id: String(component.name ?? ""),
      name: String(component.name ?? ""),
      width: "100%",
      height: "100%",
    }))
    .filter((frame) => frame.id);
  const allowedFrameIds = new Set(frames.map((frame) => frame.id));

  reka.change(() => {
    const list = ensureUserFramesState(reka);
    list.splice(0, list.length, ...frames);

    reka.frames
      .filter((frame) => !allowedFrameIds.has(String(frame.id)))
      .forEach((frame) => {
        reka.removeFrame(frame);
      });
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function mergeJsonShape(base: unknown, patch: unknown): unknown {
  if (!isRecord(base) || !isRecord(patch)) {
    return cloneJson(patch);
  }

  const result = cloneJson(base);

  Object.entries(patch).forEach(([key, patchValue]) => {
    if (patchValue === undefined) {
      return;
    }

    const baseValue = result[key];

    result[key] =
      isRecord(baseValue) && isRecord(patchValue)
        ? mergeJsonShape(baseValue, patchValue)
        : cloneJson(patchValue);
  });

  return result;
}

function normalizeNullMetaFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeNullMetaFields(item));
  }

  if (!isRecord(value)) {
    return value;
  }

  const next: Record<string, unknown> = {};

  Object.entries(value).forEach(([key, entryValue]) => {
    if (key === "meta" && entryValue == null) {
      next[key] = {};
      return;
    }

    next[key] = normalizeNullMetaFields(entryValue);
  });

  if (!("meta" in next) && typeof value.type === "string") {
    next.meta = {};
  }

  return next;
}

function normalizeAIGeneratedSchema(candidate: unknown, currentSchema: unknown) {
  if (!isRecord(candidate)) {
    return candidate;
  }

  const currentRoot = isRecord(currentSchema) ? cloneJson(currentSchema) : {};
  const currentProgram = isRecord(currentRoot.program) ? currentRoot.program : null;
  const currentExtensions = currentRoot.extensions ?? {};
  const normalizedCandidate = normalizeNullMetaFields(candidate);

  const normalizedRoot =
    isRecord(normalizedCandidate) && normalizedCandidate.type === "Program"
      ? {
          ...currentRoot,
          extensions: cloneJson(currentExtensions),
          program: currentProgram
            ? mergeJsonShape(currentProgram, normalizedCandidate)
            : cloneJson(normalizedCandidate),
        }
      : mergeJsonShape(currentRoot, normalizedCandidate);

  if (!isRecord(normalizedRoot)) {
    return normalizedRoot;
  }

  if (normalizedRoot.extensions === undefined) {
    normalizedRoot.extensions = cloneJson(currentExtensions);
  }

  const normalizedExtensions = isRecord(normalizedRoot.extensions)
    ? normalizedRoot.extensions
    : null;

  if (normalizedExtensions && isRecord(currentExtensions)) {
    Object.entries(normalizedExtensions).forEach(([key, value]) => {
      if (value == null && currentExtensions[key] !== undefined) {
        normalizedExtensions[key] = cloneJson(currentExtensions[key]);
      }
    });
  }

  const nextProgram = isRecord(normalizedRoot.program)
    ? normalizedRoot.program
    : isRecord(normalizedCandidate) && normalizedCandidate.type === "Program"
      ? (normalizedRoot.program as Record<string, unknown> | undefined) ?? null
      : null;

  if (!nextProgram || !Array.isArray(nextProgram.components)) {
    return normalizedRoot;
  }

  const currentComponents = Array.isArray(currentProgram?.components)
    ? currentProgram.components
    : [];
  const currentComponentMap = new Map(
    currentComponents.flatMap((component) => {
      if (!isRecord(component) || typeof component.name !== "string") {
        return [];
      }

      return [[component.name, component] as const];
    })
  );

  const normalizedComponents = nextProgram.components
    .map((component) => {
      if (typeof component === "string") {
        const original = currentComponentMap.get(component);
        return original ? cloneJson(original) : null;
      }

      if (!isRecord(component) || typeof component.name !== "string") {
        return null;
      }

      const original = currentComponentMap.get(component.name);

      if (!original) {
        return normalizeNullMetaFields(component);
      }

      return normalizeNullMetaFields(mergeJsonShape(original, component));
    })
    .filter((component): component is Record<string, unknown> => isRecord(component));

  if (!normalizedComponents.some((component) => component.name === "App")) {
    const originalApp = currentComponentMap.get("App");
    if (originalApp) {
      normalizedComponents.unshift(cloneJson(originalApp));
    }
  }

  nextProgram.components = normalizedComponents;

  return normalizedRoot;
}

const AI_BOOLEAN_ATTRIBUTES = new Set([
  "autofocus",
  "checked",
  "controls",
  "disabled",
  "hidden",
  "multiple",
  "muted",
  "open",
  "playsinline",
  "readonly",
  "required",
  "selected",
]);

function createAiNodeId() {
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `ai-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createAiLiteral(value: unknown) {
  return {
    type: "Literal",
    id: createAiNodeId(),
    meta: {},
    value,
  };
}

function createAiObjectExpression(properties: Record<string, unknown>) {
  return {
    type: "ObjectExpression",
    id: createAiNodeId(),
    meta: {},
    properties,
  };
}

function createAiTagTemplate(
  tag: string,
  props: Record<string, unknown>,
  children: Record<string, unknown>[],
) {
  return {
    type: "TagTemplate",
    id: createAiNodeId(),
    meta: {},
    props,
    if: null,
    each: null,
    classList: null,
    children,
    slots: {},
    tag,
  };
}

function toAiCamelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

function toAiPropName(attributeName: string) {
  const lower = attributeName.toLowerCase();

  if (lower === "class") return "className";
  if (lower === "for") return "htmlFor";
  if (lower === "tabindex") return "tabIndex";
  if (lower === "readonly") return "readOnly";
  if (lower === "maxlength") return "maxLength";
  if (lower === "minlength") return "minLength";
  if (lower === "viewbox") return "viewBox";
  if (lower === "http-equiv") return "httpEquiv";
  if (lower.startsWith("aria-") || lower.startsWith("data-")) return lower;

  return toAiCamelCase(lower);
}

function parseAiStyleAttribute(value: string) {
  const properties: Record<string, unknown> = {};

  value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .forEach((entry) => {
      const separatorIndex = entry.indexOf(":");

      if (separatorIndex === -1) {
        return;
      }

      const key = entry.slice(0, separatorIndex).trim();
      const styleValue = entry.slice(separatorIndex + 1).trim();

      if (!key || !styleValue) {
        return;
      }

      properties[toAiCamelCase(key)] = createAiLiteral(styleValue);
    });

  return Object.keys(properties).length ? createAiObjectExpression(properties) : null;
}

function domNodeToAiTemplate(node: ChildNode): Record<string, unknown> | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const value = node.textContent?.replace(/\s+/g, " ").trim() ?? "";

    if (!value) {
      return null;
    }

    return createAiTagTemplate("text", { value: createAiLiteral(value) }, []);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();

  if (tagName === "script" || tagName === "style") {
    return null;
  }

  const props: Record<string, unknown> = {};

  Array.from(element.attributes).forEach((attribute) => {
    if (attribute.name === "style") {
      const styleExpression = parseAiStyleAttribute(attribute.value);

      if (styleExpression) {
        props.style = styleExpression;
      }

      return;
    }

    const propName = toAiPropName(attribute.name);
    const lowerName = attribute.name.toLowerCase();
    const propValue = AI_BOOLEAN_ATTRIBUTES.has(lowerName)
      ? true
      : attribute.value;

    props[propName] = createAiLiteral(propValue);
  });

  const children = Array.from(element.childNodes)
    .map((childNode) => domNodeToAiTemplate(childNode))
    .filter((template): template is Record<string, unknown> => Boolean(template));

  return createAiTagTemplate(tagName, props, children);
}

function buildAiSchemaPatchFromHtml(html: string, currentSchema: unknown) {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    throw new Error("HTML conversion is only available in the browser.");
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(`<body>${html}</body>`, "text/html");
  const topLevelTemplates = Array.from(document.body.childNodes)
    .map((node) => domNodeToAiTemplate(node))
    .filter((template): template is Record<string, unknown> => Boolean(template));

  if (!topLevelTemplates.length) {
    throw new Error("The AI response did not include any usable HTML.");
  }

  const currentRoot = isRecord(currentSchema) ? currentSchema : {};
  const currentProgram = isRecord(currentRoot.program) ? currentRoot.program : {};
  const currentComponents = Array.isArray(currentProgram.components)
    ? currentProgram.components
    : [];
  const currentAppComponent = currentComponents.find(
    (component) => isRecord(component) && component.name === "App"
  );

  const nextTemplate =
    topLevelTemplates.length === 1 && topLevelTemplates[0].tag !== "text"
      ? topLevelTemplates[0]
      : createAiTagTemplate(
          "div",
          { className: createAiLiteral("min-h-screen w-full") },
          topLevelTemplates
        );

  const nextAppComponent = isRecord(currentAppComponent)
    ? {
        ...cloneJson(currentAppComponent),
        meta: {},
        props: Array.isArray(currentAppComponent.props)
          ? cloneJson(currentAppComponent.props)
          : [],
        state: Array.isArray(currentAppComponent.state)
          ? cloneJson(currentAppComponent.state)
          : [],
        template: nextTemplate,
      }
    : {
        type: "RekaComponent",
        id: createAiNodeId(),
        meta: {},
        name: "App",
        props: [],
        state: [],
        template: nextTemplate,
      };

  return {
    program: {
      components: [nextAppComponent],
    },
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function trimWrapperTag(value: string | null | undefined, tag: "head" | "body") {
  if (!value) return "";

  return value
    .replace(new RegExp(`^\\s*<${tag}[^>]*>`, "i"), "")
    .replace(new RegExp(`</${tag}>\\s*$`, "i"), "")
    .trim();
}

function stripScriptTags(value: string) {
  return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").trim();
}

function buildPreviewDocument(site: {
  title?: string | null;
  metaTitle?: string | null;
  favicon?: string | null;
  head?: string | null;
  foot?: string | null;
  theme?: string | null;
  desktopTheme?: string | null;
} | null) {
  const title = escapeHtml(site?.metaTitle || site?.title || "Studio Preview");
  const favicon = site?.favicon
    ? `<link rel="icon" href="${escapeHtml(String(site.favicon))}" />`
    : "";
  const themeAttr = escapeHtml(String(site?.theme ?? ""));
  const desktopThemeAttr = escapeHtml(String(site?.desktopTheme ?? ""));
  const head = stripScriptTags(trimWrapperTag(site?.head, "head"));
  const foot = stripScriptTags(trimWrapperTag(site?.foot, "body"));

  return `<!DOCTYPE html>
<html lang="en" data-site-theme="${themeAttr}" data-desktop-theme="${desktopThemeAttr}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${appCssHref}" />
    <link href="/frame.css" rel="stylesheet" />
    ${favicon}
    <style>
      body {
        margin: 0;
      }
    </style>
    <script async src="/frame.js"></script>
    ${head}
  </head>
  <body data-site-theme="${themeAttr}" data-desktop-theme="${desktopThemeAttr}">
    <div id="preloader"></div>
    <div id="root" style="display: none;"></div>
    ${foot}
  </body>
</html>`;
}

export default function Studio() {
  // This route is mounted outside the normal admin Layout, so it can render full-screen.
  return (
    <EditorContextProvider>
      <StudioInner />
    </EditorContextProvider>
  );
}

function StudioInner() {
  const user = useAuthStore((s) => s.user);
  const storedSiteId = useSiteAdminStore((s) => s.siteId);
  const setSiteId = useSiteAdminStore((s) => s.setSiteId);
  const upsertSite = useSiteAdminStore((s) => s.upsertSite);
  const setCurrentSite = useSiteStore((s) => s.setSite);
  const addToast = useToastStore((s) => s.addToast);
  const { editor, setEditor } = useContext(EditorContext);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeState = (location.state ?? null) as StudioLocationState;
  const routeSiteId =
    typeof routeState?.siteId === "number" ? Number(routeState.siteId) : null;
  const routeThemeId =
    typeof routeState?.themeId === "number" ? Number(routeState.themeId) : null;
  const routePageId =
    typeof routeState?.pageId === "number" ? Number(routeState.pageId) : null;
  const querySiteId = Number(searchParams.get("siteId") ?? 0) || null;
  const queryThemeId = Number(searchParams.get("themeId") ?? 0) || null;
  const queryPageId = Number(searchParams.get("pageId") ?? 0) || null;
  const themeId = routeThemeId ?? queryThemeId ?? null;
  const siteId = themeId ? null : routeSiteId ?? querySiteId ?? storedSiteId;
  const pageId =
    themeId || routeState?.entityType === "theme"
      ? null
      : routePageId ?? queryPageId ?? null;
  const recordId = themeId ?? siteId;
  const studioEntityType: "site" | "theme" =
    themeId || routeState?.entityType === "theme" ? "theme" : "site";

  const componentParam = searchParams.get("component") ?? undefined;
  const [usedFallbackSchema, setUsedFallbackSchema] = useState(false);
  const [savedSchemaOverride, setSavedSchemaOverride] = useState<unknown | null>(null);
  const [showThemeDeployPrompt, setShowThemeDeployPrompt] = useState(false);
  const lastAppliedSchemaSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (studioEntityType === "site" && siteId && siteId !== storedSiteId) {
      setSiteId(siteId);
    }
  }, [setSiteId, siteId, storedSiteId, studioEntityType]);

  const buildStudioTargetPath = (component?: string | null, nextPageId?: number | null) =>
    buildStudioStatePath({
      pathname: location.pathname,
      siteId,
      themeId,
      pageId: studioEntityType === "site" ? nextPageId ?? pageId : null,
      component,
    });

  const { data, loading, error } = useQuery(SITE_SCHEMA_DETAILS, {
    variables: { id: recordId ?? 0 },
    fetchPolicy: "no-cache",
    skip: !recordId,
  });

  const {
    data: pagesData,
    loading: pagesLoading,
    refetch: refetchPages,
  } = useQuery(SITE_PAGES, {
    variables: { siteId: siteId ?? 0, search: "", first: 200, after: null },
    fetchPolicy: "network-only",
    skip: studioEntityType !== "site" || !siteId,
  });

  const {
    data: pageData,
    loading: pageLoading,
    refetch: refetchPage,
  } = useQuery(SITE_PAGE, {
    variables: { siteId: siteId ?? 0, id: pageId ?? 0 },
    fetchPolicy: "network-only",
    skip: studioEntityType !== "site" || !siteId || !pageId,
  });

  const site = data?.siteById ?? null;
  const linkedThemeSiteId = useMemo(() => readLinkedThemeSiteId(site), [site]);

  useEffect(() => {
    if (studioEntityType !== "site" || !site?.id) return;

    const siteSummary = {
      id: Number(site.id),
      title: String(site.title ?? `Site #${site.id}`),
      domain: site.domain ?? null,
      hostname: site.hostname ?? null,
      favicon: site.favicon ?? null,
      street: site.street ?? null,
      address: site.address ?? "",
      isActive: site.isActive ?? true,
      siteType: site.siteType ?? "site",
    };

    upsertSite(siteSummary);
    setCurrentSite(siteSummary);
  }, [
    setCurrentSite,
    site?.address,
    site?.domain,
    site?.favicon,
    site?.hostname,
    site?.id,
    site?.isActive,
    site?.siteType,
    site?.street,
    site?.title,
    studioEntityType,
    upsertSite,
  ]);

  const pages = useMemo<StudioPageItem[]>(
    () =>
      (pagesData?.sitePages?.edges ?? [])
        .map((edge: { node?: SitePageRecord | null }) => edge?.node)
        .filter(Boolean)
        .map((page: SitePageRecord) => ({
          id: Number(page.id ?? 0),
          title: String(page.title ?? page.slug ?? `Page ${page.id}`),
          slug: String(page.slug ?? ""),
        }))
        .filter((page: StudioPageItem) => Number.isFinite(page.id) && page.id > 0),
    [pagesData]
  );
  const selectedPage = (pageData?.sitePage ?? null) as SitePageRecord | null;
  const currentStudioState = useMemo<StudioLocationState>(
    () => ({
      siteId,
      themeId,
      pageId,
      entityType: studioEntityType,
      title:
        (pageId ? selectedPage?.title : null) ??
        routeState?.title ??
        site?.title ??
        null,
      schema: routeState?.schema ?? null,
      promptOnSave: routeState?.promptOnSave ?? false,
    }),
    [
      pageId,
      routeState?.promptOnSave,
      routeState?.schema,
      routeState?.title,
      selectedPage?.title,
      site?.title,
      siteId,
      studioEntityType,
      themeId,
    ]
  );
  const router: StudioRouter = useMemo(
    () => ({
      pathname: location.pathname,
      query: { component: componentParam },
      push: (path: string) =>
        navigate(
          path.startsWith("/studio")
            ? buildStudioTargetPath(
                new URL(path, window.location.origin).searchParams.get("component")
              )
            : path,
          { state: currentStudioState }
        ),
      replace: (path: string) =>
        navigate(
          path.startsWith("/studio")
            ? buildStudioTargetPath(
                new URL(path, window.location.origin).searchParams.get("component")
              )
            : path,
          { replace: true, state: currentStudioState }
        ),
    }),
    [buildStudioTargetPath, componentParam, currentStudioState, location.pathname, navigate]
  );
  const previewDocument = useMemo(() => buildPreviewDocument(site), [site]);
  const [persistedEntry, setPersistedEntry] =
    useState<StudioLocationState>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setPersistedEntry(null);
      return;
    }

    setPersistedEntry(
      safeJsonParse<StudioLocationState>(
        window.sessionStorage.getItem("site-admin-react-studio-entry")
      )
    );
  }, [recordId, location.pathname, location.search]);

  const persistStudioEntry = (schema: unknown) => {
    const nextEntry: StudioLocationState = {
      siteId,
      pageId,
      title:
        (pageId ? selectedPage?.title : null) ??
        routeState?.title ??
        site?.title ??
        null,
      schema,
      themeId,
      entityType: studioEntityType,
    };

    try {
      window.sessionStorage.setItem(
        "site-admin-react-studio-entry",
        JSON.stringify(nextEntry)
      );
    } catch {
      // ignore sessionStorage failures
    }

    setPersistedEntry(nextEntry);

    navigate(buildStudioTargetPath(componentParam, pageId), {
      replace: true,
      state: nextEntry,
    });
  };

  const schemaSelection = useMemo(() => {
    if (savedSchemaOverride) {
      return { schema: savedSchemaOverride, fallback: false };
    }
    if (
      studioEntityType === "theme" &&
      routeState?.promptOnSave &&
      routeState?.schema
    ) {
      return { schema: routeState.schema, fallback: false };
    }

    const isMatchingPersistedEntry = Boolean(
      persistedEntry?.schema &&
        ((studioEntityType === "theme" && persistedEntry?.themeId === themeId) ||
          (studioEntityType === "site" &&
            persistedEntry?.siteId === siteId &&
            (persistedEntry?.pageId ?? null) === (pageId ?? null)))
    );
    const isLoadingTarget = loading || (pageId ? pageLoading : false);
    const targetSchema = pageId ? selectedPage?.schema : site?.schema;

    if (isLoadingTarget) {
      if (routeState?.schema) {
        return { schema: routeState.schema, fallback: false };
      }

      if (isMatchingPersistedEntry) {
        return { schema: persistedEntry?.schema, fallback: false };
      }

      return null;
    }

    if (targetSchema) {
      if (studioEntityType === "theme" && isMatchingPersistedEntry) {
        return { schema: persistedEntry?.schema, fallback: false };
      }

      return { schema: targetSchema, fallback: false };
    }

    if (routeState?.schema) {
      return { schema: routeState.schema, fallback: false };
    }

    if (isMatchingPersistedEntry) {
      return { schema: persistedEntry?.schema, fallback: false };
    }

    return { schema: createFallbackSchema(), fallback: true };
  }, [
    loading,
    pageId,
    pageLoading,
    persistedEntry?.schema,
    persistedEntry?.pageId,
    persistedEntry?.siteId,
    persistedEntry?.themeId,
    routeState?.schema,
    savedSchemaOverride,
    selectedPage?.schema,
    site?.schema,
    siteId,
    studioEntityType,
    themeId,
  ]);

  const schemaSelectionSignature = useMemo(() => {
    if (!schemaSelection) {
      return null;
    }

    try {
      return JSON.stringify(schemaSelection.schema);
    } catch {
      return null;
    }
  }, [schemaSelection]);

  useEffect(() => {
    lastAppliedSchemaSignatureRef.current = null;
    setSavedSchemaOverride(null);
  }, [pageId, recordId, lastAppliedSchemaSignatureRef]);

  const [updateSite, updateState] = useMutation(SELF_SITE_UPDATE);
  const [updatePage, updatePageState] = useMutation(SELF_SITE_PAGE_UPDATE);
  const [createPageMutation, createPageState] = useMutation(SELF_SITE_PAGE_CREATE);
  const [deletePageMutation, deletePageState] = useMutation(SELF_SITE_PAGE_DELETE);

  // Create a Reka instance with the same extensions/components the studio UI expects.
  const reka = useMemo(() => {
    const initialLocation =
      typeof window === "undefined"
        ? { path: "/", host: "", search: "" }
        : {
            path: window.location.pathname,
            host: window.location.hostname,
            search: window.location.search,
          };

    return Reka.create({
      kinds: {
        Color: {
          validate(field) {
            return field.string((value) => String(value).startsWith("#"));
          },
        },
      },
      ...createSharedStateGlobals({
        externals: {
          components: [
            t.externalComponent({
              name: "Animation",
              render: () => <UserAnimation />,
            }),
            t.externalComponent({
              name: "Icon",
              props: [
                t.componentProp({ name: "name", kind: t.stringKind() }),
                t.componentProp({ name: "className", kind: t.stringKind() }),
              ],
              render: (props: { name: string; className?: string }) => (
                <Icon name={props.name} className={props.className} />
              ),
            }),
          ],
          states: [
            t.externalState({ name: "scrollTop", init: 0 }),
            t.externalState({ name: "dragPayload", init: null }),
            t.externalState({ name: "dropTarget", init: null }),
            t.externalState({
              name: "currentPath",
              init: initialLocation.path,
            }),
            t.externalState({
              name: "currentHost",
              init: initialLocation.host,
            }),
            t.externalState({
              name: "currentSearch",
              init: initialLocation.search,
            }),
            t.externalState({ name: "products", init: [] }),
          ],
          functions: (self) => [
            t.externalFunc({
              name: "getScrollTop",
              func: () => self.getExternalState("scrollTop"),
            }),
            t.externalFunc({
              name: "setDragPayload",
              func: (payload: unknown) => {
                self.updateExternalState("dragPayload", payload ?? null);
              },
            }),
            t.externalFunc({
              name: "setDropTarget",
              func: (target: unknown) => {
                self.updateExternalState("dropTarget", target ?? null);
              },
            }),
            t.externalFunc({
              name: "resetDndState",
              func: () => {
                self.updateExternalState("dragPayload", null);
                self.updateExternalState("dropTarget", null);
              },
            }),
            t.externalFunc({
              name: "parseInt",
              func: (value: unknown) => {
                const parsed = Number.parseInt(String(value ?? ""), 10);
                return Number.isNaN(parsed) ? 0 : parsed;
              },
            }),
            t.externalFunc({
              name: "validatePhone",
              func: (value: unknown) => {
                const digits = String(value ?? "").replace(/[^\d]/g, "");
                const parsed = Number.parseInt(digits, 10);
                return Number.isNaN(parsed) ? 0 : parsed;
              },
            }),
            t.externalFunc({
              name: "createStoreOrder",
              func: async () => ({
                status: "error",
                message: "Not supported in Studio preview",
              }),
            }),
            t.externalFunc({
              name: "createStoreOrderPayment",
              func: async () => ({
                status: "error",
                message: "Not supported in Studio preview",
              }),
            }),
            t.externalFunc({
              name: "getPosts",
              func: () => self.getExternalState("posts"),
            }),
          ],
        },
        extensions: [],
      }),
    });
  }, []);

  // Load schema when available.
  useEffect(() => {
    if (!schemaSelection) {
      return;
    }

    if (
      schemaSelectionSignature &&
      schemaSelectionSignature === lastAppliedSchemaSignatureRef.current
    ) {
      return;
    }

    try {
      applySchemaToReka(reka, schemaSelection.schema);
      lastAppliedSchemaSignatureRef.current = schemaSelectionSignature;
      setUsedFallbackSchema(schemaSelection.fallback);
    } catch (e) {
      addToast({
        kind: "error",
        title: "Studio",
        subTitle: `Schema load failed: ${(e as Error).message}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaSelection, schemaSelectionSignature, recordId]);

  const ready = Boolean(reka.state?.program);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const currentPath =
      studioEntityType === "site"
        ? buildStudioPagePath(selectedPage?.slug ?? null)
        : "/";

    reka.change(() => {
      reka.updateExternalState("currentPath", currentPath);
      reka.updateExternalState(
        "currentHost",
        site?.domain || site?.hostname || window.location.hostname
      );
      reka.updateExternalState("currentSearch", "");
    });
  }, [ready, reka, selectedPage?.slug, site?.domain, site?.hostname, studioEntityType]);

  // Create/own studio Editor instance and keep it in context.
  useEffect(() => {
    if (!ready) return;
    const inst = new Editor(router, reka, {
      previewDocument,
    });
    setEditor(inst);
    return () => {
      inst.dispose();
      setEditor(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, previewDocument, reka, router.pathname]);

  // Sync active component to URL.
  useEffect(() => {
    if (!editor) return;
    if (!componentParam) return;
    editor.setActiveComponentEditorByName(componentParam);
  }, [editor, componentParam]);

  const saving = updateState.loading || updatePageState.loading;
  const getCurrentStudioSchema = () => {
    normalizeFreeBlocksFromDom(reka, editor?.activeComponentEditor?.activeFrame);
    return JSON.parse(JSON.stringify(reka.toJSON()));
  };

  const applyAIGeneratedSchema = (schema: unknown) => {
    try {
      const normalizedSchema = normalizeAIGeneratedSchema(
        schema,
        getCurrentStudioSchema()
      );

      applySchemaToReka(reka, normalizedSchema);
      const schemaSignature = JSON.stringify(normalizedSchema);

      lastAppliedSchemaSignatureRef.current = schemaSignature;
      setSavedSchemaOverride(normalizedSchema);
      setUsedFallbackSchema(false);
      persistStudioEntry(normalizedSchema);

      const preferredComponentName =
        componentParam ??
        editor?.activeComponentEditor?.component.name ??
        "App";

      if (editor) {
        editor.setActiveComponentEditorByName(preferredComponentName);
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `AI returned an invalid schema. ${error.message}`
          : "AI returned an invalid schema."
      );
    }
  };

  const handleSave = async () => {
    if (!recordId || !user?.id) {
      addToast({
        kind: "error",
        title: "Studio",
        subTitle: "Missing save target or user context.",
      });
      return;
    }

    normalizeFreeBlocksFromDom(reka, editor?.activeComponentEditor?.activeFrame);
    const schemaJson = JSON.parse(JSON.stringify(reka.toJSON()));
    const schemaSignature = JSON.stringify(schemaJson);
    try {
      if (studioEntityType === "site" && siteId && pageId) {
        await updatePage({
          variables: {
            userId: user.id,
            siteId,
            id: pageId,
            title: selectedPage?.title ?? "Untitled Page",
            slug: selectedPage?.slug ?? "",
            description: selectedPage?.description ?? "",
            isActive: selectedPage?.isActive ?? true,
            html:
              typeof selectedPage?.html === "string"
                ? selectedPage.html
                : JSON.stringify(selectedPage?.html ?? {}),
            schema: schemaJson,
          },
        });

        lastAppliedSchemaSignatureRef.current = schemaSignature;
        setSavedSchemaOverride(schemaJson);
        setUsedFallbackSchema(false);
        persistStudioEntry(schemaJson);
        addToast({
          kind: "success",
          title: "Studio",
          subTitle: "Page saved.",
        });

        await Promise.all([refetchPage(), refetchPages()]);
        return;
      }

      await updateSite({
        variables: {
          userId: user.id,
          siteId: recordId,
          schema: schemaJson,
          isActive: studioEntityType === "theme" ? true : undefined,
          isTheme: studioEntityType === "theme",
          isPublic: studioEntityType === "theme" ? false : undefined,
          siteType: studioEntityType === "theme" ? "theme" : undefined,
        },
      });

      if (
        studioEntityType === "theme" &&
        linkedThemeSiteId &&
        linkedThemeSiteId !== recordId
      ) {
        await updateSite({
          variables: {
            userId: user.id,
            siteId: linkedThemeSiteId,
            schema: schemaJson,
            head: site?.head ?? null,
            foot: site?.foot ?? null,
            theme: site?.theme ?? null,
            desktopTheme: site?.desktopTheme ?? null,
            navigation: site?.navigation ?? null,
            tools: site?.tools ?? null,
          },
        });
      }

      lastAppliedSchemaSignatureRef.current = schemaSignature;
      setSavedSchemaOverride(schemaJson);
      setUsedFallbackSchema(false);
      persistStudioEntry(schemaJson);
      addToast({
        kind: "success",
        title: "Studio",
        subTitle:
          studioEntityType === "theme" && linkedThemeSiteId
            ? "Saved and synced to the linked website."
            : "Saved.",
      });

      if (
        studioEntityType === "theme" &&
        routeState?.promptOnSave &&
        !linkedThemeSiteId
      ) {
        setShowThemeDeployPrompt(true);
      }
    } catch (error) {
      addToast({
        kind: "error",
        title: "Studio",
        subTitle: error instanceof Error ? error.message : "Could not save this Studio session.",
      });
    }
  };

  const switchStudioPage = (nextPageId: number | null) => {
    navigate(buildStudioTargetPath(null, nextPageId), {
      state: {
        ...currentStudioState,
        pageId: nextPageId,
        title:
          (nextPageId
            ? pages.find((page) => page.id === nextPageId)?.title ?? null
            : site?.title ?? null) ?? null,
        schema: null,
      },
    });
  };

  const createStudioPage = async (input: { title: string; slug: string }) => {
    if (!user?.id || !siteId) {
      return;
    }

    const nextSlug = slugify(input.slug || input.title);

    if (!nextSlug) {
      addToast({
        kind: "error",
        title: "Studio",
        subTitle: "A valid page slug is required.",
      });
      return;
    }

    const result = await createPageMutation({
      variables: {
        userId: user.id,
        siteId,
        title: input.title.trim(),
        slug: nextSlug,
        description: "",
        isActive: true,
        schema: createFallbackSchema(),
        html: {},
        index: "",
        metaTitle: input.title.trim(),
        metaDescription: "",
        metaKeywords: "",
        isExcludedFromSitemap: false,
        isFooterHidden: false,
        isNavHidden: false,
      },
    });

    const createdId = Number(result.data?.selfSitePageCreate?.id ?? 0) || null;

    await refetchPages();

    if (createdId) {
      addToast({
        kind: "success",
        title: "Studio",
        subTitle: "New page created.",
      });
      switchStudioPage(createdId);
      return;
    }

    addToast({
      kind: "error",
      title: "Studio",
      subTitle: "Page was created but Studio could not open it automatically.",
    });
  };

  const deleteCurrentStudioPage = async () => {
    if (!user?.id || !siteId || !pageId) {
      return;
    }

    const ok = window.confirm("Delete this page?");

    if (!ok) {
      return;
    }

    await deletePageMutation({
      variables: {
        userId: user.id,
        siteId,
        id: pageId,
      },
    });

    setSavedSchemaOverride(null);
    await refetchPages();
    addToast({
      kind: "success",
      title: "Studio",
      subTitle: "Page deleted.",
    });
    switchStudioPage(null);
  };

  useEffect(() => {
    if (studioEntityType !== "site" || !siteId) {
      return;
    }

    const handleStudioClickAction = (event: MessageEvent) => {
      const payload = event.data as
        | {
            type?: string;
            action?: "page" | "link";
            slug?: string | null;
            url?: string | null;
          }
        | undefined;

      if (payload?.type !== "site-admin-react:studio-click-action") {
        return;
      }

      if (payload.action === "page") {
        const normalizedSlug = normalizeStudioPageSlug(payload.slug);
        const nextPageId =
          pages.find((page) => normalizeStudioPageSlug(page.slug) === normalizedSlug)?.id ??
          null;
        switchStudioPage(nextPageId);
        return;
      }

      if (payload.action === "link" && payload.url) {
        window.open(payload.url, "_blank", "noopener,noreferrer");
      }
    };

    window.addEventListener("message", handleStudioClickAction);

    return () => {
      window.removeEventListener("message", handleStudioClickAction);
    };
  }, [pages, siteId, studioEntityType]);

  const studioPageContextValue = useMemo(
    () => ({
      enabled: studioEntityType === "site" && !!siteId,
      currentPageId: pageId,
      currentPageSlug: normalizeStudioPageSlug(selectedPage?.slug ?? null),
      pages,
      isLoading: pagesLoading || pageLoading,
      isMutating:
        createPageState.loading || deletePageState.loading || updatePageState.loading,
      switchPage: switchStudioPage,
      createPage: createStudioPage,
      deleteCurrentPage: deleteCurrentStudioPage,
    }),
    [
      createPageState.loading,
      deletePageState.loading,
      pageId,
      pageLoading,
      pages,
      pagesLoading,
      selectedPage?.slug,
      siteId,
      studioEntityType,
      updatePageState.loading,
    ]
  );

  const studioDisplayTitle =
    (pageId ? selectedPage?.title : routeState?.title ?? site?.title) ??
    `${studioEntityType === "theme" ? "Theme" : "Site"} #${recordId}`;

  if (!recordId) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="rounded-lg border bg-white p-6 max-w-md">
          <div className="text-lg font-semibold text-slate-900">
            Select a target first
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Go to{" "}
            <Link to="/site/" className="text-blue-600 underline">
              Site
            </Link>{" "}
            and select a site or theme.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <DndProvider backend={HTML5Backend}>
        <RekaProvider reka={reka}>
          <StudioPageContextProvider value={studioPageContextValue}>
            <StudioAIProvider
              disabled={!ready}
              entityType={studioEntityType}
              title={studioDisplayTitle}
              currentPageSlug={selectedPage?.slug ?? null}
              getCurrentSchema={getCurrentStudioSchema}
              onApplySchema={applyAIGeneratedSchema}
              buildSchemaFromHtml={buildAiSchemaPatchFromHtml}
            >
              <div className="h-full w-full flex flex-col bg-[#edf0f5]">
                <div className="h-[64px] border-b border-[#d9dee7] bg-white">
                  <div className="flex h-full items-center gap-3 px-3 sm:px-4 lg:px-6">
                    <div className="hidden min-w-0 items-center gap-2.5 text-[12px] text-[#5f6778] sm:flex">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 border border-[#dde3eb] bg-white px-3 py-2.5 font-medium text-[#1f2430]"
                        style={{ borderRadius: 6 }}
                      >
                        <span className="max-w-[170px] truncate">
                          {site?.title || studioDisplayTitle || "My Site 1"}
                        </span>
                        <ChevronDownIcon className="h-4 w-4 text-[#7a8294]" />
                      </button>
                      <button type="button" className="hidden hover:text-[#1f2430] xl:inline-flex">
                        Explore
                      </button>
                      <button type="button" className="hidden hover:text-[#1f2430] xl:inline-flex">
                        Hire a Professional
                      </button>
                      <button type="button" className="hidden hover:text-[#1f2430] xl:inline-flex">
                        Help
                      </button>
                      <button
                        type="button"
                        className="hidden bg-[#7f39fb] px-3 py-1.5 text-[10.5px] font-semibold text-white xl:inline-flex"
                        style={{ borderRadius: 999 }}
                      >
                        Upgrade
                      </button>
                    </div>

                    <div className="mx-auto hidden max-w-[640px] flex-1 xl:flex">
                      <div
                        className="flex h-10 w-full items-center gap-2 border border-[#d7deea] bg-[#f5f8fd] px-3.5"
                        style={{ borderRadius: 999 }}
                      >
                        <MagnifyingGlassIcon className="h-4 w-4 text-[#7b8395]" />
                        <input
                          type="text"
                          placeholder="Search for tools, apps, help & more..."
                          className="w-full bg-transparent text-[12.5px] text-[#334155] outline-none placeholder:text-[#8e98ab]"
                        />
                      </div>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                      <button
                        type="button"
                        className="hidden h-9 w-9 items-center justify-center text-[#667085] sm:inline-flex"
                        style={{ borderRadius: 999 }}
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="hidden h-9 w-9 items-center justify-center text-[#667085] sm:inline-flex"
                        style={{ borderRadius: 999 }}
                      >
                        <BellIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="hidden h-9 w-9 items-center justify-center text-[#667085] sm:inline-flex"
                        style={{ borderRadius: 999 }}
                      >
                        <Squares2X2Icon className="h-4 w-4" />
                      </button>
                      <div className="hidden h-6 w-px bg-[#e4e8ef] lg:block" />
                      <button
                        type="button"
                        className="hidden items-center gap-2 rounded-full border border-[#e4e8ef] bg-white px-1.5 py-1 text-[#1f2430] sm:inline-flex"
                      >
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef3fb] text-[10px] font-semibold uppercase text-[#2563eb]"
                        >
                          {(user?.name?.trim().charAt(0) || "U").toUpperCase()}
                        </div>
                        <ChevronDownIcon className="h-4 w-4 text-[#7a8294]" />
                      </button>
                      <StudioAIAssistant variant="header" />
                    </div>
                  </div>
                </div>

                <div className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      Studio - {studioDisplayTitle}
                    </div>
                    <Link
                      to="/editor/"
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Back to Admin Editor
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <ToolbarApp />
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || !ready}
                      className="rounded-full bg-[#145dff] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f54eb] disabled:opacity-60"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="p-4 text-sm text-rose-600">
                    {String(error.message)}
                  </div>
                ) : null}

                {usedFallbackSchema ? (
                  <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
                    No saved schema was found for this site. Studio loaded an empty App schema so the panel can open.
                  </div>
                ) : null}

                {(loading || (pageId ? pageLoading : false)) && !ready ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-slate-600">
                    Loading schema...
                  </div>
                ) : null}

                {ready && editor ? (
                  <div className="flex-1 flex overflow-hidden">
                    <EditorLayout className="h-full w-full" />
                  </div>
                ) : null}

                {showThemeDeployPrompt ? (
                  <div className="absolute inset-0 z-[80] flex items-center justify-center bg-slate-950/50 px-4">
                    <div className="w-full max-w-[560px] rounded-[16px] border border-slate-200 bg-white p-6 shadow-2xl">
                      <div className="text-[22px] font-semibold tracking-[-0.03em] text-slate-900">
                        Private theme saved
                      </div>
                      <p className="mt-2 text-[14px] leading-7 text-slate-600">
                        Choose where this private theme should be used next. You can apply it to an
                        existing website or create a brand new website from this theme.
                      </p>

                      <div className="mt-5 grid gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/theme/apply/?themeId=${recordId}`)}
                          className="flex h-12 items-center justify-center rounded-[12px] bg-[#116dff] px-4 text-[14px] font-semibold text-white transition hover:bg-[#0056ff]"
                        >
                          Clone To Existing Website
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/create/?themeId=${recordId}`)}
                          className="flex h-12 items-center justify-center rounded-[12px] border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Create New Website
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowThemeDeployPrompt(false)}
                          className="flex h-11 items-center justify-center rounded-[12px] bg-slate-100 px-4 text-[13px] font-medium text-slate-600 transition hover:bg-slate-200"
                        >
                          Continue Editing Theme
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </StudioAIProvider>
          </StudioPageContextProvider>
        </RekaProvider>
      </DndProvider>
    </div>
  );
}
