import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SITE_TRANSACTIONS } from "@/graphql/queries/siteTransaction";
import { SELF_SITE_TRANSACTION_UPDATE } from "@/graphql/mutations/siteTransaction";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

dayjs.extend(relativeTime);

type TabName = "All" | "In" | "Out";

const tabs: { name: TabName; id: number | null }[] = [
  { name: "All", id: null },
  { name: "In", id: 0 },
  { name: "Out", id: 1 }
];

const pageSizeOptions = [15, 30, 50, 100];

const formatMoney = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
};

export default function PaymentAffiliate() {
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [selectedTab, setSelectedTab] = useState<TabName>("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const status = tabs.find((tab) => tab.name === selectedTab)?.id ?? null;

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      status: status === null ? null : status,
      first: pageSize,
      after: null
    }),
    [siteId, status, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(SITE_TRANSACTIONS, {
    variables,
    skip: !siteId
  });
  const [updateTransaction, { loading: saving }] = useMutation(SELF_SITE_TRANSACTION_UPDATE);

  const [activeTransaction, setActiveTransaction] = useState<any | null>(null);
  const [transactionDraft, setTransactionDraft] = useState({
    isPaid: false,
    paymentTitle: "",
    paymentNo: "",
    paymentId: "",
    note: "",
    total: ""
  });

  const transactions = data?.siteTransactions?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.siteTransactions?.pageInfo;
  const totalAvailable = data?.siteTransactions?.total ?? transactions.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || transactions.length < totalAvailable;

  const allSelected = selectedIds.length > 0 && selectedIds.length === transactions.length;
  const indeterminate = selectedIds.length > 0 && selectedIds.length < transactions.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactions.map((trx: any) => trx.id));
    }
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        headClassName: "min-w-[6rem] w-full py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900",
        cellClassName: "whitespace-nowrap py-2 pl-3 sm:pl-0 pr-3 text-sm",
        cell: (trx) => (
          <>
            <div className="text-sm font-medium text-gray-900">#{trx.hid || trx.id}</div>
            <div className="text-xs text-gray-500">{trx.referTitle || trx.source || "—"}</div>
          </>
        )
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20",
        cellClassName: "px-3 py-2 text-sm text-gray-500",
        cell: (trx) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
              trx.status === 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {trx.status === 0 ? "In" : "Out"}
          </span>
        )
      },
      { id: "reference", header: "Reference", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-2 text-sm text-gray-500", cell: (trx) => trx.referPhone || "—" },
      { id: "payment", header: "Payment", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-2 text-sm text-gray-500", cell: (trx) => formatMoney(trx.total) },
      { id: "transaction", header: "Transaction", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-2 text-sm text-gray-500", cell: (trx) => trx.paymentNo || "—" },
      {
        id: "action",
        header: "Action",
        headClassName: "px-4 py-3.5 text-right text-sm font-semibold text-gray-900",
        cellClassName: "whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right",
        cell: (trx) => (
          <button
            type="button"
            onClick={() => openTransaction(trx)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ⚙
          </button>
        )
      }
    ],
    []
  );

  const openTransaction = (trx: any) => {
    setActiveTransaction(trx);
    setTransactionDraft({
      isPaid: Boolean(trx.isPaid),
      paymentTitle: trx.paymentTitle || "",
      paymentNo: trx.paymentNo || "",
      paymentId: trx.paymentId || "",
      note: trx.note || "",
      total: trx.total?.toString?.() ?? ""
    });
  };

  const closeTransaction = () => {
    setActiveTransaction(null);
  };

  const saveTransaction = async () => {
    if (!user?.id || !siteId || !activeTransaction) return;
    await updateTransaction({
      variables: {
        userId: user.id,
        siteId,
        id: activeTransaction.id,
        isPaid: transactionDraft.isPaid,
        paymentTitle: transactionDraft.paymentTitle || null,
        paymentNo: transactionDraft.paymentNo || null,
        paymentId: transactionDraft.paymentId || null,
        note: transactionDraft.note || null,
        total: transactionDraft.total ? Number(transactionDraft.total) : null,
        paymentDate: transactionDraft.isPaid ? new Date().toISOString() : null
      }
    });
    await refetch();
    closeTransaction();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
            <p className="mt-2 text-sm text-gray-700">
              View and Manage Financial Transactions for Clear and Accurate Accounting
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 sm:mt-0 inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-600 shadow-sm"
          >
            Refresh
          </button>
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
                {selectedTab === tab.name ? ` (${transactions.length})` : ""}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <DataTable
        rows={transactions}
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
          count: transactions.length,
          total: totalAvailable,
          hasNext: hasMore,
          loading,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: transactions.length,
                pageSize
              })
            }),
          pageSize,
          pageSizeOptions,
          onPageSizeChange: (value) => setPageSize(value),
          from: transactions.length ? 1 : 0,
          to: transactions.length
        }}
      />
      {activeTransaction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Transaction #{activeTransaction.hid || activeTransaction.id}
                </h3>
                <p className="text-xs text-gray-500">
                  Updated {activeTransaction.updatedAt ? dayjs(activeTransaction.updatedAt).fromNow() : "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeTransaction}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={transactionDraft.isPaid}
                  onChange={(event) => setTransactionDraft((prev) => ({ ...prev, isPaid: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                Mark as paid
              </label>
              <div className="text-sm text-gray-500">{activeTransaction.referTitle || "—"}</div>
              <div>
                <label className="text-xs font-medium text-gray-500">Payment title</label>
                <input
                  value={transactionDraft.paymentTitle}
                  onChange={(event) => setTransactionDraft((prev) => ({ ...prev, paymentTitle: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Payment no</label>
                <input
                  value={transactionDraft.paymentNo}
                  onChange={(event) => setTransactionDraft((prev) => ({ ...prev, paymentNo: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Payment ID</label>
                <input
                  value={transactionDraft.paymentId}
                  onChange={(event) => setTransactionDraft((prev) => ({ ...prev, paymentId: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Total</label>
                <input
                  value={transactionDraft.total}
                  onChange={(event) => setTransactionDraft((prev) => ({ ...prev, total: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-500">Note</label>
                <textarea
                  value={transactionDraft.note}
                  onChange={(event) => setTransactionDraft((prev) => ({ ...prev, note: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeTransaction}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTransaction}
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
