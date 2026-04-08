import { Reka } from "@rekajs/core";
import * as t from "@rekajs/types";
import React from "react";
import Icon from "@/siteAdmin/editor/Icon";

const isClient = typeof window !== "undefined";

const INITIAL_LOCATION = {
  path: isClient ? window.location.pathname : "/",
  host: isClient ? window.location.hostname : "",
  search: isClient ? window.location.search : "",
};

export function createRekaInstance() {
  return Reka.create({
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
          props: [t.componentProp({ name: "name" })],
          render: (props: any) =>
            React.createElement(Icon, {
              name: props.name,
              className: props.className,
            }),
        }),
      ],
      states: [
        t.externalState({ name: "scrollTop", init: 0 }),
        t.externalState({ name: "dragPayload", init: null }),
        t.externalState({ name: "dropTarget", init: null }),
        t.externalState({ name: "myString", init: "Hello from External Variable" }),
        t.externalState({ name: "currentPath", init: INITIAL_LOCATION.path }),
        t.externalState({ name: "currentHost", init: INITIAL_LOCATION.host }),
        t.externalState({ name: "currentSearch", init: INITIAL_LOCATION.search }),
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
          func: (number: unknown) => {
            const parsed = Number.parseInt(String(number ?? ""), 10);
            return Number.isNaN(parsed) ? 0 : parsed;
          },
        }),
        t.externalFunc({
          name: "validatePhone",
          func: (number: unknown) => {
            const digits = String(number ?? "").replace(/[^\d]/g, "");
            const parsed = Number.parseInt(digits, 10);
            return Number.isNaN(parsed) ? 0 : parsed;
          },
        }),
        // These exist in some schemas; keep them as safe no-ops so preview doesn't crash.
        t.externalFunc({
          name: "createStoreOrder",
          func: async () => ({ status: "error", message: "Not supported in admin preview" }),
        }),
        t.externalFunc({
          name: "createStoreOrderPayment",
          func: async () => ({ status: "error", message: "Not supported in admin preview" }),
        }),
      ],
    },
    extensions: [],
  });
}
