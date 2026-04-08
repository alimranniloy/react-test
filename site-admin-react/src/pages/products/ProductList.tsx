import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_PRODUCTS } from "@/graphql/queries/product";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  STORE_AUTHORS,
  STORE_BRANDS,
  STORE_CATEGORIES,
  STORE_SUB_CATEGORIES,
  STORE_SUB_SUB_CATEGORIES,
  STORE_SUPPLIERS,
  STORE_TAGS,
} from "@/graphql/queries/catalog";
import {
  SELF_STORE_PRODUCT_DELETE,
  SELF_STORE_PRODUCT_UPDATE_STATUS,
} from "@/graphql/mutations/product";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import FilterSelect, { type FilterSelectOption } from "@/components/FilterSelect";
import PaginationFooter from "@/components/PaginationFooter";
import SelectAllCheckbox from "@/components/SelectAllCheckbox";
import TableBulkBar from "@/components/TableBulkBar";
import ProductAction from "@/pages/products/ProductAction";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import useRowSelection from "@/hooks/useRowSelection";

type Edge<T> = { node: T };

type PageInfo = {
  hasNextPage?: boolean | null;
  endCursor?: string | null;
};

type ProductSummary = {
  id: number;
  title?: string | null;
  sku?: string | null;
  isActive?: boolean | null;
  thumbnail?: string | null;
  quantity?: number | null;
  comparePrice?: number | null;
  cost?: number | null;
  price?: number | null;
  updatedAt?: string | null;
};

type StoreProductsData = {
  storeProducts?: {
    edges?: Edge<ProductSummary>[];
    pageInfo?: PageInfo;
    total?: number;
  };
};

type StoreCatalogData<T> = {
  [key: string]: {
    edges?: Edge<T>[];
  };
};

type ProductListProps = {
  title?: string;
  subtitle?: string;
};

export default function ProductList({
  title = "Products",
  subtitle = "Organize, update, and showcase your entire catalog for maximum visibility and sales.",
}: ProductListProps) {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"All" | "Active" | "Inactive">(
    "All",
  );
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [subSubCategoryId, setSubSubCategoryId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [tagId, setTagId] = useState<number | null>(null);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [committedSearch, setCommittedSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState<string | null>(null);
  const [subCategorySearch, setSubCategorySearch] = useState<string | null>(
    null,
  );
  const [subSubCategorySearch, setSubSubCategorySearch] = useState<
    string | null
  >(null);
  const [brandSearch, setBrandSearch] = useState<string | null>(null);
  const [authorSearch, setAuthorSearch] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState<string | null>(null);
  const [supplierSearch, setSupplierSearch] = useState<string | null>(null);
  const [activeProductId, setActiveProductId] = useState<number | null>(null);

  const statusFilter = selectedTab === "All" ? null : selectedTab === "Active";
  const variables = useMemo(
    () => ({
      siteId: siteId ? [siteId] : [],
      search: committedSearch || null,
      isActive: statusFilter,
      categoryId,
      subCategoryId,
      subSubCategoryId,
      brandId,
      authorId,
      tagId,
      supplierId,
      first: DEFAULT_PAGE_SIZE,
    }),
    [
      siteId,
      committedSearch,
      statusFilter,
      categoryId,
      subCategoryId,
      subSubCategoryId,
      brandId,
      authorId,
      tagId,
      supplierId,
    ],
  );

  const { data, loading, fetchMore, refetch } = useQuery<StoreProductsData>(
    STORE_PRODUCTS,
    {
      variables,
      skip: !siteId,
    },
  );

  const {
    data: categoriesData,
    refetch: refetchCategories,
    loading: loadingCategories,
  } = useQuery<StoreCatalogData<FilterSelectOption>>(STORE_CATEGORIES, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: categorySearch,
    },
    skip: !siteId,
  });
  const {
    data: subCategoriesData,
    refetch: refetchSubCategories,
    loading: loadingSubCategories,
  } = useQuery<StoreCatalogData<FilterSelectOption & { categoryId?: number }>>(
    STORE_SUB_CATEGORIES,
    {
      variables: {
        siteId: siteId ? [siteId] : [],
        categoryId: categoryId ?? null,
        first: 200,
        search: subCategorySearch,
      },
      skip: !siteId,
    },
  );
  const {
    data: subSubCategoriesData,
    refetch: refetchSubSubCategories,
    loading: loadingSubSubCategories,
  } = useQuery<StoreCatalogData<FilterSelectOption & { subCategoryId?: number }>>(
    STORE_SUB_SUB_CATEGORIES,
    {
      variables: {
        siteId: siteId ? [siteId] : [],
        subCategoryId: subCategoryId ?? null,
        first: 200,
        search: subSubCategorySearch,
      },
      skip: !siteId,
    },
  );
  const {
    data: brandsData,
    refetch: refetchBrands,
    loading: loadingBrands,
  } = useQuery<StoreCatalogData<FilterSelectOption>>(STORE_BRANDS, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: brandSearch,
    },
    skip: !siteId,
  });
  const {
    data: authorsData,
    refetch: refetchAuthors,
    loading: loadingAuthors,
  } = useQuery<StoreCatalogData<FilterSelectOption>>(STORE_AUTHORS, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: authorSearch,
    },
    skip: !siteId,
  });
  const {
    data: tagsData,
    refetch: refetchTags,
    loading: loadingTags,
  } = useQuery<StoreCatalogData<FilterSelectOption>>(STORE_TAGS, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: tagSearch,
    },
    skip: !siteId,
  });
  const {
    data: suppliersData,
    refetch: refetchSuppliers,
    loading: loadingSuppliers,
  } = useQuery<StoreCatalogData<FilterSelectOption & { isActive?: boolean }>>(
    STORE_SUPPLIERS,
    {
      variables: { siteId, first: 200, search: supplierSearch },
      skip: !siteId,
    },
  );

  const categories =
    categoriesData?.storeCategories?.edges?.map((edge) => edge.node) ?? [];
  const subCategories =
    subCategoriesData?.storeSubCategories?.edges?.map((edge) => edge.node) ??
    [];
  const subSubCategories =
    subSubCategoriesData?.storeSubSubCategories?.edges?.map(
      (edge) => edge.node,
    ) ?? [];
  const brands = brandsData?.storeBrands?.edges?.map((edge) => edge.node) ?? [];
  const authors =
    authorsData?.storeAuthors?.edges?.map((edge) => edge.node) ?? [];
  const tags = tagsData?.storeTags?.edges?.map((edge) => edge.node) ?? [];
  const suppliers =
    suppliersData?.storeSuppliers?.edges?.map((edge) => edge.node) ?? [];

  const products =
    data?.storeProducts?.edges?.map((edge) => edge.node) ?? [];
  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime;
      }),
    [products],
  );
  const pageInfo = data?.storeProducts?.pageInfo;
  const totalAvailable = data?.storeProducts?.total ?? products.length;
  const hasMore =
    (pageInfo?.hasNextPage ?? false) || products.length < totalAvailable;

  const [updateStatus] = useMutation(SELF_STORE_PRODUCT_UPDATE_STATUS);
  const [deleteProduct] = useMutation(SELF_STORE_PRODUCT_DELETE);

  const {
    selectedIds,
    allSelected,
    indeterminate,
    toggleAll,
    toggleOne,
    clearSelection
  } = useRowSelection({
    rows: sortedProducts,
    getId: (product) => product.id
  });

  const runBulkAction = async (action: "active" | "inactive" | "delete") => {
    if (!user?.id || !siteId || selectedIds.length === 0) return;
    if (action === "delete") {
      await Promise.all(
        selectedIds.map((id) =>
          deleteProduct({ variables: { userId: user.id, siteId, id } }),
        ),
      );
    } else {
      await Promise.all(
        selectedIds.map((id) =>
          updateStatus({
            variables: {
              userId: user.id,
              siteId,
              id,
              isActive: action === "active",
            },
          }),
        ),
      );
    }
    await refetch();
    clearSelection();
  };

  const handleLoadMore = async () => {
    if (!hasMore) return;
    await fetchMore({
      variables: nextPageVariables({
        baseVariables: variables,
        pageInfo,
        currentCount: products.length,
        pageSize: DEFAULT_PAGE_SIZE,
      }),
    });
  };

  const openAccordion = (id: number | null) => {
    setActiveProductId(id);
  };

  const closeAccordion = () => {
    setActiveProductId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
            >
              ↻
            </button>
            <Link
              to="/product/new"
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
            >
              Add New
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", "Active", "Inactive"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                selectedTab === tab
                  ? "border-indigo-100 bg-indigo-50 text-indigo-700 shadow-sm"
                  : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <svg
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  setCommittedSearch(search.trim());
                }
              }}
              placeholder="Search by title, SKU or barcode"
              className="w-64 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <FilterSelect
            label="Category"
            items={categories}
            value={categoryId}
            onChange={(next) => {
              const selected = Array.isArray(next) ? next[0] ?? null : next;
              setCategoryId(selected);
              setSubCategoryId(null);
              setSubSubCategoryId(null);
            }}
            loading={loadingCategories}
            onRefresh={() => refetchCategories()}
            onSearch={setCategorySearch}
          />
          <FilterSelect
            label="Sub Category"
            items={subCategories}
            value={subCategoryId}
            onChange={(next) => {
              const selected = Array.isArray(next) ? next[0] ?? null : next;
              setSubCategoryId(selected);
              setSubSubCategoryId(null);
            }}
            disabled={!categoryId}
            loading={loadingSubCategories}
            onRefresh={() => refetchSubCategories()}
            onSearch={setSubCategorySearch}
          />
          <FilterSelect
            label="Sub Sub Category"
            items={subSubCategories}
            value={subSubCategoryId}
            onChange={(next) =>
              setSubSubCategoryId(Array.isArray(next) ? next[0] ?? null : next)
            }
            disabled={!subCategoryId}
            loading={loadingSubSubCategories}
            onRefresh={() => refetchSubSubCategories()}
            onSearch={setSubSubCategorySearch}
          />
          <FilterSelect
            label="Brand"
            items={brands}
            value={brandId}
            onChange={(next) => setBrandId(Array.isArray(next) ? next[0] ?? null : next)}
            loading={loadingBrands}
            onRefresh={() => refetchBrands()}
            onSearch={setBrandSearch}
          />
          <FilterSelect
            label="Author"
            items={authors}
            value={authorId}
            onChange={(next) => setAuthorId(Array.isArray(next) ? next[0] ?? null : next)}
            loading={loadingAuthors}
            onRefresh={() => refetchAuthors()}
            onSearch={setAuthorSearch}
          />
          <FilterSelect
            label="Tag"
            items={tags}
            value={tagId}
            onChange={(next) => setTagId(Array.isArray(next) ? next[0] ?? null : next)}
            loading={loadingTags}
            onRefresh={() => refetchTags()}
            onSearch={setTagSearch}
          />
          <FilterSelect
            label="Supplier"
            items={suppliers}
            value={supplierId}
            onChange={(next) =>
              setSupplierId(Array.isArray(next) ? next[0] ?? null : next)
            }
            loading={loadingSuppliers}
            onRefresh={() => refetchSuppliers()}
            onSearch={setSupplierSearch}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-white">
        <TableBulkBar
          selectedCount={selectedIds.length}
          onClear={clearSelection}
          actions={[
            { label: "Activate", onClick: () => runBulkAction("active"), tone: "success" },
            { label: "Deactivate", onClick: () => runBulkAction("inactive"), tone: "warning" },
            { label: "Delete", onClick: () => runBulkAction("delete"), tone: "danger" }
          ]}
        />
        <div className="overflow-x-auto">
          <AppTable className="data-table min-w-[1100px] w-full divide-y divide-slate-200 text-sm">
            <TableHeader className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <TableRow>
                <TableHead className="w-12 px-4 py-3 text-left">
                  <SelectAllCheckbox
                    checked={allSelected}
                    indeterminate={indeterminate}
                    disabled={sortedProducts.length === 0}
                    onChange={toggleAll}
                    ariaLabel="Select all products"
                  />
                </TableHead>
                <TableHead className="px-4 py-3 text-left">Title</TableHead>
                <TableHead className="px-4 py-3 text-left">Image</TableHead>
                <TableHead className="px-4 py-3 text-right">Stock</TableHead>
                <TableHead className="px-4 py-3 text-right">MRP</TableHead>
                <TableHead className="px-4 py-3 text-right">Cost</TableHead>
                <TableHead className="px-4 py-3 text-right">Price</TableHead>
                <TableHead className="px-4 py-3 text-right">Profit</TableHead>
                <TableHead className="px-4 py-3 text-left">Update</TableHead>
                <TableHead className="px-4 py-3 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {sortedProducts.map((product) =>
                activeProductId === product.id ? (
                  <TableRow key={`product-edit-${product.id}`}>
                    <TableCell colSpan={10} className="px-4 py-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h3 className="text-sm font-semibold text-slate-800">
                          Edit Product #{product.id}
                        </h3>
                        <button
                          type="button"
                          onClick={closeAccordion}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          Close
                        </button>
                      </div>
                      <div className="pt-4">
                        <ProductAction productId={product.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow
                    key={product.id}
                    className={
                      selectedIds.includes(product.id)
                        ? "bg-slate-50"
                        : undefined
                    }
                  >
                    <TableCell className="px-4 py-3">
                      <SelectAllCheckbox
                        checked={selectedIds.includes(product.id)}
                        onChange={(checked) => toggleOne(product.id, checked)}
                        ariaLabel={`Select product ${product.title ?? product.id}`}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="text-sm font-medium text-slate-900">
                        {product.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {product.sku ?? "—"}
                      </div>
                      <span
                        className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="h-12 w-12 rounded-lg border bg-slate-50 overflow-hidden">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title ?? "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {product.quantity ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {product.comparePrice ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {product.cost ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {product.price ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {product.price != null && product.cost != null
                        ? product.price - product.cost
                        : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left text-xs text-slate-500">
                      {product.updatedAt
                        ? new Date(product.updatedAt).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openAccordion(product.id)}
                        className="text-xs font-medium text-brand-600 hover:underline"
                      >
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ),
              )}
              {!loading && sortedProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : null}
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="px-5 py-6 text-sm text-slate-400">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </AppTable>
        </div>
      </div>

      <PaginationFooter
        count={sortedProducts.length}
        total={totalAvailable}
        from={sortedProducts.length ? 1 : 0}
        to={sortedProducts.length}
        hasNext={hasMore}
        onLoadMore={handleLoadMore}
        label="products"
        loading={loading}
      />
    </div>
  );
}
