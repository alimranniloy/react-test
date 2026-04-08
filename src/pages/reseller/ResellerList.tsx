import AppTable from "@/components/AppTable";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import OffsetPager from "@/components/OffsetPager";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  RESELLERS
} from "@/graphql/queries/reseller";
import {
  RESELLER_APPROVE,
  RESELLER_REGISTER,
  RESELLER_REPARENT,
  RESELLER_SUSPEND,
  RESELLER_UPDATE
} from "@/graphql/mutations/reseller";

const statusOptions = ["pending", "active", "suspended", "rejected", "review"];

export default function ResellerList() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | "">("");
  const [offset, setOffset] = useState(0);
  const [pageSize] = useState(15);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showReparent, setShowReparent] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [draft, setDraft] = useState({
    userId: "",
    code: "",
    parentId: "",
    level: "",
    status: "pending"
  });
  const [updateDraft, setUpdateDraft] = useState({
    code: "",
    status: ""
  });
  const [reparentDraft, setReparentDraft] = useState({ parentId: "" });

  const variables = useMemo(
    () => ({
      data: {
        siteId: siteUuid ?? "",
        status: status || null,
        search: search.trim() || null,
        limit: pageSize + 1,
        offset
      }
    }),
    [siteUuid, status, search, pageSize, offset]
  );

  const { data, loading, refetch } = useQuery(RESELLERS, {
    variables,
    skip: !siteUuid
  });

  const [registerReseller, { loading: creating }] = useMutation(RESELLER_REGISTER);
  const [approveReseller, { loading: approving }] = useMutation(RESELLER_APPROVE);
  const [suspendReseller, { loading: suspending }] = useMutation(RESELLER_SUSPEND);
  const [updateReseller, { loading: updating }] = useMutation(RESELLER_UPDATE);
  const [reparentReseller, { loading: reparenting }] = useMutation(RESELLER_REPARENT);

  const rows = data?.resellers ?? [];
  const hasNext = rows.length > pageSize;
  const resellers = rows.slice(0, pageSize);

  const openUpdate = (row: any) => {
    setSelected(row);
    setUpdateDraft({ code: row.code ?? "", status: row.status ?? "" });
    setShowUpdate(true);
  };

  const openReparent = (row: any) => {
    setSelected(row);
    setReparentDraft({ parentId: "" });
    setShowReparent(true);
  };

  const handleCreate = async () => {
    if (!siteUuid) return;
    await registerReseller({
      variables: {
        data: {
          siteId: siteUuid,
          userId: draft.userId.trim(),
          code: draft.code.trim() || null,
          parentId: draft.parentId.trim() || null,
          level: draft.level ? Number(draft.level) : null,
          status: draft.status || null
        }
      }
    });
    await refetch();
    setShowCreate(false);
  };

  const handleApprove = async (row: any) => {
    if (!siteUuid) return;
    await approveReseller({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId: row.id,
          status: "active"
        }
      }
    });
    await refetch();
  };

  const handleSuspend = async (row: any) => {
    if (!siteUuid) return;
    const confirmed = window.confirm("Suspend this reseller?");
    if (!confirmed) return;
    await suspendReseller({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId: row.id,
          reason: null
        }
      }
    });
    await refetch();
  };

  const handleUpdate = async () => {
    if (!siteUuid || !selected) return;
    await updateReseller({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId: selected.id,
          code: updateDraft.code.trim() || null,
          status: updateDraft.status.trim() || null
        }
      }
    });
    await refetch();
    setShowUpdate(false);
  };

  const handleReparent = async () => {
    if (!siteUuid || !selected) return;
    await reparentReseller({
      variables: {
        data: {
          siteId: siteUuid,
          resellerId: selected.id,
          parentId: reparentDraft.parentId.trim()
        }
      }
    });
    await refetch();
    setShowReparent(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Resellers
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Manage reseller profiles, status, and hierarchy.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Register Reseller
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setOffset(0);
          }}
          placeholder="Search code or user id"
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
              <TableHead className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Code</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">User</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Level</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {resellers.map((row: any) => (
              <TableRow key={row.id} className="hover:bg-slate-50">
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  <div className="font-medium text-gray-900">{row.code}</div>
                  <div className="text-xs text-gray-500">{row.id}</div>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{row.userId ?? "—"}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{row.level}</TableCell>
                <TableCell className="px-3 py-3 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
                      row.status === "active"
                        ? "bg-green-100 text-green-800"
                        : row.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">
                  {row.createdAt ? dayjs(row.createdAt).format("D MMM YYYY") : "—"}
                </TableCell>
                <TableCell className="px-3 py-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/reseller/${row.id}/`}
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => openUpdate(row)}
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => openReparent(row)}
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Reparent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(row)}
                      disabled={approving}
                      className="rounded-md border border-green-200 px-2 py-1 text-xs text-green-700 hover:bg-green-50 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSuspend(row)}
                      disabled={suspending}
                      className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AppTable>
        {!loading && resellers.length === 0 ? (
          <div className="text-center border-t border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">No record :-(</div>
        ) : null}
      </div>

      <OffsetPager
        count={resellers.length}
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
              <h3 className="text-lg font-semibold text-gray-900">Register Reseller</h3>
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
                <label className="text-xs font-medium text-gray-500">User id (UUID)</label>
                <input
                  value={draft.userId}
                  onChange={(event) => setDraft((prev) => ({ ...prev, userId: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Code</label>
                <input
                  value={draft.code}
                  onChange={(event) => setDraft((prev) => ({ ...prev, code: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Parent id</label>
                <input
                  value={draft.parentId}
                  onChange={(event) => setDraft((prev) => ({ ...prev, parentId: event.target.value }))}
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
                <label className="text-xs font-medium text-gray-500">Status</label>
                <select
                  value={draft.status}
                  onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
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
                <select
                  value={updateDraft.status}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, status: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">No change</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
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

      {showReparent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Reparent Reseller</h3>
              <button
                type="button"
                onClick={() => setShowReparent(false)}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5">
              <div>
                <label className="text-xs font-medium text-gray-500">New parent id</label>
                <input
                  value={reparentDraft.parentId}
                  onChange={(event) => setReparentDraft({ parentId: event.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowReparent(false)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReparent}
                disabled={reparenting}
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
