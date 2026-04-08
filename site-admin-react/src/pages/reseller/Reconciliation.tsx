import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import { RECONCILIATION_SUMMARY } from "@/graphql/queries/reseller";
import { WALLET_RECONCILE } from "@/graphql/mutations/reseller";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function Reconciliation() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);

  const [resellerId, setResellerId] = useState("");
  const [onlyMismatch, setOnlyMismatch] = useState(true);
  const [offset, setOffset] = useState(0);
  const [pageSize] = useState(15);

  const variables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        resellerId: resellerId.trim() || null,
        onlyMismatch,
        limit: pageSize + 1,
        offset
      }
    }),
    [siteUuid, resellerId, onlyMismatch, pageSize, offset]
  );

  const { data, loading, refetch } = useQuery(RECONCILIATION_SUMMARY, {
    variables,
    skip: !siteUuid
  });

  const [reconcile, { loading: reconciling }] = useMutation(WALLET_RECONCILE);

  const rows = data?.reconciliationSummary ?? [];
  const hasNext = rows.length > pageSize;
  const summaries = rows.slice(0, pageSize);
  const page = Math.floor(offset / pageSize) + 1;
  const pageCount = hasNext ? page + 1 : page;
  const approxTotal = hasNext ? offset + pageSize + 1 : offset + summaries.length;

  const handleReconcile = async (apply: boolean) => {
    if (!siteUuid) return;
    await reconcile({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId: resellerId.trim() || null,
          dryRun: !apply
        }
      }
    });
    await refetch();
  };

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "reseller",
        header: "Reseller",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => row.resellerId
      },
      {
        id: "walletPending",
        header: "Wallet Pending",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.walletPending
      },
      {
        id: "ledgerPending",
        header: "Ledger Pending",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.ledgerPending
      },
      {
        id: "diff",
        header: "Diff",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.pendingDiff
      },
      {
        id: "withdrawableDiff",
        header: "Withdrawable Diff",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.withdrawableDiff
      },
      {
        id: "paidDiff",
        header: "Paid Diff",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.paidDiff
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
              Wallet Reconciliation
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Compare wallet balances vs ledger totals.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleReconcile(false)}
              disabled={reconciling}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Dry Run
            </button>
            <button
              type="button"
              onClick={() => handleReconcile(true)}
              disabled={reconciling}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500"
            >
              Apply Fixes
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={resellerId}
          onChange={(event) => {
            setResellerId(event.target.value);
            setOffset(0);
          }}
          placeholder="Reseller id"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={onlyMismatch}
            onChange={(event) => {
              setOnlyMismatch(event.target.checked);
              setOffset(0);
            }}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
          Only mismatches
        </label>
      </div>

      <DataTable
        rows={summaries}
        getRowId={(row) => row.resellerId}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "offset",
          count: summaries.length,
          total: approxTotal,
          page,
          pageCount,
          onPageChange: (nextPage) => setOffset(Math.max(0, (nextPage - 1) * pageSize)),
          loading,
          from: summaries.length ? offset + 1 : 0,
          to: offset + summaries.length,
          pageSize,
          pageSizeOptions: [15]
        }}
      />
    </div>
  );
}
