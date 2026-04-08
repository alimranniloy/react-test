import { FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_ORDER } from "@/graphql/queries/order";
import { useSiteStore } from "@/store/useSiteStore";

const formatMoney = (value: number | null | undefined, currency?: string | null) => {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "BDT",
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `${value}`;
  }
};

export default function OrderInvoice() {
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? 0;
  const [params, setParams] = useSearchParams();
  const initialId = params.get("id") ?? "";
  const [orderIdInput, setOrderIdInput] = useState(initialId);

  const orderId = useMemo(() => Number(params.get("id") ?? 0), [params]);

  const { data, loading } = useQuery(STORE_ORDER, {
    variables: { siteId, id: orderId },
    skip: !siteId || !orderId
  });

  const order = data?.storeOrder ?? null;

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = orderIdInput.trim();
    if (!trimmed) return;
    setParams({ id: trimmed });
  };

  return (
    <main className="space-y-4">
      <section className="rounded-2xl bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Invoice</p>
            <h2 className="text-lg font-semibold text-slate-900">Order invoice</h2>
            <p className="text-xs text-slate-500 mt-1">Search by internal order id.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/order/" className="text-xs text-indigo-600 hover:underline">
              Back to orders
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
            >
              Print
            </button>
          </div>
        </div>
        <form onSubmit={handleSearch} className="mt-4 flex flex-wrap items-center gap-2">
          <input
            value={orderIdInput}
            onChange={(event) => setOrderIdInput(event.target.value)}
            placeholder="Order id (internal)"
            className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Load invoice
          </button>
        </form>
      </section>

      {loading ? (
        <section className="rounded-2xl bg-white p-6 text-sm text-slate-500">Loading invoice…</section>
      ) : order ? (
        <section className="rounded-2xl bg-white p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-slate-400">Invoice for</p>
              <h3 className="text-lg font-semibold text-slate-900">#{order.orderId}</h3>
              <p className="text-xs text-slate-500">
                Placed {dayjs(order.createdAt).format("MMM D, YYYY")} • Updated {dayjs(order.updatedAt).format("MMM D, YYYY")}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="text-slate-900 font-semibold">{site?.title ?? "Store"}</p>
              <p>{site?.domain ?? "—"}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Bill to</p>
              <p className="text-sm font-semibold text-slate-900">{order.customerName ?? "—"}</p>
              <p className="text-xs text-slate-500">{order.customerPhone ?? "—"}</p>
              <p className="text-xs text-slate-500 mt-2">{order.customerAddress ?? "—"}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Order summary</p>
              <div className="mt-2 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(order.total, order.currency || site?.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(order.discount ?? 0, order.currency || site?.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Net</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(order.netAmount, order.currency || site?.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Paid</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(order.paid ?? 0, order.currency || site?.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Items</p>
            <div className="mt-3 divide-y divide-slate-200">
              {order.lines?.length ? (
                order.lines.map((line: any) => (
                  <div key={line.id} className="flex items-center justify-between py-2 text-sm text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-900">{line.productName}</p>
                      <p className="text-xs text-slate-400">{line.productSku ?? "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Qty {line.quantity}</p>
                      <p className="font-semibold text-slate-900">
                        {formatMoney(line.price, order.currency || site?.currency)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400">No line items.</div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Logistics</p>
              <div className="mt-2 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Tracking</span>
                  <span className="font-semibold text-slate-900">{order.trackingId ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Charge</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(order.logisticsCharge ?? 0, order.currency || site?.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Extra charge</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(order.logisticsExtraCharge ?? 0, order.currency || site?.currency)}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Payments</p>
              <div className="mt-2 space-y-2 text-sm text-slate-600">
                {order.pays?.length ? (
                  order.pays.map((pay: any) => (
                    <div key={pay.id} className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900">{pay.paymentTitle ?? "Payment"}</p>
                        <p className="text-slate-500">#{pay.paymentNo ?? "—"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {formatMoney(pay.total ?? 0, order.currency || site?.currency)}
                        </p>
                        <p className="text-slate-500">{dayjs(pay.createdAt).format("MMM D")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No payments recorded.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl bg-white p-6 text-sm text-slate-500">Enter an order id to load invoice.</section>
      )}
    </main>
  );
}
