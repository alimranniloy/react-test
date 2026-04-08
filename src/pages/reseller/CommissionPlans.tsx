import AppTable from "@/components/AppTable";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import useSiteUuid from "@/hooks/useSiteUuid";
import { useSiteStore } from "@/store/useSiteStore";
import PaginationFooter from "@/components/PaginationFooter";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  COMMISSION_PLAN_LEVELS,
  COMMISSION_PLANS
} from "@/graphql/queries/reseller";
import {
  COMMISSION_PLAN_ACTIVATE,
  COMMISSION_PLAN_CREATE,
  COMMISSION_PLAN_LEVEL_UPSERT,
  COMMISSION_PLAN_UPDATE
} from "@/graphql/mutations/reseller";

export default function CommissionPlans() {
  const site = useSiteStore((state) => state.site);
  const siteUuid = useSiteUuid(site?.id ?? null);

  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [draft, setDraft] = useState({
    name: "",
    maxDepth: "4",
    basis: "order",
    platformSharePct: "0",
    isActive: true
  });

  const [updateDraft, setUpdateDraft] = useState({
    name: "",
    maxDepth: "",
    basis: "",
    platformSharePct: ""
  });

  const [levelDraft, setLevelDraft] = useState({ level: "1", sharePct: "0", requiresTarget: true });

  const { data, loading, refetch } = useQuery(COMMISSION_PLANS, {
    variables: { siteId: siteUuid ?? "", isActive: null },
    skip: !siteUuid
  });

  const { data: levelsData, refetch: refetchLevels } = useQuery(COMMISSION_PLAN_LEVELS, {
    variables: { siteId: siteUuid ?? "", planId: selected?.id ?? "" },
    skip: !siteUuid || !selected
  });

  const [createPlan, { loading: creating }] = useMutation(COMMISSION_PLAN_CREATE);
  const [updatePlan, { loading: updating }] = useMutation(COMMISSION_PLAN_UPDATE);
  const [activatePlan, { loading: activating }] = useMutation(COMMISSION_PLAN_ACTIVATE);
  const [upsertLevel, { loading: savingLevel }] = useMutation(COMMISSION_PLAN_LEVEL_UPSERT);

  const plans = data?.commissionPlans ?? [];
  const totalPages = Math.max(1, Math.ceil(plans.length / pageSize));
  const offset = (page - 1) * pageSize;
  const pagedPlans = plans.slice(offset, offset + pageSize);
  const levels = levelsData?.commissionPlanLevels ?? [];

  const handleCreate = async () => {
    if (!siteUuid) return;
    await createPlan({
      variables: {
        data: {
          siteId: siteUuid,
          userId: null,
          name: draft.name.trim() || null,
          maxDepth: Number(draft.maxDepth || 4),
          basis: draft.basis.trim(),
          platformSharePct: Number(draft.platformSharePct || 0),
          isActive: draft.isActive
        }
      }
    });
    await refetch();
    setShowCreate(false);
  };

  const handleUpdate = async () => {
    if (!siteUuid || !selected) return;
    await updatePlan({
      variables: {
        data: {
          siteId: siteUuid,
          planId: selected.id,
          name: updateDraft.name.trim() || null,
          maxDepth: updateDraft.maxDepth ? Number(updateDraft.maxDepth) : null,
          basis: updateDraft.basis.trim() || null,
          platformSharePct: updateDraft.platformSharePct ? Number(updateDraft.platformSharePct) : null
        }
      }
    });
    await refetch();
    setShowUpdate(false);
  };

  const handleActivate = async (plan: any, isActive: boolean) => {
    if (!siteUuid) return;
    await activatePlan({
      variables: {
        data: {
          siteId: siteUuid,
          planId: plan.id,
          isActive
        }
      }
    });
    await refetch();
  };

  const handleLevel = async () => {
    if (!siteUuid || !selected) return;
    await upsertLevel({
      variables: {
        data: {
          siteId: siteUuid,
          planId: selected.id,
          level: Number(levelDraft.level || 1),
          sharePct: Number(levelDraft.sharePct || 0),
          requiresTarget: levelDraft.requiresTarget
        }
      }
    });
    await refetchLevels();
    setShowLevel(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Commission Plans
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
              >
                ↻
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">Define multi-level commission structures.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create Plan
          </button>
        </div>
      </div>

      <div className="table-source-wrap">
        <AppTable className="data-table min-w-full divide-y divide-gray-300">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Name</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Depth</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Basis</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Platform %</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Active</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {pagedPlans.map((plan: any) => (
              <TableRow key={plan.id} className="hover:bg-slate-50">
                <TableCell className="px-4 py-3 text-sm text-gray-700">
                  <div className="font-medium text-gray-900">{plan.name ?? "Untitled"}</div>
                  <div className="text-xs text-gray-500">{plan.id}</div>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{plan.maxDepth}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{plan.basis}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{plan.platformSharePct}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-gray-500">{plan.isActive ? "Yes" : "No"}</TableCell>
                <TableCell className="px-3 py-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(plan);
                        setUpdateDraft({
                          name: plan.name ?? "",
                          maxDepth: String(plan.maxDepth ?? ""),
                          basis: plan.basis ?? "",
                          platformSharePct: String(plan.platformSharePct ?? "")
                        });
                        setShowUpdate(true);
                      }}
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleActivate(plan, !plan.isActive)}
                      disabled={activating}
                      className="rounded-md border border-indigo-200 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
                    >
                      {plan.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(plan);
                        setShowLevel(true);
                      }}
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Levels
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AppTable>
        {!loading && plans.length === 0 ? (
          <div className="text-center border-t border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">No record :-(</div>
        ) : (
          <PaginationFooter
            count={pagedPlans.length}
            total={plans.length}
            page={page}
            pageCount={totalPages}
            from={pagedPlans.length > 0 ? offset + 1 : 0}
            to={offset + pagedPlans.length}
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

      {selected && levels.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">Levels for {selected.name ?? "Plan"}</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {levels.map((level: any) => (
              <div key={`${level.planId}-${level.level}`} className="flex items-center justify-between">
                <span>Level {level.level}</span>
                <span className="text-gray-900">{level.sharePct}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Plan</h3>
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
                <label className="text-xs font-medium text-gray-500">Max depth</label>
                <input
                  value={draft.maxDepth}
                  onChange={(event) => setDraft((prev) => ({ ...prev, maxDepth: event.target.value }))}
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
                <label className="text-xs font-medium text-gray-500">Platform share %</label>
                <input
                  value={draft.platformSharePct}
                  onChange={(event) => setDraft((prev) => ({ ...prev, platformSharePct: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={draft.isActive}
                  onChange={(event) => setDraft((prev) => ({ ...prev, isActive: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                Active
              </label>
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
              <h3 className="text-lg font-semibold text-gray-900">Update Plan</h3>
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
                <label className="text-xs font-medium text-gray-500">Max depth</label>
                <input
                  value={updateDraft.maxDepth}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, maxDepth: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Basis</label>
                <input
                  value={updateDraft.basis}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, basis: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Platform share %</label>
                <input
                  value={updateDraft.platformSharePct}
                  onChange={(event) => setUpdateDraft((prev) => ({ ...prev, platformSharePct: event.target.value }))}
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

      {showLevel ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Upsert Level</h3>
              <button
                type="button"
                onClick={() => setShowLevel(false)}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5">
              <div>
                <label className="text-xs font-medium text-gray-500">Level</label>
                <input
                  value={levelDraft.level}
                  onChange={(event) => setLevelDraft((prev) => ({ ...prev, level: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Share %</label>
                <input
                  value={levelDraft.sharePct}
                  onChange={(event) => setLevelDraft((prev) => ({ ...prev, sharePct: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={levelDraft.requiresTarget}
                  onChange={(event) => setLevelDraft((prev) => ({ ...prev, requiresTarget: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                Requires target
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowLevel(false)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLevel}
                disabled={savingLevel}
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
