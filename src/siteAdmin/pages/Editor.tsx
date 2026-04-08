import { useCallback, useEffect, useMemo, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RekaProvider, useReka } from "@rekajs/react";
import * as t from "@rekajs/types";
import { SITE_SCHEMA_DETAILS } from "@/graphql/queries/site";
import { SELF_SITE_UPDATE } from "@/graphql/mutations/siteUpdate";
import {
  SITE_COMPONENT,
  SITE_COMPONENT_CATEGORIES,
  SITE_COMPONENTS
} from "@/graphql/queries/siteComponents";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";
import { createRekaInstance } from "@/siteAdmin/editor/rekaInstance";
import RenderView from "@/siteAdmin/editor/render/RenderView";
import DndDrop from "@/siteAdmin/editor/dnd/DndDrop";
import { type DragItem } from "@/siteAdmin/editor/dnd/types";
import DndDbComponentTile from "@/siteAdmin/editor/dnd/DndDbComponentTile";
import DndBasicTile from "@/siteAdmin/editor/dnd/DndBasicTile";
import {
  BASIC_COMPONENT_LIBRARY,
  DND_PAYLOAD_SOURCES,
  createBasicComponent,
  createComponentFromSchemaJson,
  insertComponentIntoProgram,
  moveTopLevelComponent,
  removeComponentFromProgram,
  type DropMeta
} from "@/siteAdmin/editor/rekaBlocks";

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function RekaPreview({ frameId }: { frameId: string }) {
  const { view } = useReka(
    (reka) => ({
      view: reka.getFrame(frameId)?.view ?? null
    }),
    [frameId]
  );

  if (!view) {
    return (
      <div className="rounded-md border bg-white p-4 text-sm text-slate-500">
        No frame view yet.
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <RenderView view={view as unknown as t.View} />
    </div>
  );
}

function AppCanvas({
  onDropItem,
  onRemoveComponent,
  onMoveComponent,
}: {
  onDropItem: (item: DragItem, dropMeta: DropMeta) => void;
  onRemoveComponent: (componentId: string) => void;
  onMoveComponent: (componentId: string, direction: "up" | "down") => void;
}) {
  const { ready, app, program } = useReka((reka) => {
    // `reka.program` throws until a schema has been loaded (because `reka.state` is undefined).
    // Always read through `reka.state` here so the editor can render a loading UI safely.
    const components = (reka.state?.program?.components ?? []) as any[];
    const appComponent = components.find((c) => c.name === "App") ?? null;
    return { ready: Boolean(reka.state?.program), app: appComponent, program: components };
  }, []);

  if (!ready) {
    return (
      <div className="rounded-md border bg-white p-4 text-sm text-slate-600">
        Loading schema...
      </div>
    );
  }

  const children = (app?.template?.children ?? []) as any[];

  const childEntries = children
    .map((child: any) => {
      const name = child?.component?.name ?? null;
      const component = name ? program.find((c: any) => c.name === name) : null;
      return component ? { name, component } : null;
    })
    .filter(Boolean) as { name: string; component: any }[];

  if (!app) {
    return (
      <div className="rounded-md border bg-white p-4 text-sm text-rose-600">
        App component not found in schema.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {childEntries.length === 0 ? (
        <DndDrop
          dropMeta={{ targetId: null, position: "down" }}
          label="Drop components here"
          onDropped={onDropItem}
        />
      ) : null}

      {childEntries.map((entry, index) => {
        const component = entry.component;
        const id = String(component.id);
        const title = String(component.meta?.title ?? component.name);
        const thumb = component.meta?.thumbnail ?? null;
        return (
          <div key={id} className="space-y-3">
            {index === 0 ? (
              <DndDrop
                dropMeta={{ targetId: id, position: "up" }}
                label="Drop above"
                onDropped={onDropItem}
              />
            ) : null}

            <div className="rounded-lg border bg-white p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-md border bg-slate-100">
                    {thumb ? (
                      <img
                        src={String(thumb)}
                        className="h-full w-full object-cover"
                        alt=""
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {title}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {component.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onMoveComponent(id, "up")}
                    className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveComponent(id, "down")}
                    className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveComponent(id)}
                    className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <DndDrop
              dropMeta={{ targetId: id, position: "down" }}
              label="Drop below"
              onDropped={onDropItem}
            />
          </div>
        );
      })}
    </div>
  );
}

function UndoRedoButtons() {
  const { ready, canUndo, canRedo, reka } = useReka(
    (r) => {
      // `canUndo/canRedo/undo/redo` depend on the HistoryManager, which is created on `reka.load(...)`.
      const ready = Boolean(r.state?.program);
      return {
        reka: r,
        ready,
        canUndo: ready ? r.canUndo() : false,
        canRedo: ready ? r.canRedo() : false,
      };
    },
    []
  );

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => (ready ? reka.undo() : null)}
        disabled={!ready || !canUndo}
        className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => (ready ? reka.redo() : null)}
        disabled={!ready || !canRedo}
        className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
      >
        Redo
      </button>
    </div>
  );
}

export default function Editor() {
  const user = useAuthStore((s) => s.user);
  const siteId = useSiteAdminStore((s) => s.siteId);
  const addToast = useToastStore((s) => s.addToast);
  const apollo = useApolloClient();
  const reka = useMemo(() => createRekaInstance(), []);

  const { data, loading, error, refetch } = useQuery(SITE_SCHEMA_DETAILS, {
    variables: { id: siteId ?? 0 },
    fetchPolicy: "network-only",
    skip: !siteId
  });

  const site = data?.siteById ?? null;

  const [tab, setTab] = useState<"builder" | "schema" | "site">("builder");
  const [schemaText, setSchemaText] = useState<string>("{}");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [deviceType, setDeviceType] = useState<"max-w-full" | "max-w-lg" | "max-w-md">("max-w-full");

  useEffect(() => {
    if (!site) return;
    setSchemaText(safeJsonStringify(site.schema));
  }, [site?.id]);

  // Load schema into Reka once site schema is available.
  useEffect(() => {
    if (!site?.schema) return;
    try {
      // Deep clone to avoid mutating Apollo cache objects via mobx.
      const cloned = JSON.parse(JSON.stringify(site.schema));
      reka.load(t.Schema.fromJSON(cloned) as any);

      // Ensure frames exist for all program components.
      const programComponents = (reka.state?.program?.components ?? []) as any[];
      for (const c of programComponents) {
        try {
          if (!reka.getFrame(c.name)) {
            reka.createFrame({ id: c.name, name: c.name, component: c } as any);
          }
        } catch {
          // ignore duplicate frame ids
        }
      }

      // Always ensure App frame exists and is first choice.
      const app = programComponents.find((c) => c.name === "App") ?? null;
      if (app && !reka.getFrame("App")) {
        reka.createFrame({ id: "App", name: "App", component: app } as any);
      }
    } catch (e) {
      addToast({
        kind: "error",
        title: "Editor",
        subTitle: `Schema load failed: ${(e as Error).message}`
      });
    }
  }, [site?.id]);

  const previewUrl = useMemo(() => {
    if (!site?.domain) return null;
    return `https://${String(site.domain)}/?adminPreview=1&t=${Date.now()}`;
  }, [site?.domain, site?.version]);

  const studioState = useMemo(
    () => ({
      siteId,
      title: site?.title ?? null,
      schema: reka.state?.program ? reka.toJSON() : site?.schema ?? null,
    }),
    [reka, site?.schema, site?.title, siteId]
  );

  const categoriesQuery = useQuery(SITE_COMPONENT_CATEGORIES, {
    variables: { first: 4096, after: null },
    fetchPolicy: "network-only"
  });
  const componentsQuery = useQuery(SITE_COMPONENTS, {
    variables: { first: 4096, after: null },
    fetchPolicy: "network-only"
  });

  const categories: any[] = useMemo(() => {
    const edges = categoriesQuery.data?.siteComponentCategories?.edges ?? [];
    return edges.map((e: any) => e.node).filter(Boolean).sort((a: any, b: any) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [categoriesQuery.data]);

  const dbComponents: any[] = useMemo(() => {
    const edges = componentsQuery.data?.siteComponents?.edges ?? [];
    return edges.map((e: any) => e.node).filter(Boolean).sort((a: any, b: any) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [componentsQuery.data]);

  useEffect(() => {
    if (selectedCategoryId != null) return;
    if (categories.length) setSelectedCategoryId(Number(categories[0].id));
  }, [categories.length, selectedCategoryId]);

  const filteredDbComponents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return dbComponents.filter((c) => {
      if (selectedCategoryId != null && Number(c.categoryId) !== Number(selectedCategoryId)) return false;
      if (!term) return true;
      return String(c.title ?? "").toLowerCase().includes(term) || String(c.slug ?? "").toLowerCase().includes(term);
    });
  }, [dbComponents, search, selectedCategoryId]);

  const [updateSite, updateState] = useMutation(SELF_SITE_UPDATE, {
    onCompleted: () =>
      addToast({ kind: "success", title: "Editor", subTitle: "Saved." }),
    onError: (err) =>
      addToast({ kind: "error", title: "Editor", subTitle: err.message })
  });

  const saving = updateState.loading;

  const handleSave = async () => {
    if (!user?.id) return;
    if (!siteId) return;
    await updateSite({
      variables: {
        userId: user.id,
        siteId,
        schema: reka.toJSON()
      }
    });
    await refetch();
  };

  const handleApplySchemaText = async () => {
    if (!siteId) return;
    const parsed = safeJsonParse(schemaText);
    if (parsed === null) {
      addToast({ kind: "error", title: "Schema", subTitle: "Invalid JSON." });
      return;
    }
    try {
      reka.load(t.Schema.fromJSON(parsed as any) as any);
      addToast({ kind: "success", title: "Editor", subTitle: "Schema applied to builder." });
    } catch (e) {
      addToast({
        kind: "error",
        title: "Editor",
        subTitle: `Apply failed: ${(e as Error).message}`
      });
    }
  };

  const handleDropItem = useCallback(
    async (item: DragItem, dropMeta: DropMeta) => {
      const payload = item.payload;
      try {
        if (payload.source === DND_PAYLOAD_SOURCES.BASIC) {
          const comp = createBasicComponent(payload.key, reka);
          insertComponentIntoProgram(reka, comp, dropMeta);
          if (!reka.getFrame(comp.name)) {
            try {
              reka.createFrame({ id: comp.name, name: comp.name, component: comp } as any);
            } catch {}
          }
          return;
        }

        // COMPONENT: fetch componentData and convert into a Reka component.
        const res = await apollo.query({
          query: SITE_COMPONENT,
          variables: { id: payload.id },
          fetchPolicy: "network-only"
        });
        const siteComponent = res.data?.siteComponent;
        if (!siteComponent) {
          addToast({ kind: "error", title: "Component", subTitle: "Component not found." });
          return;
        }

        const comp =
          createComponentFromSchemaJson(siteComponent.componentData, reka) ??
          createComponentFromSchemaJson(siteComponent.component, reka) ??
          createComponentFromSchemaJson(siteComponent, reka);
        if (!comp) {
          addToast({ kind: "error", title: "Component", subTitle: "Invalid component schema." });
          return;
        }
        insertComponentIntoProgram(reka, comp, dropMeta);
        if (!reka.getFrame(comp.name)) {
          try {
            reka.createFrame({ id: comp.name, name: comp.name, component: comp } as any);
          } catch {}
        }
      } catch (e) {
        addToast({
          kind: "error",
          title: "Editor",
          subTitle: `Drop failed: ${(e as Error).message}`
        });
      }
    },
    [apollo, addToast, reka]
  );

  const handleRemoveComponent = useCallback(
    (componentId: string) => {
      removeComponentFromProgram(reka, componentId);
    },
    [reka]
  );

  const handleMoveComponent = useCallback(
    (componentId: string, direction: "up" | "down") => {
      moveTopLevelComponent(reka, componentId, direction);
    },
    [reka]
  );

  if (!siteId) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">Select site first</h2>
        <p className="mt-2 text-sm text-slate-500">
          Go to{" "}
          <Link to="/site/" className="text-brand-600 underline">
            Site
          </Link>{" "}
          and select a site.
        </p>
      </div>
    );
  }

  return (
    <main className="px-4 pb-16 pt-0">
      <RekaProvider reka={reka}>
        <DndProvider backend={HTML5Backend}>
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Editor</h1>
              <p className="mt-2 text-sm text-slate-600">
                Visual builder (React port) using Reka schema. Drag components from the left and drop into the canvas.
              </p>
            </div>

            {error ? (
              <div className="rounded-md border bg-white p-4 text-sm text-rose-600">
                {String(error.message)}
              </div>
            ) : null}

            <div className="rounded-lg border bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {site?.title ? `${site.title} (#${site.id})` : `Site #${siteId}`}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {site?.domain ? `Domain: ${site.domain}` : ""}
                  </div>
	                </div>
	                <div className="flex items-center gap-2">
	                  <UndoRedoButtons />
	                  <Link
	                    to={`/studio/${siteId ? `?siteId=${siteId}` : ""}`}
                      state={studioState}
                      onClick={() => {
                        try {
                          window.sessionStorage.setItem(
                            "site-admin-react-studio-entry",
                            safeJsonStringify(studioState)
                          );
                        } catch {
                          // ignore sessionStorage failures
                        }
                      }}
	                    className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
	                  >
	                    Studio
	                  </Link>
	                  <button
	                    type="button"
	                    onClick={() => {
	                      setSchemaText(safeJsonStringify(reka.toJSON()));
                      refetch();
                    }}
                    disabled={loading}
                    className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Refresh
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setTab("builder")}
                  className={[
                    "rounded-md px-3 py-1.5 text-sm font-medium border",
                    tab === "builder"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  ].join(" ")}
                >
                  Builder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSchemaText(safeJsonStringify(reka.toJSON()));
                    setTab("schema");
                  }}
                  className={[
                    "rounded-md px-3 py-1.5 text-sm font-medium border",
                    tab === "schema"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  ].join(" ")}
                >
                  Schema JSON
                </button>
                <button
                  type="button"
                  onClick={() => setTab("site")}
                  className={[
                    "rounded-md px-3 py-1.5 text-sm font-medium border",
                    tab === "site"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  ].join(" ")}
                >
                  Site Preview
                </button>
              </div>

              {tab === "builder" ? (
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
                  <aside className="rounded-lg border bg-white p-4 space-y-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Quick Blocks
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {Object.values(BASIC_COMPONENT_LIBRARY).map((b) => (
                          <DndBasicTile
                            key={b.key}
                            blockKey={b.key}
                            label={b.label}
                            onClickAdd={() =>
                              handleDropItem(
                                { payload: { source: DND_PAYLOAD_SOURCES.BASIC, key: b.key } } as any,
                                { targetId: null, position: "down" }
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Components
                      </div>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search components..."
                        className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {categories.slice(0, 12).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCategoryId(Number(c.id))}
                            className={[
                              "rounded-md border px-2 py-1 text-xs",
                              selectedCategoryId === Number(c.id)
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            ].join(" ")}
                            title={c.title}
                          >
                            {String(c.title)}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        {filteredDbComponents.slice(0, 60).map((c) => (
                          <DndDbComponentTile
                            key={c.id}
                            id={Number(c.id)}
                            title={String(c.title ?? "")}
                            image={c.image ?? null}
                            onClickAdd={() =>
                              handleDropItem(
                                {
                                  payload: {
                                    source: DND_PAYLOAD_SOURCES.COMPONENT,
                                    id: Number(c.id),
                                    title: String(c.title ?? "")
                                  }
                                } as any,
                                { targetId: null, position: "down" }
                              )
                            }
                          />
                        ))}
                        {filteredDbComponents.length === 0 ? (
                          <div className="text-sm text-slate-500">No components.</div>
                        ) : null}
                      </div>
                      <div className="mt-3 text-[11px] text-slate-400">
                        Showing {Math.min(filteredDbComponents.length, 60)} of {filteredDbComponents.length}.
                      </div>
                    </div>
                  </aside>

                  <section className="space-y-4">
                    <div className="rounded-lg border bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">Canvas</div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDeviceType("max-w-full")}
                            className={[
                              "rounded-md border px-2 py-1 text-xs",
                              deviceType === "max-w-full"
                                ? "bg-blue-100 border-blue-200"
                                : "bg-white border-slate-200 hover:bg-slate-50"
                            ].join(" ")}
                          >
                            Desktop
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeviceType("max-w-lg")}
                            className={[
                              "rounded-md border px-2 py-1 text-xs",
                              deviceType === "max-w-lg"
                                ? "bg-blue-100 border-blue-200"
                                : "bg-white border-slate-200 hover:bg-slate-50"
                            ].join(" ")}
                          >
                            Tablet
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeviceType("max-w-md")}
                            className={[
                              "rounded-md border px-2 py-1 text-xs",
                              deviceType === "max-w-md"
                                ? "bg-blue-100 border-blue-200"
                                : "bg-white border-slate-200 hover:bg-slate-50"
                            ].join(" ")}
                          >
                            Mobile
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 rounded-md border bg-slate-50 p-3 text-sm text-slate-700">
                        Drop order (top-level App children)
                      </div>
                      <div className="mt-4">
                        <AppCanvas
                          onDropItem={handleDropItem}
                          onRemoveComponent={handleRemoveComponent}
                          onMoveComponent={handleMoveComponent}
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">Reka Preview</div>
                        {site?.domain ? (
                          <a
                            href={`https://${String(site.domain)}/`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-brand-600 hover:underline"
                          >
                            Open site
                          </a>
                        ) : null}
                      </div>
                      <div className="mt-4 w-full overflow-auto rounded-md border bg-slate-100 p-4">
                        <div className={["mx-auto bg-white rounded-md border p-4", deviceType].join(" ")}>
                          <RekaPreview frameId="App" />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}

              {tab === "schema" ? (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSchemaText(safeJsonStringify(reka.toJSON()))}
                      className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Load from Builder
                    </button>
                    <button
                      type="button"
                      onClick={handleApplySchemaText}
                      className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Apply to Builder
                    </button>
                  </div>
                  <textarea
                    value={schemaText}
                    onChange={(e) => setSchemaText(e.target.value)}
                    className="w-full min-h-[70vh] rounded-md border px-3 py-2 font-mono text-xs"
                    spellCheck={false}
                  />
                </div>
              ) : null}

              {tab === "site" ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-md border bg-slate-50 p-3 text-sm text-slate-700">
                    Preview URL:{" "}
                    {previewUrl ? (
                      <a
                        className="text-brand-600 underline break-all"
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {previewUrl}
                      </a>
                    ) : (
                      <span className="text-slate-500">No domain</span>
                    )}
                  </div>

                  <div className="rounded-md border bg-white p-3">
                    <div className="text-xs font-semibold text-slate-700">
                      Embedded preview (may be blocked by site headers)
                    </div>
                    {previewUrl ? (
                      <iframe
                        title="Site preview"
                        src={previewUrl}
                        className="mt-3 h-[70vh] w-full rounded-md border"
                      />
                    ) : (
                      <div className="mt-2 text-sm text-slate-500">No preview.</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </DndProvider>
      </RekaProvider>
    </main>
  );
}
