import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import OffsetPager from "@/components/OffsetPager";
import { COMMISSION_EVENTS } from "@/graphql/queries/reseller";
import { COMMISSION_EVENT_RECORD, COMMISSION_EVENT_REVERSE } from "@/graphql/mutations/reseller";
import { useNotificationsStore } from "@/stores/notifications";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CommissionEvents() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);
  const { addNotification } = useNotificationsStore();

  const [resellerId, setResellerId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const [pageSize] = useState(15);
  const [showCreate, setShowCreate] = useState(false);

  const [draft, setDraft] = useState({
    resellerId: "",
    orderId: "",
    refType: "store_order",
    status: "pending",
    basis: "order",
    level: "1",
    amount: "0",
    idempotencyKey: "",
    meta: ""
  });

  const variables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        resellerId: resellerId.trim() || null,
        orderId: orderId.trim() || null,
        status: status.trim() || null,
        limit: pageSize + 1,
        offset
      }
    }),
    [siteUuid, resellerId, orderId, status, pageSize, offset]
  );

  const { data, loading, refetch } = useQuery(COMMISSION_EVENTS, {
    variables,
    skip: !siteUuid
  });

  const [recordEvent, { loading: recording }] = useMutation(COMMISSION_EVENT_RECORD);
  const [reverseEvent] = useMutation(COMMISSION_EVENT_REVERSE);

  const rows = data?.commissionEvents ?? [];
  const hasNext = rows.length > pageSize;
  const events = rows.slice(0, pageSize);

  const handleCreate = async () => {
    if (!siteUuid) return;
    let meta: Record<string, unknown> | null = null;
    if (draft.meta.trim()) {
      try {
        meta = JSON.parse(draft.meta);
      } catch {
        addNotification(
          {
            title: "Invalid meta",
            subTitle: "Meta must be valid JSON."
          },
          "error"
        );
        return;
      }
    }
    await recordEvent({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId: draft.resellerId.trim(),
          orderId: draft.orderId.trim(),
          refType: draft.refType.trim(),
          status: draft.status.trim(),
          basis: draft.basis.trim(),
          level: Number(draft.level || 1),
          amount: Number(draft.amount || 0),
          idempotencyKey: draft.idempotencyKey.trim() || null,
          meta
        }
      }
    });
    await refetch();
    setShowCreate(false);
  };

  const handleReverse = async (eventId: string) => {
    if (!siteUuid) return;
    const reason = window.prompt("Reverse reason", "") ?? "";
    await reverseEvent({
      variables: {
        data: {
          siteId: siteUuid,
          commissionEventId: eventId,
          reason: reason.trim() || null
        }
      }
    });
    await refetch();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Commission Events
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Record and reverse reseller commission events.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Record Event
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
        <input
          value={orderId}
          onChange={(event) => {
            setOrderId(event.target.value);
            setOffset(0);
          }}
          placeholder="Order id"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
        <input
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setOffset(0);
          }}
          placeholder="Status"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
      </div>

      <div className="table-source-wrap">
        <AppTable className="data-table min-w-full divide-y divide-gray-300">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Date</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reseller</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Order</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {events.map((event: any) => (
              <TableRow key={event.id} className="hover:bg-slate-50">
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  {event.createdAt ? dayjs(event.createdAt).format("D MMM YYYY") : "—"}
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{event.resellerId}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{event.orderId}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{event.amount}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{event.status}</TableCell>
                <TableCell className="px-3 py-3 text-sm">
                  <button
                    type="button"
                    onClick={() => handleReverse(event.id)}
                    className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                  >
                    Reverse
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AppTable>
        {!loading && events.length === 0 ? (
          <div className="text-center border-t border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">No record :-(</div>
        ) : null}
      </div>

      <OffsetPager
        count={events.length}
        offset={offset}
        limit={pageSize}
        hasNext={hasNext}
        loading={loading}
        onPrev={() => setOffset((prev) => Math.max(0, prev - pageSize))}
        onNext={() => setOffset((prev) => (hasNext ? prev + pageSize : prev))}
      />

      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Record Event</h3>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-500">Reseller id</label>
                <input
                  value={draft.resellerId}
                  onChange={(event) => setDraft((prev) => ({ ...prev, resellerId: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Order id</label>
                <input
                  value={draft.orderId}
                  onChange={(event) => setDraft((prev) => ({ ...prev, orderId: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Ref type</label>
                <input
                  value={draft.refType}
                  onChange={(event) => setDraft((prev) => ({ ...prev, refType: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Status</label>
                <input
                  value={draft.status}
                  onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Basis</label>
                <input
                  value={draft.basis}
                  onChange={(event) => setDraft((prev) => ({ ...prev, basis: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Level</label>
                <input
                  value={draft.level}
                  onChange={(event) => setDraft((prev) => ({ ...prev, level: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Amount</label>
                <input
                  value={draft.amount}
                  onChange={(event) => setDraft((prev) => ({ ...prev, amount: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Idempotency key</label>
                <input
                  value={draft.idempotencyKey}
                  onChange={(event) => setDraft((prev) => ({ ...prev, idempotencyKey: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-500">Meta (JSON)</label>
                <textarea
                  value={draft.meta}
                  onChange={(event) => setDraft((prev) => ({ ...prev, meta: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows={3}
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
                disabled={recording}
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
