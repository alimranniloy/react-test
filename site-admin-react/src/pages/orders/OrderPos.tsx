import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { STORE_PRODUCTS_FOR_POS } from "@/graphql/queries/pos";
import { useSiteStore } from "@/store/useSiteStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

type CartLine = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  stock: number;
};

const formatMoney = (value: number, currency = "BDT") => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${value}`;
  }
};

export default function OrderPos() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [search, setSearch] = useState("");
  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [lines, setLines] = useState<CartLine[]>([]);

  const variables = useMemo(
    () => ({
      siteId: siteId ? [siteId] : [],
      search: search.trim() || null,
      first
    }),
    [siteId, search, first]
  );

  const { data, loading, refetch, fetchMore } = useQuery(STORE_PRODUCTS_FOR_POS, {
    variables,
    skip: !siteId
  });

  const products = data?.storeProducts?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.storeProducts?.pageInfo;
  const totalAvailable = data?.storeProducts?.total ?? products.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || products.length < totalAvailable;

  const addLine = (product: any) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.id === product.id
            ? { ...line, quantity: Math.min(line.quantity + 1, Math.max(product.quantity ?? 0, 1)) }
            : line
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: Number(product.price ?? 0),
          quantity: 1,
          stock: Number(product.quantity ?? 0)
        }
      ];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, quantity: Math.max(1, quantity) } : line)));
  };

  const removeLine = (id: number) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  };

  const subTotal = useMemo(() => lines.reduce((sum, line) => sum + line.price * line.quantity, 0), [lines]);

  const productColumns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "product",
        header: "Product",
        headClassName: "px-3 py-2 text-left text-xs font-semibold text-slate-600",
        cellClassName: "px-3 py-2 text-sm text-slate-700",
        cell: (product) => product.title
      },
      {
        id: "price",
        header: "Price",
        headClassName: "px-3 py-2 text-left text-xs font-semibold text-slate-600",
        cellClassName: "px-3 py-2 text-sm text-slate-500",
        cell: (product) => formatMoney(Number(product.price ?? 0), site?.currency ?? "BDT")
      },
      {
        id: "stock",
        header: "Stock",
        headClassName: "px-3 py-2 text-left text-xs font-semibold text-slate-600",
        cellClassName: "px-3 py-2 text-sm text-slate-500",
        cell: (product) => product.quantity ?? 0
      },
      {
        id: "action",
        header: "Action",
        headClassName: "px-3 py-2 text-right text-xs font-semibold text-slate-600",
        cellClassName: "px-3 py-2 text-right",
        cell: (product) => (
          <button
            type="button"
            onClick={() => addLine(product)}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
          >
            Add
          </button>
        )
      }
    ],
    [site?.currency]
  );

  const cartColumns = useMemo<DataTableColumn<CartLine>[]>(
    () => [
      {
        id: "item",
        header: "Item",
        headClassName: "px-3 py-2 text-left text-xs font-semibold text-slate-600",
        cellClassName: "px-3 py-2 text-sm text-slate-700",
        cell: (line) => line.title
      },
      {
        id: "qty",
        header: "Qty",
        headClassName: "px-3 py-2 text-left text-xs font-semibold text-slate-600",
        cellClassName: "px-3 py-2 text-sm text-slate-500",
        cell: (line) => (
          <input
            type="number"
            min={1}
            value={line.quantity}
            onChange={(event) => updateQuantity(line.id, Number(event.target.value))}
            className="w-20 rounded border border-slate-300 px-2 py-1"
          />
        )
      },
      {
        id: "total",
        header: "Total",
        headClassName: "px-3 py-2 text-right text-xs font-semibold text-slate-600",
        cellClassName: "px-3 py-2 text-right text-sm text-slate-700",
        cell: (line) => formatMoney(line.price * line.quantity, site?.currency ?? "BDT")
      },
      {
        id: "remove",
        header: "",
        headClassName: "px-3 py-2 text-right text-xs font-semibold text-slate-600",
        cellClassName: "px-3 py-2 text-right",
        cell: (line) => (
          <button type="button" onClick={() => removeLine(line.id)} className="text-xs text-rose-600 hover:underline">
            Remove
          </button>
        )
      }
    ],
    [site?.currency]
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              POS
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Point-of-sale quick order workspace.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            placeholder="Customer phone"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Customer name"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={customerAddress}
            onChange={(event) => setCustomerAddress(event.target.value)}
            placeholder="Customer address"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="max-h-[540px] overflow-auto rounded-lg border border-slate-200">
            <DataTable
              rows={products}
              getRowId={(row) => row.id}
              columns={productColumns}
              loading={loading}
              emptyLabel="No products."
              pagination={{
                mode: "cursor",
                count: products.length,
                total: totalAvailable,
                from: products.length ? 1 : 0,
                to: products.length,
                hasNext: hasMore,
                onLoadMore: () =>
                  fetchMore({
                    variables: nextPageVariables({
                      baseVariables: variables,
                      pageInfo,
                      currentCount: products.length,
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

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-800">Cart</h2>
          <div className="mt-3 max-h-[420px] overflow-auto rounded-lg border border-slate-200">
            <DataTable rows={lines} getRowId={(row) => row.id} columns={cartColumns} emptyLabel="No cart items selected." />
          </div>

          <div className="mt-4 space-y-2 rounded-lg bg-slate-50 px-3 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Customer</span>
              <span className="font-medium text-slate-900">{customerName || customerPhone || "Walk-in"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Items</span>
              <span className="font-medium text-slate-900">{lines.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Sub total</span>
              <span className="font-semibold text-slate-900">{formatMoney(subTotal, site?.currency ?? "BDT")}</span>
            </div>
          </div>

          <button type="button" disabled className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white opacity-60">
            Place POS Order (next step)
          </button>
        </div>
      </div>
    </div>
  );
}
