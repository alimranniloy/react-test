import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { STORE_CATEGORIES, STORE_SUB_CATEGORIES, STORE_SUB_SUB_CATEGORIES } from "@/graphql/queries/catalog";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SubSubCategoryList() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);

  const { data: categoryData } = useQuery(STORE_CATEGORIES, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });

  const { data: subCategoryData } = useQuery(STORE_SUB_CATEGORIES, {
    variables: { siteId: siteId ? [siteId] : [], categoryId, first: 200 },
    skip: !siteId
  });

  const subSubCategoryVariables = useMemo(
    () => ({ siteId: siteId ? [siteId] : [], categoryId, subCategoryId, first }),
    [siteId, categoryId, subCategoryId, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_SUB_SUB_CATEGORIES, {
    variables: subSubCategoryVariables,
    skip: !siteId
  });

  const categories = categoryData?.storeCategories?.edges?.map((edge: any) => edge.node) ?? [];
  const subCategories = subCategoryData?.storeSubCategories?.edges?.map((edge: any) => edge.node) ?? [];
  const subSubCategories = data?.storeSubSubCategories?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeSubSubCategories?.pageInfo;
  const totalAvailable = data?.storeSubSubCategories?.total ?? subSubCategories.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || subSubCategories.length < totalAvailable;

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((category: any) => map.set(category.id, category.title));
    return map;
  }, [categories]);

  const subCategoryMap = useMemo(() => {
    const map = new Map<number, string>();
    subCategories.forEach((item: any) => map.set(item.id, item.title));
    return map;
  }, [subCategories]);

  return (
    <main>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Sub sub category</h2>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
              >
                ⚡
              </button>
            </div>
            <p className="text-sm text-slate-500">Manage deeper catalog groupings for accurate browsing.</p>
          </div>
          <div>
            <Link
              to="/product/sub-sub-category/create/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              Add New
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
            Sub category
            <select
              value={subCategoryId ?? ""}
              onChange={(event) =>
                setSubCategoryId(event.target.value ? Number(event.target.value) : null)
              }
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
            >
              <option value="">All sub categories</option>
              {subCategories.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.title}
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
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sub category</TableHead>
                    <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {subSubCategories.map((item: any, index: number) => (
                    <TableRow key={item.id} className="cursor-pointer active:cursor-wait">
                      <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
                      <TableCell className="py-4 pl-3 sm:pl-0 pr-3 text-sm text-gray-900">{item.title}</TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-500">
                        {categoryMap.get(item.categoryId) ?? "—"}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-500">
                        {subCategoryMap.get(item.subCategoryId) ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right text-sm text-gray-500">
                        <Link to={`/product/sub-sub-category/${item.id}/edit`} className="text-indigo-600 hover:underline">
                          Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && subSubCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                        No sub sub categories found.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="px-5 py-6 text-sm text-slate-400">
                        Loading sub sub categories...
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </AppTable>
            </div>
            <PaginationFooter
              count={subSubCategories.length}
              total={totalAvailable}
              from={subSubCategories.length ? 1 : 0}
              to={subSubCategories.length}
              hasNext={hasMore}
              onLoadMore={() =>
                fetchMore({
                  variables: nextPageVariables({
                    baseVariables: subSubCategoryVariables,
                    pageInfo,
                    currentCount: subSubCategories.length,
                    pageSize: first
                  })
                })
              }
              loading={loading}
              pageSize={first}
              pageSizeOptions={[15, 30, 50, 100]}
              onPageSizeChange={setFirst}
              label="sub sub categories"
              nextLabel="Next"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
