import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import { RESELLER_WALLET_LEDGER } from "@/graphql/queries/reseller";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function WalletLedger() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);

  const [resellerId, setResellerId] = useState("");
  const [offset, setOffset] = useState(0);
  const [pageSize] = useState(15);

  const variables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        resellerId: resellerId.trim(),
        limit: pageSize + 1,
        offset
      }
    }),
    [siteUuid, resellerId, pageSize, offset]
  );

  const { data, loading, refetch } = useQuery(RESELLER_WALLET_LEDGER, {
    variables,
    skip: !siteUuid || !resellerId.trim()
  });

  const rows = data?.walletLedger ?? [];
  const hasNext = rows.length > pageSize;
  const ledger = rows.slice(0, pageSize);
  const page = Math.floor(offset / pageSize) + 1;
  const pageCount = hasNext ? page + 1 : page;
  const approxTotal = hasNext ? offset + pageSize + 1 : offset + ledger.length;

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "date",
        header: "Date",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (entry) => (entry.createdAt ? dayjs(entry.createdAt).format("D MMM YYYY") : "—")
      },
      {
        id: "ref",
        header: "Ref",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (entry) => entry.refType
      },
      {
        id: "bucket",
        header: "Bucket",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (entry) => entry.bucket
      },
      {
        id: "direction",
        header: "Direction",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (entry) => entry.direction
      },
      {
        id: "amount",
        header: "Amount",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (entry) => entry.amount
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Wallet Ledger
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Ledger entries for reseller wallets.</p>
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
        <button
          type="button"
          onClick={() => refetch()}
          disabled={!resellerId.trim()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          Load
        </button>
      </div>

      <DataTable
        rows={ledger}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "offset",
          count: ledger.length,
          total: approxTotal,
          page,
          pageCount,
          onPageChange: (nextPage) => setOffset(Math.max(0, (nextPage - 1) * pageSize)),
          loading,
          from: ledger.length ? offset + 1 : 0,
          to: offset + ledger.length,
          pageSize,
          pageSizeOptions: [15]
        }}
      />
    </div>
  );
}
