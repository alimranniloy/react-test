import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_ORDER_STATISTICS_BY_STAFFS, SITE_STAFFS } from "@/graphql/queries/orderReports";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function StaffReport() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [fromDate, setFromDate] = useState(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [staffId, setStaffId] = useState<number | "">("");
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);

  const staffVariables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      first
    }),
    [siteId, first]
  );

  const { data: staffData } = useQuery(SITE_STAFFS, {
    variables: staffVariables,
    skip: !siteId
  });

  const staffList = staffData?.siteStaffs?.edges?.map((edge: any) => edge.node) ?? [];

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      from: new Date(fromDate).toISOString(),
      to: new Date(toDate).toISOString(),
      productId: null,
      first
    }),
    [siteId, fromDate, toDate, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_ORDER_STATISTICS_BY_STAFFS, {
    variables,
    skip: !siteId
  });

  const rows = data?.storeOrdersStatisticsByStaffs?.edges?.map((edge: any) => edge.node) ?? [];
  const filtered = staffId ? rows.filter((row: any) => row.staffId === staffId) : rows;
  const pageInfo = data?.storeOrdersStatisticsByStaffs?.pageInfo;
  const totalAvailable = data?.storeOrdersStatisticsByStaffs?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      { id: "staff", header: "Staff", headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-4 py-3 text-sm text-gray-700", cell: (row) => row.staffId },
      { id: "placed", header: "Placed", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.placed },
      { id: "delivered", header: "Delivered", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-green-600", cell: (row) => row.delivered },
      { id: "returned", header: "Returned", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-red-600", cell: (row) => row.returned },
      { id: "profit", header: "Profit", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.profit }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="relative mb-5 rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Staff Report
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Track staff performance across orders and revenue.</p>
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
          <select
            value={staffId}
            onChange={(event) => setStaffId(event.target.value ? Number(event.target.value) : "")}
            className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
          >
            <option value="">All staff</option>
            {staffList.map((staff: any) => (
              <option key={staff.id} value={staff.id}>
                {staff.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        rows={filtered}
        getRowId={(row) => row.staffId}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "cursor",
          count: filtered.length,
          total: totalAvailable,
          from: filtered.length ? 1 : 0,
          to: filtered.length,
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
