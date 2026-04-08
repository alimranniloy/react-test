import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { SITE_TRANSACTIONS } from "@/graphql/queries/siteTransaction";
import { SELF_SITE_TRANSACTION_UPDATE } from "@/graphql/mutations/siteTransaction";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

export default function PaymentTransactionAction() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const siteId = site?.id ?? null;

  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id") ?? 0);

  const variables = useMemo(
    () => ({
      siteId: siteId ?? 0,
      first: 200,
      after: null
    }),
    [siteId]
  );

  const { data, loading, refetch } = useQuery(SITE_TRANSACTIONS, {
    variables,
    skip: !siteId || id <= 0
  });

  const row = (data?.siteTransactions?.edges?.map((edge: any) => edge.node) ?? []).find((item: any) => item.id === id) ?? null;

  const [paymentNo, setPaymentNo] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [paymentTitle, setPaymentTitle] = useState("");
  const [note, setNote] = useState("");
  const [total, setTotal] = useState("");
  const [isPaid, setIsPaid] = useState<boolean | null>(null);
  const [isSettle, setIsSettle] = useState<boolean | null>(null);

  const [updateTransaction, { loading: saving }] = useMutation(SELF_SITE_TRANSACTION_UPDATE);

  const effectiveIsPaid = isPaid ?? Boolean(row?.isPaid);
  const effectiveIsSettle = isSettle ?? Boolean(row?.isSettle);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.id || !siteId || id <= 0) return;

    await updateTransaction({
      variables: {
        userId: user.id,
        siteId,
        id,
        isPaid: effectiveIsPaid,
        isSettle: effectiveIsSettle,
        paymentNo: paymentNo || row?.paymentNo || null,
        paymentId: paymentId || row?.paymentId || null,
        paymentTitle: paymentTitle || row?.paymentTitle || null,
        note: note || row?.note || null,
        total: total ? Number(total) : row?.total ?? null,
        source: row?.source ?? "payment",
        receiverId: row?.receiverId ?? null,
        referId: row?.referId ?? null,
        referPhone: row?.referPhone ? Number(row.referPhone) : null,
        referTitle: row?.referTitle ?? null,
        status: row?.status ?? null,
        subTotal: row?.subTotal ?? null,
        paymentDate: effectiveIsPaid ? new Date().toISOString() : null
      }
    });

    setPaymentNo("");
    setPaymentId("");
    setPaymentTitle("");
    setNote("");
    setTotal("");
    await refetch();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900">Payment Transaction Action</h1>
        <p className="mt-2 text-sm text-gray-700">Update transaction settlement and payment metadata.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Transaction ID
            <input
              value={id > 0 ? String(id) : ""}
              readOnly
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Current Amount
            <input
              value={row?.total ?? (loading ? "Loading..." : "—")}
              readOnly
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Payment Title
            <input
              value={paymentTitle}
              onChange={(event) => setPaymentTitle(event.target.value)}
              placeholder={row?.paymentTitle ?? "Cash"}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Payment Number
            <input
              value={paymentNo}
              onChange={(event) => setPaymentNo(event.target.value)}
              placeholder={row?.paymentNo ?? "Reference no"}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Payment ID
            <input
              value={paymentId}
              onChange={(event) => setPaymentId(event.target.value)}
              placeholder={row?.paymentId ?? "Gateway id"}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Override Total
            <input
              type="number"
              value={total}
              onChange={(event) => setTotal(event.target.value)}
              placeholder={row?.total ? String(row.total) : "0"}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500 md:col-span-2">
            Note
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={row?.note ?? "Optional note"}
              className="min-h-[90px] rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={effectiveIsPaid}
              onChange={(event) => setIsPaid(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
            />
            Mark as paid
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={effectiveIsSettle}
              onChange={(event) => setIsSettle(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
            />
            Mark as settled
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving || id <= 0}
            className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            Save
          </button>
          <Link to="/payment/transaction/" className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
