import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { HOME_FEEDBACKS } from "@/graphql/queries/homeFeedback";
import {
  SELF_HOME_FEEDBACK_CREATE,
  SELF_HOME_FEEDBACK_DELETE,
  SELF_HOME_FEEDBACK_UPDATE
} from "@/graphql/mutations/homeFeedback";
import { useAuthStore } from "@/store/useAuthStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function OrderFraud() {
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [priority, setPriority] = useState<number | null>(null);
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: "", body: "", name: "", contact: "", source: "store-admin", status: 0, priority: 1 });

  const variables = useMemo(
    () => ({
      userId: user?.id ?? 0,
      search: search.trim() || null,
      status,
      priority,
      first
    }),
    [user?.id, search, status, priority, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(HOME_FEEDBACKS, {
    variables,
    skip: !user?.id
  });

  const [createFeedback, { loading: creating }] = useMutation(SELF_HOME_FEEDBACK_CREATE);
  const [updateFeedback, { loading: updating }] = useMutation(SELF_HOME_FEEDBACK_UPDATE);
  const [deleteFeedback, { loading: deleting }] = useMutation(SELF_HOME_FEEDBACK_DELETE);

  const rows = data?.homeFeedbacks?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.homeFeedbacks?.pageInfo;
  const totalAvailable = data?.homeFeedbacks?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => (
          <>
            <div className="font-medium">{row.title}</div>
            <div className="text-xs text-slate-500 line-clamp-1">{row.body}</div>
          </>
        )
      },
      { id: "contact", header: "Contact", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.contact || "—" },
      { id: "priority", header: "Priority", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.priority },
      {
        id: "updated",
        header: "Updated",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => (row.updatedAt ? dayjs(row.updatedAt).format("h:mm A MMM D") : "—")
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

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", body: "", name: "", contact: "", source: "store-admin", status: 0, priority: 1 });
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      body: item.body || "",
      name: item.name || "",
      contact: item.contact || "",
      source: item.source || "store-admin",
      status: item.status ?? 0,
      priority: item.priority ?? 1
    });
  };

  const handleSave = async () => {
    if (!user?.id || !form.title.trim() || !form.body.trim()) return;
    if (editing) {
      await updateFeedback({
        variables: {
          userId: user.id,
          feedbackId: editing.id,
          ...form,
          image: null
        }
      });
    } else {
      await createFeedback({
        variables: {
          userId: user.id,
          ...form,
          image: null
        }
      });
    }
    await refetch();
    openCreate();
  };

  const handleDelete = async () => {
    if (!user?.id || !editing?.id) return;
    if (!window.confirm("Delete this fraud feedback entry?")) return;
    await deleteFeedback({ variables: { userId: user.id, feedbackId: editing.id } });
    await refetch();
    openCreate();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900">Fraud Check</h1>
        <p className="mt-2 text-sm text-gray-700">Monitor and manage fraud feedback signals.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <select value={status ?? ""} onChange={(event) => setStatus(event.target.value ? Number(event.target.value) : null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">All status</option>
            <option value="0">Open</option>
            <option value="1">In review</option>
            <option value="2">Closed</option>
          </select>
          <select value={priority ?? ""} onChange={(event) => setPriority(event.target.value ? Number(event.target.value) : null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">All priority</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
          <button type="button" onClick={() => refetch()} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">Refresh</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">{editing ? `Edit #${editing.id}` : "Create Fraud Feedback"}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Title" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Name" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={form.contact} onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))} placeholder="Contact" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={form.source} onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))} placeholder="Source" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: Number(event.target.value) }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value={0}>Open</option>
            <option value={1}>In review</option>
            <option value={2}>Closed</option>
          </select>
          <select value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: Number(event.target.value) }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
          <textarea value={form.body} onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))} placeholder="Message" className="min-h-[90px] rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleSave} disabled={creating || updating} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{editing ? "Update" : "Create"}</button>
          <button type="button" onClick={openCreate} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Clear</button>
          {editing ? <button type="button" onClick={handleDelete} disabled={deleting} className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600">Delete</button> : null}
        </div>
      </div>

      <DataTable
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "cursor",
          count: rows.length,
          total: totalAvailable,
          from: rows.length ? 1 : 0,
          to: rows.length,
          hasNext: hasMore,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: rows.length,
                pageSize: first
              })
            }),
          loading,
          pageSize: first,
          pageSizeOptions: [15, 30, 50, 100],
          onPageSizeChange: setFirst,
          nextLabel: "Next"
        }}
      />
    </div>
  );
}
