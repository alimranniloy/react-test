import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_SHIPPING_METHODS } from "@/graphql/queries/shipping";
import {
  SELF_STORE_SHIPPING_METHOD_CREATE,
  SELF_STORE_SHIPPING_METHOD_DELETE,
  SELF_STORE_SHIPPING_METHOD_UPDATE
} from "@/graphql/mutations/shipping";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function ShippingZone() {
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [editing, setEditing] = useState<any | null>(null);
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);
  const [form, setForm] = useState({
    title: "",
    note: "",
    currency: site?.currency || "BDT",
    price: "0",
    minimumOrderPrice: "0",
    maximumOrderPrice: "0",
    isActive: true
  });

  const queryVariables = useMemo(
    () => ({ siteId: siteId ?? 0, first }),
    [siteId, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_SHIPPING_METHODS, {
    variables: queryVariables,
    skip: !siteId
  });

  const [createMethod, { loading: creating }] = useMutation(SELF_STORE_SHIPPING_METHOD_CREATE);
  const [updateMethod, { loading: updating }] = useMutation(SELF_STORE_SHIPPING_METHOD_UPDATE);
  const [deleteMethod, { loading: deleting }] = useMutation(SELF_STORE_SHIPPING_METHOD_DELETE);

  const rows = data?.storeShippingMethods?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeShippingMethods?.pageInfo;
  const totalAvailable = data?.storeShippingMethods?.total ?? rows.length;
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
            <div className="text-xs text-slate-500">{row.note || "—"}</div>
          </>
        )
      },
      {
        id: "price",
        header: "Price",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => `${row.price} ${row.currency}`
      },
      {
        id: "minMax",
        header: "Min/Max",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => `${row.minimumOrderPrice ?? 0} - ${row.maximumOrderPrice ?? 0}`
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => (row.isActive ? "Active" : "Inactive")
      },
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

  const parseFloatOrZero = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      note: "",
      currency: site?.currency || "BDT",
      price: "0",
      minimumOrderPrice: "0",
      maximumOrderPrice: "0",
      isActive: true
    });
  };

  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      title: row.title || "",
      note: row.note || "",
      currency: row.currency || site?.currency || "BDT",
      price: String(row.price ?? 0),
      minimumOrderPrice: String(row.minimumOrderPrice ?? 0),
      maximumOrderPrice: String(row.maximumOrderPrice ?? 0),
      isActive: Boolean(row.isActive)
    });
  };

  const handleSave = async () => {
    if (!user?.id || !siteId || !form.title.trim()) return;

    const payload = {
      userId: user.id,
      siteId,
      title: form.title,
      note: form.note,
      currency: form.currency,
      price: parseFloatOrZero(form.price),
      minimumOrderPrice: parseFloatOrZero(form.minimumOrderPrice),
      maximumOrderPrice: parseFloatOrZero(form.maximumOrderPrice),
      isActive: form.isActive
    };

    if (editing) {
      await updateMethod({ variables: { ...payload, id: editing.id } });
    } else {
      await createMethod({ variables: payload });
    }

    await refetch();
    openCreate();
  };

  const handleDelete = async () => {
    if (!user?.id || !siteId || !editing?.id) return;
    if (!window.confirm("Delete shipping zone?")) return;
    await deleteMethod({ variables: { userId: user.id, siteId, id: editing.id } });
    await refetch();
    openCreate();
  };

  const busy = useMemo(() => creating || updating || deleting, [creating, updating, deleting]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900">Shipping Zones</h1>
        <p className="mt-2 text-sm text-gray-700">Manage shipping methods and pricing thresholds.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">{editing ? `Update #${editing.id}` : "Create Shipping Zone"}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Title" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={form.currency} onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))} placeholder="Currency" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input type="number" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="Price" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input type="number" value={form.minimumOrderPrice} onChange={(event) => setForm((prev) => ({ ...prev, minimumOrderPrice: event.target.value }))} placeholder="Min order" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input type="number" value={form.maximumOrderPrice} onChange={(event) => setForm((prev) => ({ ...prev, maximumOrderPrice: event.target.value }))} placeholder="Max order" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
            Active
          </label>
          <textarea value={form.note} onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))} placeholder="Note" className="min-h-[80px] rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-3" />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleSave} disabled={busy} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{editing ? "Update" : "Create"}</button>
          <button type="button" onClick={openCreate} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Clear</button>
          {editing ? <button type="button" onClick={handleDelete} disabled={busy} className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600">Delete</button> : null}
        </div>
      </div>

      <DataTable
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No shipping zone found."
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
                baseVariables: queryVariables,
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
