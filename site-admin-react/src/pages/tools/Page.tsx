import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SITE_PAGES } from "@/graphql/queries/tools";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import SelectAllCheckbox from "@/components/SelectAllCheckbox";
import TableBulkBar from "@/components/TableBulkBar";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import useRowSelection from "@/hooks/useRowSelection";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

dayjs.extend(relativeTime);

const tabs = [
  { id: null, name: "All" },
  { id: 0, name: "Active" },
  { id: 1, name: "Inactive" }
];

const perPageOptions = [
  { name: "15", value: 15 },
  { name: "30", value: 30 },
  { name: "100", value: 100 },
  { name: "200", value: 200 }
];

export default function Page() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("All");
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      first,
      after: null
    }),
    [siteId, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(SITE_PAGES, {
    variables,
    skip: !siteId
  });

  const pages = data?.sitePages?.edges ?? [];
  const pageRows = useMemo(() => pages.map((item: any) => item.node), [pages]);
  const pageInfo = data?.sitePages?.pageInfo;
  const totalAvailable = data?.sitePages?.total ?? pages.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || pages.length < totalAvailable;

  const { selectedIds, allSelected, indeterminate, toggleAll, toggleOne, clearSelection } = useRowSelection({
    rows: pageRows,
    getId: (row: any) => row.id
  });

  const selectPage = (id: number) => {
    navigate(`/tool/page/update/${id}`);
  };

  return (
    <div className="space-y-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto relative">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            Page
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
            >
              ↻
            </button>
          </h1>
          <p className="mt-2 text-sm text-gray-700">Create and Manage Web Pages for a Seamless Online Experience</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/tool/page/create/"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add New
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-4 w-full">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => {
                  setSelectedTab(tab.name);
                  refetch({
                    isActive: tab.name === "All" ? null : tab.name === "Active"
                  });
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.name
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-4 lg:-mx-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-5">
            <div className="table-source-wrap">
              <TableBulkBar selectedCount={selectedIds.length} actions={[]} onClear={clearSelection} />
              <AppTable className="data-table min-w-full divide-y divide-gray-300">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead scope="col" className="relative w-6 px-4 sm:w-6 sm:px-4">
                      SL
                    </TableHead>
                    <TableHead scope="col" className="relative w-5 px-5 sm:w-5 sm:px-5">
                      <SelectAllCheckbox
                        checked={allSelected}
                        indeterminate={indeterminate}
                        disabled={pages.length === 0}
                        onChange={toggleAll}
                        ariaLabel="Select all pages"
                        className="absolute left-3 top-1/2 -mt-2 h-4 w-4 -translate-y-1/2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      />
                    </TableHead>
                    <TableHead scope="col" className="min-w-[6rem] w-full py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Status
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Url
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Update
                    </TableHead>
                    <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6 w-20">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {pages.map((page: any, index: number) => {
                    const row = page.node;
                    const pageUrl = site?.domain ? `https://${site.domain}/page/${row.slug}/` : `/page/${row.slug}/`;
                    return (
                      <TableRow
                        key={row.id}
                        className={`cursor-pointer active:cursor-wait ${selectedIds.includes(row.id) ? "bg-gray-50" : ""}`}
                      >
                        <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
                        <TableCell className="relative w-5 px-5 sm:w-5 sm:px-5">
                          {selectedIds.includes(row.id) ? (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          ) : null}
                          <SelectAllCheckbox
                            checked={selectedIds.includes(row.id)}
                            onChange={(checked) => toggleOne(row.id, checked)}
                            ariaLabel={`Select page ${row.title ?? row.id}`}
                            className="absolute left-3 top-1/2 -mt-2 h-4 w-4 -translate-y-1/2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                          />
                        </TableCell>
                        <TableCell onClick={() => selectPage(row.id)} className="whitespace-nowrap py-2 pl-3 sm:pl-0 pr-3 text-sm">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium text-gray-900">{row.title}</div>
                              <div className="text-gray-500 text-xs">{pageUrl}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => selectPage(row.id)} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              row.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {row.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="px-2 py-2 text-sm text-gray-500">
                          <a href={pageUrl} target="_blank" rel="noreferrer" className="text-blue-700 line-clamp-2 leading-snug">
                            {`/page/${row.slug}/`}
                          </a>
                        </TableCell>
                        <TableCell onClick={() => selectPage(row.id)} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <div className="text-gray-900">{row.updatedAt ? dayjs(row.updatedAt).fromNow() : "—"}</div>
                          <div className="text-gray-500 text-xs">
                            {row.updatedAt ? dayjs(row.updatedAt).format("h:mm A MMM D") : "—"}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right sm:pr-4">
                          <button
                            type="button"
                            onClick={() => selectPage(row.id)}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </AppTable>
              {!loading && pages.length === 0 ? (
                <div className="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">No record :-(</p>
                  </div>
                </div>
              ) : null}
              {pages.length >= first || pageInfo?.hasNextPage ? (
                <PaginationFooter
                  count={pages.length}
                  total={totalAvailable}
                  from={pages.length ? 1 : 0}
                  to={pages.length}
                  hasNext={hasMore}
                  onLoadMore={() => {
                    fetchMore({
                      variables: nextPageVariables({
                        baseVariables: { siteId: siteId ?? 0 },
                        pageInfo,
                        currentCount: pages.length,
                        pageSize: first
                      })
                    });
                  }}
                  label="pages"
                  loading={loading}
                  pageSize={first}
                  pageSizeOptions={perPageOptions.map((item) => item.value)}
                  onPageSizeChange={setFirst}
                  nextLabel="Next"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
