import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { STORE_AUTHORS } from "@/graphql/queries/catalog";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

export default function AuthorList() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [search, setSearch] = useState("");
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({ siteId: siteId ? [siteId] : [], search: search.trim() || null, first }),
    [siteId, search, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_AUTHORS, {
    variables,
    skip: !siteId
  });

  const authors = data?.storeAuthors?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeAuthors?.pageInfo;
  const totalAvailable = data?.storeAuthors?.total ?? authors.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || authors.length < totalAvailable;

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        headClassName: "min-w-[6rem] w-full py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900",
        cellClassName: "py-4 pl-3 sm:pl-0 pr-3 text-sm text-gray-900",
        cell: (author) => author.title
      },
      {
        id: "action",
        header: "Action",
        headClassName: "px-4 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6",
        cellClassName: "px-4 py-2 text-right text-sm text-gray-500",
        cell: (author) => (
          <Link to={`/product/author/${author.id}/edit`} className="text-indigo-600 hover:underline">
            Edit
          </Link>
        )
      }
    ],
    []
  );

  return (
    <main>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Author</h2>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
              >
                ⚡
              </button>
            </div>
            <p className="text-sm text-slate-500">Keep author profiles organized and searchable.</p>
          </div>
          <div>
            <Link
              to="/product/author/create/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              Add New
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search authors"
              className="w-64 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-4 lg:-mx-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-5">
            <DataTable
              rows={authors}
              getRowId={(row) => row.id}
              columns={columns}
              loading={loading}
              emptyLabel="No authors found."
              pagination={{
                mode: "cursor",
                count: authors.length,
                total: totalAvailable,
                from: authors.length ? 1 : 0,
                to: authors.length,
                hasNext: hasMore,
                onLoadMore: () =>
                  fetchMore({
                    variables: nextPageVariables({
                      baseVariables: variables,
                      pageInfo,
                      currentCount: authors.length,
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
        </div>
      </div>
    </main>
  );
}
