import AppTable from "@/components/AppTable";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import { useNotificationsStore } from "@/stores/notifications";
import PaginationFooter from "@/components/PaginationFooter";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  RESELLER_TARGET_PROGRESS,
  RESELLER_TARGETS
} from "@/graphql/queries/reseller";
import { TARGET_ARCHIVE, TARGET_CREATE, TARGET_UPDATE } from "@/graphql/mutations/reseller";

const statusOptions = ["active", "archived", "paused", "draft"];

export default function Targets() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);
  const { addNotification } = useNotificationsStore();

  const [status, setStatus] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [progressTargetId, setProgressTargetId] = useState("");
  const [progressResellerId, setProgressResellerId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [draft, setDraft] = useState({
    name: "",
    periodType: "monthly",
    startAt: "",
    endAt: "",
    metric: "revenue",
    threshold: "0",
    status: "active"
  });

  const [updateDraft, setUpdateDraft] = useState({
    name: "",
    periodType: "",
    startAt: "",
    endAt: "",
    metric: "",
    threshold: "",
    status: ""
  });

  const { data, loading, refetch } = useQuery(RESELLER_TARGETS, {
    variables: {
      data: {
        siteId: siteUuid ?? "",
        status: status || null
      }
    },
    skip: !siteUuid
  });

  const { data: progressData, refetch: refetchProgress } = useQuery(RESELLER_TARGET_PROGRESS, {
    variables: {
      data: {
        siteId: siteUuid ?? "",
        targetId: progressTargetId.trim() || null,
        resellerId: progressResellerId.trim() || null,
        isCompleted: null
      }
    },
    skip: !siteUuid || (!progressTargetId.trim() && !progressResellerId.trim())
  });

  const [createTarget, { loading: creating }] = useMutation(TARGET_CREATE);
  const [updateTarget, { loading: updating }] = useMutation(TARGET_UPDATE);
  const [archiveTarget, { loading: archiving }] = useMutation(TARGET_ARCHIVE);

  const targets = data?.targets ?? [];
  const totalPages = Math.max(1, Math.ceil(targets.length / pageSize));
  const offset = (page - 1) * pageSize;
  const pagedTargets = targets.slice(offset, offset + pageSize);
  const progress = progressData?.targetProgress ?? [];

  const handleCreate = async () => {
    if (!siteUuid) return;
    if (!draft.startAt || !draft.endAt) {
      addNotification(
        {
          title: "Missing dates",
          subTitle: "Start and end dates are required."
        },
        "error"
      );
      return;
    }
    await createTarget({
      variables: {
        data: {
          siteId: siteUuid,
          userId: null,
          name: draft.name.trim() || null,
          periodType: draft.periodType.trim(),
          startAt: new Date(draft.startAt).toISOString(),
          endAt: new Date(draft.endAt).toISOString(),
          metric: draft.metric.trim(),
          threshold: Number(draft.threshold || 0),
          status: draft.status
        }
      }
    });
    await refetch();
    setShowCreate(false);
  };

  const handleUpdate = async () => {
    if (!siteUuid || !selected) return;
    await updateTarget({
      variables: {
        data: {
          siteId: siteUuid,
          targetId: selected.id,
          name: updateDraft.name.trim() || null,
          periodType: updateDraft.periodType.trim() || null,
          startAt: updateDraft.startAt ? new Date(updateDraft.startAt).toISOString() : null,
          endAt: updateDraft.endAt ? new Date(updateDraft.endAt).toISOString() : null,
          metric: updateDraft.metric.trim() || null,
          threshold: updateDraft.threshold ? Number(updateDraft.threshold) : null,
          status: updateDraft.status.trim() || null
        }
      }
    });
    await refetch();
    setShowUpdate(false);
  };

  const handleArchive = async (targetId: string) => {
    if (!siteUuid) return;
    await archiveTarget({
      variables: {
        data: {
          siteId: siteUuid,
          targetId
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
              Targets
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Reseller target campaigns and progress.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create Target
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
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
              <TableHead className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Name</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Period</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Metric</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Threshold</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {pagedTargets.map((target: any) => (
              <TableRow key={target.id} className="hover:bg-slate-50">
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  <div className="font-medium text-gray-900">{target.name ?? "Untitled"}</div>
                  <div className="text-xs text-gray-500">{target.id}</div>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">
                  {dayjs(target.startAt).format("D MMM")}
                  {" – "}
                  {dayjs(target.endAt).format("D MMM")}
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{target.metric}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{target.threshold}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{target.status}</TableCell>
                <TableCell className="px-3 py-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(target);
                        setUpdateDraft({
                          name: target.name ?? "",
                          periodType: target.periodType ?? "",
                          startAt: target.startAt ? dayjs(target.startAt).format("YYYY-MM-DD") : "",
                          endAt: target.endAt ? dayjs(target.endAt).format("YYYY-MM-DD") : "",
                          metric: target.metric ?? "",
                          threshold: String(target.threshold ?? ""),
                          status: target.status ?? ""
                        });
                        setShowUpdate(true);
                      }}
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleArchive(target.id)}
                      disabled={archiving}
                      className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Archive
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AppTable>
        {!loading && targets.length === 0 ? (
          <div className="text-center border-t border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">No record :-(</div>
        ) : (
          <PaginationFooter
            count={pagedTargets.length}
            total={targets.length}
            page={page}
            pageCount={totalPages}
            from={pagedTargets.length > 0 ? offset + 1 : 0}
            to={offset + pagedTargets.length}
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

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Target Progress</h2>
            <p className="mt-1 text-xs text-gray-500">Filter by target id or reseller id.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={progressTargetId}
              onChange={(event) => setProgressTargetId(event.target.value)}
              placeholder="Target id"
              className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            />
            <input
              value={progressResellerId}
              onChange={(event) => setProgressResellerId(event.target.value)}
              placeholder="Reseller id"
              className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => refetchProgress()}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Load
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          {progress.map((row: any, index: number) => (
            <div key={`${row.targetId}-${index}`} className="flex items-center justify-between">
              <span>
                {row.resellerId} · {row.qty} qty · {row.revenue} revenue
              </span>
              <span className="text-gray-900">{row.isCompleted ? "Completed" : "Active"}</span>
            </div>
          ))}
          {progress.length === 0 ? <p className="text-sm text-gray-500">No progress data.</p> : null}
        </div>
      </div>

      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Target</h3>
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
                <label className="text-xs font-medium text-gray-500">Name</label>
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Period type</label>
                <input
                  value={draft.periodType}
                  onChange={(event) => setDraft((prev) => ({ ...prev, periodType: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Start</label>
                <input
                  type="date"
                  value={draft.startAt}
                  onChange={(event) => setDraft((prev) => ({ ...prev, startAt: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">End</label>
                <input
                  type="date"
                  value={draft.endAt}
                  onChange={(event) => setDraft((prev) => ({ ...prev, endAt: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Metric</label>
                <input
                  value={draft.metric}
                  onChange={(event) => setDraft((prev) => ({ ...prev, metric: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Threshold</label>
                <input
                  value={draft.threshold}
                  onChange={(event) => setDraft((prev) => ({ ...prev, threshold: event.target.value }))}
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
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Target</h3>
              <button
                type="button"
                onClick={() => setShowUpdate(false)}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-500">Name</label>
                <input
                  value={updateDraft.name}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Period type</label>
                <input
                  value={updateDraft.periodType}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, periodType: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Start</label>
                <input
                  type="date"
                  value={updateDraft.startAt}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, startAt: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">End</label>
                <input
                  type="date"
                  value={updateDraft.endAt}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, endAt: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Metric</label>
                <input
                  value={updateDraft.metric}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, metric: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Threshold</label>
                <input
                  value={updateDraft.threshold}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, threshold: event.target.value }))}
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
