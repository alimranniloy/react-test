import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { STORE_SUPPLIERS } from "@/graphql/queries/connection";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function Supplier() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [search, setSearch] = useState("");
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? null,
      search: search.trim() || null,
      first
    }),
    [siteId, search, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_SUPPLIERS, {
    variables,
    skip: !siteId
  });

  const rows = data?.storeSuppliers?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeSuppliers?.pageInfo;
  const totalAvailable = data?.storeSuppliers?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      { id: "title", header: "Title", headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-4 py-3 text-sm text-gray-700", cell: (row) => row.title },
      { id: "phone", header: "Phone", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.phone ?? "—" },
      { id: "orders", header: "Orders", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.ordersTotal ?? 0 },
      {
        id: "status",
        header: "Status",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm",
        cell: (row) => (
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${row.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {row.isActive ? "Active" : "Inactive"}
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
          Supplier
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Manage supplier relationships and performance.</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search suppliers"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
      </div>

      <DataTable
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "cursor",
          count: rows.length,
          total: totalAvailable,
          from: rows.length ? 1 : 0,
          to: rows.length,
          hasNext: hasMore,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: rows.length,
                pageSize: first
              })
            }),
          loading,
          pageSize: first,
          pageSizeOptions: [15, 30, 50, 100],
          onPageSizeChange: setFirst,
          nextLabel: "Next"
        }}
      />
    </div>
  );
}
