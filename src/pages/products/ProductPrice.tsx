import AppTable from "@/components/AppTable";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_PRODUCTS } from "@/graphql/queries/product";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  STORE_AUTHORS,
  STORE_BRANDS,
  STORE_CATEGORIES,
  STORE_SUB_CATEGORIES,
  STORE_SUB_SUB_CATEGORIES,
  STORE_SUPPLIERS
} from "@/graphql/queries/catalog";
import { SELF_STORE_PRODUCT_UPDATE_FROM_COMPARE_PRICE_BY_PERCENTAGE } from "@/graphql/mutations/product";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import SelectAllCheckbox from "@/components/SelectAllCheckbox";
import TableBulkBar from "@/components/TableBulkBar";

type Tab = "All" | "Active" | "Inactive";

export default function ProductPrice() {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;

  const [tab, setTab] = useState<Tab>("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [subSubCategoryId, setSubSubCategoryId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [percentagePrice, setPercentagePrice] = useState("0");
  const [percentageCost, setPercentageCost] = useState("0");
  const [percentageWholesale, setPercentageWholesale] = useState("0");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const isActive = tab === "All" ? null : tab === "Active";

  const queryVariables = useMemo(
    () => ({
      siteId: siteId ? [siteId] : [],
      isActive,
      search: search.trim() || null,
      categoryId,
      subCategoryId,
      subSubCategoryId,
      brandId,
      supplierId,
      authorId,
      first: 15
    }),
    [siteId, isActive, search, categoryId, subCategoryId, subSubCategoryId, brandId, supplierId, authorId]
  );

  const { data, loading, refetch } = useQuery(STORE_PRODUCTS, {
    variables: queryVariables,
    skip: !siteId
  });

  const { data: categoriesData } = useQuery(STORE_CATEGORIES, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });
  const { data: subCategoriesData } = useQuery(STORE_SUB_CATEGORIES, {
    variables: { siteId: siteId ? [siteId] : [], categoryId, first: 200 },
    skip: !siteId
  });
  const { data: subSubCategoriesData } = useQuery(STORE_SUB_SUB_CATEGORIES, {
    variables: { siteId: siteId ? [siteId] : [], categoryId, subCategoryId, first: 200 },
    skip: !siteId
  });
  const { data: brandsData } = useQuery(STORE_BRANDS, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });
  const { data: suppliersData } = useQuery(STORE_SUPPLIERS, {
    variables: { siteId, first: 200 },
    skip: !siteId
  });
  const { data: authorsData } = useQuery(STORE_AUTHORS, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });

  const products = data?.storeProducts?.edges?.map((edge: any) => edge.node) ?? [];
  const categories = categoriesData?.storeCategories?.edges?.map((edge: any) => edge.node) ?? [];
  const subCategories = subCategoriesData?.storeSubCategories?.edges?.map((edge: any) => edge.node) ?? [];
  const subSubCategories = subSubCategoriesData?.storeSubSubCategories?.edges?.map((edge: any) => edge.node) ?? [];
  const brands = brandsData?.storeBrands?.edges?.map((edge: any) => edge.node) ?? [];
  const suppliers = suppliersData?.storeSuppliers?.edges?.map((edge: any) => edge.node) ?? [];
  const authors = authorsData?.storeAuthors?.edges?.map((edge: any) => edge.node) ?? [];

  const [bulkUpdate, { loading: updating }] = useMutation(SELF_STORE_PRODUCT_UPDATE_FROM_COMPARE_PRICE_BY_PERCENTAGE);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, page, pageSize]);

  const visibleIds = pagedProducts.map((product: any) => product.id);
  const selectedOnPage = selectedIds.filter((id) => visibleIds.includes(id));
  const allSelected = pagedProducts.length > 0 && selectedOnPage.length === pagedProducts.length;
  const indeterminate = selectedOnPage.length > 0 && selectedOnPage.length < pagedProducts.length;

  useEffect(() => {
    setPage(1);
  }, [search, tab, categoryId, subCategoryId, subSubCategoryId, brandId, supplierId, authorId]);

  useEffect(() => {
    const idSet = new Set(products.map((product: any) => product.id));
    setSelectedIds((prev) => prev.filter((id) => idSet.has(id)));
    if (page > totalPages) setPage(totalPages);
  }, [products, page, totalPages]);

  const toggleAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const toggleOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((item) => item !== id);
    });
  };

  const normalize = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const runUpdate = async () => {
    if (!user?.id || !siteId || selectedIds.length === 0) return;

    const tasks: Array<{ percentage: number; percentageType: "price" | "cost" | "wholesale_price" }> = [];
    const sale = normalize(percentagePrice);
    const cost = normalize(percentageCost);
    const wholesale = normalize(percentageWholesale);

    if (sale > 0) tasks.push({ percentage: sale, percentageType: "price" });
    if (cost > 0) tasks.push({ percentage: cost, percentageType: "cost" });
    if (wholesale > 0) tasks.push({ percentage: wholesale, percentageType: "wholesale_price" });
    if (tasks.length === 0) return;

    for (const item of tasks) {
      await bulkUpdate({
        variables: {
          userId: user.id,
          siteId,
          productIds: selectedIds,
          percentage: item.percentage,
          percentageType: item.percentageType,
          categoryId: categoryId ?? 0,
          subCategoryId: subCategoryId ?? 0,
          subSubCategoryId: subSubCategoryId ?? 0,
          supplierId: supplierId ?? 0,
          brandId: brandId ?? 0,
          shopId: 0,
          tagIds: null,
          authorId: authorId ?? 0
        }
      });
    }

    setPercentagePrice("0");
    setPercentageCost("0");
    setPercentageWholesale("0");
    setSelectedIds([]);
    await refetch();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900">Product Price Update</h1>
        <p className="mt-2 text-sm text-gray-700">Bulk-update sale, cost, or wholesale price from compare price percentage.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["All", "Active", "Inactive"] as Tab[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                tab === item ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <select value={categoryId ?? ""} onChange={(event) => setCategoryId(event.target.value ? Number(event.target.value) : null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Category</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>{category.title}</option>
            ))}
          </select>
          <select value={subCategoryId ?? ""} onChange={(event) => setSubCategoryId(event.target.value ? Number(event.target.value) : null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" disabled={!categoryId}>
            <option value="">Sub category</option>
            {subCategories.map((item: any) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
          <select value={subSubCategoryId ?? ""} onChange={(event) => setSubSubCategoryId(event.target.value ? Number(event.target.value) : null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" disabled={!subCategoryId}>
            <option value="">Sub sub category</option>
            {subSubCategories.map((item: any) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
          <select value={brandId ?? ""} onChange={(event) => setBrandId(event.target.value ? Number(event.target.value) : null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Brand</option>
            {brands.map((item: any) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
          <select value={supplierId ?? ""} onChange={(event) => setSupplierId(event.target.value ? Number(event.target.value) : null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Supplier</option>
            {suppliers.map((item: any) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
          <select value={authorId ?? ""} onChange={(event) => setAuthorId(event.target.value ? Number(event.target.value) : null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Author</option>
            {authors.map((item: any) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input type="number" value={percentagePrice} onChange={(event) => setPercentagePrice(event.target.value)} placeholder="Customer sale %" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input type="number" value={percentageCost} onChange={(event) => setPercentageCost(event.target.value)} placeholder="Cost %" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input type="number" value={percentageWholesale} onChange={(event) => setPercentageWholesale(event.target.value)} placeholder="Wholesale %" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <button
            type="button"
            onClick={runUpdate}
            disabled={updating || selectedIds.length === 0}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Selected"}
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <TableBulkBar
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          actions={[
            {
              label: updating ? "Updating..." : "Update Selected",
              onClick: runUpdate,
              tone: "success",
              disabled: updating || selectedIds.length === 0
            }
          ]}
        />
        <AppTable className="data-table min-w-full divide-y divide-gray-300">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                <SelectAllCheckbox
                  checked={allSelected}
                  indeterminate={indeterminate}
                  disabled={pagedProducts.length === 0}
                  onChange={toggleAll}
                  ariaLabel="Select all visible products"
                />
              </TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Compare</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Qty</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {pagedProducts.map((product: any) => (
              <TableRow key={product.id} className="hover:bg-slate-50">
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  <SelectAllCheckbox
                    checked={selectedIds.includes(product.id)}
                    onChange={(checked) => toggleOne(product.id, checked)}
                    ariaLabel={`Select product ${product.title ?? product.id}`}
                  />
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-700">{product.title}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{product.cost ?? 0}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{product.price ?? 0}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{product.comparePrice ?? 0}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{product.quantity ?? 0}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{product.isActive ? "Active" : "Inactive"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AppTable>
        {!loading && products.length === 0 ? (
          <div className="text-center border-t border-gray-200 bg-white px-4 py-6 text-sm text-gray-700">No products found.</div>
        ) : null}
      </div>
      <PaginationFooter
        count={pagedProducts.length}
        total={products.length}
        from={products.length === 0 ? 0 : (page - 1) * pageSize + 1}
        to={Math.min(page * pageSize, products.length)}
        page={page}
        pageCount={totalPages}
        onPageChange={(next) => setPage(Math.max(1, Math.min(totalPages, next)))}
        pageSize={pageSize}
        pageSizeOptions={[15, 30, 50, 100]}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
        loading={loading}
      />
    </div>
  );
}
