import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { STORE_ORDER_PAYS } from "@/graphql/queries/orderPay";
import { SELF_STORE_ORDER_PAY_UPDATE } from "@/graphql/mutations/orderPay";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

dayjs.extend(relativeTime);

type TabName = "All" | "Paid" | "Settled";

const tabs: { name: TabName }[] = [{ name: "All" }, { name: "Paid" }, { name: "Settled" }];
const pageSizeOptions = [15, 30, 50, 100];

const formatMoney = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
};

export default function PaymentCustomer() {
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [selectedTab, setSelectedTab] = useState<TabName>("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      first: pageSize,
      after: null
    }),
    [siteId, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_ORDER_PAYS, {
    variables,
    skip: !siteId
  });
  const [updatePay, { loading: saving }] = useMutation(SELF_STORE_ORDER_PAY_UPDATE);

  const [activePay, setActivePay] = useState<any | null>(null);
  const [payDraft, setPayDraft] = useState({
    isPaid: false,
    paymentTitle: "",
    paymentNo: "",
    paymentId: "",
    note: "",
    total: ""
  });

  const orderPays = data?.storeOrderPays?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeOrderPays?.pageInfo;
  const totalAvailable = data?.storeOrderPays?.total ?? orderPays.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || orderPays.length < totalAvailable;
  const filtered = orderPays.filter((pay: any) => {
    if (selectedTab === "Paid") return Boolean(pay.isPaid);
    if (selectedTab === "Settled") return Boolean(pay.isSettle);
    return true;
  });

  const allSelected = selectedIds.length > 0 && selectedIds.length === filtered.length;
  const indeterminate = selectedIds.length > 0 && selectedIds.length < filtered.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((pay: any) => pay.id));
    }
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        headClassName: "min-w-[6rem] w-full py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900",
        cellClassName: "whitespace-nowrap py-2 pl-3 sm:pl-0 pr-3 text-sm",
        cell: (pay) => (
          <>
            <div className="text-sm font-medium text-gray-900">#{pay.id}</div>
            <div className="text-xs text-gray-500">Order #{pay.orderId}</div>
          </>
        )
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20",
        cellClassName: "px-3 py-2 text-sm text-gray-500",
        cell: (pay) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
              pay.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {pay.isPaid ? "Paid" : "Unpaid"}
          </span>
        )
      },
      { id: "update", header: "Update", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20", cellClassName: "px-3 py-2 text-sm text-gray-500", cell: (pay) => (pay.updatedAt ? dayjs(pay.updatedAt).fromNow() : "—") },
      { id: "name", header: "Name", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-2 text-sm text-gray-500", cell: (pay) => pay.paymentTitle || "—" },
      { id: "pay", header: "Pay", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-2 text-sm text-gray-500", cell: (pay) => formatMoney(pay.total) },
      { id: "transaction", header: "Transaction", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-2 text-sm text-gray-500", cell: (pay) => pay.paymentNo || "—" },
      {
        id: "action",
        header: "Action",
        headClassName: "px-4 py-3.5 text-right text-sm font-semibold text-gray-900",
        cellClassName: "whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right",
        cell: (pay) => (
          <button
            type="button"
            onClick={() => openPay(pay)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ⚙
          </button>
        )
      }
    ],
    []
  );

  const openPay = (pay: any) => {
    setActivePay(pay);
    setPayDraft({
      isPaid: Boolean(pay.isPaid),
      paymentTitle: pay.paymentTitle || "",
      paymentNo: pay.paymentNo || "",
      paymentId: pay.paymentId || "",
      note: pay.note || "",
      total: pay.total?.toString?.() ?? ""
    });
  };

  const closePay = () => {
    setActivePay(null);
  };

  const savePay = async () => {
    if (!user?.id || !activePay) return;
    await updatePay({
      variables: {
        userId: user.id,
        id: activePay.id,
        queryType: "update",
        isPaid: payDraft.isPaid,
        paymentTitle: payDraft.paymentTitle || null,
        paymentNo: payDraft.paymentNo || null,
        paymentId: payDraft.paymentId || null,
        note: payDraft.note || null,
        total: payDraft.total ? Number(payDraft.total) : null,
        paymentDate: payDraft.isPaid ? new Date().toISOString() : null
      }
    });
    await refetch();
    closePay();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Customer Pays
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Track Customer Payments and Manage Financial Transactions Securely and Efficiently
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none max-w-[220px]">
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
              Select date
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => setSelectedTab(tab.name)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.name
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.name}
                {selectedTab === tab.name ? ` (${filtered.length})` : ""}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <DataTable
        rows={filtered}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        selection={{
          selectedIds,
          allSelected,
          indeterminate,
          onToggleAll: () => toggleSelectAll(),
          onToggleOne: (id, _checked) => toggleSelected(Number(id)),
          onClear: () => setSelectedIds([])
        }}
        pagination={{
          mode: "cursor",
          count: orderPays.length,
          total: totalAvailable,
          hasNext: hasMore,
          loading,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: orderPays.length,
                pageSize
              })
            }),
          pageSize,
          pageSizeOptions: pageSizeOptions,
          onPageSizeChange: (value) => setPageSize(value),
          from: orderPays.length ? 1 : 0,
          to: orderPays.length
        }}
      />
      {activePay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Pay #{activePay.id}</h3>
                <p className="text-xs text-gray-500">
                  Updated {activePay.updatedAt ? dayjs(activePay.updatedAt).fromNow() : "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={closePay}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={payDraft.isPaid}
                  onChange={(event) => setPayDraft((prev) => ({ ...prev, isPaid: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                Mark as paid
              </label>
              <div className="text-sm text-gray-500">{activePay.orderId ? `Order #${activePay.orderId}` : "—"}</div>
              <div>
                <label className="text-xs font-medium text-gray-500">Payment title</label>
                <input
                  value={payDraft.paymentTitle}
                  onChange={(event) => setPayDraft((prev) => ({ ...prev, paymentTitle: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Payment no</label>
                <input
                  value={payDraft.paymentNo}
                  onChange={(event) => setPayDraft((prev) => ({ ...prev, paymentNo: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Payment ID</label>
                <input
                  value={payDraft.paymentId}
                  onChange={(event) => setPayDraft((prev) => ({ ...prev, paymentId: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Total</label>
                <input
                  value={payDraft.total}
                  onChange={(event) => setPayDraft((prev) => ({ ...prev, total: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-500">Note</label>
                <textarea
                  value={payDraft.note}
                  onChange={(event) => setPayDraft((prev) => ({ ...prev, note: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closePay}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={savePay}
                disabled={saving}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
