import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_CATEGORIES } from "@/graphql/queries/catalog";
import { SELF_STORE_CATEGORY_DELETE, SELF_STORE_CATEGORY_UPDATE_STATUS } from "@/graphql/mutations/catalog";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import SelectAllCheckbox from "@/components/SelectAllCheckbox";
import TableBulkBar from "@/components/TableBulkBar";
import { nextPageVariables } from "@/lib/pagination";
import useRowSelection from "@/hooks/useRowSelection";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CategoryList() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const user = useAuthStore((state) => state.user);
  const [selectedTab, setSelectedTab] = useState("All");
  const [first, setFirst] = useState(15);

  const statusFilter = selectedTab === "All" ? null : selectedTab === "Active";
  const variables = useMemo(
    () => ({ siteId: siteId ? [siteId] : [], isActive: statusFilter, first }),
    [siteId, statusFilter, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_CATEGORIES, {
    variables,
    skip: !siteId
  });

  const categories = data?.storeCategories?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeCategories?.pageInfo;
  const totalAvailable = data?.storeCategories?.total ?? categories.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || categories.length < totalAvailable;
  const { selectedIds, allSelected, indeterminate, toggleAll, toggleOne, clearSelection } = useRowSelection({
    rows: categories,
    getId: (category: any) => category.id
  });

  const [updateStatus] = useMutation(SELF_STORE_CATEGORY_UPDATE_STATUS);
  const [deleteCategory] = useMutation(SELF_STORE_CATEGORY_DELETE);

  const runBulkAction = async (isActive: boolean) => {
    if (!user?.id || !siteId || selectedIds.length === 0) return;
    await Promise.all(
      selectedIds.map((id) =>
        updateStatus({ variables: { userId: user.id, siteId, id, isActive } })
      )
    );
    clearSelection();
  };

  const runDelete = async () => {
    if (!user?.id || !siteId || selectedIds.length === 0) return;
    await Promise.all(selectedIds.map((id) => deleteCategory({ variables: { userId: user.id, siteId, id } })));
    clearSelection();
  };

  return (
    <main>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Category</h2>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
              >
                ⚡
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Classify and manage your catalog in clean, meaningful groups so customers can browse with confidence.
            </p>
          </div>
          <div>
            <Link
              to="/product/category/create/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              Add New
            </Link>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          {["All", "Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className={`inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium transition ${
                selectedTab === tab
                  ? "border-indigo-100 bg-indigo-50 text-indigo-700 shadow-sm"
                  : "border-transparent bg-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-4 lg:-mx-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-5">
            <div className="table-source-wrap">
              <TableBulkBar
                selectedCount={selectedIds.length}
                onClear={clearSelection}
                actions={[
                  { label: "Active", onClick: () => runBulkAction(true), tone: "success" },
                  { label: "Inactive", onClick: () => runBulkAction(false), tone: "warning" },
                  { label: "Delete", onClick: runDelete, tone: "danger" }
                ]}
              />
              <AppTable className="data-table min-w-full divide-y divide-gray-300">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead scope="col" className="relative w-6 px-4 sm:w-6 sm:px-4">SL</TableHead>
                    <TableHead scope="col" className="relative w-5 px-5 sm:w-5 sm:px-5">
                      <SelectAllCheckbox
                        checked={allSelected}
                        indeterminate={indeterminate}
                        disabled={categories.length === 0}
                        onChange={toggleAll}
                        ariaLabel="Select all categories"
                        className="absolute left-3 top-1/2 -mt-2 h-4 w-4 -translate-y-1/2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                      />
                    </TableHead>
                    <TableHead scope="col" className="min-w-[6rem] w-full py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">Status</TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">Update</TableHead>
                    <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6 w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {categories.map((category: any, index: number) => (
                    <TableRow
                      key={category.id}
                      className={`cursor-pointer active:cursor-wait ${selectedIds.includes(category.id) ? "bg-gray-50" : ""}`}
                    >
                      <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
                      <TableCell className="relative w-5 px-5 sm:w-5 sm:px-5">
                        {selectedIds.includes(category.id) ? (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"></div>
                        ) : null}
                        <SelectAllCheckbox
                          checked={selectedIds.includes(category.id)}
                          onChange={(checked) => toggleOne(category.id, checked)}
                          ariaLabel={`Select category ${category.title ?? category.id}`}
                          className="absolute left-3 top-1/2 -mt-2 h-4 w-4 -translate-y-1/2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-3"
                        />
                      </TableCell>
                      <TableCell className="py-4 pl-3 sm:pl-0 pr-3 text-sm text-gray-900">{category.title}</TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
                            category.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-500">{category.updatedAt?.slice(0, 10) ?? "—"}</TableCell>
                      <TableCell className="px-4 py-2 text-right text-sm text-gray-500">
                        <Link to={`/product/category/${category.id}/edit`} className="text-indigo-600 hover:underline">
                          Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                        No categories found.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-5 py-6 text-sm text-slate-400">
                        Loading categories...
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </AppTable>
            </div>
            <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-4">
              <PaginationFooter
                count={categories.length}
                total={totalAvailable}
                from={categories.length ? 1 : 0}
                to={categories.length}
                hasNext={hasMore}
                onLoadMore={() => {
                  fetchMore({
                    variables: nextPageVariables({
                      baseVariables: variables,
                      pageInfo,
                      currentCount: categories.length,
                      pageSize: first
                    })
                  });
                }}
                loading={loading}
                pageSize={first}
                pageSizeOptions={[15, 30, 50, 100]}
                onPageSizeChange={setFirst}
                label="categories"
                nextLabel="Next"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
