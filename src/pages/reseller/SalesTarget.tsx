import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_SELL_TARGET_OPERATIONS } from "@/graphql/queries/reseller";
import { SELF_STORE_TARGET_OPERATION_CREATE } from "@/graphql/mutations/reseller";
import { useSiteStore } from "@/store/useSiteStore";
import { useAuthStore } from "@/store/useAuthStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";

export default function SalesTarget() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const user = useAuthStore((state) => state.user);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ? [siteId] : [],
      search: search.trim() || null,
      first: pageSize,
      after: null
    }),
    [siteId, search, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_SELL_TARGET_OPERATIONS, {
    variables,
    skip: !siteId
  });
  const [createTarget, { loading: saving }] = useMutation(SELF_STORE_TARGET_OPERATION_CREATE);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState({
    offerCriteria: "",
    targetType: "qty",
    targetQty: "",
    targetAmount: "",
    bonus: "",
    startDate: "",
    endDate: "",
    isActive: true
  });

  const targets = data?.storeSellTargetOperations?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeSellTargetOperations?.pageInfo;
  const totalAvailable = data?.storeSellTargetOperations?.total ?? targets.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || targets.length < totalAvailable;
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "criteria",
        header: "Criteria",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (target) => target.offerCriteria
      },
      {
        id: "target",
        header: "Target",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (target) => target.targetQty || target.targetAmount
      },
      {
        id: "bonus",
        header: "Bonus",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (target) => target.bonus
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm",
        cell: (target) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
              target.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {target.isActive ? "Active" : "Inactive"}
          </span>
        )
      }
    ],
    []
  );

  const submit = async () => {
    if (!user?.id || !siteId) return;
    await createTarget({
      variables: {
        userId: user.id,
        siteId,
        offerCriteria: draft.offerCriteria,
        targetType: draft.targetType,
        targetQty: Number(draft.targetQty || 0),
        targetAmount: Number(draft.targetAmount || 0),
        bonus: Number(draft.bonus || 0),
        startDate: draft.startDate || null,
        endDate: draft.endDate || null,
        isActive: draft.isActive
      }
    });
    await refetch();
    setShowCreate(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Reseller Target
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Track reseller sales target operations.</p>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create Target
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search target"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
      </div>

      <DataTable
        rows={targets}
        getRowId={(row) => `${row.offerCriteria}-${row.startDate ?? ""}-${row.endDate ?? ""}`}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "cursor",
          count: targets.length,
          total: totalAvailable,
          hasNext: hasMore,
          loading,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: targets.length,
                pageSize
              })
            }),
          pageSize,
          pageSizeOptions: [15, 30, 50, 100],
          onPageSizeChange: (value) => setPageSize(value)
        }}
      />
      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Target</h3>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-500">Criteria</label>
                <input
                  value={draft.offerCriteria}
                  onChange={(event) => setDraft((prev) => ({ ...prev, offerCriteria: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Target type</label>
                <select
                  value={draft.targetType}
                  onChange={(event) => setDraft((prev) => ({ ...prev, targetType: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="qty">Quantity</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Target qty</label>
                <input
                  value={draft.targetQty}
                  onChange={(event) => setDraft((prev) => ({ ...prev, targetQty: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Target amount</label>
                <input
                  value={draft.targetAmount}
                  onChange={(event) => setDraft((prev) => ({ ...prev, targetAmount: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Bonus</label>
                <input
                  value={draft.bonus}
                  onChange={(event) => setDraft((prev) => ({ ...prev, bonus: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Start date</label>
                <input
                  type="date"
                  value={draft.startDate}
                  onChange={(event) => setDraft((prev) => ({ ...prev, startDate: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">End date</label>
                <input
                  type="date"
                  value={draft.endDate}
                  onChange={(event) => setDraft((prev) => ({ ...prev, endDate: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={draft.isActive}
                  onChange={(event) => setDraft((prev) => ({ ...prev, isActive: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                Active
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
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
