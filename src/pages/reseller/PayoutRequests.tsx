import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import OffsetPager from "@/components/OffsetPager";
import { useNotificationsStore } from "@/stores/notifications";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  RESELLER_PAYOUT_AUDITS,
  RESELLER_PAYOUT_REQUESTS
} from "@/graphql/queries/reseller";
import {
  WALLET_PAYOUT_APPROVE,
  WALLET_PAYOUT_CANCEL,
  WALLET_PAYOUT_FAIL,
  WALLET_PAYOUT_PROCESS,
  WALLET_PAYOUT_REJECT,
  WALLET_PAYOUT_SETTLE,
  WALLET_PAYOUT_REQUEST_CREATE
} from "@/graphql/mutations/reseller";

const statusOptions = [
  "requested",
  "approved",
  "processing",
  "settled",
  "failed",
  "rejected",
  "cancelled"
];

export default function PayoutRequests() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);
  const user = useAuthStore((state) => state.user);
  const isAdmin = !user?.isStaff;
  const { addNotification } = useNotificationsStore();

  const [resellerId, setResellerId] = useState("");
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const [pageSize] = useState(15);
  const [auditRequestId, setAuditRequestId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createDraft, setCreateDraft] = useState({ resellerId: "", amount: "", note: "" });

  const variables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        resellerId: resellerId.trim() || null,
        status: status || null,
        limit: pageSize + 1,
        offset
      }
    }),
    [siteUuid, resellerId, status, pageSize, offset]
  );

  const { data, loading, refetch } = useQuery(RESELLER_PAYOUT_REQUESTS, {
    variables,
    skip: !siteUuid
  });

  const { data: auditData, refetch: refetchAudits } = useQuery(RESELLER_PAYOUT_AUDITS, {
    variables: {
      data: {
        siteId: siteUuid ?? "",
        payoutRequestId: auditRequestId,
        resellerId: null,
        limit: 20,
        offset: 0
      }
    },
    skip: !siteUuid || !auditRequestId
  });

  const [approve] = useMutation(WALLET_PAYOUT_APPROVE);
  const [process] = useMutation(WALLET_PAYOUT_PROCESS);
  const [settle] = useMutation(WALLET_PAYOUT_SETTLE);
  const [reject] = useMutation(WALLET_PAYOUT_REJECT);
  const [fail] = useMutation(WALLET_PAYOUT_FAIL);
  const [cancel] = useMutation(WALLET_PAYOUT_CANCEL);
  const [createRequest, { loading: creating }] = useMutation(WALLET_PAYOUT_REQUEST_CREATE);

  const rows = data?.walletPayoutRequests ?? [];
  const hasNext = rows.length > pageSize;
  const payouts = rows.slice(0, pageSize);
  const audits = auditData?.walletPayoutAudits ?? [];

  const runAction = async (
    type: "approve" | "process" | "settle" | "reject" | "fail" | "cancel",
    payoutId: string
  ) => {
    if (!siteUuid) return;
    if (!isAdmin) {
      addNotification(
        {
          title: "Admin only",
          subTitle: "Admin access is required for this action."
        },
        "error"
      );
      return;
    }

    const note = window.prompt("Add a note (optional)", "") ?? "";
    if (type === "settle") {
      const transactionRef = window.prompt("Transaction reference", "") ?? "";
      if (!transactionRef.trim()) return;
      await settle({
        variables: {
          data: {
            siteId: siteUuid,
            payoutRequestId: payoutId,
            transactionRef: transactionRef.trim(),
            note: note.trim() || null
          }
        }
      });
    } else if (type === "approve") {
      await approve({ variables: { data: { siteId: siteUuid, payoutRequestId: payoutId, note: note.trim() || null } } });
    } else if (type === "process") {
      await process({ variables: { data: { siteId: siteUuid, payoutRequestId: payoutId, note: note.trim() || null } } });
    } else if (type === "reject") {
      await reject({ variables: { data: { siteId: siteUuid, payoutRequestId: payoutId, note: note.trim() || null } } });
    } else if (type === "fail") {
      await fail({ variables: { data: { siteId: siteUuid, payoutRequestId: payoutId, note: note.trim() || null } } });
    } else if (type === "cancel") {
      await cancel({ variables: { data: { siteId: siteUuid, payoutRequestId: payoutId, note: note.trim() || null } } });
    }
    await refetch();
  };

  const handleCreate = async () => {
    if (!siteUuid) return;
    await createRequest({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId: createDraft.resellerId.trim(),
          amount: Number(createDraft.amount || 0),
          note: createDraft.note.trim() || null
        }
      }
    });
    await refetch();
    setShowCreate(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Payout Requests
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">Manage reseller payouts and approvals.</p>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create Payout
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={resellerId}
          onChange={(event) => {
            setResellerId(event.target.value);
            setOffset(0);
          }}
          placeholder="Reseller id"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setOffset(0);
          }}
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        >
          <option value="">All status</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="table-source-wrap">
        <AppTable className="data-table min-w-full divide-y divide-gray-300">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Requested</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reseller</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {payouts.map((payout: any) => (
              <TableRow key={payout.id} className="hover:bg-slate-50">
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  {payout.requestedAt ? dayjs(payout.requestedAt).format("D MMM YYYY") : "—"}
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{payout.resellerId}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{payout.amount}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{payout.status}</TableCell>
                <TableCell className="px-3 py-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => runAction("approve", payout.id)}
                      className="rounded-md border border-green-200 px-2 py-1 text-xs text-green-700 hover:bg-green-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => runAction("process", payout.id)}
                      className="rounded-md border border-blue-200 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                    >
                      Process
                    </button>
                    <button
                      type="button"
                      onClick={() => runAction("settle", payout.id)}
                      className="rounded-md border border-indigo-200 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-50"
                    >
                      Settle
                    </button>
                    <button
                      type="button"
                      onClick={() => runAction("reject", payout.id)}
                      className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => runAction("fail", payout.id)}
                      className="rounded-md border border-amber-200 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50"
                    >
                      Fail
                    </button>
                    <button
                      type="button"
                      onClick={() => runAction("cancel", payout.id)}
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuditRequestId(payout.id);
                        refetchAudits();
                      }}
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Audits
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AppTable>
        {!loading && payouts.length === 0 ? (
          <div className="text-center border-t border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">No record :-(</div>
        ) : null}
      </div>

      <OffsetPager
        count={payouts.length}
        offset={offset}
        limit={pageSize}
        hasNext={hasNext}
        loading={loading}
        onPrev={() => setOffset((prev) => Math.max(0, prev - pageSize))}
        onNext={() => setOffset((prev) => (hasNext ? prev + pageSize : prev))}
      />

      {auditRequestId ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Payout Audits</h2>
            <button
              type="button"
              onClick={() => setAuditRequestId(null)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {audits.map((audit: any) => (
              <div key={audit.id} className="flex items-center justify-between">
                <span>
                  {audit.fromStatus} → {audit.toStatus}
                </span>
                <span className="text-gray-900">{dayjs(audit.createdAt).format("D MMM YYYY")}</span>
              </div>
            ))}
            {audits.length === 0 ? <p className="text-sm text-gray-500">No audits found.</p> : null}
          </div>
        </div>
      ) : null}

      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Payout Request</h3>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5">
              <div>
                <label className="text-xs font-medium text-gray-500">Reseller id</label>
                <input
                  value={createDraft.resellerId}
                  onChange={(event) => setCreateDraft((prev) => ({ ...prev, resellerId: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Amount</label>
                <input
                  value={createDraft.amount}
                  onChange={(event) => setCreateDraft((prev) => ({ ...prev, amount: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Note</label>
                <input
                  value={createDraft.note}
                  onChange={(event) => setCreateDraft((prev) => ({ ...prev, note: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
