import React from "react";
import { toJS } from "mobx";
import * as t from "@rekajs/types";

function normalizeProps(raw: Record<string, any> | null | undefined) {
  const normalizedRaw = raw ? (toJS(raw) as Record<string, any>) : null;
  const props: Record<string, any> = {};
  if (!normalizedRaw) return props;

  for (const [key, value] of Object.entries(normalizedRaw)) {
    if (value === undefined) continue;
    if (key === "class") {
      props.className = String(value);
      continue;
    }
    if (key === "className") {
      props.className = String(value);
      continue;
    }
    if (key === "for") {
      props.htmlFor = String(value);
      continue;
    }
    props[key] = value;
  }

  return props;
}

export default function RenderView({ view }: { view: t.View }) {
  if (!view) return null;

  if (view instanceof t.TagView) {
    const tag = view.tag;
    const props = normalizeProps(view.props);
    const children = (view.children ?? []).map((child) => (
      <RenderView key={(child as any)?.id ?? undefined} view={child} />
    ));

    if (tag === "text") {
      const value = (toJS(view.props) as any)?.value;
      return <>{value == null ? "" : String(value)}</>;
    }

    return React.createElement(tag, { ...props }, children.length ? children : undefined);
  }

  if (view instanceof t.RekaComponentView) {
    return (
      <>
        {view.render.map((child) => (
          <RenderView key={(child as any)?.id ?? undefined} view={child} />
        ))}
      </>
    );
  }

  if (view instanceof t.ExternalComponentView) {
    try {
      // External component render functions are provided by the host app (this admin).
      // In our setup, they return React elements.
      return (view.component as any)?.render?.(toJS(view.props)) ?? null;
    } catch (err) {
      return (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          External component render error: {(err as Error).message}
        </div>
      );
    }
  }

  if (view instanceof t.FrameView || view instanceof t.SlotView || view instanceof t.FragmentView || view instanceof t.EachSystemView) {
    const children = (view.children ?? []).map((child) => (
      <RenderView key={(child as any)?.id ?? undefined} view={child} />
    ));
    return <>{children}</>;
  }

  if (view instanceof t.ErrorSystemView) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        {String(view.error ?? "Something went wrong.")}
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white p-3 text-xs text-slate-500">
      Unsupported view type: {(view as any)?.type ?? "unknown"}
    </div>
  );
}
