import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

type DiscountRow = {
  id: number;
  createDate: string;
  discountType: string;
  applyBy: string;
  discountPercentage: number;
  status: "Active" | "Inactive";
};

const initialRows: DiscountRow[] = [
  {
    id: 1,
    createDate: "8/18/2025",
    discountType: "Purchase Discount",
    applyBy: "Mokkabali",
    discountPercentage: 40,
    status: "Active"
  },
  {
    id: 2,
    createDate: "8/20/2025",
    discountType: "Seasonal Discount",
    applyBy: "All Products",
    discountPercentage: 15,
    status: "Inactive"
  }
];

export default function DiscountManagement() {
  const [rows, setRows] = useState<DiscountRow[]>(initialRows);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [form, setForm] = useState({
    type: "Sales Discount",
    applyBy: "Sub Chaild C",
    percentage: ""
  });

  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rows.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, rows]);

  const paginationText = useMemo(() => {
    if (!rows.length) return "No results";
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalItems);
    return `Showing ${start} to ${end} of ${totalItems} results`;
  }, [currentPage, itemsPerPage, rows.length, totalItems]);

  const columns = useMemo<DataTableColumn<DiscountRow>[]>(
    () => [
      {
        id: "createDate",
        header: "Create Date",
        headClassName: "border-b border-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700",
        cellClassName: "border-b border-gray-200 px-6 py-4 text-sm text-gray-700",
        cell: (row) => row.createDate
      },
      {
        id: "discountType",
        header: "Discount Type",
        headClassName: "border-b border-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700",
        cellClassName: "border-b border-gray-200 px-6 py-4 text-sm text-gray-700",
        cell: (row) => row.discountType
      },
      {
        id: "applyBy",
        header: "Apply Discount By",
        headClassName: "border-b border-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700",
        cellClassName: "border-b border-gray-200 px-6 py-4 text-sm text-gray-700",
        cell: (row) => row.applyBy
      },
      {
        id: "discountPercentage",
        header: "Discount %",
        headClassName: "border-b border-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700",
        cellClassName: "border-b border-gray-200 px-6 py-4 text-sm text-gray-700",
        cell: (row) => `${row.discountPercentage}%`
      },
      {
        id: "status",
        header: "Status",
        headClassName: "border-b border-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700",
        cellClassName: "border-b border-gray-200 px-6 py-4 text-sm",
        cell: (row) => (
          <span
            className={`inline-flex rounded-md px-4 py-1 text-xs font-semibold ${
              row.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {row.status}
          </span>
        )
      }
    ],
    []
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.type.trim() || !form.applyBy.trim() || !form.percentage.trim()) return;

    const percentage = Number(form.percentage);
    if (!Number.isFinite(percentage) || percentage < 0) return;

    const createDate = new Intl.DateTimeFormat("en-US").format(new Date());
    setRows((prev) => [
      {
        id: Date.now(),
        createDate,
        discountType: form.type.trim(),
        applyBy: form.applyBy.trim(),
        discountPercentage: percentage,
        status: "Active"
      },
      ...prev
    ]);
    setCurrentPage(1);
    setForm({ type: "", applyBy: "", percentage: "" });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900">Product Discount Management</h1>
        <p className="mt-2 text-sm text-gray-700">
          Monitor and manage daily product discount rules for efficient operations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
          <label className="text-sm font-medium text-gray-700 md:col-span-3">
            Discount Type
            <input
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="text-sm font-medium text-gray-700 md:col-span-5">
            Apply Discount By
            <input
              value={form.applyBy}
              onChange={(event) => setForm((prev) => ({ ...prev, applyBy: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="text-sm font-medium text-gray-700 md:col-span-2">
            Discount %
            <input
              type="number"
              min={0}
              value={form.percentage}
              onChange={(event) => setForm((prev) => ({ ...prev, percentage: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-right text-sm"
              required
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow-500"
            >
              Submit
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <DataTable
          rows={pagedRows}
          getRowId={(row) => row.id}
          columns={columns}
          emptyLabel="No discounts found."
          pagination={{
            mode: "offset",
            count: pagedRows.length,
            total: totalItems,
            page: currentPage,
            pageCount: totalPages,
            onPageChange: (page) => setCurrentPage(Math.min(totalPages, Math.max(1, page))),
            pageSize: itemsPerPage,
            pageSizeOptions: [15, 50, 100],
            onPageSizeChange: (value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            },
            from: totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
            to: Math.min(currentPage * itemsPerPage, totalItems)
          }}
        />
        <p className="px-4 pb-4 text-xs text-slate-500">{paginationText}</p>
      </div>
    </div>
  );
}
