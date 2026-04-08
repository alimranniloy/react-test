import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FILE_FILES } from "@/graphql/queries/tools";
import { useAuthStore } from "@/store/useAuthStore";
import PaginationFooter from "@/components/PaginationFooter";
import SelectAllCheckbox from "@/components/SelectAllCheckbox";
import TableBulkBar from "@/components/TableBulkBar";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import useRowSelection from "@/hooks/useRowSelection";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

dayjs.extend(relativeTime);

const perPageOptions = [
  { name: "15", value: 15 },
  { name: "30", value: 30 },
  { name: "100", value: 100 },
  { name: "200", value: 200 },
  { name: "500", value: 500 },
  { name: "1000", value: 1000 },
  { name: "3000", value: 3000 }
];

const limitOptions = [
  { name: "256", value: 256 },
  { name: "500", value: 500 },
  { name: "1000", value: 1000 },
  { name: "3000", value: 3000 }
];

const formatBytes = (bytes: number) => {
  if (!bytes && bytes !== 0) return "0 B";
  if (bytes < 1024) return `${bytes.toFixed(2)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

type FileProps = {
  view?: "select";
  onFile?: (url: string) => void;
};

export default function File({ view, onFile }: FileProps) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const navigate = useNavigate();
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);
  const [limit, setLimit] = useState(256);
  const [limitOpen, setLimitOpen] = useState(false);

  const variables = useMemo(
    () => ({
      userId: userId ?? 0,
      first,
      after: null,
      limit
    }),
    [userId, first, limit]
  );

  const { data, loading, refetch, fetchMore } = useQuery(FILE_FILES, {
    variables,
    skip: !userId
  });

  const files = data?.fileFiles?.edges ?? [];
  const fileRows = useMemo(() => files.map((edge: any) => edge.node), [files]);
  const pageInfo = data?.fileFiles?.pageInfo;
  const totalAvailable = data?.fileFiles?.total ?? files.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || files.length < totalAvailable;

  const { selectedIds, allSelected, indeterminate, toggleAll, toggleOne, clearSelection } = useRowSelection({
    rows: fileRows,
    getId: (file: any) => file.id
  });

  const selectFile = (id: number) => {
    if (view === "select") return;
    navigate(`/tool/file/update/${id}`);
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto relative">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            File
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
            >
              ↻
            </button>
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and Organize Files and Documents for Easy Access and Collaboration
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/tool/file/create/"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add New
          </Link>
          <Link
            to="/tool/file/bulk/"
            className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add Bulk
          </Link>
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
                        disabled={files.length === 0}
                        onChange={toggleAll}
                        ariaLabel="Select all files"
                        className="absolute left-3 top-1/2 -mt-2 h-4 w-4 -translate-y-1/2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      />
                    </TableHead>
                    <TableHead scope="col" className="min-w-[6rem] w-full py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Size
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
                  {files.map((edge: any, index: number) => {
                    const file = edge.node;
                    const safeUrl = file.isSecure && file.url?.includes(".mp4")
                      ? file.url.replace("video", "drm").replace(".mp4", ".m3u8")
                      : file.url;
                    return (
                      <TableRow
                        key={file.id}
                        className={`cursor-pointer active:cursor-wait ${selectedIds.includes(file.id) ? "bg-gray-50" : ""}`}
                      >
                        <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
                        <TableCell className="relative w-5 px-5 sm:w-5 sm:px-5">
                          {selectedIds.includes(file.id) ? (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          ) : null}
                          <SelectAllCheckbox
                            checked={selectedIds.includes(file.id)}
                            onChange={(checked) => toggleOne(file.id, checked)}
                            ariaLabel={`Select file ${file.title ?? file.id}`}
                            className="absolute left-3 top-1/2 -mt-2 h-4 w-4 -translate-y-1/2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                          />
                        </TableCell>
                        <TableCell onClick={() => selectFile(file.id)} className="truncate py-2 pl-3 sm:pl-0 pr-3 text-sm max-w-[170px]">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium text-gray-900">{file.title}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => selectFile(file.id)} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <span className="bg-green-100 text-green-800 inline-flex rounded-full px-2 text-xs font-semibold leading-5">
                            {formatBytes(file.size)}
                          </span>
                        </TableCell>
                        <TableCell onClick={() => selectFile(file.id)} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <div className="text-gray-900">{file.updatedAt ? dayjs(file.updatedAt).fromNow() : "—"}</div>
                          <div className="text-gray-500 text-xs">
                            {file.updatedAt ? dayjs(file.updatedAt).format("h:mm A MMM D") : "—"}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right sm:pr-4 flex items-center gap-2">
                          {view === "select" ? (
                            <button
                              type="button"
                              onClick={() => onFile?.(safeUrl)}
                              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Select
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => copyUrl(safeUrl)}
                                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                URL
                              </button>
                              <button
                                type="button"
                                onClick={() => selectFile(file.id)}
                                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </AppTable>
              {!loading && files.length === 0 ? (
                <div className="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">No record :-(</p>
                  </div>
                </div>
              ) : null}
              {files.length >= first || pageInfo?.hasNextPage ? (
                <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-4">
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <div className="inline-flex rounded-md shadow-sm">
                      <button
                        type="button"
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Max limit
                      </button>
                      <div className="relative -ml-px block">
                        <button
                          type="button"
                          onClick={() => setLimitOpen((prev) => !prev)}
                          className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          {limit}
                          <span className="ml-1">▾</span>
                        </button>
                        {limitOpen ? (
                          <div className="absolute left-0 sm:left-auto sm:right-0 bottom-12 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {limitOptions.map((item) => (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => {
                                    setLimit(item.value);
                                    setLimitOpen(false);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {item.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <PaginationFooter
                    count={files.length}
                    total={totalAvailable}
                    from={files.length ? 1 : 0}
                    to={files.length}
                    hasNext={hasMore}
                    onLoadMore={() => {
                      fetchMore({
                        variables: nextPageVariables({
                          baseVariables: { userId: userId ?? 0, limit },
                          pageInfo,
                          currentCount: files.length,
                          pageSize: first
                        })
                      });
                    }}
                    label="files"
                    loading={loading}
                    pageSize={first}
                    pageSizeOptions={perPageOptions.filter((item) => item.value <= limit).map((item) => item.value)}
                    onPageSizeChange={setFirst}
                    nextLabel="Next"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
