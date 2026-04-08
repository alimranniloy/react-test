import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import { RESELLER_TREE } from "@/graphql/queries/reseller";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";

export default function ResellerTree() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);

  const [resellerId, setResellerId] = useState("");
  const [maxDepth, setMaxDepth] = useState("4");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        resellerId: resellerId.trim(),
        maxDepth: maxDepth ? Number(maxDepth) : null
      }
    }),
    [siteUuid, resellerId, maxDepth]
  );

  const { data, loading, refetch } = useQuery(RESELLER_TREE, {
    variables,
    skip: !siteUuid || !resellerId.trim()
  });

  const tree = data?.resellerTree ?? [];
  const totalPages = Math.max(1, Math.ceil(tree.length / pageSize));
  const offset = (page - 1) * pageSize;
  const pagedTree = tree.slice(offset, offset + pageSize);
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "ancestor",
        header: "Ancestor",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (node) => node.ancestorId
      },
      {
        id: "descendant",
        header: "Descendant",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (node) => node.descendantId
      },
      {
        id: "depth",
        header: "Depth",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (node) => node.depth
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Reseller Tree
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Explore reseller hierarchy by reseller id.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={resellerId}
          onChange={(event) => {
            setResellerId(event.target.value);
            setPage(1);
          }}
          placeholder="Reseller id"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
        <input
          value={maxDepth}
          onChange={(event) => {
            setMaxDepth(event.target.value);
            setPage(1);
          }}
          placeholder="Max depth"
          className="w-28 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
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
        rows={pagedTree}
        getRowId={(row) => `${row.descendantId}-${row.ancestorId}-${row.depth}`}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "offset",
          count: pagedTree.length,
          total: tree.length,
          page,
          pageCount: totalPages,
          from: pagedTree.length > 0 ? offset + 1 : 0,
          to: offset + pagedTree.length,
          onPageChange: (nextPage) => setPage(Math.max(1, Math.min(totalPages, nextPage))),
          pageSize,
          pageSizeOptions: [15, 30, 50, 100],
          onPageSizeChange: (value) => {
            setPageSize(value);
            setPage(1);
          },
          loading
        }}
      />
    </div>
  );
}
