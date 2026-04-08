import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { STORE_ORDER } from "@/graphql/queries/order";
import { SELF_STORE_ORDER_EVENT_CREATE } from "@/graphql/mutations/order";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

const statusLabels: Record<number, string> = {
  0: "Processing",
  1: "Placed",
  2: "Confirmed",
  3: "Packaging",
  4: "Packaged",
  5: "Shipping",
  6: "Review",
  7: "Rejected",
  8: "Return",
  9: "Canceled",
  10: "Delivered",
  11: "Query",
  12: "Payment",
  13: "Notification",
  14: "Hold",
  15: "Not Responding",
  16: "Partial Delivered"
};

export default function OrderDetails() {
  const { id } = useParams();
  const orderId = Number(id);
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState<number>(0);
  const [note, setNote] = useState("");

  const { data, loading, refetch } = useQuery(STORE_ORDER, {
    variables: { siteId: site?.id ?? 0, id: orderId },
    skip: !site?.id || !orderId
  });

  const order = data?.storeOrder ?? null;

  const [createEvent, { loading: updating }] = useMutation(SELF_STORE_ORDER_EVENT_CREATE);

  const handleUpdateStatus = async () => {
    if (!site?.id || !user?.id || !order?.id) return;
    await createEvent({
      variables: {
        userId: user.id,
        siteId: site.id,
        orderId: order.id,
        eventType: status,
        note: note || statusLabels[status] || "Status update",
        status
      }
    });
    setNote("");
    await refetch();
  };

  const statusOptions = useMemo(
    () => Object.entries(statusLabels).map(([value, label]) => ({ value: Number(value), label })),
    []
  );

  if (loading) {
    return <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">Loading order...</div>;
  }

  if (!order) {
    return <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">Order not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border bg-white p-5">
        <div>
          <p className="text-xs uppercase text-slate-400">Order</p>
          <h2 className="text-lg font-semibold text-slate-900">#{order.orderId}</h2>
          <p className="text-sm text-slate-500">Placed {dayjs(order.createdAt).format("MMM D, YYYY")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/order/invoice/?id=${order.id}`} className="text-sm text-indigo-600 hover:underline">
            View invoice
          </Link>
          <Link to="/order/" className="text-sm text-brand-600 hover:underline">
            Back to orders
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Customer</h3>
          <p className="text-sm font-medium text-slate-900">{order.customerName ?? "—"}</p>
          <p className="text-sm text-slate-500">{order.customerPhone ?? ""}</p>
          <p className="text-xs text-slate-400 mt-2">{order.customerAddress ?? ""}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Totals</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="font-medium">{order.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Net</span>
              <span className="font-medium">{order.netAmount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Profit</span>
              <span className="font-medium">{order.profit ?? "—"}</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Status</h3>
          <p className="text-sm text-slate-600">{statusLabels[order.status] ?? "Processing"}</p>
          <p className="text-xs text-slate-400 mt-1">Updated {dayjs(order.updatedAt).fromNow()}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Update Status</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={status}
            onChange={(event) => setStatus(Number(event.target.value))}
            className="rounded-md border px-3 py-2 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add note (optional)"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          />
        </div>
        <button
          type="button"
          onClick={handleUpdateStatus}
          disabled={updating}
          className="mt-3 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {updating ? "Updating..." : "Update status"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Logistics</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Charge</span>
              <span className="font-medium">{order.logisticsCharge ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Extra Charge</span>
              <span className="font-medium">{order.logisticsExtraCharge ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tracking ID</span>
              <span className="font-medium">{order.trackingId ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Logistics Text</span>
              <span className="font-medium">{order.logisticsText ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Logistics URL</span>
              <span className="font-medium">{order.logisticsUrl ?? "—"}</span>
            </div>
            {order.logisticsNote ? (
              <div className="rounded-lg border p-3 text-xs text-slate-500 whitespace-pre-wrap">
                {order.logisticsNote}
              </div>
            ) : null}
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Payments</h3>
          <div className="space-y-2 text-sm text-slate-600">
            {order.pays?.length ? (
              order.pays.map((pay: any) => (
                <div key={pay.id} className="rounded-md border px-3 py-2">
                  <p className="font-medium">{pay.paymentTitle ?? "Payment"}</p>
                  <p className="text-xs text-slate-400">#{pay.paymentNo ?? "—"}</p>
                  <p className="text-xs text-slate-500">{dayjs(pay.createdAt).format("MMM D, h:mm A")}</p>
                  <p className="text-sm text-slate-700 mt-1">{pay.total ?? "—"}</p>
                  {pay.note ? <p className="text-xs text-slate-400 mt-1">{pay.note}</p> : null}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No payments recorded.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Line Items</h3>
        <div className="space-y-3">
          {order.lines?.map((line: any) => (
            <div key={line.id} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-800">{line.productName}</p>
                <p className="text-xs text-slate-400">{line.productSku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-700">Qty: {line.quantity}</p>
                <p className="text-xs text-slate-400">{line.price}</p>
              </div>
            </div>
          ))}
          {!order.lines?.length ? (
            <div className="text-sm text-slate-400">No line items.</div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Activity</h3>
        <div className="space-y-2 text-sm text-slate-600">
          {order.events?.map((event: any) => (
            <div key={event.id} className="flex items-center justify-between rounded-md border px-3 py-2">
              <span>{event.note}</span>
              <span className="text-xs text-slate-400">{dayjs(event.createdAt).format("MMM D, h:mm A")}</span>
            </div>
          ))}
          {!order.events?.length ? <div className="text-sm text-slate-400">No events yet.</div> : null}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Invoice</h3>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            Print
          </button>
        </div>
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-slate-400">Customer</p>
            <p className="font-medium text-slate-800">{order.customerName ?? "—"}</p>
            <p className="text-xs text-slate-500">{order.customerPhone ?? ""}</p>
            <p className="text-xs text-slate-400 mt-1">{order.customerAddress ?? ""}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Totals</p>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="font-medium">{order.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="font-medium">{order.discount ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Net</span>
              <span className="font-medium">{order.netAmount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Paid</span>
              <span className="font-medium">{order.paid ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="font-medium">{statusLabels[order.status] ?? "Processing"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
