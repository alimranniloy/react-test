import * as t from "@rekajs/types";
import type { Reka } from "@rekajs/core";

export const DND_PAYLOAD_SOURCES = {
  BASIC: "basic",
  COMPONENT: "component",
} as const;

export type DragPayload =
  | { source: typeof DND_PAYLOAD_SOURCES.BASIC; key: keyof typeof BASIC_COMPONENT_LIBRARY }
  | { source: typeof DND_PAYLOAD_SOURCES.COMPONENT; id: number; title?: string };

export type DropMeta = {
  targetId?: string | null;
  position?: "up" | "down" | "child";
  templateId?: string | null;
};

const createLiteral = (value: any) => t.literal({ value });

const wrapWithContainer = (name: string, children: any[], className?: string) =>
  t.rekaComponent({
    name,
    state: [],
    props: [],
    template: t.tagTemplate({
      tag: "div",
      props: className
        ? {
            className: createLiteral(className),
          }
        : {},
      children,
    }),
  });

const createTextNode = (text: string, className?: string) =>
  t.tagTemplate({
    tag: "text",
    props: {
      value: createLiteral(text),
      ...(className ? { className: createLiteral(className) } : {}),
    },
    children: [],
  });

const createPlaceholderBlock = (text: string) =>
  t.tagTemplate({
    tag: "div",
    props: {
      className: createLiteral(
        "rounded-md border border-dashed border-slate-300 bg-white/80 p-4 text-center text-sm text-slate-500"
      ),
    },
    children: [createTextNode(text ?? "Drop blocks here")],
  });

const columnClassMap: Record<number, string> = {
  1: "grid grid-cols-1 gap-4",
  2: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  3: "grid grid-cols-1 sm:grid-cols-3 gap-4",
  4: "grid grid-cols-1 sm:grid-cols-4 gap-4",
};

export const BASIC_COMPONENT_LIBRARY = {
  text: {
    key: "text",
    label: "Text",
    defaultName: "TextBlock",
    factory: ({ name, text = "Double click to edit text" }: { name: string; text?: string }) =>
      wrapWithContainer(
        name,
        [
          t.tagTemplate({
            tag: "div",
            props: { className: createLiteral("space-y-2") },
            children: [
              createTextNode("Text", "text-xs font-semibold uppercase"),
              createTextNode(text, "text-base text-slate-700"),
            ],
          }),
        ],
        "rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      ),
  },
  image: {
    key: "image",
    label: "Image",
    defaultName: "ImageBlock",
    factory: ({
      name,
      src = "https://placehold.co/600x400/png",
      alt = "Placeholder image",
    }: {
      name: string;
      src?: string;
      alt?: string;
    }) =>
      wrapWithContainer(
        name,
        [
          t.tagTemplate({
            tag: "img",
            props: {
              src: createLiteral(src),
              alt: createLiteral(alt),
              className: createLiteral("h-full w-full object-cover"),
            },
            children: [],
          }),
        ],
        "relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
      ),
  },
  rows: {
    key: "rows",
    label: "Rows",
    defaultName: "RowBlock",
    factory: ({ name, rows = 3 }: { name: string; rows?: number }) =>
      wrapWithContainer(
        name,
        Array.from({ length: rows }).map((_, index) =>
          t.tagTemplate({
            tag: "div",
            props: {
              className: createLiteral(
                "rounded-lg border border-dashed border-slate-300 bg-white/80 px-4 py-6"
              ),
            },
            children: [
              createTextNode(
                `Row ${index + 1}`,
                "text-center text-sm font-medium text-slate-500"
              ),
            ],
          })
        ),
        "space-y-4"
      ),
  },
  columns: {
    key: "columns",
    label: "Columns",
    defaultName: "ColumnBlock",
    factory: ({ name, columns = 2 }: { name: string; columns?: number }) => {
      const safeColumns = Math.min(Math.max(columns, 1), 4);
      return wrapWithContainer(
        name,
        [
          t.tagTemplate({
            tag: "div",
            props: {
              className: createLiteral(columnClassMap[safeColumns] ?? columnClassMap[2]),
            },
            children: Array.from({ length: safeColumns }).map((_, index) =>
              createPlaceholderBlock(`Column ${index + 1}`)
            ),
          }),
        ],
        "rounded-xl bg-white"
      );
    },
  },
} as const;

export function ensureUniqueComponentName(baseName: string, instance: Reka) {
  const sanitized = (baseName ?? "Component").replace(/\s+/g, "");
  const existingNames = new Set(
    (instance?.state?.program?.components ?? []).map((component: any) => component.name)
  );
  if (!existingNames.has(sanitized)) return sanitized;

  let index = 2;
  let candidate = `${sanitized}${index}`;
  while (existingNames.has(candidate)) {
    index += 1;
    candidate = `${sanitized}${index}`;
  }
  return candidate;
}

export function createBasicComponent(
  key: keyof typeof BASIC_COMPONENT_LIBRARY,
  reka: Reka
) {
  const item = BASIC_COMPONENT_LIBRARY[key];
  const name = ensureUniqueComponentName(item.defaultName, reka);
  const component = item.factory({ name });
  return component;
}

function parseJsonValue(value: any) {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractProgramComponent(value: any) {
  const components = Array.isArray(value?.program?.components)
    ? value.program.components
    : [];

  return (
    components.find((entry: any) => entry?.name && entry.name !== "App") ??
    components[0] ??
    null
  );
}

function createComponentFromRawJson(value: any): t.RekaComponent | null {
  const normalizedValue = parseJsonValue(value);

  if (!normalizedValue) return null;

  if (normalizedValue instanceof t.RekaComponent) {
    return normalizedValue;
  }

  if (Array.isArray(normalizedValue)) {
    for (const item of normalizedValue) {
      const component = createComponentFromRawJson(item);
      if (component) return component;
    }

    return null;
  }

  if (typeof normalizedValue !== "object") {
    return null;
  }

  const wrappedComponent =
    createComponentFromRawJson(normalizedValue.componentData) ??
    createComponentFromRawJson(normalizedValue.schema) ??
    createComponentFromRawJson(normalizedValue.componentJson) ??
    createComponentFromRawJson(normalizedValue.componentSchema) ??
    createComponentFromRawJson(extractProgramComponent(normalizedValue));

  if (wrappedComponent) {
    return wrappedComponent;
  }

  if (normalizedValue.type) {
    try {
      const parsed = t.Schema.fromJSON(
        normalizedValue as Parameters<typeof t.Schema.fromJSON>[0]
      );

      if (parsed instanceof t.RekaComponent) {
        return parsed;
      }
    } catch {
      return null;
    }
  }

  if (normalizedValue.name && normalizedValue.template) {
    try {
      const templateJson = parseJsonValue(normalizedValue.template);
      const template =
        templateJson?.type
          ? t.Schema.fromJSON(templateJson as Parameters<typeof t.Schema.fromJSON>[0])
          : null;

      if (!(template instanceof t.Template)) {
        return null;
      }

      return t.rekaComponent({
        name: normalizedValue.name,
        props: Array.isArray(normalizedValue.props)
          ? normalizedValue.props
              .map((prop: any) =>
                prop?.type
                  ? t.Schema.fromJSON(prop as Parameters<typeof t.Schema.fromJSON>[0])
                  : null
              )
              .filter(Boolean)
          : [],
        state: Array.isArray(normalizedValue.state)
          ? normalizedValue.state
              .map((entry: any) =>
                entry?.type
                  ? t.Schema.fromJSON(entry as Parameters<typeof t.Schema.fromJSON>[0])
                  : null
              )
              .filter(Boolean)
          : [],
        template,
      });
    } catch {
      return null;
    }
  }

  return null;
}

export function createComponentFromSchemaJson(schemaJson: any, reka: Reka) {
  const component = createComponentFromRawJson(schemaJson);
  if (!component) return null;
  const clone = t.clone(component, { replaceExistingId: true });
  clone.name = ensureUniqueComponentName(component.name, reka);
  return clone as any;
}

export function insertComponentIntoProgram(
  reka: Reka,
  component: any,
  dropMeta?: DropMeta | null
) {
  const targetId = dropMeta?.targetId ?? null;
  const placement = dropMeta?.position ?? "down";
  const program = (reka.state?.program?.components as any[]) ?? null;
  if (!program) return;
  const referenceComponent = targetId
    ? program.find((entry) => entry.id === targetId)
    : null;
  const referenceIndex = referenceComponent
    ? program.findIndex((entry) => entry.id === referenceComponent.id)
    : -1;
  const insertionIndex =
    referenceIndex === -1
      ? program.length
      : placement === "up"
        ? referenceIndex
        : referenceIndex + 1;

  reka.change(() => {
    program.splice(insertionIndex, 0, component);
    const appComponent = program.find((entry) => entry.name === "App");
    if (!appComponent) return;

    const node = t.componentTemplate({
      component: t.identifier({ name: component.name, external: false }),
      props: {},
      children: [],
    });

    const children = appComponent.template.children;
    if (!referenceComponent) {
      children.push(node);
      return;
    }

    const templateIndex = children.findIndex(
      (child: any) => child.component?.name === referenceComponent.name
    );
    const templateInsertionIndex =
      templateIndex === -1
        ? children.length
        : placement === "up"
          ? templateIndex
          : templateIndex + 1;

    children.splice(templateInsertionIndex, 0, node);
  });
}

export function removeComponentFromProgram(reka: Reka, componentId: string) {
  const program = (reka.state?.program?.components as any[]) ?? null;
  if (!program) return;
  const component = program.find((c) => c.id === componentId);
  if (!component) return;
  if (component.name === "App") return;

  reka.change(() => {
    const idx = program.findIndex((c) => c.id === componentId);
    if (idx >= 0) program.splice(idx, 1);

    const appComponent = program.find((entry) => entry.name === "App");
    if (!appComponent) return;
    const children = appComponent.template.children;
    const tIdx = children.findIndex((child: any) => child.component?.name === component.name);
    if (tIdx >= 0) children.splice(tIdx, 1);
  });
}

export function moveTopLevelComponent(
  reka: Reka,
  componentId: string,
  direction: "up" | "down"
) {
  const program = (reka.state?.program?.components as any[]) ?? null;
  if (!program) return;
  const component = program.find((c) => c.id === componentId);
  if (!component) return;
  if (component.name === "App") return;

  reka.change(() => {
    const appComponent = program.find((entry) => entry.name === "App");
    if (!appComponent) return;

    const children = appComponent.template.children as any[];
    const idx = children.findIndex(
      (child: any) => child?.component?.name === component.name
    );
    if (idx === -1) return;

    const swapWith = direction === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= children.length) return;

    // Swap in App template children.
    const tmp = children[idx];
    children[idx] = children[swapWith];
    children[swapWith] = tmp;

    // Keep program order roughly in sync for better UX.
    const pIdx = program.findIndex((c) => c.id === componentId);
    const pSwap = direction === "up" ? pIdx - 1 : pIdx + 1;
    if (pIdx !== -1 && pSwap >= 0 && pSwap < program.length) {
      // Avoid moving across App if possible (App is typically first).
      if (program[pSwap]?.name !== "App") {
        const pTmp = program[pIdx];
        program[pIdx] = program[pSwap];
        program[pSwap] = pTmp;
      }
    }
  });
}
