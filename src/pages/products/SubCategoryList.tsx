import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { STORE_CATEGORIES, STORE_SUB_CATEGORIES } from "@/graphql/queries/catalog";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SubCategoryList() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);

  const { data: categoryData } = useQuery(STORE_CATEGORIES, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });

  const subCategoryVariables = useMemo(
    () => ({ siteId: siteId ? [siteId] : [], categoryId, first }),
    [siteId, categoryId, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_SUB_CATEGORIES, {
    variables: subCategoryVariables,
    skip: !siteId
  });

  const categories = categoryData?.storeCategories?.edges?.map((edge: any) => edge.node) ?? [];
  const subCategories = data?.storeSubCategories?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeSubCategories?.pageInfo;
  const totalAvailable = data?.storeSubCategories?.total ?? subCategories.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || subCategories.length < totalAvailable;
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((category: any) => map.set(category.id, category.title));
    return map;
  }, [categories]);

  return (
    <main>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Sub category</h2>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
              >
                ⚡
              </button>
            </div>
            <p className="text-sm text-slate-500">Organize catalog sub categories and tie them to parent categories.</p>
          </div>
          <div>
            <Link
              to="/product/sub-category/create/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              Add New
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
            Category
            <select
              value={categoryId ?? ""}
              onChange={(event) =>
                setCategoryId(event.target.value ? Number(event.target.value) : null)
              }
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
            >
              <option value="">All categories</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-4 lg:-mx-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-5">
            <div className="table-source-wrap">
              <AppTable className="data-table min-w-full divide-y divide-gray-300">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead scope="col" className="relative w-6 px-4 sm:w-6 sm:px-4">SL</TableHead>
                    <TableHead scope="col" className="min-w-[6rem] w-full py-3.5 pl-3 sm:pl-0 pr-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</TableHead>
                    <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {subCategories.map((item: any, index: number) => (
                    <TableRow key={item.id} className="cursor-pointer active:cursor-wait">
                      <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
                      <TableCell className="py-4 pl-3 sm:pl-0 pr-3 text-sm text-gray-900">{item.title}</TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-500">
                        {categoryMap.get(item.categoryId) ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right text-sm text-gray-500">
                        <Link to={`/product/sub-category/${item.id}/edit`} className="text-indigo-600 hover:underline">
                          Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && subCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500">
                        No sub categories found.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-5 py-6 text-sm text-slate-400">
                        Loading sub categories...
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </AppTable>
            </div>
            <PaginationFooter
              count={subCategories.length}
              total={totalAvailable}
              from={subCategories.length ? 1 : 0}
              to={subCategories.length}
              hasNext={hasMore}
              onLoadMore={() =>
                fetchMore({
                  variables: nextPageVariables({
                    baseVariables: subCategoryVariables,
                    pageInfo,
                    currentCount: subCategories.length,
                    pageSize: first
                  })
                })
              }
              loading={loading}
              pageSize={first}
              pageSizeOptions={[15, 30, 50, 100]}
              onPageSizeChange={setFirst}
              label="sub categories"
              nextLabel="Next"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
