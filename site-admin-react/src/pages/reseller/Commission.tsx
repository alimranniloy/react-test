import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_ORDERS_FOR_RESELLER } from "@/graphql/queries/orderReseller";
import { useSiteStore } from "@/store/useSiteStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";

export default function Commission() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      customerName: search.trim() || null,
      first: pageSize,
      after: null
    }),
    [siteId, search, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_ORDERS_FOR_RESELLER, {
    variables,
    skip: !siteId
  });

  const orders = data?.storeOrders?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeOrders?.pageInfo;
  const totalAvailable = data?.storeOrders?.total ?? orders.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || orders.length < totalAvailable;
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "order",
        header: "Order",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (order) => (
          <div>
            <div className="font-medium text-gray-900">#{order.orderId}</div>
            <div className="text-xs text-gray-500">{dayjs(order.updatedAt).fromNow()}</div>
          </div>
        )
      },
      {
        id: "customer",
        header: "Customer",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (order) => order.customerName
      },
      {
        id: "commission",
        header: "Commission",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (order) => order.resellerCommission
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm",
        cell: (order) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
              order.resellerIsPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {order.resellerIsPaid ? "Paid" : "Unpaid"}
          </span>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Reseller Commission
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Track reseller commission status and totals.</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search customer"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
      </div>

      <DataTable
        rows={orders}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "cursor",
          count: orders.length,
          total: totalAvailable,
          hasNext: hasMore,
          loading,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: orders.length,
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
