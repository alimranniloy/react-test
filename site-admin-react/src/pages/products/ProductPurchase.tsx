import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { STORE_PURCHASES } from "@/graphql/queries/purchase";
import { STORE_SUPPLIERS } from "@/graphql/queries/catalog";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

dayjs.extend(relativeTime);

const statusText: Record<number, string> = {
  0: "Draft",
  1: "Placed",
  2: "Confirmed",
  3: "Packaging",
  4: "Shipment",
  5: "On the way",
  6: "Station",
  7: "Canceled"
};

const toDateTime = (date: string, end = false) => {
  if (!date) return null;
  const suffix = end ? "T23:59:59.999Z" : "T00:00:00.000Z";
  return new Date(`${date}${suffix}`).toISOString();
};

const formatMoney = (amount: number, currency = "BDT") => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount || 0);
  } catch {
    return `${amount || 0}`;
  }
};

export default function ProductPurchase() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      supplierId,
      status,
      search: search.trim() || null,
      from: toDateTime(from),
      to: toDateTime(to, true)
    }),
    [siteId, supplierId, status, search, from, to]
  );

  const { data, loading, refetch } = useQuery(STORE_PURCHASES, {
    variables,
    skip: !siteId
  });

  const { data: supplierData } = useQuery(STORE_SUPPLIERS, {
    variables: { siteId, first: 200 },
    skip: !siteId
  });

  const purchases = data?.storePurchases ?? [];
  const totalPages = Math.max(1, Math.ceil(purchases.length / pageSize));
  const offset = (page - 1) * pageSize;
  const visiblePurchases = purchases.slice(offset, offset + pageSize);
  const suppliers = supplierData?.storeSuppliers?.edges?.map((edge: any) => edge.node) ?? [];

  const totals = purchases.reduce(
    (acc: { count: number; totalAmount: number; netAmount: number; paid: number }, row: any) => {
      acc.count += 1;
      acc.totalAmount += row.total ?? 0;
      acc.netAmount += row.netAmount ?? 0;
      acc.paid += row.paid ?? 0;
      return acc;
    },
    { count: 0, totalAmount: 0, netAmount: 0, paid: 0 }
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Purchases
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Monitor supplier purchases and delivery progress.</p>
          </div>
          <Link
            to="/product/purchase/create/"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            New Purchase
          </Link>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search purchase ID or supplier"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={status ?? ""}
            onChange={(event) => {
              setStatus(event.target.value ? Number(event.target.value) : null);
              setPage(1);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All status</option>
            {Object.entries(statusText).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={supplierId ?? ""}
            onChange={(event) => {
              setSupplierId(event.target.value ? Number(event.target.value) : null);
              setPage(1);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All suppliers</option>
            {suppliers.map((supplier: any) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.title}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={from}
            onChange={(event) => {
              setFrom(event.target.value);
              setPage(1);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={to}
            onChange={(event) => {
              setTo(event.target.value);
              setPage(1);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2">Count: <span className="font-semibold text-slate-900">{totals.count}</span></div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">Total: <span className="font-semibold text-slate-900">{formatMoney(totals.totalAmount, site?.currency ?? "BDT")}</span></div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">Paid: <span className="font-semibold text-slate-900">{formatMoney(totals.paid, site?.currency ?? "BDT")}</span></div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <AppTable className="data-table min-w-full divide-y divide-gray-300">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Purchase</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Supplier</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amounts</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Updated</TableHead>
              <TableHead className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {visiblePurchases.map((purchase: any) => (
              <TableRow key={purchase.id} className="hover:bg-slate-50">
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  <div className="font-semibold">#{purchase.purchaseId || purchase.id}</div>
                  <div className="text-xs text-slate-500">{purchase.source || "—"}</div>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{purchase.supplierName}</div>
                  <div className="text-xs">{purchase.supplierPhone || "—"}</div>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">
                  <div>{formatMoney(purchase.total, purchase.currency || site?.currency || "BDT")}</div>
                  <div className="text-xs">Paid: {formatMoney(purchase.paid, purchase.currency || site?.currency || "BDT")}</div>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {statusText[purchase.status] ?? `Status ${purchase.status}`}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{purchase.updatedAt ? dayjs(purchase.updatedAt).fromNow() : "—"}</TableCell>
                <TableCell className="px-4 py-3 text-right text-sm">
                  <Link to={`/product/purchase/update/?id=${purchase.id}`} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    Open
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AppTable>
        {!loading && purchases.length === 0 ? (
          <div className="text-center border-t border-gray-200 bg-white px-4 py-6 text-sm text-gray-700">No purchases found.</div>
        ) : (
          <PaginationFooter
            count={visiblePurchases.length}
            total={purchases.length}
            page={page}
            pageCount={totalPages}
            from={visiblePurchases.length > 0 ? offset + 1 : 0}
            to={offset + visiblePurchases.length}
            onPageChange={(nextPage) => setPage(Math.max(1, Math.min(totalPages, nextPage)))}
            pageSize={pageSize}
            pageSizeOptions={[15, 30, 50, 100]}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
