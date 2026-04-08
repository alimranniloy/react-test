import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_ORDER_STATISTICS_BY_PRODUCT } from "@/graphql/queries/orderReports";
import { useSiteStore } from "@/store/useSiteStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";

export default function ProductReport() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [fromDate, setFromDate] = useState(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [productSku, setProductSku] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      from: new Date(fromDate).toISOString(),
      to: new Date(toDate).toISOString(),
      productSku: productSku.trim() || null,
      first: pageSize,
      after: null
    }),
    [siteId, fromDate, toDate, productSku, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_ORDER_STATISTICS_BY_PRODUCT, {
    variables,
    skip: !siteId
  });

  const rows = data?.storeOrdersStatisticsByProduct?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeOrdersStatisticsByProduct?.pageInfo;
  const totalAvailable = data?.storeOrdersStatisticsByProduct?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      { id: "title", header: "Title", headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-4 py-3 text-sm text-gray-700", cell: (row) => row.title },
      { id: "sku", header: "SKU", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.productSku },
      { id: "author", header: "Author", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.authorName || "—" },
      { id: "supplier", header: "Supplier", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.supplierName || "—" },
      { id: "quantity", header: "Quantity", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.quantity }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="relative mb-5 rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Product Based Reports
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Track sales performance by product and SKU.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
          />
          <label className="text-sm text-gray-700">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            value={productSku}
            onChange={(event) => setProductSku(event.target.value)}
            placeholder="Search by SKU"
            className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <DataTable
        rows={rows}
        getRowId={(row) => `${row.productSku ?? ""}-${row.title ?? ""}`}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "cursor",
          count: rows.length,
          total: totalAvailable,
          hasNext: hasMore,
          loading,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: rows.length,
                pageSize
              })
            }),
          pageSize,
          pageSizeOptions: [15, 30, 50, 100],
          onPageSizeChange: (value) => setPageSize(value)
        }}
      />
    </div>
  );
}
