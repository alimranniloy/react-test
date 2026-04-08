import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { SITE_SLIDERS } from "@/graphql/queries/marketing";
import {
  SELF_SITE_SLIDER_CREATE,
  SELF_SITE_SLIDER_UPDATE,
  SELF_SITE_SLIDER_DELETE
} from "@/graphql/mutations/marketing";
import { useSiteStore } from "@/store/useSiteStore";
import { useAuthStore } from "@/store/useAuthStore";
import ActionDrawer from "@/components/ActionDrawer";
import FilePondUploader from "@/components/FilePondUploader";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function Slider() {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;

  const variables = useMemo(
    () => ({
      siteId: siteId ? [siteId] : [],
      childId: null,
      isPrivate: null,
      isActive: null
    }),
    [siteId]
  );

  const { data, loading, refetch } = useQuery(SITE_SLIDERS, {
    variables,
    skip: !siteId
  });

  const [createSlider, { loading: creating }] = useMutation(SELF_SITE_SLIDER_CREATE);
  const [updateSlider, { loading: updating }] = useMutation(SELF_SITE_SLIDER_UPDATE);
  const [deleteSlider, { loading: deleting }] = useMutation(SELF_SITE_SLIDER_DELETE);

  const rows = data?.siteSliders?.edges?.map((edge: any) => edge.node) ?? [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: "",
    body: "",
    url: "",
    priority: 0,
    isActive: true,
    isPrivate: false,
    isExternal: false,
    isPhone: false,
    cover: null as File | null
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      body: "",
      url: "",
      priority: 0,
      isActive: true,
      isPrivate: false,
      isExternal: false,
      isPhone: false,
      cover: null
    });
    setDrawerOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      title: row.title ?? "",
      body: row.body ?? "",
      url: row.url ?? "",
      priority: row.priority ?? 0,
      isActive: Boolean(row.isActive),
      isPrivate: Boolean(row.isPrivate),
      isExternal: Boolean(row.isExternal),
      isPhone: Boolean(row.isPhone),
      cover: null
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async () => {
    if (!user?.id || !siteId) return;
    if (!form.title.trim()) return;

    if (editing) {
      await updateSlider({
        variables: {
          userId: user.id,
          id: editing.id,
          title: form.title,
          body: form.body || "-",
          cover: form.cover ?? undefined,
          url: form.url || "",
          isActive: form.isActive,
          isExternal: form.isExternal,
          isPhone: form.isPhone,
          isPrivate: form.isPrivate,
          priority: Number(form.priority) || 0
        }
      });
    } else {
      if (!form.cover) return;
      await createSlider({
        variables: {
          userId: user.id,
          siteId,
          body: form.body || "-",
          cover: form.cover,
          isActive: form.isActive,
          isExternal: form.isExternal,
          isPhone: form.isPhone,
          isPrivate: form.isPrivate,
          priority: Number(form.priority) || 0,
          title: form.title,
          url: form.url || ""
        }
      });
    }

    await refetch();
    setDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (!editing || !user?.id || !siteId) return;
    if (!window.confirm("Delete this slider?")) return;
    await deleteSlider({ variables: { userId: user.id, siteId, id: editing.id } });
    await refetch();
    setDrawerOpen(false);
  };

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => row.title
      },
      {
        id: "priority",
        header: "Priority",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.priority ?? 0
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm",
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
              row.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
        )
      },
      {
        id: "action",
        header: "Action",
        headClassName: "px-4 py-3.5 text-right text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-right text-sm",
        cell: (row) => (
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Slider
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Slider list and status.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            Add Slider
          </button>
        </div>
      </div>

      <DataTable
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
      />

      <ActionDrawer
        open={drawerOpen}
        title={editing ? `Slider - ${editing.title ?? "Edit"}` : "Create Slider"}
        subtitle="Homepage slider settings."
        onClose={() => setDrawerOpen(false)}
        footer={
          <div className="flex items-center justify-between">
            <div>
              {editing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  disabled={deleting}
                >
                  Delete
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
              disabled={creating || updating}
            >
              {editing ? "Save Changes" : "Create Slider"}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Title
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            URL
            <input
              value={form.url}
              onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Priority
            <input
              type="number"
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Cover
            <div className="mt-1">
              <FilePondUploader
                accepted="image/*"
                onAdded={(file) => setForm((prev) => ({ ...prev, cover: file }))}
                onRemove={() => setForm((prev) => ({ ...prev, cover: null }))}
              />
            </div>
          </label>
        </div>
        <label className="text-sm font-medium text-gray-700">
          Body
          <textarea
            value={form.body}
            onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            rows={3}
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={(event) => setForm((prev) => ({ ...prev, isPrivate: event.target.checked }))}
            />
            Private
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isExternal}
              onChange={(event) => setForm((prev) => ({ ...prev, isExternal: event.target.checked }))}
            />
            External
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isPhone}
              onChange={(event) => setForm((prev) => ({ ...prev, isPhone: event.target.checked }))}
            />
            Phone
          </label>
        </div>
        {!form.cover && !editing ? (
          <p className="text-xs text-amber-600">Slider cover image is required for create.</p>
        ) : null}
      </ActionDrawer>
    </div>
  );
}
