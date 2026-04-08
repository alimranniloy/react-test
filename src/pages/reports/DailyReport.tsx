import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_ORDER_STATISTICS_BY_DAYS } from "@/graphql/queries/orderReports";
import { useSiteStore } from "@/store/useSiteStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";

const filteredOrders = [
  { name: "All", value: null },
  { name: "Delivered", value: 10 },
  { name: "Returned", value: 8 },
  { name: "Canceled", value: 9 }
];

const sortItems = [
  { name: "Newest", value: "desc" },
  { name: "Oldest", value: "asc" }
];

export default function DailyReport() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [filter, setFilter] = useState(filteredOrders[0]);
  const [sort, setSort] = useState(sortItems[0]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      status: filter.value,
      first: pageSize,
      after: null
    }),
    [siteId, filter, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_ORDER_STATISTICS_BY_DAYS, {
    variables,
    skip: !siteId
  });

  const rows = data?.storeOrdersStatisticsByDays?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeOrdersStatisticsByDays?.pageInfo;
  const totalAvailable = data?.storeOrdersStatisticsByDays?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;
  const sortedRows = [...rows].sort((a: any, b: any) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    return sort.value === "asc" ? aDate - bDate : bDate - aDate;
  });

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
        id: "total",
        header: "Total Orders",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.total
      },
      {
        id: "delivered",
        header: "Delivered",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-green-600",
        cell: (row) => row.delivered
      },
      {
        id: "returned",
        header: "Returned",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-red-600",
        cell: (row) => row.returned
      },
      {
        id: "amount",
        header: "Amount",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.amount
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="relative mb-5 rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Daily Based New Orders Placed Reports
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of all the orders in your account including their name, title, email and role.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700">Filter by:</p>
          <select
            value={filter.name}
            onChange={(event) => {
              const next = filteredOrders.find((item) => item.name === event.target.value) || filteredOrders[0];
              setFilter(next);
            }}
            className="w-48 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
          >
            {filteredOrders.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700">Sort by:</p>
          <select
            value={sort.name}
            onChange={(event) => {
              const next = sortItems.find((item) => item.name === event.target.value) || sortItems[0];
              setSort(next);
            }}
            className="w-48 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
          >
            {sortItems.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        rows={sortedRows}
        getRowId={(row) => String(row.date)}
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
