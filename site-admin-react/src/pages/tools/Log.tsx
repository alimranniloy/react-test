import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import { SITE_LOGS } from "@/graphql/queries/tools";
import { useSiteStore } from "@/store/useSiteStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function Log() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      first: pageSize,
      after: null
    }),
    [siteId, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(SITE_LOGS, {
    variables,
    skip: !siteId
  });

  const rows = data?.siteLogs?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.siteLogs?.pageInfo;
  const totalAvailable = data?.siteLogs?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "topic",
        header: "Topic",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (row) => row.topic
      },
      {
        id: "note",
        header: "Note",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.note
      },
      {
        id: "created",
        header: "Created",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (row) => row.createdAt
      }
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Log
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Activity logs and audit history.</p>
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
    </div>
  );
}
