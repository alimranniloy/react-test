import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_VOUCHERS } from "@/graphql/queries/marketing";
import {
  SELF_STORE_VOUCHER_CREATE,
  SELF_STORE_VOUCHER_UPDATE,
  SELF_STORE_VOUCHER_DELETE
} from "@/graphql/mutations/marketing";
import { useSiteStore } from "@/store/useSiteStore";
import { useAuthStore } from "@/store/useAuthStore";
import ActionDrawer from "@/components/ActionDrawer";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function Voucher() {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      first: 15
    }),
    [siteId]
  );

  const { data, loading, refetch } = useQuery(STORE_VOUCHERS, {
    variables,
    skip: !siteId
  });

  const [createVoucher, { loading: creating }] = useMutation(SELF_STORE_VOUCHER_CREATE);
  const [updateVoucher, { loading: updating }] = useMutation(SELF_STORE_VOUCHER_UPDATE);
  const [deleteVoucher, { loading: deleting }] = useMutation(SELF_STORE_VOUCHER_DELETE);

  const rows = data?.storeVouchers?.edges?.map((edge: any) => edge.node) ?? [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: "",
    translation: "",
    code: "",
    discount: 0,
    maxDiscount: 0,
    minSpent: 0,
    minQuantity: 1,
    usageLimit: 1,
    voucherType: 0,
    applyOn: true,
    applyOncePerCustomer: true,
    isActive: true,
    isAuto: false,
    isPublic: true,
    currency: site?.currency ?? "BDT",
    description: "",
    endDate: "",
    products: ""
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      translation: "",
      code: "",
      discount: 0,
      maxDiscount: 0,
      minSpent: 0,
      minQuantity: 1,
      usageLimit: 1,
      voucherType: 0,
      applyOn: true,
      applyOncePerCustomer: true,
      isActive: true,
      isAuto: false,
      isPublic: true,
      currency: site?.currency ?? "BDT",
      description: "",
      endDate: "",
      products: ""
    });
    setDrawerOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      title: row.title ?? "",
      translation: row.translation ?? "",
      code: row.code ?? "",
      discount: row.discount ?? 0,
      maxDiscount: row.maxDiscount ?? 0,
      minSpent: row.minSpent ?? 0,
      minQuantity: row.minQuantity ?? 1,
      usageLimit: row.usageLimit ?? 1,
      voucherType: row.voucherType ?? 0,
      applyOn: row.applyOn ?? true,
      applyOncePerCustomer: row.applyOncePerCustomer ?? true,
      isActive: Boolean(row.isActive),
      isAuto: Boolean(row.isAuto),
      isPublic: Boolean(row.isPublic),
      currency: row.currency ?? site?.currency ?? "BDT",
      description: row.description ?? "",
      endDate: row.endDate ?? "",
      products: row.products ? row.products.join(",") : ""
    });
    setDrawerOpen(true);
  };

  const parseProducts = () =>
    form.products
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => !Number.isNaN(value));

  const handleSubmit = async () => {
    if (!user?.id || !siteId) return;
    if (!form.title.trim() || !form.code.trim()) return;

    const payload = {
      userId: user.id,
      siteId,
      applyOn: form.applyOn,
      applyOncePerCustomer: form.applyOncePerCustomer,
      code: form.code,
      collectionId: null,
      currency: form.currency,
      description: form.description || "-",
      discount: Number(form.discount) || 0,
      endDate: form.endDate || undefined,
      html: {},
      isActive: form.isActive,
      isAuto: form.isAuto,
      isPublic: form.isPublic,
      maxDiscount: Number(form.maxDiscount) || 0,
      minQuantity: Number(form.minQuantity) || 1,
      minSpent: Number(form.minSpent) || 0,
      products: parseProducts(),
      title: form.title,
      translation: form.translation || form.title,
      usageLimit: Number(form.usageLimit) || 1,
      voucherType: Number(form.voucherType) || 0
    };

    if (editing) {
      await updateVoucher({
        variables: {
          userId: user.id,
          siteId,
          id: editing.id,
          ...payload
        }
      });
    } else {
      await createVoucher({ variables: payload });
    }

    await refetch();
    setDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (!editing || !user?.id || !siteId) return;
    if (!window.confirm("Delete this voucher?")) return;
    await deleteVoucher({ variables: { userId: user.id, siteId, id: editing.id } });
    await refetch();
    setDrawerOpen(false);
  };

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "code",
        header: "Code",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => row.code
      },
      {
        id: "discount",
        header: "Discount",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.discount
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
              Voucher
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Voucher list and status.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            Add Voucher
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
        title={editing ? `Voucher - ${editing.code ?? "Edit"}` : "Create Voucher"}
        subtitle="Voucher rules and discount configuration."
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
              {editing ? "Save Changes" : "Create Voucher"}
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
            Code
            <input
              value={form.code}
              onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Discount
            <input
              type="number"
              value={form.discount}
              onChange={(event) => setForm((prev) => ({ ...prev, discount: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Max Discount
            <input
              type="number"
              value={form.maxDiscount}
              onChange={(event) => setForm((prev) => ({ ...prev, maxDiscount: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Min Spent
            <input
              type="number"
              value={form.minSpent}
              onChange={(event) => setForm((prev) => ({ ...prev, minSpent: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Min Quantity
            <input
              type="number"
              value={form.minQuantity}
              onChange={(event) => setForm((prev) => ({ ...prev, minQuantity: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Usage Limit
            <input
              type="number"
              value={form.usageLimit}
              onChange={(event) => setForm((prev) => ({ ...prev, usageLimit: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Voucher Type
            <input
              type="number"
              value={form.voucherType}
              onChange={(event) => setForm((prev) => ({ ...prev, voucherType: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            End Date
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Currency
            <input
              value={form.currency}
              onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <label className="text-sm font-medium text-gray-700">
          Translation
          <input
            value={form.translation}
            onChange={(event) => setForm((prev) => ({ ...prev, translation: event.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-gray-700">
          Description
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            rows={3}
          />
        </label>
        <label className="text-sm font-medium text-gray-700">
          Products (IDs comma separated)
          <input
            value={form.products}
            onChange={(event) => setForm((prev) => ({ ...prev, products: event.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
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
              checked={form.isAuto}
              onChange={(event) => setForm((prev) => ({ ...prev, isAuto: event.target.checked }))}
            />
            Auto
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(event) => setForm((prev) => ({ ...prev, isPublic: event.target.checked }))}
            />
            Public
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.applyOn}
              onChange={(event) => setForm((prev) => ({ ...prev, applyOn: event.target.checked }))}
            />
            Apply On
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.applyOncePerCustomer}
              onChange={(event) => setForm((prev) => ({ ...prev, applyOncePerCustomer: event.target.checked }))}
            />
            Once per Customer
          </label>
        </div>
      </ActionDrawer>
    </div>
  );
}
