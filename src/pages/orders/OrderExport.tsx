import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { STORE_ORDERS } from "@/graphql/queries/order";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

const toCsvCell = (value: unknown) => {
  const text = String(value ?? "").replaceAll('"', '""');
  return `"${text}"`;
};

export default function OrderExport() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [status, setStatus] = useState<number | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      status,
      from: from ? new Date(`${from}T00:00:00.000Z`).toISOString() : null,
      to: to ? new Date(`${to}T23:59:59.999Z`).toISOString() : null,
      first
    }),
    [siteId, status, from, to, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_ORDERS, {
    variables,
    skip: !siteId
  });

  const rows = data?.storeOrders?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeOrders?.pageInfo;
  const totalAvailable = data?.storeOrders?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      { id: "order", header: "Order", headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-4 py-3 text-sm text-gray-700", cell: (row) => `#${row.orderId}` },
      { id: "customer", header: "Customer", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.customerName || "—" },
      { id: "status", header: "Status", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.status },
      { id: "total", header: "Total", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.total }
    ],
    []
  );

  const exportCsv = () => {
    const headers = [
      "id",
      "orderId",
      "customerName",
      "customerPhone",
      "customerAddress",
      "status",
      "total",
      "netAmount",
      "paid",
      "sourceId",
      "createdAt",
      "updatedAt"
    ];

    const body = rows.map((row: any) =>
      [
        row.id,
        row.orderId,
        row.customerName,
        row.customerPhone,
        row.customerAddress,
        row.status,
        row.total,
        row.netAmount,
        row.paid,
        row.sourceId,
        row.createdAt,
        row.updatedAt
      ]
        .map(toCsvCell)
        .join(",")
    );

    const csv = [headers.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Order Export</h1>
            <p className="mt-2 text-sm text-gray-700">Download orders as CSV for accounting and analysis.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => refetch()} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Refresh</button>
            <button type="button" onClick={exportCsv} disabled={rows.length === 0} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Export CSV</button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select value={status ?? ""} onChange={(event) => setStatus(event.target.value ? Number(event.target.value) : null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">All statuses</option>
            <option value="0">Processing</option>
            <option value="1">Placed</option>
            <option value="2">Confirmed</option>
            <option value="3">Packaging</option>
            <option value="4">Packaged</option>
            <option value="5">Shipping</option>
            <option value="10">Delivered</option>
          </select>
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <DataTable
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No order to export."
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
