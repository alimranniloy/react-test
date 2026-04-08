import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { STORE_ORDER_PAYMENTS } from "@/graphql/queries/orderPayment";
import { useSiteStore } from "@/store/useSiteStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";

export default function ResellerPayment() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({ siteId: siteId ?? 0, first: pageSize, after: null }),
    [siteId, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_ORDER_PAYMENTS, {
    variables,
    skip: !siteId
  });

  const payments = data?.storeOrderPayments?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeOrderPayments?.pageInfo;
  const totalAvailable = data?.storeOrderPayments?.total ?? payments.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || payments.length < totalAvailable;
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (pay) => `#${pay.id}`
      },
      {
        id: "customer",
        header: "Customer",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (pay) => pay.customerTitle
      },
      {
        id: "total",
        header: "Total",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (pay) => pay.total
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm",
        cell: (pay) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
              pay.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {pay.isPaid ? "Paid" : "Pending"}
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
          Reseller Payment
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Reseller payout list and payment status.</p>
      </div>

      <DataTable
        rows={payments}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "cursor",
          count: payments.length,
          total: totalAvailable,
          hasNext: hasMore,
          loading,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: payments.length,
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
