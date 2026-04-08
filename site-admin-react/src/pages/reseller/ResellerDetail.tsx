import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import {
  RESELLER,
  RESELLER_PAYOUT_REQUESTS,
  RESELLER_TREE,
  RESELLER_WALLET,
  RESELLER_WALLET_LEDGER
} from "@/graphql/queries/reseller";
import { RESELLER_APPROVE, RESELLER_SUSPEND, RESELLER_UPDATE } from "@/graphql/mutations/reseller";

export default function ResellerDetail() {
  const { id } = useParams();
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);
  const resellerId = id ?? "";

  const [showUpdate, setShowUpdate] = useState(false);
  const [updateDraft, setUpdateDraft] = useState({ code: "", status: "" });

  const resellerVariables = useMemo(
    () => ({ siteId: siteUuid ?? "", resellerId }),
    [siteUuid, resellerId]
  );

  const { data, loading, refetch } = useQuery(RESELLER, {
    variables: resellerVariables,
    skip: !siteUuid || !resellerId
  });

  const { data: walletData } = useQuery(RESELLER_WALLET, {
    variables: resellerVariables,
    skip: !siteUuid || !resellerId
  });

  const { data: treeData } = useQuery(RESELLER_TREE, {
    variables: {
      data: {
        siteId: siteUuid ?? "",
        resellerId,
        maxDepth: 4
      }
    },
    skip: !siteUuid || !resellerId
  });

  const { data: ledgerData } = useQuery(RESELLER_WALLET_LEDGER, {
    variables: {
      data: {
        siteId: siteUuid ?? "",
        resellerId,
        limit: 10,
        offset: 0
      }
    },
    skip: !siteUuid || !resellerId
  });

  const { data: payoutData } = useQuery(RESELLER_PAYOUT_REQUESTS, {
    variables: {
      data: {
        siteId: siteUuid ?? "",
        resellerId,
        limit: 10,
        offset: 0
      }
    },
    skip: !siteUuid || !resellerId
  });

  const [approveReseller, { loading: approving }] = useMutation(RESELLER_APPROVE);
  const [suspendReseller, { loading: suspending }] = useMutation(RESELLER_SUSPEND);
  const [updateReseller, { loading: updating }] = useMutation(RESELLER_UPDATE);

  const reseller = data?.reseller ?? null;
  const wallet = walletData?.wallet ?? null;
  const tree = treeData?.resellerTree ?? [];
  const ledger = ledgerData?.walletLedger ?? [];
  const payouts = payoutData?.walletPayoutRequests ?? [];

  const handleApprove = async () => {
    if (!siteUuid || !resellerId) return;
    await approveReseller({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId,
          status: "active"
        }
      }
    });
    await refetch();
  };

  const handleSuspend = async () => {
    if (!siteUuid || !resellerId) return;
    const confirmed = window.confirm("Suspend this reseller?");
    if (!confirmed) return;
    await suspendReseller({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId,
          reason: null
        }
      }
    });
    await refetch();
  };

  const handleUpdate = async () => {
    if (!siteUuid || !resellerId) return;
    await updateReseller({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId,
          code: updateDraft.code.trim() || null,
          status: updateDraft.status.trim() || null
        }
      }
    });
    await refetch();
    setShowUpdate(false);
  };

  const openUpdate = () => {
    setUpdateDraft({ code: reseller?.code ?? "", status: reseller?.status ?? "" });
    setShowUpdate(true);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Reseller</p>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              {reseller?.code ?? "Reseller detail"}
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-xs text-gray-500">{resellerId}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openUpdate}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={approving}
              className="rounded-md border border-green-200 px-3 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={handleSuspend}
              disabled={suspending}
              className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Suspend
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-gray-500">Loading...</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">Profile</h2>
          <dl className="mt-3 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Code</span>
              <span className="text-gray-900">{reseller?.code ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>User</span>
              <span className="text-gray-900">{reseller?.userId ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-gray-900">{reseller?.status ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Level</span>
              <span className="text-gray-900">{reseller?.level ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Parent</span>
              <span className="text-gray-900">{reseller?.parentId ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Created</span>
              <span className="text-gray-900">
                {reseller?.createdAt ? dayjs(reseller.createdAt).format("D MMM YYYY") : "—"}
              </span>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">Wallet</h2>
          <dl className="mt-3 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Pending</span>
              <span className="text-gray-900">{wallet?.pendingBalance ?? "0"}</span>
            </div>
            <div className="flex justify-between">
              <span>Withdrawable</span>
              <span className="text-gray-900">{wallet?.withdrawableBalance ?? "0"}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid</span>
              <span className="text-gray-900">{wallet?.paidBalance ?? "0"}</span>
            </div>
            <div className="flex justify-between">
              <span>Updated</span>
              <span className="text-gray-900">
                {wallet?.updatedAt ? dayjs(wallet.updatedAt).format("D MMM YYYY") : "—"}
              </span>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Hierarchy</h2>
            <Link to="/reseller/tree/" className="text-xs text-indigo-600 hover:underline">
              Full tree
            </Link>
          </div>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {tree.map((node: any, index: number) => (
              <div key={`${node.descendantId}-${index}`} className="flex items-center justify-between">
                <span>Depth {node.depth}</span>
                <span className="text-gray-900">{node.descendantId}</span>
              </div>
            ))}
            {tree.length === 0 ? <p className="text-sm text-gray-500">No tree data.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Latest Ledger</h2>
            <Link to="/reseller/wallet-ledger/" className="text-xs text-indigo-600 hover:underline">
              Full ledger
            </Link>
          </div>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {ledger.map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between">
                <span>{entry.refType}</span>
                <span className="text-gray-900">{entry.amount}</span>
              </div>
            ))}
            {ledger.length === 0 ? <p className="text-sm text-gray-500">No ledger entries.</p> : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Recent Payout Requests</h2>
          <Link to="/reseller/payouts/" className="text-xs text-indigo-600 hover:underline">
            Full payouts
          </Link>
        </div>
        <div className="mt-3 grid gap-2">
          {payouts.map((payout: any) => (
            <div key={payout.id} className="flex items-center justify-between text-sm text-gray-600">
              <span>{payout.status}</span>
              <span className="text-gray-900">{payout.amount}</span>
            </div>
          ))}
          {payouts.length === 0 ? <p className="text-sm text-gray-500">No payout requests.</p> : null}
        </div>
      </div>

      {showUpdate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Reseller</h3>
              <button
                type="button"
                onClick={() => setShowUpdate(false)}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5">
              <div>
                <label className="text-xs font-medium text-gray-500">Code</label>
                <input
                  value={updateDraft.code}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, code: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Status</label>
                <input
                  value={updateDraft.status}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, status: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowUpdate(false)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={updating}
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
