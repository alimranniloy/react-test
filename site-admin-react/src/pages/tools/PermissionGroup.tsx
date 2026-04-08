import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { SITE_PERMISSIONS } from "@/graphql/queries/tools";
import { useSiteStore } from "@/store/useSiteStore";
import PermissionGroupAction from "@/pages/tools/PermissionGroupAction";
import PaginationFooter from "@/components/PaginationFooter";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const perPageOptions = [
  { name: "15", value: 15 },
  { name: "50", value: 50 },
  { name: "100", value: 100 }
];

export default function PermissionGroup() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [permissionIndex, setPermissionIndex] = useState<number | null>(null);
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      first,
      after: null
    }),
    [siteId, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(SITE_PERMISSIONS, {
    variables,
    skip: !siteId
  });

  const rows = data?.sitePermissions?.edges ?? [];
  const pageInfo = data?.sitePermissions?.pageInfo;
  const totalAvailable = data?.sitePermissions?.total ?? rows.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || rows.length < totalAvailable;

  const selectPermission = (index: number) => {
    setPermissionIndex(index);
  };

  const closeAction = () => {
    setPermissionIndex(null);
  };

  return (
    <div className="space-y-5">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto relative">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            Permission Group
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
            >
              ↻
            </button>
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage Team Members and Assign Roles for Efficient Business Operations
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-4">
          <Link
            to="/tool/permission-group/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add New
          </Link>
        </div>
      </div>

      <div className="my-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-4 lg:-mx-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-5">
            <div className="table-source-wrap">
              <AppTable className="data-table min-w-full table-fixed divide-y divide-gray-300">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead scope="col" className="w-[55px]">
                      SL
                    </TableHead>
                    <TableHead scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Title
                    </TableHead>
                    <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {rows.map((row: any, index: number) => {
                    const permission = row.node;
                    const expanded = index === permissionIndex;
                    return (
                      <TableRow key={permission.id} className="cursor-pointer active:cursor-wait">
                        {expanded ? (
                          <TableCell colSpan={3} className="relative w-[55px] bg-white">
                            <PermissionGroupAction
                              id={permission.id}
                              onClose={closeAction}
                              onSaved={() => {
                                refetch();
                                closeAction();
                              }}
                            />
                          </TableCell>
                        ) : (
                          <>
                            <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
                            <TableCell onClick={() => selectPermission(index)} className="whitespace-nowrap py-2 px-3 text-sm">
                              <div className="font-medium text-gray-900">{permission.title}</div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right">
                              <button
                                type="button"
                                onClick={() => selectPermission(index)}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </AppTable>
              {!loading && rows.length === 0 ? (
                <div className="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">No record :-(</p>
                  </div>
                </div>
              ) : null}
              {rows.length >= first || pageInfo?.hasNextPage ? (
                <PaginationFooter
                  count={rows.length}
                  total={totalAvailable}
                  hasNext={hasMore}
                  onLoadMore={() => {
                    fetchMore({
                      variables: nextPageVariables({
                        baseVariables: { siteId: siteId ?? 0 },
                        pageInfo,
                        currentCount: rows.length,
                        pageSize: first
                      })
                    });
                  }}
                  label="groups"
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
