import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_ORDER_RESELLER_LEDGER } from "@/graphql/queries/reseller";
import { useSiteStore } from "@/store/useSiteStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";

export default function Ledger() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      customerTitle: search.trim() || null,
      from: fromDate ? new Date(fromDate).toISOString() : null,
      to: toDate ? new Date(toDate).toISOString() : null,
      first: pageSize,
      after: null
    }),
    [siteId, search, fromDate, toDate, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_ORDER_RESELLER_LEDGER, {
    variables,
    skip: !siteId
  });

  const rows = data?.storeOrderResellerLedger?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeOrderResellerLedger?.pageInfo;
  const totalAvailable = data?.storeOrderResellerLedger?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "date",
        header: "Date",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => dayjs(row.date).format("D MMM YYYY")
      },
      {
        id: "reseller",
        header: "Reseller",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.customerTitle
      },
      {
        id: "order",
        header: "Order",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.orderHid
      },
      {
        id: "commission",
        header: "Commission",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.resellerCommission
      },
      {
        id: "sales",
        header: "Sales",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.sales
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Reseller Ledger
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Ledger summary for reseller sales and commissions.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search reseller"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
      </div>

      <DataTable
        rows={rows}
        getRowId={(row) => `${row.orderHid}-${row.date}`}
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
