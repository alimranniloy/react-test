import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import { RESELLER_REPORT_OVERVIEW, RESELLER_TOP_REPORT } from "@/graphql/queries/reseller";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";

export default function ResellerReports() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const overviewVariables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        from: from ? new Date(from).toISOString() : null,
        to: to ? new Date(to).toISOString() : null
      }
    }),
    [siteUuid, from, to]
  );

  const topVariables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        from: from ? new Date(from).toISOString() : null,
        to: to ? new Date(to).toISOString() : null,
        status: null,
        limit: pageSize,
        offset: (page - 1) * pageSize
      }
    }),
    [siteUuid, from, to, pageSize, page]
  );

  const { data: overviewData, loading: overviewLoading, refetch: refetchOverview } = useQuery(RESELLER_REPORT_OVERVIEW, {
    variables: overviewVariables,
    skip: !siteUuid
  });

  const { data: topData, loading: topLoading, refetch: refetchTop } = useQuery(RESELLER_TOP_REPORT, {
    variables: topVariables,
    skip: !siteUuid
  });

  const overview = overviewData?.resellerReportOverview ?? null;
  const topRows = topData?.resellerTopReport ?? [];
  const totalRows = topRows.length;
  const totalPages = Math.max(1, page + (totalRows === pageSize ? 1 : 0));

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "reseller",
        header: "Reseller",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => (
          <div>
            <div className="font-medium text-gray-900">{row.code}</div>
            <div className="text-xs text-gray-500">{row.resellerId}</div>
          </div>
        )
      },
      {
        id: "commission",
        header: "Commission",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.totalCommission
      },
      {
        id: "orders",
        header: "Orders",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.totalOrders
      },
      {
        id: "pending",
        header: "Pending",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.pendingBalance
      },
      {
        id: "paid",
        header: "Paid",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.paidBalance
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
              Reseller Reports
              <button
                type="button"
                onClick={() => {
                  refetchOverview();
                  refetchTop();
                }}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Snapshot and top performers.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                setPage(1);
              }}
              className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={to}
              onChange={(event) => {
                setTo(event.target.value);
                setPage(1);
              }}
              className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-gray-500">Total Resellers</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{overview?.totalResellers ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-gray-500">Active Resellers</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{overview?.activeResellers ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-gray-500">Total Commission</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{overview?.totalCommission ?? 0}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">Wallet Summary</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm text-gray-600">
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{overview?.walletPendingTotal ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Withdrawable</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{overview?.walletWithdrawableTotal ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Paid</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{overview?.walletPaidTotal ?? 0}</p>
          </div>
        </div>
      </div>

      <DataTable
        rows={topRows}
        getRowId={(row) => row.resellerId}
        columns={columns}
        loading={topLoading}
        emptyLabel="No record :-("
        pagination={{
          mode: "offset",
          count: topRows.length,
          total: totalRows,
          page,
          pageCount: totalPages,
          from: topRows.length > 0 ? (page - 1) * pageSize + 1 : 0,
          to: (page - 1) * pageSize + topRows.length,
          onPageChange: (nextPage) => setPage(Math.max(1, nextPage)),
          pageSize,
          pageSizeOptions: [15, 30, 50, 100],
          onPageSizeChange: (value) => {
            setPageSize(value);
            setPage(1);
          },
          loading: topLoading
        }}
      />

      {overviewLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-xs text-gray-500">Refreshing reports...</div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs text-gray-500">
          Report window: {from ? dayjs(from).format("D MMM YYYY") : "All time"} — {to ? dayjs(to).format("D MMM YYYY") : "Now"}
        </p>
      </div>
    </div>
  );
}
