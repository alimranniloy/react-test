import { ref, h } from "vue";
import { Reka } from "@rekajs/core";
import * as t from "@rekajs/types";
import confetti from "canvas-confetti";
import Icon from "@/views/editor/components/Icon.vue";
import { createOrder, createPayment } from "@/utils/order";
import parsePhoneNumber from "libphonenumber-js/max";

const isClient = typeof window !== "undefined";

const INITIAL_LOCATION = {
  path: isClient ? window.location.pathname : "/",
  host: isClient ? window.location.hostname : "",
  search: isClient ? window.location.search : "",
};

export const DND_PAYLOAD_SOURCES = {
  BASIC: "basic",
  COMPONENT: "component",
};

const columnClassMap = {
  1: "grid grid-cols-1 gap-4",
  2: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  3: "grid grid-cols-1 sm:grid-cols-3 gap-4",
  4: "grid grid-cols-1 sm:grid-cols-4 gap-4",
};

const createLiteral = (value) =>
  t.literal({
    value,
  });

const wrapWithContainer = (name, children, className) =>
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

const createTextNode = (text, className) =>
  t.tagTemplate({
    tag: "text",
    props: {
      value: createLiteral(text),
      ...(className ? { className: createLiteral(className) } : {}),
    },
    children: [],
  });

const createPlaceholderBlock = (text) =>
  t.tagTemplate({
    tag: "div",
    props: {
      className: createLiteral(
        "rounded-md border border-dashed border-slate-300 bg-white/80 p-4 text-center text-sm text-slate-500"
      ),
    },
    children: [createTextNode(text ?? "Drop blocks here")],
  });

const BASIC_COMPONENT_LIBRARY = {
  text: {
    key: "text",
    icon: "PencilIcon",
    label: "Text",
    defaultName: "TextBlock",
    factory: ({ name, text = "Double click to edit text" }) =>
      wrapWithContainer(
        name,
        [
          t.tagTemplate({
            tag: "div",
            props: {
              className: createLiteral("space-y-2"),
            },
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
    icon: "PhotoIcon",
    label: "Image",
    defaultName: "ImageBlock",
    factory: ({
      name,
      src = "https://placehold.co/600x400/png",
      alt = "Placeholder image",
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
  video: {
    key: "video",
    icon: "VideoCameraIcon",
    label: "Video",
    defaultName: "VideoBlock",
    factory: ({
      name,
      src = "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
      poster = "https://placehold.co/640x360/png",
    }) =>
      wrapWithContainer(
        name,
        [
          t.tagTemplate({
            tag: "video",
            props: {
              src: createLiteral(src),
              poster: createLiteral(poster),
              controls: createLiteral("true"),
              className: createLiteral("h-full w-full rounded-lg bg-black"),
            },
            children: [],
          }),
        ],
        "overflow-hidden rounded-xl border border-slate-200 bg-slate-900"
      ),
  },
  rows: {
    key: "rows",
    icon: "EqualsIcon",
    label: "Rows",
    defaultName: "RowBlock",
    factory: ({ name, rows = 3 }) =>
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
    icon: "PauseIcon",
    label: "Columns",
    defaultName: "ColumnBlock",
    factory: ({ name, columns = 2 }) => {
      const safeColumns = Math.min(Math.max(columns, 1), 4);
      return wrapWithContainer(
        name,
        [
          t.tagTemplate({
            tag: "div",
            props: {
              className: createLiteral(
                columnClassMap[safeColumns] ?? columnClassMap[2]
              ),
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
  grid: {
    key: "grid",
    icon: "Squares2X2Icon",
    label: "Grid",
    defaultName: "GridBlock",
    factory: ({ name, items = 6, columns = 3 }) => {
      const safeColumns = Math.min(Math.max(columns, 1), 4);
      return wrapWithContainer(
        name,
        [
          t.tagTemplate({
            tag: "div",
            props: {
              className: createLiteral(
                `${columnClassMap[safeColumns]}`
              ),
            },
            children: Array.from({ length: items }).map((_, index) =>
              createPlaceholderBlock(`Item ${index + 1}`)
            ),
          }),
        ],
        "rounded-xl bg-white"
      );
    },
  },
};

export const BASIC_COMPONENT_PALETTE = Object.values(
  BASIC_COMPONENT_LIBRARY
).map(({ key, icon, label }) => ({
  key,
  icon,
  label,
  source: DND_PAYLOAD_SOURCES.BASIC,
}));

export const ensureUniqueComponentName = (baseName, instance) => {
  const sanitized = (baseName ?? "Component").replace(/\s+/g, "");
  const existingNames = new Set(
    instance?.program?.components?.map((component) => component.name) ?? []
  );

  if (!existingNames.has(sanitized)) {
    return sanitized;
  }

  let index = 2;
  let candidate = `${sanitized}${index}`;
  while (existingNames.has(candidate)) {
    index += 1;
    candidate = `${sanitized}${index}`;
  }
  return candidate;
};

export const createComponentFromLibrary = (
  key,
  instance,
  options = Object.create(null)
) => {
  const entry = BASIC_COMPONENT_LIBRARY[key];
  if (!entry) {
    console.warn(`[reka] Unknown component key "${key}".`);
    return null;
  }

  const name = ensureUniqueComponentName(
    options?.name ?? entry.defaultName,
    instance
  );

  return entry.factory({
    name,
    ...options,
  });
};

export const createComponentFromDragPayload = (payload, instance) => {
  if (!payload) {
    return null;
  }

  switch (payload.source) {
    case DND_PAYLOAD_SOURCES.BASIC:
      return createComponentFromLibrary(payload.key, instance, payload.options);
    case DND_PAYLOAD_SOURCES.COMPONENT: {
      if (payload.component) {
        const clone = t.clone(payload.component, {
          replaceExistingId: true,
        });
        clone.name = ensureUniqueComponentName(
          payload.component.name,
          instance
        );
        return clone;
      }

      const schema =
        payload.schema && payload.schema.program
          ? payload.schema
          : payload.schema
          ? t.Schema.fromJSON(payload.schema)
          : payload.program
          ? t.Schema.fromJSON(payload.program)
          : null;

      const component =
        payload.componentJSON && payload.componentJSON.program
          ? t.Schema.fromJSON(payload.componentJSON).program.components?.[0]
          : schema?.program?.components?.[0];

      if (!component) {
        console.warn("[reka] Invalid component payload provided.");
        return null;
      }

      const clone = t.clone(component, {
        replaceExistingId: true,
      });
      clone.name = ensureUniqueComponentName(component.name, instance);
      return clone;
    }
    default:
      console.warn(`[reka] Unsupported drag source "${payload.source}".`);
      return null;
  }
};

const createRekaInstance = () =>
  Reka.create({
    kinds: {
      Color: {
        validate(field) {
          return field.string((value) => value.startsWith("#"));
        },
      },
    },
    externals: {
      components: [
        t.externalComponent({
          name: "Icon",
          props: [
            t.componentProp({
              name: "name",
            }),
          ],
          render: (props) =>
            h(Icon, {
              name: props.name,
              className: props.className,
            }),
        }),
      ],
      states: [
        t.externalState({
          name: "scrollTop",
          init: 0,
        }),
        t.externalState({
          name: "dragPayload",
          init: null,
        }),
        t.externalState({
          name: "dropTarget",
          init: null,
        }),
        t.externalState({
          name: "myString",
          init: "Hello from External Variable",
        }),
        t.externalState({
          name: "currentPath",
          init: INITIAL_LOCATION.path,
        }),
        t.externalState({
          name: "currentHost",
          init: INITIAL_LOCATION.host,
        }),
        t.externalState({
          name: "currentSearch",
          init: INITIAL_LOCATION.search,
        }),
        t.externalState({
          name: "products",
          init: [
            {
              name: "Interesting Product",
              image: "/images/pawel-olek-1.png",
              description:
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
            },
            {
              name: "Hello World",
              image: "/images/pawel-olek-2.png",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
        }),
      ],
      functions: (self) => [
        t.externalFunc({
          name: "confetti",
          func: () => {
            confetti();
          },
        }),
        t.externalFunc({
          name: "getScrollTop",
          func: () => self.getExternalState("scrollTop"),
        }),
        t.externalFunc({
          name: "setDragPayload",
          func: (payload) => {
            self.updateExternalState("dragPayload", payload ?? null);
          },
        }),
        t.externalFunc({
          name: "setDropTarget",
          func: (target) => {
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
          name: "createComponentFromPayload",
          func: (payload) =>
            createComponentFromDragPayload(payload, self) ?? null,
        }),
        t.externalFunc({
          name: "getProducts",
          func: () => {
            return self.getExternalState("products") ?? [];
          },
        }),
        t.externalFunc({
          name: "createStoreOrder",
          func: async (siteId, customer, products) => {
            try {
              const result = await createOrder(siteId, customer, products);
              if (result?.status === "success") {
                location.replace(
                  `${location.href}success/?message=${encodeURIComponent(
                    result.message ?? "Order created"
                  )}`
                );
                return result;
              }

              location.replace(
                `${location.href}error/?message=${encodeURIComponent(
                  result?.message ?? "Unable to create order"
                )}`
              );
              return result;
            } catch (error) {
              console.error("Failed to create order", error);
              location.replace(
                `${location.href}error/?message=${encodeURIComponent(
                  "Unexpected error"
                )}`
              );
              return {
                status: "error",
                message: "Unexpected error",
              };
            }
          },
        }),
        t.externalFunc({
          name: "createStoreOrderPayment",
          func: async (
            siteId,
            gatewayId,
            domain,
            customer,
            products,
            total
          ) => {
            try {
              const result = await createPayment(
                siteId,
                gatewayId,
                domain,
                customer,
                products,
                total
              );
              if (result?.status === "success") {
                location.replace(result.message);
                return result;
              }

              location.replace(result?.message ?? location.href);
              return result;
            } catch (error) {
              console.error("Failed to create payment", error);
              location.replace(location.href);
              return {
                status: "error",
                message: "Unexpected error",
              };
            }
          },
        }),
        t.externalFunc({
          name: "parseInt",
          func: (number) => {
            const parsed = parseInt(number, 10);
            return Number.isNaN(parsed) ? 0 : parsed;
          },
        }),
        t.externalFunc({
          name: "validatePhone",
          func: (number) => {
            const phone = number?.toString() ?? "";
            const defaultCountryCode = "BD";

            try {
              const parsedPhoneNumber = parsePhoneNumber(
                phone,
                defaultCountryCode
              );

              if (!parsedPhoneNumber?.isValid?.()) {
                console.warn("Invalid phone number");
                return 0;
              }

              const numeric = parseInt(parsedPhoneNumber.number, 10);
              return Number.isNaN(numeric) ? 0 : numeric;
            } catch (error) {
              console.warn("Unable to parse phone number", error);
              return 0;
            }
          },
        }),
      ],
    },
    extensions: [],
  });

const setupBrowserBridges = (instance) => {
  if (!isClient || !instance) {
    return () => {};
  }

  const destroyers = [];
  const pendingExternals = new Map();

  const updateExternal = (key, value) => {
    if (!instance?.loaded || !instance?.observer) {
      pendingExternals.set(key, value);
      return;
    }

    try {
      instance.updateExternalState(key, value);
    } catch (error) {
      console.warn(`[reka] Unable to update external state "${key}"`, error);
      pendingExternals.set(key, value);
    }
  };

  const flushPendingExternals = () => {
    if (!instance?.loaded || !instance?.observer || pendingExternals.size === 0) {
      return;
    }

    const entries = Array.from(pendingExternals.entries());
    pendingExternals.clear();

    for (const [key, value] of entries) {
      updateExternal(key, value);
    }
  };

  const rafThrottle = (fn) => {
    let frame = null;
    return (...args) => {
      if (frame) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = null;
        fn(...args);
      });
    };
  };

  const syncScroll = rafThrottle(() => {
    updateExternal(
      "scrollTop",
      window.scrollY ?? window.pageYOffset ?? 0
    );
  });

  const syncLocation = () => {
    updateExternal("currentPath", window.location.pathname);
    updateExternal("currentHost", window.location.hostname);
    updateExternal("currentSearch", window.location.search);
  };

  syncScroll();
  syncLocation();

  const originalLoad = instance.load?.bind(instance);
  if (originalLoad) {
    instance.load = (...args) => {
      const result = originalLoad(...args);
      flushPendingExternals();
      syncScroll();
      syncLocation();
      return result;
    };

    destroyers.push(() => {
      if (originalLoad) {
        instance.load = originalLoad;
      }
    });
  }

  window.addEventListener("scroll", syncScroll, { passive: true });
  destroyers.push(() => window.removeEventListener("scroll", syncScroll));

  window.addEventListener("popstate", syncLocation);
  window.addEventListener("hashchange", syncLocation);

  destroyers.push(() => window.removeEventListener("popstate", syncLocation));
  destroyers.push(() => window.removeEventListener("hashchange", syncLocation));

  const historyMethods = ["pushState", "replaceState"];
  historyMethods.forEach((method) => {
    const original = window.history[method];
    window.history[method] = function patchedHistoryMethod(...args) {
      const result = original.apply(this, args);
      syncLocation();
      return result;
    };
    destroyers.push(() => {
      window.history[method] = original;
    });
  });

  return () => {
    destroyers.forEach((destroy) => destroy && destroy());
  };
};

const reka = ref(createRekaInstance());

let teardown = null;
if (isClient) {
  teardown = setupBrowserBridges(reka.value);
  window.addEventListener("beforeunload", () => {
    teardown && teardown();
  });
}

export default reka;
