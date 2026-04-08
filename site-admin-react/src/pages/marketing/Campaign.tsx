import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_CAMPAIGNS } from "@/graphql/queries/marketing";
import {
  SELF_STORE_CAMPAIGN_CREATE,
  SELF_STORE_CAMPAIGN_UPDATE,
  SELF_STORE_CAMPAIGN_DELETE
} from "@/graphql/mutations/marketing";
import { useSiteStore } from "@/store/useSiteStore";
import { useAuthStore } from "@/store/useAuthStore";
import ActionDrawer from "@/components/ActionDrawer";
import FilePondUploader from "@/components/FilePondUploader";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

const defaultEndAt = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 16);
};

export default function Campaign() {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;

  const variables = useMemo(
    () => ({
      siteId: siteId ? [siteId] : [],
      first: 15
    }),
    [siteId]
  );

  const { data, loading, refetch } = useQuery(STORE_CAMPAIGNS, {
    variables,
    skip: !siteId
  });

  const [createCampaign, { loading: creating }] = useMutation(SELF_STORE_CAMPAIGN_CREATE);
  const [updateCampaign, { loading: updating }] = useMutation(SELF_STORE_CAMPAIGN_UPDATE);
  const [deleteCampaign, { loading: deleting }] = useMutation(SELF_STORE_CAMPAIGN_DELETE);

  const rows = data?.storeCampaigns?.edges?.map((edge: any) => edge.node) ?? [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: "",
    translation: "",
    description: "",
    queryType: "default",
    priority: 0,
    priorityHome: 0,
    isActive: true,
    isHome: false,
    isPrivate: false,
    endAt: defaultEndAt(),
    image: null as File | null,
    cover: null as File | null
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      translation: "",
      description: "",
      queryType: "default",
      priority: 0,
      priorityHome: 0,
      isActive: true,
      isHome: false,
      isPrivate: false,
      endAt: defaultEndAt(),
      image: null,
      cover: null
    });
    setDrawerOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      title: row.title ?? "",
      translation: row.translation ?? "",
      description: row.description ?? "",
      queryType: row.queryType ?? "default",
      priority: row.priority ?? 0,
      priorityHome: row.priorityHome ?? 0,
      isActive: Boolean(row.isActive),
      isHome: Boolean(row.isHome),
      isPrivate: Boolean(row.isPrivate),
      endAt: defaultEndAt(),
      image: null,
      cover: null
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async () => {
    if (!user?.id || !siteId) return;
    if (!form.title.trim()) return;

    if (editing) {
      await updateCampaign({
        variables: {
          userId: user.id,
          siteId,
          id: editing.id,
          cover: form.cover ?? undefined,
          description: form.description || undefined,
          endAt: form.endAt || undefined,
          image: form.image ?? undefined,
          isActive: form.isActive,
          isHome: form.isHome,
          isPrivate: form.isPrivate,
          priority: Number(form.priority) || 0,
          priorityHome: Number(form.priorityHome) || 0,
          queryType: form.queryType,
          title: form.title,
          translation: form.translation || form.title
        }
      });
    } else {
      if (!form.image) return;
      await createCampaign({
        variables: {
          userId: user.id,
          siteId,
          description: form.description || "-",
          cover: form.cover ?? undefined,
          endAt: form.endAt,
          image: form.image,
          isActive: form.isActive,
          isHome: form.isHome,
          isPrivate: form.isPrivate,
          priority: Number(form.priority) || 0,
          priorityHome: Number(form.priorityHome) || 0,
          queryType: form.queryType,
          title: form.title,
          translation: form.translation || form.title
        }
      });
    }

    await refetch();
    setDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (!editing || !user?.id || !siteId) return;
    if (!window.confirm("Delete this campaign?")) return;
    await deleteCampaign({ variables: { userId: user.id, siteId, id: editing.id } });
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
              Campaign
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Campaign list and status.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            Add Campaign
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
        title={editing ? `Campaign - ${editing.title ?? "Edit"}` : "Create Campaign"}
        subtitle="This information will be displayed publicly so be careful what you share."
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
              {editing ? "Save Changes" : "Create Campaign"}
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
            Translation
            <input
              value={form.translation}
              onChange={(event) => setForm((prev) => ({ ...prev, translation: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Query Type
            <input
              value={form.queryType}
              onChange={(event) => setForm((prev) => ({ ...prev, queryType: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            End Date
            <input
              type="datetime-local"
              value={form.endAt}
              onChange={(event) => setForm((prev) => ({ ...prev, endAt: event.target.value }))}
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
            Home Priority
            <input
              type="number"
              value={form.priorityHome}
              onChange={(event) => setForm((prev) => ({ ...prev, priorityHome: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <label className="text-sm font-medium text-gray-700">
          Description
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            rows={3}
          />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Image
            <div className="mt-1">
              <FilePondUploader
                accepted="image/*"
                onAdded={(file) => setForm((prev) => ({ ...prev, image: file }))}
                onRemove={() => setForm((prev) => ({ ...prev, image: null }))}
              />
            </div>
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              checked={form.isHome}
              onChange={(event) => setForm((prev) => ({ ...prev, isHome: event.target.checked }))}
            />
            Home
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={(event) => setForm((prev) => ({ ...prev, isPrivate: event.target.checked }))}
            />
            Private
          </label>
        </div>
        {!form.image && !editing ? (
          <p className="text-xs text-amber-600">Campaign image is required for create.</p>
        ) : null}
      </ActionDrawer>
    </div>
  );
}
