import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_CUSTOMERS } from "@/graphql/queries/customer";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function OrderCart() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [search, setSearch] = useState("");
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      queryType: "abandoned_cart",
      search: search.trim() || null,
      first
    }),
    [siteId, search, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_CUSTOMERS, {
    variables,
    skip: !siteId
  });

  const rows = data?.storeCustomers?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeCustomers?.pageInfo;
  const totalAvailable = data?.storeCustomers?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "customer",
        header: "Customer",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => (
          <>
            <div className="font-medium">{row.title || "—"}</div>
            <div className="text-xs text-slate-500">{row.address || "—"}</div>
          </>
        )
      },
      { id: "phone", header: "Phone", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.phone || "—" },
      { id: "cartCount", header: "Cart Count", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.cartCount ?? 0 },
      { id: "ordersTotal", header: "Orders", headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900", cellClassName: "px-3 py-3 text-sm text-gray-500", cell: (row) => row.ordersTotal ?? 0 },
      {
        id: "updatedAt",
        header: "Updated",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => (row.updatedAt ? dayjs(row.updatedAt).format("h:mm A MMM D") : "—")
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
              Abandoned Cart
              <button type="button" onClick={() => refetch()} className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600">↻</button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Customers with active cart activity that has not converted.</p>
          </div>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer" className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <DataTable
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No abandoned cart customer found."
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
