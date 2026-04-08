import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_ORDERS } from "@/graphql/queries/order";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

const statusLabels: Record<number, string> = {
  0: "Processing",
  1: "Placed",
  2: "Confirmed",
  3: "Packaging",
  4: "Packaged",
  5: "Shipping",
  6: "Review",
  7: "Rejected",
  8: "Return",
  9: "Canceled",
  10: "Delivered",
  11: "Query",
  12: "Payment",
  13: "Notification",
  14: "Hold",
  15: "Not Responding",
  16: "Partial Delivered"
};

const formatMoney = (value: number | null | undefined, currency?: string | null) => {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "BDT",
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `${value}`;
  }
};

type OrderReportProps = {
  title: string;
  description: string;
  compact?: boolean;
};

export default function OrderReport({ title, description, compact }: OrderReportProps) {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? 0;
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [params] = useSearchParams();

  const statusParam = params.get("status");
  const status = statusParam ? Number(statusParam) : null;

  const variables = useMemo(
    () => ({
      siteId,
      first: pageSize,
      after: null,
      status: Number.isNaN(status) ? null : status
    }),
    [siteId, status, pageSize]
  );

  const { data, loading, fetchMore } = useQuery(STORE_ORDERS, {
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
        headClassName: "py-2 pr-4 text-[11px] uppercase text-slate-400",
        cellClassName: "py-2 pr-4 text-xs text-slate-600",
        cell: (order) => (
          <div>
            <div className="font-semibold text-slate-900">#{order.orderId}</div>
            <div className="text-[11px] text-slate-400">{order.createdAt ? dayjs(order.createdAt).format("MMM D, YYYY") : "—"}</div>
          </div>
        )
      },
      {
        id: "customer",
        header: "Customer",
        headClassName: "py-2 pr-4 text-[11px] uppercase text-slate-400",
        cellClassName: "py-2 pr-4 text-xs text-slate-600",
        cell: (order) => (
          <div>
            <div className="font-medium text-slate-900">{order.customerName ?? "—"}</div>
            <div className="text-[11px] text-slate-400">{order.customerPhone ?? "—"}</div>
            {!compact ? <div className="text-[11px] text-slate-400">{order.customerAddress ?? ""}</div> : null}
          </div>
        )
      },
      {
        id: "status",
        header: "Status",
        headClassName: "py-2 pr-4 text-[11px] uppercase text-slate-400",
        cellClassName: "py-2 pr-4 text-xs text-slate-600",
        cell: (order) => (
          <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            {statusLabels[order.status] ?? "Processing"}
          </span>
        )
      },
      {
        id: "logistics",
        header: "Logistics",
        headClassName: "py-2 pr-4 text-[11px] uppercase text-slate-400",
        cellClassName: "py-2 pr-4 text-[11px] text-slate-500",
        cell: (order) => (
          <div>
            <div>{order.logisticsText ?? "—"}</div>
            <div>{order.trackingId ? `#${order.trackingId}` : ""}</div>
          </div>
        )
      },
      {
        id: "total",
        header: "Total",
        headClassName: "py-2 pr-2 text-right text-[11px] uppercase text-slate-400",
        cellClassName: "py-2 pr-2 text-right text-xs font-semibold text-slate-900",
        cell: (order) => formatMoney(order.netAmount ?? order.total, order.currency || site?.currency)
      }
    ],
    [compact, site?.currency]
  );

  return (
    <main className="space-y-4">
      <section className="rounded-2xl bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Order report</p>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/order/" className="text-xs text-indigo-600 hover:underline">
              Back to orders
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
            >
              Print
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4">
        <DataTable
          rows={orders}
          getRowId={(row) => row.id}
          columns={columns}
          loading={loading}
          emptyLabel="No orders found."
          pagination={{
            mode: "cursor",
            count: orders.length,
            total: totalAvailable,
            from: orders.length ? 1 : 0,
            to: orders.length,
            hasNext: hasMore,
            onLoadMore: () =>
              fetchMore({
                variables: nextPageVariables({
                  baseVariables: variables,
                  pageInfo,
                  currentCount: orders.length,
                  pageSize
                })
              }),
            loading,
            pageSize,
            pageSizeOptions: [15, 30, 50, 100],
            onPageSizeChange: setPageSize,
            nextLabel: "Next"
          }}
        />
      </section>
    </main>
  );
}
