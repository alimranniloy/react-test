import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SITE_TRANSACTIONS } from "@/graphql/queries/siteTransaction";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

dayjs.extend(relativeTime);

type Tab = "All" | "Paid" | "Unpaid";

export default function PaymentTransaction() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [selectedTab, setSelectedTab] = useState<Tab>("All");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      first: pageSize,
      after: null
    }),
    [siteId, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(SITE_TRANSACTIONS, {
    variables,
    skip: !siteId
  });

  const rows = data?.siteTransactions?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.siteTransactions?.pageInfo;
  const totalAvailable = data?.siteTransactions?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;
  const filtered = rows.filter((row: any) => {
    if (selectedTab === "Paid") return Boolean(row.isPaid);
    if (selectedTab === "Unpaid") return !row.isPaid;
    return true;
  });
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => `#${row.id}`
      },
      {
        id: "receiver",
        header: "Receiver",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.referTitle ?? row.referPhone ?? "—"
      },
      {
        id: "amount",
        header: "Amount",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.total ?? row.subTotal ?? 0
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm",
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
              row.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {row.isPaid ? "Paid" : "Unpaid"}
          </span>
        )
      },
      {
        id: "updated",
        header: "Updated",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => (row.updatedAt ? dayjs(row.updatedAt).fromNow() : "—")
      },
      {
        id: "action",
        header: "Action",
        headClassName: "px-4 py-3.5 text-right text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-right text-sm",
        cell: (row) => (
          <Link
            to={`/payment/transaction/update/?id=${row.id}`}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>
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
              Payment Transactions
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Track and update transaction settlement status.</p>
          </div>
          <div className="flex items-center gap-2">
            {(["All", "Paid", "Unpaid"] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTab(tab)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  selectedTab === tab
                    ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DataTable
        rows={filtered}
        getRowId={(row) => row.id}
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
          onPageSizeChange: (value) => setPageSize(value),
          from: rows.length ? 1 : 0,
          to: rows.length
        }}
      />
    </div>
  );
}
