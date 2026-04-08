import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_FEATURES } from "@/graphql/queries/marketing";
import {
  SELF_STORE_FEATURE_CREATE,
  SELF_STORE_FEATURE_UPDATE,
  SELF_STORE_FEATURE_DELETE
} from "@/graphql/mutations/marketing";
import { useAuthStore } from "@/store/useAuthStore";
import ActionDrawer from "@/components/ActionDrawer";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function Feature() {
  const user = useAuthStore((state) => state.user);

  const variables = useMemo(
    () => ({
      first: 15
    }),
    []
  );

  const { data, loading, refetch } = useQuery(STORE_FEATURES, {
    variables
  });

  const [createFeature, { loading: creating }] = useMutation(SELF_STORE_FEATURE_CREATE);
  const [updateFeature, { loading: updating }] = useMutation(SELF_STORE_FEATURE_UPDATE);
  const [deleteFeature, { loading: deleting }] = useMutation(SELF_STORE_FEATURE_DELETE);

  const rows = data?.storeFeatures?.edges?.map((edge: any) => edge.node) ?? [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: "",
    keyword: "",
    priority: 0,
    isActive: true,
    feature: "{}"
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      keyword: "",
      priority: 0,
      isActive: true,
      feature: "{}"
    });
    setDrawerOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      title: row.title ?? "",
      keyword: row.keyword ?? "",
      priority: row.priority ?? 0,
      isActive: Boolean(row.isActive),
      feature: row.feature ? JSON.stringify(row.feature, null, 2) : "{}"
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (!form.title.trim()) return;

    let featureJson: Record<string, unknown> = {};
    try {
      featureJson = form.feature ? JSON.parse(form.feature) : {};
    } catch (error) {
      return;
    }

    if (editing) {
      await updateFeature({
        variables: {
          userId: user.id,
          id: editing.id,
          feature: featureJson,
          isActive: form.isActive,
          keyword: form.keyword,
          priority: Number(form.priority) || 0,
          title: form.title
        }
      });
    } else {
      await createFeature({
        variables: {
          userId: user.id,
          feature: featureJson,
          isActive: form.isActive,
          keyword: form.keyword,
          priority: Number(form.priority) || 0,
          title: form.title
        }
      });
    }

    await refetch();
    setDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (!editing || !user?.id) return;
    if (!window.confirm("Delete this feature?")) return;
    await deleteFeature({ variables: { userId: user.id, id: editing.id } });
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
        id: "keyword",
        header: "Keyword",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.keyword
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
              Feature
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Feature list and status.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            Add Feature
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
        title={editing ? `Feature - ${editing.title ?? "Edit"}` : "Create Feature"}
        subtitle="Marketing feature configuration."
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
              {editing ? "Save Changes" : "Create Feature"}
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
            Keyword
            <input
              value={form.keyword}
              onChange={(event) => setForm((prev) => ({ ...prev, keyword: event.target.value }))}
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
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
            />
            Active
          </label>
        </div>
        <label className="text-sm font-medium text-gray-700">
          Feature JSON
          <textarea
            value={form.feature}
            onChange={(event) => setForm((prev) => ({ ...prev, feature: event.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
            rows={6}
          />
        </label>
      </ActionDrawer>
    </div>
  );
}
