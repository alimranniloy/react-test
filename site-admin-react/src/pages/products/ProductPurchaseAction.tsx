import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_SUPPLIERS } from "@/graphql/queries/catalog";
import { STORE_PRODUCTS } from "@/graphql/queries/product";
import { SELF_STORE_PURCHASE_CREATE } from "@/graphql/mutations/purchase";
import { STORE_SUPPLIER_PENDING_PRODUCTS } from "@/graphql/queries/purchase";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PurchaseLine = {
  productId: number;
  title: string;
  sku?: string | null;
  currentQuantity: number;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  orderIds?: number[];
};

const toNumber = (value: string) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

export default function ProductPurchaseAction() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const purchaseId = query.get("id");

  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [barcodeStatuses, setBarcodeStatuses] = useState<string>("3");
  const [lines, setLines] = useState<PurchaseLine[]>([]);
  const [discount, setDiscount] = useState("0");
  const [vat, setVat] = useState("0");
  const [logisticsCharge, setLogisticsCharge] = useState("0");
  const [paid, setPaid] = useState("0");
  const [note, setNote] = useState("");

  const { data: suppliersData } = useQuery(STORE_SUPPLIERS, {
    variables: { siteId, first: 200 },
    skip: !siteId
  });

  const suppliers = suppliersData?.storeSuppliers?.edges?.map((edge: any) => edge.node) ?? [];

  const { data: productsData } = useQuery(STORE_PRODUCTS, {
    variables: {
      siteId: siteId ? [siteId] : [],
      search: search.trim() || null,
      supplierId,
      first: 15
    },
    skip: !siteId || !supplierId
  });

  const products = productsData?.storeProducts?.edges?.map((edge: any) => edge.node) ?? [];

  const { data: candidateData, refetch: refetchCandidates } = useQuery(STORE_SUPPLIER_PENDING_PRODUCTS, {
    variables: {
      siteId: siteId ?? 0,
      supplierId: supplierId ?? 0,
      statuses: barcodeStatuses
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item))
    },
    skip: !siteId || !supplierId
  });

  const [createPurchase, { loading: creating }] = useMutation(SELF_STORE_PURCHASE_CREATE);

  const subTotal = useMemo(() => lines.reduce((sum, line) => sum + line.quantity * line.purchasePrice, 0), [lines]);
  const netAmount = useMemo(
    () => subTotal - toNumber(discount) + toNumber(vat) + toNumber(logisticsCharge),
    [subTotal, discount, vat, logisticsCharge]
  );

  const addProduct = (product: any) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.productId === product.id);
      if (existing) {
        return prev.map((line) =>
          line.productId === product.id ? { ...line, quantity: line.quantity + 1, purchasePrice: product.cost ?? line.purchasePrice } : line
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          sku: product.sku,
          currentQuantity: product.quantity ?? 0,
          quantity: 1,
          purchasePrice: product.cost ?? 0,
          salePrice: product.price ?? 0
        }
      ];
    });
  };

  const addPendingCandidates = () => {
    const candidates = candidateData?.storeSupplierPurchaseCandidates ?? [];
    if (!Array.isArray(candidates) || candidates.length === 0) return;

    setLines((prev) => {
      const next = [...prev];
      candidates.forEach((candidate: any) => {
        if (!candidate?.productId) return;
        const index = next.findIndex((line) => line.productId === candidate.productId);
        const needed = Math.max(Number(candidate.quantity ?? 0), 1);

        if (index >= 0) {
          next[index] = {
            ...next[index],
            quantity: next[index].quantity + needed,
            purchasePrice: candidate.cost ?? next[index].purchasePrice,
            salePrice: candidate.price ?? next[index].salePrice,
            orderIds: candidate.orderIds ?? next[index].orderIds
          };
        } else {
          next.push({
            productId: candidate.productId,
            title: candidate.productName,
            sku: candidate.productSku,
            currentQuantity: Number(candidate.stock ?? 0),
            quantity: needed,
            purchasePrice: Number(candidate.cost ?? 0),
            salePrice: Number(candidate.price ?? 0),
            orderIds: candidate.orderIds ?? []
          });
        }
      });
      return next;
    });
  };

  const removeLine = (productId: number) => {
    setLines((prev) => prev.filter((line) => line.productId !== productId));
  };

  const updateLine = (productId: number, patch: Partial<PurchaseLine>) => {
    setLines((prev) => prev.map((line) => (line.productId === productId ? { ...line, ...patch } : line)));
  };

  const handleSubmit = async () => {
    if (!user?.id || !siteId || !supplierId || lines.length === 0) return;
    await createPurchase({
      variables: {
        userId: user.id,
        siteId,
        supplierId,
        lines: lines.map((line) => ({
          productId: line.productId,
          quantity: Math.max(line.quantity, 0),
          cost: Math.max(line.purchasePrice, 0),
          price: Math.max(line.salePrice, 0)
        })),
        discount: toNumber(discount),
        vat: toNumber(vat),
        logisticsCharge: toNumber(logisticsCharge),
        paid: toNumber(paid),
        note
      }
    });
    navigate("/product/purchase/");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{purchaseId ? `Purchase #${purchaseId}` : "Create Purchase"}</h1>
            <p className="mt-2 text-sm text-gray-700">Select supplier, add lines, then create purchase invoice.</p>
            {purchaseId ? <p className="mt-1 text-xs text-amber-600">Update mode opens existing context; submission creates a new purchase entry.</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/product/purchase/" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
              Back
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={creating || !supplierId || lines.length === 0}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {creating ? "Saving..." : "Create Purchase"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <select
            value={supplierId ?? ""}
            onChange={(event) => setSupplierId(event.target.value ? Number(event.target.value) : null)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Select supplier</option>
            {suppliers.map((supplier: any) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.title}
              </option>
            ))}
          </select>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={barcodeStatuses}
            onChange={(event) => setBarcodeStatuses(event.target.value)}
            placeholder="Pending statuses, e.g. 3,4,5"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={async () => {
              await refetchCandidates();
              addPendingCandidates();
            }}
            disabled={!supplierId}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Add Pending Candidates
          </button>
        </div>

        <div className="max-h-64 overflow-auto rounded-lg border border-slate-200">
          <AppTable className="data-table min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Product</TableHead>
                <TableHead className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Stock</TableHead>
                <TableHead className="px-3 py-2 text-right text-xs font-semibold text-slate-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 bg-white">
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="px-3 py-2 text-sm text-slate-700">{product.title}</TableCell>
                  <TableCell className="px-3 py-2 text-sm text-slate-500">{product.quantity ?? 0}</TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => addProduct(product)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
                    >
                      Add
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </AppTable>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="overflow-auto">
          <AppTable className="data-table min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Product</TableHead>
                <TableHead className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Current</TableHead>
                <TableHead className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Qty</TableHead>
                <TableHead className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Purchase price</TableHead>
                <TableHead className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Sale price</TableHead>
                <TableHead className="px-3 py-2 text-right text-xs font-semibold text-slate-600">Line total</TableHead>
                <TableHead className="px-3 py-2 text-right text-xs font-semibold text-slate-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 bg-white">
              {lines.map((line) => (
                <TableRow key={line.productId}>
                  <TableCell className="px-3 py-2 text-sm text-slate-700">
                    <div className="font-medium">{line.title}</div>
                    <div className="text-xs text-slate-500">{line.sku || "—"}</div>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-sm text-slate-500">{line.currentQuantity}</TableCell>
                  <TableCell className="px-3 py-2 text-sm">
                    <input
                      type="number"
                      value={line.quantity}
                      onChange={(event) => updateLine(line.productId, { quantity: Math.max(toNumber(event.target.value), 0) })}
                      className="w-24 rounded border border-slate-300 px-2 py-1"
                    />
                  </TableCell>
                  <TableCell className="px-3 py-2 text-sm">
                    <input
                      type="number"
                      value={line.purchasePrice}
                      onChange={(event) => updateLine(line.productId, { purchasePrice: Math.max(toNumber(event.target.value), 0) })}
                      className="w-28 rounded border border-slate-300 px-2 py-1"
                    />
                  </TableCell>
                  <TableCell className="px-3 py-2 text-sm">
                    <input
                      type="number"
                      value={line.salePrice}
                      onChange={(event) => updateLine(line.productId, { salePrice: Math.max(toNumber(event.target.value), 0) })}
                      className="w-28 rounded border border-slate-300 px-2 py-1"
                    />
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right text-sm text-slate-700">{(line.quantity * line.purchasePrice).toFixed(2)}</TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <button type="button" onClick={() => removeLine(line.productId)} className="text-xs text-rose-600 hover:underline">
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </AppTable>
          {lines.length === 0 ? <div className="px-4 py-6 text-sm text-slate-500">No products selected.</div> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-5">
          <input value={discount} onChange={(event) => setDiscount(event.target.value)} placeholder="Discount" type="number" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={vat} onChange={(event) => setVat(event.target.value)} placeholder="VAT" type="number" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={logisticsCharge} onChange={(event) => setLogisticsCharge(event.target.value)} placeholder="Logistics" type="number" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={paid} onChange={(event) => setPaid(event.target.value)} placeholder="Paid" type="number" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Note" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2">Sub total: <span className="font-semibold text-slate-900">{subTotal.toFixed(2)}</span></div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">Net amount: <span className="font-semibold text-slate-900">{netAmount.toFixed(2)}</span></div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">Due: <span className="font-semibold text-slate-900">{(netAmount - toNumber(paid)).toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
